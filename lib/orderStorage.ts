/**
 * Order storage: local JSON files when running on your PC,
 * Vercel Blob when deployed (Vercel/Netlify etc.) so orders persist and you can export them.
 * Scale: supports up to 100k+ orders (single JSON in Blob; export downloads all to your PC).
 */

import { promises as fs } from "fs";
import { paths } from "@/lib/dataPaths";
import connectDB from "@/lib/connectDB";
import Order from "@/models/order";

const BLOB_ORDERS_PATH = "orders.json";
const BLOB_ORDERS_DATA_PATH = "ordersData.json";

function useMongoStorage(): boolean {
  const uri = process.env.MONGO_URI?.trim() || process.env.MONGODB_URI?.trim();
  return Boolean(
    uri &&
      (uri.startsWith("mongodb://") || uri.startsWith("mongodb+srv://"))
  );
}

function useCloudStorage(): boolean {
  return typeof process.env.BLOB_READ_WRITE_TOKEN === "string" && process.env.BLOB_READ_WRITE_TOKEN.length > 0;
}

function normalizeOrder(order: any): any {
  const items = Array.isArray(order?.items) ? order.items : [];
  const products = Array.isArray(order?.products)
    ? order.products
    : items.map((item: any) => ({
        _id: item.productId ?? item._id,
        name: item.name ?? "",
        price: Number(item.price ?? 0),
        quantity: Number(item.quantity ?? 1),
        image: item.image ?? "",
        size: item.size ?? null,
        color: item.color ?? null,
      }));
  const customer = order?.customer ?? order?.customerInfo ?? {};
  const orderId = String(order?._id ?? order?.id ?? `order-${Date.now()}`);
  const createdAt = order?.createdAt
    ? new Date(order.createdAt).toISOString()
    : new Date().toISOString();

  return {
    _id: orderId,
    id: String(order?.id ?? orderId),
    userId: String(order?.userId ?? customer.email ?? "guest"),
    items: items.map((item: any) => ({
      productId: String(item.productId ?? item._id ?? ""),
      name: item.name ?? "",
      price: Number(item.price ?? 0),
      quantity: Number(item.quantity ?? 1),
      image: item.image ?? "",
      size: item.size ?? null,
      color: item.color ?? null,
    })),
    products: products.map((item: any) => ({
      _id: String(item._id ?? item.productId ?? ""),
      name: item.name ?? "",
      price: Number(item.price ?? 0),
      quantity: Number(item.quantity ?? 1),
      image: item.image ?? "",
      size: item.size ?? null,
      color: item.color ?? null,
    })),
    totalPrice: Number(order?.totalPrice ?? order?.total ?? 0),
    total: Number(order?.total ?? order?.totalPrice ?? 0),
    status: order?.status ?? "pending",
    createdAt,
    customer: {
      email: customer.email ?? "",
      firstName: customer.firstName ?? "",
      lastName: customer.lastName ?? "",
      name:
        customer.name ??
        [customer.firstName, customer.lastName].filter(Boolean).join(" ").trim(),
      phone: customer.phone ?? "",
      address: customer.address ?? "",
      apartment: customer.apartment ?? "",
      city: customer.city ?? "",
      postalCode: customer.postalCode ?? customer.zipCode ?? "",
      country: customer.country ?? "",
      newsletter: Boolean(customer.newsletter),
      shippingMethod: customer.shippingMethod ?? "",
      shippingCost: Number(customer.shippingCost ?? 0),
    },
  };
}

function toOrdersDataRecord(order: any): any {
  const normalized = normalizeOrder(order);
  return {
    id: normalized.id,
    status: normalized.status,
    products: normalized.products.map((item: any) => ({
      _id: item._id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
      size: item.size,
      color: item.color,
    })),
    totalPrice: normalized.totalPrice,
    total: normalized.total,
    user: {
      name: normalized.customer.name,
      email: normalized.customer.email,
      phone: normalized.customer.phone,
      address: [normalized.customer.address, normalized.customer.apartment]
        .filter(Boolean)
        .join(", "),
      city: normalized.customer.city,
      postalCode: normalized.customer.postalCode,
      country: normalized.customer.country,
    },
    customer: normalized.customer,
    userId: normalized.userId,
    createdAt: normalized.createdAt,
  };
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
  if (useMongoStorage()) {
    await connectDB();
    const orders = await Order.find({}).sort({ createdAt: -1 }).lean();
    return orders.map(normalizeOrder);
  }
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

export async function appendOrder(order: any): Promise<any> {
  const normalized = normalizeOrder(order);

  if (useMongoStorage()) {
    await connectDB();
    await Order.findOneAndUpdate(
      { _id: normalized._id },
      normalized,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    return normalized;
  }

  const orders = await getOrdersJson();
  orders.push(normalized);
  await setOrdersJson(orders);
  return normalized;
}

export async function removeOrderById(orderId: string, userId?: string): Promise<boolean> {
  if (useMongoStorage()) {
    await connectDB();
    const filter = userId ? { _id: orderId, userId } : { _id: orderId };
    const result = await Order.deleteOne(filter);
    return result.deletedCount > 0;
  }

  const orders = await getOrdersJson();
  const filtered = orders.filter((order) => {
    const normalized = normalizeOrder(order);
    if (normalized._id !== orderId) return true;
    if (userId && normalized.userId !== userId) return true;
    return false;
  });

  if (filtered.length === orders.length) {
    return false;
  }

  await setOrdersJson(filtered);
  return true;
}

/** Read ordersData array (detailed format for admin/analytics) */
export async function getOrdersDataJson(): Promise<any[]> {
  if (useMongoStorage()) {
    const orders = await getOrdersJson();
    return orders.map(toOrdersDataRecord);
  }
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
  if (useMongoStorage()) {
    await connectDB();
    const normalized = orders.map(normalizeOrder);
    await Order.deleteMany({});
    if (normalized.length > 0) {
      await Order.insertMany(normalized, { ordered: true });
    }
    return;
  }
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
  if (useMongoStorage()) {
    // ordersData is derived from the primary orders collection when Mongo is enabled.
    return;
  }
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
