import { NextRequest, NextResponse } from "next/server";
import { getAuthFromRequest } from "@/lib/auth";
import { addToWishlistMongo } from "@/lib/wishlistMongo";
import productsData from "@/lib/productsData";

export async function POST(req: NextRequest) {
  const auth = await getAuthFromRequest(req);
  if (!auth) {
    return NextResponse.json({ error: "Please log in to add to wishlist" }, { status: 401 });
  }
  try {
    const { productId, productData: clientProductData } = await req.json();
    if (!productId) {
      return NextResponse.json({ error: "productId required" }, { status: 400 });
    }
    const product = productsData.find((p) => String(p._id) === String(productId));
    const productData = clientProductData || (product
      ? { _id: product._id, name: product.name, price: product.price, images: product.images || [], category: product.category }
      : undefined);
    await addToWishlistMongo(auth.userId, productId, productData);
    return NextResponse.json({ message: "Added to wishlist" }, { status: 200 });
  } catch (e) {
    console.error("Wishlist add error:", e);
    return NextResponse.json({ error: "Failed to add to wishlist" }, { status: 500 });
  }
}
