import { promises as fs } from "fs";
import { paths } from "./dataPaths";

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

export async function readProductStoreJson(): Promise<ProductStoreEntry[]> {
  try {
    const data = await fs.readFile(paths.products, "utf-8");
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((entry) => isProductRecord(entry) || isDeletedProductRecord(entry));
  } catch {
    return [];
  }
}

async function writeProductStoreJson(entries: ProductStoreEntry[]): Promise<void> {
  await fs.writeFile(paths.products, JSON.stringify(entries, null, 2));
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
