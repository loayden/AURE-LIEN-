import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAuthFromRequest } from "@/lib/auth";
import connectDB, { hasConfiguredMongoUri } from "@/lib/connectDB";
import Product from "@/models/Product";
import { CATALOG_PRICE_OFFSET_EGP } from "@/lib/catalogPrice";
import { appendProductJson, ProductRecord, readProductsJson, removeProductJson, upsertProductJson } from "@/lib/productsJson";
import { clearProductsCache, getAllProducts, getProductById } from "@/lib/getAllProducts";
import { ALL_CATEGORY_META } from "@/lib/commerce";

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store, max-age=0",
};

const CATALOG_REVALIDATION_PATHS = [
  "/",
  "/shop",
  "/collection",
  ...ALL_CATEGORY_META.map((category) => category.href),
];

function revalidateCatalogPages(productId?: string) {
  for (const path of new Set(CATALOG_REVALIDATION_PATHS)) {
    revalidatePath(path);
  }

  if (productId) {
    revalidatePath(`/product/${encodeURIComponent(productId)}`);
  }
}

function parseStringList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((entry) => String(entry).trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    return value.split(",").map((entry) => entry.trim()).filter(Boolean);
  }

  return [];
}

function normalizeCategory(value: unknown): string {
  return String(value ?? "").trim().toLowerCase().replace(/\s+/g, "-");
}

function storefrontPriceToStoredPrice(value: unknown, fallbackStorefrontPrice?: number): number {
  const numeric = Number(value ?? fallbackStorefrontPrice ?? 0);
  if (!Number.isFinite(numeric)) return 0;
  return Math.max(0, numeric);
}

function buildProductRecord(body: Record<string, unknown>, existing?: Awaited<ReturnType<typeof getProductById>>): ProductRecord {
  const productId = String(body._id ?? body.productId ?? existing?._id ?? "").trim();
  const name = String(body.name ?? existing?.name ?? "").trim();
  const category = normalizeCategory(body.category ?? existing?.category);
  const price = storefrontPriceToStoredPrice(
    body.price,
    existing?.price != null ? Math.max(0, existing.price - CATALOG_PRICE_OFFSET_EGP) : undefined
  );
  const images = parseStringList(body.images).length
    ? parseStringList(body.images)
    : existing?.images?.length
      ? existing.images
      : ["/images/placeholder.svg"];
  const size = parseStringList(body.size).length
    ? parseStringList(body.size)
    : existing?.size ?? [];
  const colors = parseStringList(body.colors).length
    ? parseStringList(body.colors)
    : existing?.colors ?? [];
  const stock = body.stock === "" || body.stock == null
    ? existing?.stock
    : Math.max(0, Math.floor(Number(body.stock) || 0));

  return {
    _id: productId,
    name,
    category,
    price,
    description: String(body.description ?? existing?.description ?? "").trim() || undefined,
    images,
    size,
    colors,
    material: String(body.material ?? existing?.material ?? "").trim() || undefined,
    stock,
  };
}

function validateProductRecord(product: ProductRecord): string | null {
  if (!product._id) return "Product id is required";
  if (!product.name) return "Name is required";
  if (!product.category) return "Category is required";
  if (!Number.isFinite(product.price) || product.price < 0) return "Price must be a positive number";
  if (!product.images.length) return "At least one image is required";
  return null;
}

async function writeProductToMongo(productData: ProductRecord): Promise<boolean> {
  try {
    if (!hasConfiguredMongoUri()) return false;

    await connectDB();
    await Product.findOneAndUpdate(
      { _id: productData._id },
      {
        $set: {
          ...productData,
          deleted: false,
        },
        $unset: { deletedAt: "" },
      },
      { upsert: true, returnDocument: "after" }
    );
    return true;
  } catch (dbError) {
    console.error("Product Mongo write failed:", dbError);
    return false;
  }
}

async function tombstoneProductInMongo(productId: string, existing?: Awaited<ReturnType<typeof getProductById>>): Promise<boolean> {
  try {
    if (!hasConfiguredMongoUri()) return false;

    await connectDB();
    await Product.findOneAndUpdate(
      { _id: productId },
      {
        $set: {
          _id: productId,
          name: existing?.name ?? "Deleted product",
          category: existing?.category ?? "deleted",
          price: 0,
          images: [],
          size: [],
          colors: [],
          deleted: true,
          deletedAt: new Date(),
        },
        $unset: {
          description: "",
          material: "",
          stock: "",
        },
      },
      { upsert: true, returnDocument: "after" }
    );
    return true;
  } catch (dbError) {
    console.error("Product Mongo delete tombstone failed:", dbError);
    return false;
  }
}

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
        manageable: true,
        editable: true,
        storedInJson: jsonIds.has(String(product._id)),
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

    const savedToMongo = await writeProductToMongo(productData);
    let savedToJson = false;
    try {
      await appendProductJson(productData);
      savedToJson = true;
    } catch (jsonError) {
      console.error("Add product JSON write failed:", jsonError);
    }

    if (!savedToMongo && !savedToJson) {
      return NextResponse.json({ error: "Failed to persist product" }, { status: 500 });
    }

    clearProductsCache();
    revalidateCatalogPages(_id);

    return NextResponse.json(
      { message: "Product added", product: productData, savedToMongo, savedToJson },
      { status: 201 }
    );
  } catch (e) {
    console.error("Add product error:", e);
    return NextResponse.json({ error: "Failed to add product" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const auth = await getAuthFromRequest(req);
  if (!auth || auth.role !== "admin") {
    return NextResponse.json({ message: "Not authorized" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const productId = String(body?._id ?? body?.productId ?? "").trim();
    if (!productId) {
      return NextResponse.json({ error: "Product id is required" }, { status: 400 });
    }

    const existing = await getProductById(productId);
    if (!existing) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const productData = buildProductRecord({ ...body, _id: productId }, existing);
    const validationError = validateProductRecord(productData);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const savedToMongo = await writeProductToMongo(productData);
    let savedToJson = false;
    try {
      await upsertProductJson(productData);
      savedToJson = true;
    } catch (jsonError) {
      console.error("Edit product JSON write failed:", jsonError);
    }

    if (!savedToMongo && !savedToJson) {
      return NextResponse.json({ error: "Failed to persist product update" }, { status: 500 });
    }

    clearProductsCache();
    revalidateCatalogPages(productId);

    const updated = await getProductById(productId);
    return NextResponse.json({
      message: "Product updated",
      product: updated ?? productData,
      savedToMongo,
      savedToJson,
    });
  } catch (error) {
    console.error("Edit product error:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
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
  let tombstonedJson = false;

  try {
    const existing = await getProductById(productId);
    let savedToJson = false;
    try {
      const jsonResult = await removeProductJson(productId);
      removedJson = jsonResult.removed;
      tombstonedJson = jsonResult.tombstoned;
      savedToJson = true;
    } catch (jsonError) {
      console.error("Delete product JSON write failed:", jsonError);
    }
    removedMongo = await tombstoneProductInMongo(productId, existing ?? undefined);

    if (!existing && !savedToJson && !removedMongo) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (existing && !savedToJson && !removedMongo) {
      return NextResponse.json({ error: "Failed to persist product deletion" }, { status: 500 });
    }

    clearProductsCache();

    revalidateCatalogPages(productId);

    return NextResponse.json({
      success: true,
      removedJson,
      removedMongo,
      tombstonedJson,
      alreadyDeleted: !existing,
    });
  } catch (error) {
    console.error("Delete product error:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
