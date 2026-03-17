/**
 * Order storage: local JSON files when running on your PC,
 * Vercel Blob when deployed (Vercel/Netlify etc.) so orders persist and you can export them.
 * Scale: supports up to 100k+ orders (single JSON in Blob; export downloads all to your PC).
 */

import { promises as fs } from "fs";
import { paths } from "@/lib/dataPaths";

const BLOB_ORDERS_PATH = "orders.json";
const BLOB_ORDERS_DATA_PATH = "ordersData.json";

function useCloudStorage(): boolean {
  return typeof process.env.BLOB_READ_WRITE_TOKEN === "string" && process.env.BLOB_READ_WRITE_TOKEN.length > 0;
}

async function readLocalJson<T>(filePath: string): Promise<T> {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data) as T;
  } catch {
    return [] as unknown as T;
  }
}

async function writeLocalJson(filePath: string, data: unknown): Promise<void> {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

async function readBlobByPathname(pathname: string): Promise<string | null> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) return null;
  const { list } = await import("@vercel/blob");
  const result = await list({ prefix: pathname.replace(/\.[^/.]+$/, "") });
  const blob = result.blobs.find((b) => b.pathname === pathname);
  if (!blob) return null;
  const res = await fetch(blob.url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;
  return res.text();
}

/** Read orders array (used by /api/orders and /api/saveorder) */
export async function getOrdersJson(): Promise<any[]> {
  if (!useCloudStorage()) {
    return readLocalJson<any[]>(paths.orders);
  }
  try {
    const text = await readBlobByPathname(BLOB_ORDERS_PATH);
    if (!text) return [];
    const parsed = JSON.parse(text);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/** Read ordersData array (detailed format for admin/analytics) */
export async function getOrdersDataJson(): Promise<any[]> {
  if (!useCloudStorage()) {
    return readLocalJson<any[]>(paths.ordersData);
  }
  try {
    const text = await readBlobByPathname(BLOB_ORDERS_DATA_PATH);
    if (!text) return [];
    const parsed = JSON.parse(text);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/** Write orders array (append or replace) */
export async function setOrdersJson(orders: any[]): Promise<void> {
  if (!useCloudStorage()) {
    await writeLocalJson(paths.orders, orders);
    return;
  }
  const { put } = await import("@vercel/blob");
  await put(BLOB_ORDERS_PATH, JSON.stringify(orders, null, 2), {
    access: "public",
    contentType: "application/json",
  });
}

/** Write ordersData array */
export async function setOrdersDataJson(ordersData: any[]): Promise<void> {
  if (!useCloudStorage()) {
    await writeLocalJson(paths.ordersData, ordersData);
    return;
  }
  const { put } = await import("@vercel/blob");
  await put(BLOB_ORDERS_DATA_PATH, JSON.stringify(ordersData, null, 2), {
    access: "public",
    contentType: "application/json",
  });
}
