import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAuthFromRequest } from "@/lib/auth";
import { getOrCreateUserId } from "@/lib/userSession";
import { getOrdersJson } from "@/lib/orderStorage";
import connectDB, { hasConfiguredMongoUri } from "@/lib/connectDB";
import ReturnRequest from "@/models/Return";
import { RATE_LIMITS, rateLimitResponse } from "@/lib/rateLimit";
import { isOriginAllowed } from "@/lib/csrf";

const NO_STORE = { "Cache-Control": "no-store, max-age=0" };

const requestSchema = z.object({
  orderId: z.string().min(1),
  reason: z.string().min(4, "Tell us briefly why").max(1000),
});

/** GET: my return requests. POST: request a return for my order. */
export async function GET(req: NextRequest) {
  const auth = await getAuthFromRequest(req);
  const userId = auth?.userId ?? (await getOrCreateUserId(req)).userId;
  if (!hasConfiguredMongoUri()) return NextResponse.json({ returns: [] }, { headers: NO_STORE });
  try {
    await connectDB();
    const rows = await ReturnRequest.find({ userId }).sort({ createdAt: -1 }).limit(50).lean();
    return NextResponse.json({ returns: rows }, { headers: NO_STORE });
  } catch {
    return NextResponse.json({ returns: [] }, { headers: NO_STORE });
  }
}

export async function POST(req: NextRequest) {
  const limited = await rateLimitResponse(req, RATE_LIMITS.cart);
  if (limited) return limited;
  if (!isOriginAllowed(req)) {
    return NextResponse.json({ error: "Invalid origin" }, { status: 403, headers: NO_STORE });
  }
  const auth = await getAuthFromRequest(req);
  const userId = auth?.userId ?? (await getOrCreateUserId(req)).userId;
  const body = await req.json().catch(() => ({}));
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid request" }, { status: 400, headers: NO_STORE });
  }
  if (!hasConfiguredMongoUri()) {
    return NextResponse.json({ error: "Returns storage not configured" }, { status: 503, headers: NO_STORE });
  }
  const orders = await getOrdersJson();
  const order = orders.find((o) => String(o._id ?? o.id) === parsed.data.orderId && o.userId === userId);
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404, headers: NO_STORE });
  }
  if (["cancelled", "refunded"].includes(String(order.status))) {
    return NextResponse.json({ error: "Order is already closed" }, { status: 409, headers: NO_STORE });
  }
  try {
    await connectDB();
    const existing = await ReturnRequest.findOne({ orderId: parsed.data.orderId, userId, status: "requested" }).lean();
    if (existing) {
      return NextResponse.json({ success: true, deduped: true, id: (existing as { _id: string })._id });
    }
    const id = `rma-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    await ReturnRequest.create({ _id: id, orderId: parsed.data.orderId, userId, reason: parsed.data.reason.slice(0, 1000), status: "requested" });
    return NextResponse.json({ success: true, id }, { status: 201, headers: NO_STORE });
  } catch (error) {
    console.error("Return request error:", error instanceof Error ? error.message : String(error));
    return NextResponse.json({ error: "Failed to submit return request" }, { status: 500, headers: NO_STORE });
  }
}
