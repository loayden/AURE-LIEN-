import { promises as fs } from "fs";
import path from "path";
import { paths } from "./dataPaths";
import {
  getRedisProducts,
  isRedisStorageAvailable,
  setRedisProducts,
} from "@/lib/redisStorage";

export interface ProductRecord {
  _id: string;
  name: string;
  category: string;
  price: number;
  images: string[];
  size: string[];
  colors: string[];
  description?: string;
}

const BLOB_PRODUCTS_PATH = "products.json";

function isProductionBuildPhase(): boolean {
  return process.env.NEXT_PHASE === "phase-production-build";
}

function useCloudStorage(): boolean {
  return !isProductionBuildPhase() && Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim());
}

function useRedisStorage(): boolean {
  return !isProductionBuildPhase() && isRedisStorageAvailable();
}

function normalizeProduct(product: unknown): ProductRecord | null {
  if (!product || typeof product !== "object") {
    return null;
  }

  const raw = product as Record<string, unknown>;
  const _id = String(raw._id ?? "").trim();
  if (!_id) {
    return null;
  }

  return {
    ...raw,
    _id,
    name: String(raw.name ?? "").trim(),
    category: String(raw.category ?? "").trim(),
    price: Number(raw.price ?? 0),
    images: Array.isArray(raw.images)
      ? raw.images.map((value) => String(value))
      : [],
    size: Array.isArray(raw.size)
      ? raw.size.map((value) => String(value))
      : [],
    colors: Array.isArray(raw.colors)
      ? raw.colors.map((value) => String(value))
      : [],
    description: raw.description ? String(raw.description) : undefined,
  } as ProductRecord;
}

function normalizeProducts(products: unknown): ProductRecord[] {
  if (!Array.isArray(products)) {
    return [];
  }

  return products
    .map(normalizeProduct)
    .filter((product): product is ProductRecord => product !== null);
}

async function readLocalProducts(): Promise<ProductRecord[]> {
  try {
    const data = await fs.readFile(paths.products, "utf-8");
    return normalizeProducts(JSON.parse(data));
  } catch {
    return [];
  }
}

async function writeLocalProducts(products: ProductRecord[]): Promise<void> {
  await fs.mkdir(path.dirname(paths.products), { recursive: true });
  await fs.writeFile(paths.products, JSON.stringify(products, null, 2));
}

async function readBlobProducts(): Promise<ProductRecord[] | null> {
  if (!useCloudStorage()) {
    return null;
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  const { list } = await import("@vercel/blob");
  const result = await list({ prefix: BLOB_PRODUCTS_PATH.replace(/\.[^/.]+$/, "") });
  const blob = result.blobs.find((item) => item.pathname === BLOB_PRODUCTS_PATH);
  if (!blob) {
    return null;
  }

  const response = await fetch(blob.url, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  if (!response.ok) {
    return null;
  }

  return normalizeProducts(JSON.parse(await response.text()));
}

async function writeBlobProducts(products: ProductRecord[]): Promise<void> {
  const { put } = await import("@vercel/blob");
  await put(BLOB_PRODUCTS_PATH, JSON.stringify(products, null, 2), {
    access: "public",
    contentType: "application/json",
  });
}

async function readProductSnapshots(): Promise<ProductRecord[]> {
  if (useCloudStorage()) {
    try {
      const products = await readBlobProducts();
      if (products !== null) {
        return products;
      }
    } catch (error) {
      console.warn(
        "Product Blob storage read failed, falling back:",
        error instanceof Error ? error.message : String(error)
      );
    }
  }

  if (useRedisStorage()) {
    try {
      const products = await getRedisProducts();
      if (products !== null) {
        return normalizeProducts(products);
      }
    } catch (error) {
      console.warn(
        "Product Redis storage read failed, falling back:",
        error instanceof Error ? error.message : String(error)
      );
    }
  }

  return readLocalProducts();
}

async function writeProductSnapshots(products: ProductRecord[]): Promise<void> {
  if (useCloudStorage()) {
    await writeBlobProducts(products);
    return;
  }

  if (useRedisStorage()) {
    await setRedisProducts(products);
    return;
  }

  await writeLocalProducts(products);
}

export async function readProductsJson(): Promise<ProductRecord[]> {
  return readProductSnapshots();
}

export async function appendProductJson(product: ProductRecord): Promise<void> {
  const normalized = normalizeProduct(product);
  if (!normalized) {
    throw new Error("Product is missing an id");
  }

  const list = await readProductSnapshots();
  const next = list.filter((item) => String(item._id) !== String(normalized._id));
  next.push(normalized);
  await writeProductSnapshots(next);
}

export async function removeProductJson(productId: string): Promise<boolean> {
  const list = await readProductSnapshots();
  const next = list.filter((product) => String(product._id) !== String(productId));
  if (next.length === list.length) return false;
  await writeProductSnapshots(next);
  return true;
}
