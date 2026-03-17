import { NextRequest, NextResponse } from "next/server";
import { getAuthFromRequest } from "@/lib/auth";
import { getWishlistByUserMongo } from "@/lib/wishlistMongo";
import productsData from "@/lib/productsData";

export async function GET(req: NextRequest) {
  const auth = await getAuthFromRequest(req);
  if (!auth) {
    return NextResponse.json({ items: [] }, { status: 200 });
  }
  try {
    const entries = await getWishlistByUserMongo(auth.userId);
    const items = entries.map((e) => {
      if (e.productData && e.productData._id) {
        const { _id, ...rest } = e.productData;
        return { _id, ...rest };
      }
      const p = productsData.find((x) => String(x._id) === String(e.productId));
      return p || { _id: e.productId };
    });
    return NextResponse.json({ items });
  } catch (e) {
    console.error("Wishlist list error:", e);
    return NextResponse.json({ items: [] }, { status: 500 });
  }
}
