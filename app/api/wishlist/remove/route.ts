import { NextRequest, NextResponse } from "next/server";
import { getAuthFromRequest } from "@/lib/auth";
import { removeFromWishlistMongo } from "@/lib/wishlistMongo";

export async function POST(req: NextRequest) {
  const auth = await getAuthFromRequest(req);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { productId } = await req.json();
    if (!productId) {
      return NextResponse.json({ error: "productId required" }, { status: 400 });
    }
    await removeFromWishlistMongo(auth.userId, productId);
    return NextResponse.json({ message: "Removed from wishlist" }, { status: 200 });
  } catch (e) {
    console.error("Wishlist remove error:", e);
    return NextResponse.json({ error: "Failed to remove" }, { status: 500 });
  }
}
