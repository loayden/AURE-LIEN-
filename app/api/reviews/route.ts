import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import connectDB, { hasConfiguredMongoUri } from "@/lib/connectDB";
import Review from "@/models/Review";
import { getAuthFromRequest } from "@/lib/auth";
import { RATE_LIMITS, rateLimitResponse } from "@/lib/rateLimit";

const NO_STORE = { "Cache-Control": "no-store, max-age=0" };

const reviewSchema = z.object({
  productId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  title: z.string().max(120).optional().default(""),
  body: z.string().max(2000).optional().default(""),
});

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const productId = String(url.searchParams.get("productId") ?? "").trim();
    if (!productId) return NextResponse.json({ error: "productId required" }, { status: 400, headers: NO_STORE });
    if (!hasConfiguredMongoUri()) return NextResponse.json({ reviews: [], average: 0, count: 0 }, { status: 200, headers: NO_STORE });
    await connectDB();
    const reviews = await Review.find({ productId }).sort({ createdAt: -1 }).limit(100).lean();
    const count = await Review.countDocuments({ productId });
    const agg = await Review.aggregate([
      { $match: { productId } },
      { $group: { _id: null, avg: { $avg: "$rating" } } },
    ]);
    const average = agg[0]?.avg ? Math.round(agg[0].avg * 10) / 10 : 0;
    // Verified purchase: reviewer has an order containing this product.
    let verifiedIds = new Set<string>();
    try {
      const { getOrdersJson } = await import("@/lib/orderStorage");
      const orders = await getOrdersJson();
      const reviewerIds = new Set(
        (reviews as Array<{ userId?: string }>).map((r) => String(r.userId ?? "")).filter(Boolean)
      );
      for (const order of orders) {
        const items = Array.isArray(order.items) ? order.items : [];
        const hasProduct = items.some((item: { productId?: string }) => String(item.productId ?? "") === productId);
        if (hasProduct && reviewerIds.has(String(order.userId ?? ""))) {
          verifiedIds.add(String(order.userId));
        }
      }
    } catch {
      // verification is best-effort
    }
    return NextResponse.json(
      {
        reviews: reviews.map((r: { userName?: string; rating?: number; title?: string; body?: string; createdAt?: Date; userId?: string }) => ({
          userName: r.userName ?? "Verified buyer",
          rating: r.rating,
          title: r.title ?? "",
          body: r.body ?? "",
          createdAt: r.createdAt,
          verified: verifiedIds.has(String(r.userId ?? "")),
        })),
        average,
        count,
      },
      { status: 200, headers: NO_STORE }
    );
  } catch (error) {
    console.error("reviews GET error:", error instanceof Error ? error.message : String(error));
    return NextResponse.json({ reviews: [], average: 0, count: 0 }, { status: 200, headers: NO_STORE });
  }
}

export async function POST(req: NextRequest) {
  const limited = await rateLimitResponse(req, RATE_LIMITS.cart);
  if (limited) return limited;
  try {
    const auth = await getAuthFromRequest(req);
    if (!auth) return NextResponse.json({ error: "Sign in to write a review" }, { status: 401, headers: NO_STORE });
    const body = await req.json().catch(() => ({}));
    const parsed = reviewSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid review" }, { status: 400, headers: NO_STORE });
    }
    if (!hasConfiguredMongoUri()) {
      return NextResponse.json({ error: "Reviews storage not configured" }, { status: 503, headers: NO_STORE });
    }
    await connectDB();
    await Review.findOneAndUpdate(
      { productId: parsed.data.productId, userId: auth.userId },
      {
        productId: parsed.data.productId,
        userId: auth.userId,
        userName: String(auth.email?.split("@")[0] ?? "Verified buyer").slice(0, 80),
        rating: parsed.data.rating,
        title: String(parsed.data.title ?? "").slice(0, 120),
        body: String(parsed.data.body ?? "").slice(0, 2000),
        createdAt: new Date(),
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    return NextResponse.json({ success: true }, { status: 201, headers: NO_STORE });
  } catch (error) {
    if (String((error as Error)?.message ?? "").includes("duplicate key")) {
      return NextResponse.json({ error: "You already reviewed this product" }, { status: 409, headers: NO_STORE });
    }
    console.error("reviews POST error:", error instanceof Error ? error.message : String(error));
    return NextResponse.json({ error: "Failed to save review" }, { status: 500, headers: NO_STORE });
  }
}
