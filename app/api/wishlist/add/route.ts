import { NextRequest, NextResponse } from "next/server";
import { getAuthFromRequest } from "@/lib/auth";
import { addToWishlistMongo } from "@/lib/wishlistMongo";
import { getProductById } from "@/lib/getAllProducts";

export async function POST(req: NextRequest) {
  const auth = await getAuthFromRequest(req);
  if (!auth) {
    return NextResponse.json({ error: "Please log in to add to wishlist" }, { status: 401 });
  }
  try {
    const { productId } = await req.json();
    if (!productId || typeof productId !== "string") {
      return NextResponse.json({ error: "productId required" }, { status: 400 });
    }

    const product = await getProductById(productId);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const productData = {
      _id: product._id,
      name: product.name,
      price: product.price,
      images: product.images || [],
      category: product.category,
    };

    await addToWishlistMongo(auth.userId, productId, productData);
    return NextResponse.json({ message: "Added to wishlist" }, { status: 200 });
  } catch (e) {
    console.error("Wishlist add error:", e);
    return NextResponse.json({ error: "Failed to add to wishlist" }, { status: 500 });
  }
}
