import { NextResponse } from "next/server";
import connectDB, { hasConfiguredMongoUri } from "@/lib/connectDB";
import Reel from "@/models/Reel";
import { getAllProducts } from "@/lib/getAllProducts";

const NO_STORE = { "Cache-Control": "no-store, max-age=0" };

/** GET: active shoppable reels with resolved product chips. */
export async function GET() {
  try {
    if (!hasConfiguredMongoUri()) return NextResponse.json({ reels: [] }, { headers: NO_STORE });
    await connectDB();
    const reels = await Reel.find({ active: true }).sort({ createdAt: -1 }).limit(20).lean();
    const products = await getAllProducts().catch(() => []);
    const byId = new Map(products.map((p) => [String(p._id), p]));
    return NextResponse.json(
      {
        reels: (reels as Array<{ _id: string; title?: string; videoUrl: string; posterUrl?: string; productIds?: string[] }>).map((r) => ({
          id: r._id,
          title: r.title ?? "",
          videoUrl: r.videoUrl,
          posterUrl: r.posterUrl ?? "",
          products: (r.productIds ?? [])
            .map((id) => byId.get(String(id)))
            .filter(Boolean)
            .slice(0, 6)
            .map((p) => ({ _id: p!._id, name: p!.name, price: p!.price, image: p!.images?.[0] ?? "" })),
        })),
      },
      { headers: NO_STORE }
    );
  } catch (error) {
    console.error("Reels GET error:", error instanceof Error ? error.message : String(error));
    return NextResponse.json({ reels: [] }, { headers: NO_STORE });
  }
}
