/**
 * Order storage: local JSON files when running on your PC,
 * Vercel Blob when deployed (Vercel/Netlify etc.) so orders persist and you can export them.
 * Scale: supports up to 100k+ orders (single JSON in Blob; export downloads all to your PC).
 */

import { promises as fs } from "fs";
import { paths } from "@/lib/dataPaths";
import connectDB from "@/lib/connectDB";
import Order from "@/models/order";
import {
  appendRedisOrder,
  getRedisOrders,
  isRedisStorageAvailable,
  removeRedisOrder,
  setRedisOrders,
} from "@/lib/redisStorage";

const BLOB_ORDERS_PATH = "orders.json";
const BLOB_ORDERS_DATA_PATH = "ordersData.json";

function hasMongoStorage(): boolean {
  const uri = process.env.MONGO_URI?.trim() || process.env.MONGODB_URI?.trim();
  return Boolean(
    uri &&
      (uri.startsWith("mongodb://") || uri.startsWith("mongodb+srv://"))
  );
}

function hasCloudStorage(): boolean {
  return typeof process.env.BLOB_READ_WRITE_TOKEN === "string" && process.env.BLOB_READ_WRITE_TOKEN.length > 0;
}

function sortOrdersByDateDesc(orders: any[]): any[] {
  return [...orders].sort(
    (a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
  );
}

function mergeOrders(primary: any[], secondary: any[]): any[] {
  const byId = new Map<string, any>();

  for (const order of secondary.map(normalizeOrder)) {
    byId.set(order._id, order);
  }

  for (const order of primary.map(normalizeOrder)) {
    byId.set(order._id, order);
  }

  return sortOrdersByDateDesc(Array.from(byId.values()));
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
  const updatedAt = order?.updatedAt
    ? new Date(order.updatedAt).toISOString()
    : createdAt;
  const paidAt = order?.paidAt ? new Date(order.paidAt).toISOString() : null;

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
    paymentStatus:
      order?.paymentStatus ?? (order?.status === "completed" ? "paid" : "pending"),
    paymentProvider: order?.paymentProvider ?? "manual",
    stripeSessionId: order?.stripeSessionId ?? "",
    paidAt,
    createdAt,
    updatedAt,
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
    paymentStatus: normalized.paymentStatus,
    paymentProvider: normalized.paymentProvider,
    stripeSessionId: normalized.stripeSessionId,
    paidAt: normalized.paidAt,
    createdAt: normalized.createdAt,
    updatedAt: normalized.updatedAt,
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

async function readOrderSnapshots(): Promise<any[]> {
  if (hasCloudStorage()) {
    try {
      const text = await readBlobByPathname(BLOB_ORDERS_PATH);
      if (!text) return [];
      const parsed = JSON.parse(text);
      return Array.isArray(parsed) ? parsed.map(normalizeOrder) : [];
    } catch {
      return [];
    }
  }

  if (isRedisStorageAvailable()) {
    const redisOrders = await getRedisOrders();
    return Array.isArray(redisOrders) ? redisOrders.map(normalizeOrder) : [];
  }

  return readLocalJson<any[]>(paths.orders);
}

async function writeOrderSnapshots(orders: any[]): Promise<void> {
  const normalized = sortOrdersByDateDesc(orders.map(normalizeOrder));
  const ordersData = normalized.map(toOrdersDataRecord);

  if (hasCloudStorage()) {
    const { put } = await import("@vercel/blob");
    await Promise.all([
      put(BLOB_ORDERS_PATH, JSON.stringify(normalized, null, 2), {
        access: "public",
        contentType: "application/json",
      }),
      put(BLOB_ORDERS_DATA_PATH, JSON.stringify(ordersData, null, 2), {
        access: "public",
        contentType: "application/json",
      }),
    ]);
    return;
  }

  if (isRedisStorageAvailable()) {
    await setRedisOrders(normalized);
    return;
  }

  await writeLocalJson(paths.orders, normalized);
  await writeLocalJson(paths.ordersData, ordersData);
}

async function readMongoOrders(): Promise<any[]> {
  await connectDB();
  const orders = await Order.find({}).sort({ createdAt: -1 }).lean();
  return orders.map(normalizeOrder);
}

async function syncOrderSnapshotsFromMongo(excludedOrderIds: string[] = []): Promise<any[]> {
  const mongoOrders = await readMongoOrders();
  const snapshotOrders = (await readOrderSnapshots()).filter(
    (order) => !excludedOrderIds.includes(normalizeOrder(order)._id)
  );
  const merged = mergeOrders(mongoOrders, snapshotOrders);
  await writeOrderSnapshots(merged);
  return merged;
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
  const snapshotOrders = await readOrderSnapshots();

  if (hasMongoStorage()) {
    try {
      const mongoOrders = await readMongoOrders();
      return mergeOrders(mongoOrders, snapshotOrders);
    } catch {
      return snapshotOrders;
    }
  }

  return snapshotOrders;
}

export async function appendOrder(order: any): Promise<any> {
  const normalized = normalizeOrder(order);

  if (hasMongoStorage()) {
    await connectDB();
    await Order.findOneAndUpdate(
      { _id: normalized._id },
      normalized,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    try {
      await syncOrderSnapshotsFromMongo();
    } catch (error) {
      console.warn(
        "⚠️ Order saved to MongoDB but snapshot sync failed:",
        error instanceof Error ? error.message : String(error)
      );
    }
    return normalized;
  }

  if (!hasCloudStorage() && isRedisStorageAvailable()) {
    await appendRedisOrder(normalized);
    return normalized;
  }

  const orders = await readOrderSnapshots();
  orders.push(normalized);
  await setOrdersJson(orders);
  return normalized;
}

export async function removeOrderById(orderId: string, userId?: string): Promise<boolean> {
  if (hasMongoStorage()) {
    await connectDB();
    const filter = userId ? { _id: orderId, userId } : { _id: orderId };
    const result = await Order.deleteOne(filter);
    if (result.deletedCount > 0) {
      try {
        await syncOrderSnapshotsFromMongo([orderId]);
      } catch (error) {
        console.warn(
          "⚠️ Order removed from MongoDB but snapshot sync failed:",
          error instanceof Error ? error.message : String(error)
        );
      }
    }
    return result.deletedCount > 0;
  }

  if (!hasCloudStorage() && isRedisStorageAvailable()) {
    const orders = await readOrderSnapshots();
    const existing = orders.find((order) => {
      const normalized = normalizeOrder(order);
      if (normalized._id !== orderId) return false;
      if (userId && normalized.userId !== userId) return false;
      return true;
    });

    if (!existing) {
      return false;
    }

    await removeRedisOrder(orderId);
    return true;
  }

  const orders = await readOrderSnapshots();
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

export async function updateOrderById(
  orderId: string,
  updates: Record<string, unknown>,
  userId?: string
): Promise<any | null> {
  const now = new Date().toISOString();

  if (hasMongoStorage()) {
    await connectDB();
    const filter = userId ? { _id: orderId, userId } : { _id: orderId };
    const updated = await Order.findOneAndUpdate(
      filter,
      { ...updates, updatedAt: now },
      { new: true }
    ).lean();

    if (!updated) return null;

    try {
      await syncOrderSnapshotsFromMongo();
    } catch (error) {
      console.warn(
        "⚠️ Order updated in MongoDB but snapshot sync failed:",
        error instanceof Error ? error.message : String(error)
      );
    }

    return normalizeOrder(updated);
  }

  const orders = await readOrderSnapshots();
  const index = orders.findIndex((order) => {
    const normalized = normalizeOrder(order);
    if (normalized._id !== orderId) return false;
    if (userId && normalized.userId !== userId) return false;
    return true;
  });

  if (index === -1) return null;

  const current = normalizeOrder(orders[index]);
  const updated = normalizeOrder({
    ...current,
    ...updates,
    _id: current._id,
    id: current.id,
    userId: current.userId,
    items: current.items,
    products: current.products,
    customer: current.customer,
    total: current.total,
    totalPrice: current.totalPrice,
    createdAt: current.createdAt,
    updatedAt: now,
  });

  orders[index] = updated;
  await setOrdersJson(orders);
  return updated;
}

/** Read ordersData array (detailed format for admin/analytics) */
export async function getOrdersDataJson(): Promise<any[]> {
  const orders = await getOrdersJson();
  return orders.map(toOrdersDataRecord);
}

/** Write orders array (append or replace) */
export async function setOrdersJson(orders: any[]): Promise<void> {
  const normalized = sortOrdersByDateDesc(orders.map(normalizeOrder));

  if (hasMongoStorage()) {
    await connectDB();
    if (normalized.length === 0) {
      await Order.deleteMany({});
      try {
        await writeOrderSnapshots([]);
      } catch (error) {
        console.warn(
          "⚠️ MongoDB orders cleared but snapshot sync failed:",
          error instanceof Error ? error.message : String(error)
        );
      }
      return;
    }

    await Order.deleteMany({ _id: { $nin: normalized.map((order) => order._id) } });
    await Order.bulkWrite(
      normalized.map((order) => ({
        replaceOne: {
          filter: { _id: order._id },
          replacement: order,
          upsert: true,
        },
      }))
    );
    try {
      await writeOrderSnapshots(normalized);
    } catch (error) {
      console.warn(
        "⚠️ MongoDB orders updated but snapshot sync failed:",
        error instanceof Error ? error.message : String(error)
      );
    }
    return;
  }
  await writeOrderSnapshots(normalized);
}

/** Write ordersData array */
export async function setOrdersDataJson(ordersData: any[]): Promise<void> {
  if (hasMongoStorage()) {
    await writeOrderSnapshots(
      ordersData.map((record: any) => ({
        id: record.id,
        _id: record.id,
        userId: record.userId,
        products: record.products,
        totalPrice: record.totalPrice ?? record.total,
        total: record.total ?? record.totalPrice,
        status: record.status,
        paymentStatus: record.paymentStatus,
        paymentProvider: record.paymentProvider,
        stripeSessionId: record.stripeSessionId,
        paidAt: record.paidAt,
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
        customer: record.customer ?? record.user,
      }))
    );
    return;
  }
  const orders = ordersData.map((record: any) => ({
    id: record.id,
    _id: record.id,
    userId: record.userId,
    products: record.products,
    totalPrice: record.totalPrice ?? record.total,
    total: record.total ?? record.totalPrice,
    status: record.status,
    paymentStatus: record.paymentStatus,
    paymentProvider: record.paymentProvider,
    stripeSessionId: record.stripeSessionId,
    paidAt: record.paidAt,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    customer: record.customer ?? record.user,
  }));
  await writeOrderSnapshots(orders);
}
