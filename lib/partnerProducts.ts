import { promises as fs } from "fs";
import connectDB, { hasConfiguredMongoUri } from "@/lib/connectDB";
import { paths } from "@/lib/dataPaths";
import { CATALOG_PRICE_OFFSET_EGP } from "@/lib/catalogPrice";
import { upsertProductJson, type ProductRecord } from "@/lib/productsJson";
import ProductModel from "@/models/Product";
import {
  appendRedisPartnerProduct,
  getRedisPartnerProducts,
  isRedisStorageAvailable,
  setRedisPartnerProducts,
} from "@/lib/redisStorage";
import {
  hasVercelBlobStorage,
  readBlobTextWithLegacyPublicFallback,
  writeBlobText,
} from "@/lib/blobStorage";

const BLOB_PARTNER_PRODUCTS_PATH = "partnerProducts.json";

export type PartnerProductStatus = "pending" | "approved" | "rejected";

export type PartnerProductDraft = {
  _id: string;
  productId: string;
  applicationId: string;
  partnerUserId?: string;
  partnerEmail?: string;
  boutiqueName: string;
  partnerName: string;
  phone: string;
  name: string;
  category: string;
  price: number;
  images: string[];
  size: string[];
  colors: string[];
  description?: string;
  material?: string;
  stock?: number;
  status: PartnerProductStatus;
  reviewNote?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  createdAt: string;
  updatedAt: string;
};

function useCloudStorage(): boolean {
  return hasVercelBlobStorage();
}

function cleanString(value: unknown): string {
  return String(value ?? "").trim();
}

function normalizeCategory(value: unknown): string {
  return cleanString(value).toLowerCase().replace(/\s+/g, "-");
}

function parseList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((entry) => cleanString(entry)).filter(Boolean);
  }

  if (typeof value === "string") {
    return value.split(",").map((entry) => entry.trim()).filter(Boolean);
  }

  return [];
}

function normalizePartnerProduct(raw: any): PartnerProductDraft | null {
  const id = cleanString(raw?._id ?? raw?.id);
  const applicationId = cleanString(raw?.applicationId);
  const name = cleanString(raw?.name);
  const category = normalizeCategory(raw?.category);
  const price = Math.max(0, Math.floor(Number(raw?.price ?? 0)));
  const boutiqueName = cleanString(raw?.boutiqueName);
  const partnerName = cleanString(raw?.partnerName);
  const phone = cleanString(raw?.phone);
  const createdAt = raw?.createdAt ? new Date(raw.createdAt).toISOString() : new Date().toISOString();
  const status = ["approved", "rejected", "pending"].includes(cleanString(raw?.status))
    ? cleanString(raw?.status) as PartnerProductStatus
    : "pending";

  if (!id || !applicationId || !name || !category || !price || !boutiqueName || !partnerName || !phone) {
    return null;
  }

  return {
    _id: id,
    productId: cleanString(raw?.productId) || `partner-${id}`,
    applicationId,
    partnerUserId: cleanString(raw?.partnerUserId) || undefined,
    partnerEmail: cleanString(raw?.partnerEmail).toLowerCase() || undefined,
    boutiqueName,
    partnerName,
    phone,
    name,
    category,
    price,
    images: parseList(raw?.images).length ? parseList(raw?.images) : ["/images/placeholder.svg"],
    size: parseList(raw?.size),
    colors: parseList(raw?.colors),
    description: cleanString(raw?.description) || undefined,
    material: cleanString(raw?.material) || undefined,
    stock: Number.isFinite(Number(raw?.stock)) ? Math.max(0, Math.floor(Number(raw.stock))) : undefined,
    status,
    reviewNote: cleanString(raw?.reviewNote) || undefined,
    reviewedAt: raw?.reviewedAt ? new Date(raw.reviewedAt).toISOString() : undefined,
    reviewedBy: cleanString(raw?.reviewedBy) || undefined,
    createdAt,
    updatedAt: raw?.updatedAt ? new Date(raw.updatedAt).toISOString() : createdAt,
  };
}

function normalizePartnerProducts(products: unknown): PartnerProductDraft[] {
  if (!Array.isArray(products)) return [];
  return products
    .map(normalizePartnerProduct)
    .filter((product): product is PartnerProductDraft => Boolean(product))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

function mergePartnerProducts(primary: PartnerProductDraft[], secondary: PartnerProductDraft[]): PartnerProductDraft[] {
  const byId = new Map<string, PartnerProductDraft>();

  for (const product of secondary) {
    byId.set(product._id, product);
  }

  for (const product of primary) {
    byId.set(product._id, product);
  }

  return Array.from(byId.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

async function readLocalPartnerProducts(): Promise<PartnerProductDraft[]> {
  try {
    const data = await fs.readFile(paths.partnerProducts, "utf-8");
    return normalizePartnerProducts(JSON.parse(data));
  } catch {
    return [];
  }
}

async function writeLocalPartnerProducts(products: PartnerProductDraft[]): Promise<void> {
  await fs.writeFile(paths.partnerProducts, JSON.stringify(products, null, 2));
}

async function readBlobPartnerProducts(): Promise<PartnerProductDraft[] | null> {
  const text = await readBlobTextWithLegacyPublicFallback(BLOB_PARTNER_PRODUCTS_PATH, {
    access: "private",
  });
  if (!text) return null;

  try {
    return normalizePartnerProducts(JSON.parse(text));
  } catch {
    return [];
  }
}

async function writeBlobPartnerProducts(products: PartnerProductDraft[]): Promise<void> {
  await writeBlobText(BLOB_PARTNER_PRODUCTS_PATH, JSON.stringify(products, null, 2), {
    access: "private",
    contentType: "application/json",
  });
}

export async function getPartnerProducts(): Promise<PartnerProductDraft[]> {
  const localProducts = await readLocalPartnerProducts();

  if (useCloudStorage()) {
    try {
      const blobProducts = await readBlobPartnerProducts();
      if (blobProducts) {
        return mergePartnerProducts(blobProducts, localProducts);
      }
    } catch (error) {
      console.error(
        "Partner product Blob read failed, falling back to local products:",
        error instanceof Error ? error.message : String(error)
      );
    }
  }

  if (isRedisStorageAvailable()) {
    const redisProducts = await getRedisPartnerProducts();
    if (redisProducts) {
      return mergePartnerProducts(normalizePartnerProducts(redisProducts), localProducts);
    }
  }

  return localProducts;
}

async function setPartnerProducts(products: PartnerProductDraft[]): Promise<void> {
  const normalized = normalizePartnerProducts(products);

  if (useCloudStorage()) {
    await writeBlobPartnerProducts(normalized);
    return;
  }

  if (isRedisStorageAvailable()) {
    await setRedisPartnerProducts(normalized);
    return;
  }

  await writeLocalPartnerProducts(normalized);
}

export async function createPartnerProductDraft(
  payload: Omit<PartnerProductDraft, "_id" | "productId" | "status" | "createdAt" | "updatedAt">
): Promise<PartnerProductDraft> {
  const now = new Date().toISOString();
  const id = `partner-product-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  const product = normalizePartnerProduct({
    ...payload,
    _id: id,
    productId: `partner-${id}`,
    status: "pending",
    createdAt: now,
    updatedAt: now,
  });

  if (!product) {
    throw new Error("Invalid partner product draft");
  }

  if (useCloudStorage()) {
    const existing = await getPartnerProducts();
    await setPartnerProducts([product, ...existing]);
    return product;
  }

  if (isRedisStorageAvailable()) {
    await appendRedisPartnerProduct(product);
    return product;
  }

  const existing = await readLocalPartnerProducts();
  await writeLocalPartnerProducts([product, ...existing]);
  return product;
}

function toApprovedProductRecord(product: PartnerProductDraft): ProductRecord {
  return {
    _id: product.productId,
    name: product.name,
    category: product.category,
    price: Math.max(0, product.price - CATALOG_PRICE_OFFSET_EGP),
    images: product.images,
    size: product.size,
    colors: product.colors,
    description: product.description,
    material: product.material,
    stock: product.stock,
  };
}

async function upsertApprovedProduct(product: ProductRecord): Promise<void> {
  await upsertProductJson(product);

  if (!hasConfiguredMongoUri()) return;

  try {
    await connectDB();
    await ProductModel.findOneAndUpdate(
      { _id: product._id },
      {
        $set: {
          ...product,
          deleted: false,
        },
        $unset: { deletedAt: "" },
      },
      { upsert: true, returnDocument: "after" }
    );
  } catch (error) {
    console.error(
      "Partner product Mongo publish failed; JSON/Redis catalogue write already completed:",
      error instanceof Error ? error.message : String(error)
    );
  }
}

export async function reviewPartnerProduct(
  productId: string,
  review: { status: "approved" | "rejected"; reviewNote?: string; reviewedBy?: string }
): Promise<PartnerProductDraft | null> {
  const products = await getPartnerProducts();
  const index = products.findIndex((product) => product._id === productId);
  if (index === -1) return null;

  const now = new Date().toISOString();
  const nextProduct: PartnerProductDraft = {
    ...products[index],
    status: review.status,
    reviewNote: cleanString(review.reviewNote) || undefined,
    reviewedBy: cleanString(review.reviewedBy) || undefined,
    reviewedAt: now,
    updatedAt: now,
  };

  if (review.status === "approved") {
    await upsertApprovedProduct(toApprovedProductRecord(nextProduct));
  }

  const nextProducts = [...products];
  nextProducts[index] = nextProduct;
  await setPartnerProducts(nextProducts);
  return nextProduct;
}
