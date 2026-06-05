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
import {
  hasVercelBlobStorage,
  readBlobTextWithLegacyPublicFallback,
  writeBlobText,
} from "@/lib/blobStorage";

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
  return hasVercelBlobStorage();
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
  const customerDataCleared = Boolean(order?.customerDataCleared || customer?.dataCleared);
  const orderId = String(order?._id ?? order?.id ?? `order-${Date.now()}`);
  const createdAt = order?.createdAt
    ? new Date(order.createdAt).toISOString()
    : new Date().toISOString();

  return {
    _id: orderId,
    id: String(order?.id ?? orderId),
    userId: customerDataCleared
      ? "customer-data-cleared"
      : String(order?.userId ?? customer.email ?? "guest"),
    customerDataCleared,
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
    paymentStatus: order?.paymentStatus ?? (order?.status === "completed" ? "paid" : "pending"),
    paymentMethod: order?.paymentMethod ?? "",
    createdAt,
    customer: {
      dataCleared: customerDataCleared,
      email: customerDataCleared ? "" : customer.email ?? "",
      firstName: customerDataCleared ? "" : customer.firstName ?? "",
      lastName: customerDataCleared ? "" : customer.lastName ?? "",
      name: customerDataCleared
        ? ""
        : customer.name ?? [customer.firstName, customer.lastName].filter(Boolean).join(" ").trim(),
      phone: customerDataCleared ? "" : customer.phone ?? "",
      address: customerDataCleared ? "" : customer.address ?? "",
      apartment: customerDataCleared ? "" : customer.apartment ?? "",
      city: customerDataCleared ? "" : customer.city ?? "",
      postalCode: customerDataCleared ? "" : customer.postalCode ?? customer.zipCode ?? "",
      country: customerDataCleared ? "" : customer.country ?? "",
      newsletter: customerDataCleared ? false : Boolean(customer.newsletter),
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
    paymentStatus: normalized.paymentStatus,
    paymentMethod: normalized.paymentMethod,
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
      dataCleared: normalized.customerDataCleared,
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
    customerDataCleared: normalized.customerDataCleared,
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

async function readOrderSnapshots(): Promise<any[]> {
  if (useCloudStorage()) {
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

  if (useCloudStorage()) {
    await Promise.all([
      writeBlobText(BLOB_ORDERS_PATH, JSON.stringify(normalized, null, 2), {
        access: "private",
        contentType: "application/json",
      }),
      writeBlobText(BLOB_ORDERS_DATA_PATH, JSON.stringify(ordersData, null, 2), {
        access: "private",
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
  return readBlobTextWithLegacyPublicFallback(pathname, { access: "private" });
}

/** Read orders array (used by /api/orders and /api/saveorder) */
export async function getOrdersJson(): Promise<any[]> {
  const snapshotOrders = await readOrderSnapshots();

  if (useMongoStorage()) {
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

  if (useMongoStorage()) {
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

  if (!useCloudStorage() && isRedisStorageAvailable()) {
    await appendRedisOrder(normalized);
    return normalized;
  }

  const orders = await readOrderSnapshots();
  orders.push(normalized);
  await setOrdersJson(orders);
  return normalized;
}

function anonymizeOrderCustomerData(order: any): any {
  const normalized = normalizeOrder(order);

  return normalizeOrder({
    ...normalized,
    userId: "customer-data-cleared",
    customerDataCleared: true,
    customer: {
      ...normalized.customer,
      dataCleared: true,
      email: "",
      firstName: "",
      lastName: "",
      name: "",
      phone: "",
      address: "",
      apartment: "",
      city: "",
      postalCode: "",
      country: "",
      newsletter: false,
    },
  });
}

export async function clearOrderCustomerData(): Promise<{ updatedOrders: number; totalOrders: number }> {
  const orders = await getOrdersJson();
  const updatedOrders = orders.filter(
    (order) => !Boolean(order?.customerDataCleared || order?.customer?.dataCleared)
  ).length;

  await setOrdersJson(orders.map(anonymizeOrderCustomerData));
  return { updatedOrders, totalOrders: orders.length };
}

export async function removeOrderById(orderId: string, userId?: string): Promise<boolean> {
  if (useMongoStorage()) {
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

  if (!useCloudStorage() && isRedisStorageAvailable()) {
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

/** Read ordersData array (detailed format for admin/analytics) */
export async function getOrdersDataJson(): Promise<any[]> {
  const orders = await getOrdersJson();
  return orders.map(toOrdersDataRecord);
}

/** Write orders array (append or replace) */
export async function setOrdersJson(orders: any[]): Promise<void> {
  const normalized = sortOrdersByDateDesc(orders.map(normalizeOrder));

  if (useMongoStorage()) {
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
  if (useMongoStorage()) {
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
        paymentMethod: record.paymentMethod,
        createdAt: record.createdAt,
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
    paymentMethod: record.paymentMethod,
    createdAt: record.createdAt,
    customer: record.customer ?? record.user,
  }));
  await writeOrderSnapshots(orders);
}
