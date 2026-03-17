import { NextRequest, NextResponse } from "next/server";
import { getAuthFromRequest } from "@/lib/auth";
import connectDB from "@/lib/connectDB";
import Product from "@/models/Product";
import { appendProductJson } from "@/lib/productsJson";
import { clearProductsCache } from "@/lib/getAllProducts";

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
