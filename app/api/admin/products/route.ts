import { NextRequest, NextResponse } from "next/server";
import { getAuthFromRequest } from "@/lib/auth";
import connectDB from "@/lib/connectDB";
import Product from "@/models/Product";
import { appendProductJson, readProductsJson, removeProductJson } from "@/lib/productsJson";
import { clearProductsCache, getAllProducts } from "@/lib/getAllProducts";

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store, max-age=0",
};

export async function GET(req: NextRequest) {
  const auth = await getAuthFromRequest(req);
  if (!auth || auth.role !== "admin") {
    return NextResponse.json({ message: "Not authorized" }, { status: 403 });
  }

  const [products, jsonProducts] = await Promise.all([getAllProducts(), readProductsJson()]);
  const jsonIds = new Set(jsonProducts.map((product) => String(product._id)));

  return NextResponse.json(
    {
      products: products.map((product) => ({
        ...product,
        manageable: jsonIds.has(String(product._id)),
      })),
    },
    { headers: NO_STORE_HEADERS }
  );
}

export async function POST(req: NextRequest) {
  const auth = await getAuthFromRequest(req);
  if (!auth || auth.role !== "admin") {
    return NextResponse.json({ message: "Not authorized" }, { status: 403 });
  }
  try {
    const body = await req.json();
    const {
      name,
      category,
      price,
      description,
      images,
      size,
      colors,
    } = body;

    if (!name || !category || price == null) {
      return NextResponse.json(
        { error: "Name, category, and price are required" },
        { status: 400 }
      );
    }

    const imgList = Array.isArray(images)
      ? images
      : typeof images === "string"
        ? images.split(",").map((s: string) => s.trim()).filter(Boolean)
        : [];
    const sizeList = Array.isArray(size)
      ? size
      : typeof size === "string"
        ? size.split(",").map((s: string) => s.trim()).filter(Boolean)
        : [];
    const colorList = Array.isArray(colors)
      ? colors
      : typeof colors === "string"
        ? colors.split(",").map((s: string) => s.trim()).filter(Boolean)
        : [];

    const _id = `p-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const productData = {
      _id,
      name: String(name).trim(),
      category: String(category).trim().toLowerCase().replace(/\s+/g, "-"),
      price: Number(price) || 0,
      description: String(description || "").trim() || undefined,
      images: imgList.length ? imgList : ["/images/placeholder.svg"],
      size: sizeList,
      colors: colorList,
    };

    try {
      await connectDB();
      await Product.create(productData);
    } catch (dbError) {
      console.error("Add product DB error (continuing with JSON only):", dbError);
    }

    await appendProductJson(productData);
    clearProductsCache();

    return NextResponse.json({ message: "Product added", product: productData }, { status: 201 });
  } catch (e) {
    console.error("Add product error:", e);
    return NextResponse.json({ error: "Failed to add product" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await getAuthFromRequest(req);
  if (!auth || auth.role !== "admin") {
    return NextResponse.json({ message: "Not authorized" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");
  if (!productId) {
    return NextResponse.json({ error: "productId is required" }, { status: 400 });
  }

  let removedJson = false;
  let removedMongo = false;

  try {
    removedJson = await removeProductJson(productId);
    try {
      await connectDB();
      const result = await Product.deleteOne({ _id: productId });
      removedMongo = Boolean(result.deletedCount);
    } catch (dbError) {
      console.error("Delete product DB error (continuing with JSON result):", dbError);
    }

    clearProductsCache();

    if (!removedJson && !removedMongo) {
      return NextResponse.json(
        { error: "Only admin-added products can be deleted from this screen." },
        { status: 409 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete product error:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
