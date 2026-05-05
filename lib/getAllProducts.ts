/**
 * Server-only merged product catalog:
 * - built-in storefront products
 * - JSON-backed admin products
 * - Mongo-backed admin products when DB is configured
 */
import connectDB from "./connectDB";
import ProductModel from "@/models/Product";
import { applyCatalogPriceOffset } from "./catalogPrice";
import { resolveProductColors } from "./productColors";
import { withPublicAssetVersion } from "./publicAsset";
import { rawProductsData } from "./productsData";
import { readProductsJson } from "./productsJson";
import type { Product } from "./types";

const PLACEHOLDER_IMAGE = "/images/placeholder.svg";
const DEFAULT_CATALOG_DISCOUNT = 40;

const PRODUCT_CACHE_TTL_MS = 30_000;

let cache: Product[] | null = null;
let cacheExpiresAt = 0;
let pendingLoad: Promise<Product[]> | null = null;

function hasMongoConfig(): boolean {
  const uri = process.env.MONGO_URI?.trim() || process.env.MONGODB_URI?.trim();
  return Boolean(
    uri &&
      (uri.startsWith("mongodb://") || uri.startsWith("mongodb+srv://"))
  );
}

function normalizeImagePath(image: unknown): string {
  if (typeof image !== "string") return PLACEHOLDER_IMAGE;

  const trimmed = image.trim();
  if (!trimmed) return PLACEHOLDER_IMAGE;

  if (
    trimmed.startsWith("/") ||
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:")
  ) {
    return trimmed;
  }

  const normalized = trimmed.replace(/^\.?\//, "");

  if (!normalized) return PLACEHOLDER_IMAGE;
  if (normalized.startsWith("uploads/") || normalized.startsWith("images/")) {
    return withPublicAssetVersion(`/${normalized}`);
  }
  if (normalized === "placeholder.svg") return "/images/placeholder.svg";

  // Admin-uploaded media is stored under public/uploads.
  return withPublicAssetVersion(`/uploads/${normalized}`);
}

function normalizeProduct(raw: any): Product {
  const images = Array.isArray(raw?.images)
    ? raw.images.map(normalizeImagePath).filter(Boolean)
    : [];

  return {
    _id: String(raw?._id ?? ""),
    name: String(raw?.name ?? "").trim(),
    category: String(raw?.category ?? "").trim(),
    price: applyCatalogPriceOffset(Number(raw?.price ?? 0)),
    discount:
      typeof raw?.discount === "number" && raw.discount > 0
        ? raw.discount
        : DEFAULT_CATALOG_DISCOUNT,
    images: images.length > 0 ? images : [PLACEHOLDER_IMAGE],
    size: Array.isArray(raw?.size)
      ? raw.size.map((value: unknown) => String(value))
      : [],
    colors: resolveProductColors({
      _id: String(raw?._id ?? ""),
      name: String(raw?.name ?? "").trim(),
      description: raw?.description ? String(raw.description) : undefined,
      images,
      colors: Array.isArray(raw?.colors)
        ? raw.colors.map((value: unknown) => String(value))
        : [],
    }),
    description: raw?.description ? String(raw.description) : undefined,
    material: raw?.material ? String(raw.material) : undefined,
    stock: typeof raw?.stock === "number" ? raw.stock : undefined,
    media360: Array.isArray(raw?.media360)
      ? raw.media360.map((value: unknown) => normalizeImagePath(value))
      : undefined,
    videoUrl: raw?.videoUrl ? String(raw.videoUrl) : undefined,
  };
}

function mergeProducts(lists: Product[][]): Product[] {
  const byId = new Map<string, Product>();

  for (const list of lists) {
    for (const product of list.map(normalizeProduct)) {
      if (!product._id) continue;
      byId.set(product._id, product);
    }
  }

  return Array.from(byId.values());
}

async function readMongoProducts(): Promise<Product[]> {
  if (!hasMongoConfig()) return [];

  try {
    await connectDB();
    const products = await ProductModel.find({}).sort({ createdAt: -1 }).lean();
    return products.map(normalizeProduct);
  } catch (error) {
    console.error("Failed to read products from MongoDB:", error);
    return [];
  }
}

async function loadAllProducts(): Promise<Product[]> {
  const builtInProducts = rawProductsData.map(normalizeProduct);
  const fromJson = (await readProductsJson()).map(normalizeProduct);
  const fromMongo = await readMongoProducts();

  return mergeProducts([builtInProducts, fromJson, fromMongo]);
}

export async function getAllProducts(): Promise<Product[]> {
  const now = Date.now();
  if (cache && now < cacheExpiresAt) return cache;
  if (pendingLoad) return pendingLoad;

  pendingLoad = loadAllProducts()
    .then((products) => {
      cache = products;
      cacheExpiresAt = Date.now() + PRODUCT_CACHE_TTL_MS;
      return products;
    })
    .finally(() => {
      pendingLoad = null;
    });

  return pendingLoad;
}

export async function getProductById(id: string): Promise<Product | null> {
  if (!id) return null;
  const products = await getAllProducts();
  return products.find((product) => String(product._id) === String(id)) ?? null;
}

export function clearProductsCache() {
  cache = null;
  cacheExpiresAt = 0;
  pendingLoad = null;
}
