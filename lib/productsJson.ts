import { promises as fs } from "fs";
import { paths } from "./dataPaths";
import {
  getProductStoreEntries,
  isRedisStorageAvailable,
  setProductStoreEntries,
} from "./redisStorage";
import { hasVercelBlobJsonSnapshotStorage, readBlobText, writeBlobText } from "@/lib/blobStorage";

const BLOB_PRODUCTS_PATH = "products.json";

export interface ProductRecord {
  _id: string;
  name: string;
  category: string;
  price: number;
  images: string[];
  size: string[];
  colors: string[];
  description?: string;
  material?: string;
  stock?: number;
  discount?: number;
  media360?: string[];
  videoUrl?: string;
}

export interface DeletedProductRecord {
  _id: string;
  deleted: true;
  deletedAt: string;
}

export type ProductStoreEntry = ProductRecord | DeletedProductRecord;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isDeletedProductRecord(value: unknown): value is DeletedProductRecord {
  return isRecord(value) && value.deleted === true && typeof value._id === "string";
}

function isProductRecord(value: unknown): value is ProductRecord {
  return (
    isRecord(value) &&
    value.deleted !== true &&
    typeof value._id === "string" &&
    typeof value.name === "string" &&
    typeof value.category === "string" &&
    typeof value.price === "number"
  );
}

function normalizeProductRecord(product: ProductRecord): ProductRecord {
  return {
    ...product,
    _id: String(product._id),
    name: String(product.name).trim(),
    category: String(product.category).trim().toLowerCase().replace(/\s+/g, "-"),
    price: Number(product.price) || 0,
    images: Array.isArray(product.images)
      ? product.images.map((value) => String(value).trim()).filter(Boolean)
      : ["/images/placeholder.svg"],
    size: Array.isArray(product.size)
      ? product.size.map((value) => String(value).trim()).filter(Boolean)
      : [],
    colors: Array.isArray(product.colors)
      ? product.colors.map((value) => String(value).trim()).filter(Boolean)
      : [],
    description: product.description ? String(product.description).trim() : undefined,
    material: product.material ? String(product.material).trim() : undefined,
    stock: typeof product.stock === "number" && Number.isFinite(product.stock)
      ? Math.max(0, Math.floor(product.stock))
      : undefined,
    discount: typeof product.discount === "number" && Number.isFinite(product.discount)
      ? Math.max(0, product.discount)
      : undefined,
    media360: Array.isArray(product.media360)
      ? product.media360.map((value) => String(value).trim()).filter(Boolean)
      : undefined,
    videoUrl: product.videoUrl ? String(product.videoUrl).trim() : undefined,
  };
}

function normalizeProductStoreEntries(entries: unknown): ProductStoreEntry[] {
  if (!Array.isArray(entries)) return [];
  return entries.filter((entry) => isProductRecord(entry) || isDeletedProductRecord(entry));
}

function mergeProductStoreEntries(
  primary: ProductStoreEntry[],
  secondary: ProductStoreEntry[]
): ProductStoreEntry[] {
  const byId = new Map<string, ProductStoreEntry>();

  for (const entry of secondary) {
    byId.set(String(entry._id), entry);
  }

  for (const entry of primary) {
    byId.set(String(entry._id), entry);
  }

  return Array.from(byId.values());
}

function useCloudStorage(): boolean {
  return hasVercelBlobJsonSnapshotStorage();
}

function useRedisStorage(): boolean {
  return isRedisStorageAvailable();
}

function isProductionBuildPhase(): boolean {
  return (
    process.env.NEXT_PHASE === "phase-production-build" ||
    process.env.npm_lifecycle_event === "build"
  );
}

export function getActiveProductRecords(entries: ProductStoreEntry[]): ProductRecord[] {
  return entries.filter(isProductRecord).map(normalizeProductRecord);
}

export function getDeletedProductIds(entries: ProductStoreEntry[]): Set<string> {
  return new Set(
    entries
      .filter(isDeletedProductRecord)
      .map((entry) => String(entry._id))
      .filter(Boolean)
  );
}

export function applyProductUpsert(
  entries: ProductStoreEntry[],
  product: ProductRecord
): ProductStoreEntry[] {
  const normalized = normalizeProductRecord(product);
  const next = entries.filter((entry) => String(entry._id) !== normalized._id);
  next.push(normalized);
  return next;
}

export function applyProductDeletion(
  entries: ProductStoreEntry[],
  productId: string
): { entries: ProductStoreEntry[]; removed: boolean; tombstoned: boolean } {
  const normalizedId = String(productId).trim();
  const activeBefore = entries.some(
    (entry) => !isDeletedProductRecord(entry) && String(entry._id) === normalizedId
  );
  const next = entries.filter((entry) => String(entry._id) !== normalizedId);

  if (activeBefore) {
    return { entries: next, removed: true, tombstoned: false };
  }

  next.push({
    _id: normalizedId,
    deleted: true,
    deletedAt: new Date().toISOString(),
  });
  return { entries: next, removed: false, tombstoned: true };
}

async function readLocalProductStoreJson(): Promise<ProductStoreEntry[]> {
  try {
    const data = await fs.readFile(paths.products, "utf-8");
    const parsed = JSON.parse(data);
    return normalizeProductStoreEntries(parsed);
  } catch {
    return [];
  }
}

async function writeLocalProductStoreJson(entries: ProductStoreEntry[]): Promise<void> {
  await fs.writeFile(paths.products, JSON.stringify(entries, null, 2));
}

async function readBlobProductStoreJson(): Promise<ProductStoreEntry[] | null> {
  const text = await readBlobText(BLOB_PRODUCTS_PATH, { access: "public" });
  if (!text) return null;

  try {
    return normalizeProductStoreEntries(JSON.parse(text));
  } catch {
    return [];
  }
}

async function writeBlobProductStoreJson(entries: ProductStoreEntry[]): Promise<void> {
  await writeBlobText(BLOB_PRODUCTS_PATH, JSON.stringify(entries, null, 2), {
    access: "public",
    contentType: "application/json",
  });
}

async function readRedisProductStoreJson(): Promise<ProductStoreEntry[] | null> {
  const entries = await getProductStoreEntries();
  return entries ? normalizeProductStoreEntries(entries) : null;
}

async function writeRedisProductStoreJson(entries: ProductStoreEntry[]): Promise<void> {
  await setProductStoreEntries(entries);
}

export async function readProductStoreJson(): Promise<ProductStoreEntry[]> {
  const localEntries = await readLocalProductStoreJson();
  if (isProductionBuildPhase()) {
    return localEntries;
  }

  if (useCloudStorage()) {
    try {
      const blobEntries = await readBlobProductStoreJson();
      if (blobEntries) {
        return mergeProductStoreEntries(blobEntries, localEntries);
      }
    } catch (error) {
      console.error(
        "Product Blob read failed, falling back to local snapshot:",
        error instanceof Error ? error.message : String(error)
      );
    }
  }

  if (useRedisStorage()) {
    try {
      const redisEntries = await readRedisProductStoreJson();
      if (redisEntries) {
        return mergeProductStoreEntries(redisEntries, localEntries);
      }
    } catch (error) {
      console.error(
        "Product Redis read failed, falling back to local snapshot:",
        error instanceof Error ? error.message : String(error)
      );
    }
  }

  return localEntries;
}

async function writeProductStoreJson(entries: ProductStoreEntry[]): Promise<void> {
  if (useCloudStorage()) {
    try {
      await writeBlobProductStoreJson(entries);
      return;
    } catch (error) {
      console.error(
        "Product Blob write failed, falling back to Redis/local snapshot:",
        error instanceof Error ? error.message : String(error)
      );
    }
  }

  if (useRedisStorage()) {
    try {
      await writeRedisProductStoreJson(entries);
      return;
    } catch (error) {
      console.error(
        "Product Redis write failed, falling back to local snapshot:",
        error instanceof Error ? error.message : String(error)
      );
    }
  }

  await writeLocalProductStoreJson(entries);
}

export async function readProductsJson(): Promise<ProductRecord[]> {
  return getActiveProductRecords(await readProductStoreJson());
}

export async function readDeletedProductIds(): Promise<Set<string>> {
  return getDeletedProductIds(await readProductStoreJson());
}

export async function appendProductJson(product: ProductRecord): Promise<void> {
  await upsertProductJson(product);
}

export async function upsertProductJson(product: ProductRecord): Promise<void> {
  const entries = await readProductStoreJson();
  await writeProductStoreJson(applyProductUpsert(entries, product));
}

export async function removeProductJson(
  productId: string
): Promise<{ removed: boolean; tombstoned: boolean }> {
  const entries = await readProductStoreJson();
  const result = applyProductDeletion(entries, productId);
  await writeProductStoreJson(result.entries);
  return { removed: result.removed, tombstoned: result.tombstoned };
}
