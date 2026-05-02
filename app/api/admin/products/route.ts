import { NextRequest, NextResponse } from "next/server";
import { requireAdminRequest } from "@/lib/adminAuth";
import connectDB from "@/lib/connectDB";
import Product from "@/models/Product";
import {
  appendProductJson,
  readProductsJson,
  removeProductJson,
  updateProductJson,
} from "@/lib/productsJson";
import { clearProductsCache, getAllProducts } from "@/lib/getAllProducts";

function parseList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    return value.split(",").map((item) => item.trim()).filter(Boolean);
  }

  return [];
}

function normalizeCategory(category: unknown): string {
  return String(category ?? "").trim().toLowerCase().replace(/\s+/g, "-");
}

async function readMongoManagedIds(): Promise<Set<string>> {
  try {
    await connectDB();
    const products = await Product.find({}, { _id: 1 }).lean();
    return new Set(products.map((product) => String(product._id)));
  } catch {
    return new Set();
  }
}

export async function GET(req: NextRequest) {
  const authError = await requireAdminRequest(req);
  if (authError) return authError;

  try {
    const [products, jsonProducts, mongoIds] = await Promise.all([
      getAllProducts(),
      readProductsJson(),
      readMongoManagedIds(),
    ]);
    const jsonIds = new Set(jsonProducts.map((product) => String(product._id)));

    return NextResponse.json({
      products: products.map((product) => ({
        ...product,
        managed: jsonIds.has(String(product._id)) || mongoIds.has(String(product._id)),
      })),
    });
  } catch (error) {
    console.error("Admin products GET error:", error);
    return NextResponse.json({ error: "Failed to load products" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const authError = await requireAdminRequest(req);
  if (authError) return authError;

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
      stock,
    } = body;

    if (!name || !category || price == null) {
      return NextResponse.json(
        { error: "Name, category, and price are required" },
        { status: 400 }
      );
    }

    const imgList = parseList(images);
    const sizeList = parseList(size);
    const colorList = parseList(colors);
    const parsedStock = Number(stock);

    const _id = `p-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const productData = {
      _id,
      name: String(name).trim(),
      category: normalizeCategory(category),
      price: Number(price) || 0,
      description: String(description || "").trim() || undefined,
      images: imgList.length ? imgList : ["/images/placeholder.svg"],
      size: sizeList,
      colors: colorList,
      stock: Number.isFinite(parsedStock) && parsedStock >= 0 ? parsedStock : undefined,
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

export async function PUT(req: NextRequest) {
  const authError = await requireAdminRequest(req);
  if (authError) return authError;

  try {
    const body = await req.json();
    const productId = String(body?._id ?? body?.id ?? "").trim();

    if (!productId) {
      return NextResponse.json({ error: "Product id is required" }, { status: 400 });
    }

    const parsedPrice = Number(body?.price);
    const parsedStock = Number(body?.stock);
    const updates = {
      name: String(body?.name ?? "").trim(),
      category: normalizeCategory(body?.category),
      price: Number.isFinite(parsedPrice) && parsedPrice >= 0 ? parsedPrice : 0,
      description: String(body?.description ?? "").trim() || undefined,
      images: parseList(body?.images).length ? parseList(body?.images) : ["/images/placeholder.svg"],
      size: parseList(body?.size),
      colors: parseList(body?.colors),
      stock: Number.isFinite(parsedStock) && parsedStock >= 0 ? parsedStock : undefined,
    };

    if (!updates.name || !updates.category) {
      return NextResponse.json({ error: "Name and category are required" }, { status: 400 });
    }

    const jsonUpdated = await updateProductJson(productId, updates);
    let mongoUpdated = false;

    try {
      await connectDB();
      const result = await Product.findOneAndUpdate(
        { _id: productId },
        { ...updates, _id: productId },
        { new: true }
      );
      mongoUpdated = Boolean(result);
    } catch (dbError) {
      console.error("Admin product update DB error:", dbError);
    }

    if (!jsonUpdated && !mongoUpdated) {
      return NextResponse.json(
        { error: "Built-in products cannot be edited from the admin table" },
        { status: 409 }
      );
    }

    clearProductsCache();
    return NextResponse.json({ product: { _id: productId, ...updates } });
  } catch (error) {
    console.error("Admin products PUT error:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const authError = await requireAdminRequest(req);
  if (authError) return authError;

  try {
    const productId = req.nextUrl.searchParams.get("id")?.trim();

    if (!productId) {
      return NextResponse.json({ error: "Product id is required" }, { status: 400 });
    }

    const jsonRemoved = await removeProductJson(productId);
    let mongoRemoved = false;

    try {
      await connectDB();
      const result = await Product.deleteOne({ _id: productId });
      mongoRemoved = Boolean(result.deletedCount);
    } catch (dbError) {
      console.error("Admin product delete DB error:", dbError);
    }

    if (!jsonRemoved && !mongoRemoved) {
      return NextResponse.json(
        { error: "Built-in products cannot be deleted from the admin table" },
        { status: 409 }
      );
    }

    clearProductsCache();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin products DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
