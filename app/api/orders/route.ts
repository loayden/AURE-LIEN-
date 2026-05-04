import productsData from "@/lib/productsData";
import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { attachUserCookie, getOrCreateUserId } from "@/lib/userSession";
import { getAuthFromRequest } from "@/lib/auth";
import { appendOrder, getOrdersJson, removeOrderById, setOrdersJson } from "@/lib/orderStorage";

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store, max-age=0",
};

async function resolveUserId(req: NextRequest): Promise<{ userId: string; isNew: boolean }> {
  const auth = await getAuthFromRequest(req);
  if (auth?.userId) return { userId: auth.userId, isNew: false };
  return getOrCreateUserId(req);
}

function enrichItems(items: any[]) {
  return items.map(item => {
    const product = productsData.find(p => String(p._id) === String(item.productId));
    return {
      productId: item.productId,
      quantity: item.quantity || 1,
      name: product?.name || "Unknown Product",
      price: product?.price ?? 0,
      image: product?.images?.[0] || "/images/placeholder.svg",
      size: item.size ?? null,
      color: item.color ?? null,
    };
  });
}

function findExistingPendingOrder(orders: any[], userId: string) {
  return orders.find(o => o.userId === userId && o.status === "pending");
}

/** Normalize order to the shape expected by the orders page (_id, userId, items, totalPrice, status, createdAt). */
function normalizeOrder(raw: any): any {
  if (raw._id != null && raw.items != null && raw.totalPrice != null) {
    return raw;
  }
  // saveorder shape: id, customer, products, total, status, createdAt
  const rawItems = raw.items || raw.products || [];
  const items = enrichItems(
    rawItems.map((p: any) => ({
      productId: p._id || p.productId,
      quantity: p.quantity ?? 1,
      size: p.size ?? null,
      color: p.color ?? null,
    }))
  );
  const totalPrice = raw.totalPrice ?? raw.total ?? 0;
  const userId = raw.userId ?? raw.customer?.email ?? "guest";
  return {
    _id: raw._id ?? raw.id ?? `legacy-${Date.now()}`,
    userId,
    items,
    totalPrice,
    status: raw.status ?? "pending",
    paymentStatus: raw.paymentStatus ?? (raw.status === "completed" ? "paid" : "pending"),
    paymentMethod: raw.paymentMethod ?? "",
    createdAt: raw.createdAt ?? new Date().toISOString(),
  };
}

export async function GET(req: NextRequest) {
  const orders = await getOrdersJson();
  const { userId, isNew } = await resolveUserId(req);
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("orderId");

  const normalizedOrders = orders.map(normalizeOrder);

  if (orderId) {
    const foundOrder = normalizedOrders.find(o => o._id === orderId && o.userId === userId);
    const res = NextResponse.json(
      { orders: foundOrder ? [foundOrder] : [] },
      { status: 200, headers: NO_STORE_HEADERS }
    );
    if (isNew) attachUserCookie(res, userId);
    return res;
  }

  const userOrders = normalizedOrders.filter(o => o.userId === userId);
  const res = NextResponse.json(
    { orders: userOrders },
    { status: 200, headers: NO_STORE_HEADERS }
  );
  if (isNew) attachUserCookie(res, userId);
  return res;
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("orderId");
  if (!orderId) {
    return NextResponse.json({ error: "orderId required" }, { status: 400 });
  }
  const { userId, isNew } = await resolveUserId(req);
  const removed = await removeOrderById(orderId, userId);
  if (!removed) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  const res = NextResponse.json({ success: true }, { status: 200 });
  if (isNew) attachUserCookie(res, userId);
  return res;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, isNew } = await resolveUserId(req);
    const { items, totalPrice, status } = body;

    if (
      !items ||
      !Array.isArray(items) ||
      items.length === 0 ||
      totalPrice === undefined
    ) {
      return NextResponse.json({ orders: [] }, { status: 400 });
    }

    const enrichedItems = enrichItems(items);
    const orders = await getOrdersJson();
    const existingOrder = findExistingPendingOrder(orders, userId);

    if (existingOrder) {
      existingOrder.items = existingOrder.items.concat(enrichedItems);
      const newItemsTotal = enrichedItems.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
      existingOrder.totalPrice = (existingOrder.totalPrice ?? 0) + newItemsTotal;
      await setOrdersJson(orders);
      const res = NextResponse.json({ orders: [existingOrder] }, { status: 200 });
      if (isNew) attachUserCookie(res, userId);
      return res;
    }

    const newOrder = {
      _id: randomUUID(),
      userId,
      items: enrichedItems,
      totalPrice,
      status: status || "pending",
      paymentStatus: body.paymentStatus || "pending",
      paymentMethod: body.paymentMethod || "",
      createdAt: new Date().toISOString(),
    };

    await appendOrder(newOrder);

    const res = NextResponse.json({ orders: [newOrder] }, { status: 201 });
    if (isNew) attachUserCookie(res, userId);
    return res;
  } catch (err) {
    console.error("POST /api/orders error:", err);
    return NextResponse.json({ orders: [] }, { status: 500 });
  }
}
