import { NextRequest, NextResponse } from "next/server";
import { attachUserCookie, getOrCreateUserId } from "@/lib/userSession";
import { getOrdersJson } from "@/lib/orderStorage";

interface Order {
  id: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  products: {
    _id: string;
    quantity: number;
  }[];
  total: number;
  status: string;
  createdAt: string;
}

async function readOrders(): Promise<Order[]> {
  return getOrdersJson();
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const orderId = url.searchParams.get("orderId");
    const { userId, isNew } = getOrCreateUserId(req);

    const orders = await readOrders();

    if (orderId) {
      const order = orders.find((o: any) => (o.id === orderId || o._id === orderId) && (o.userId ?? "guest") === userId);
      if (!order) {
        return NextResponse.json(
          { error: "Order not found" },
          { status: 404 }
        );
      }
      const res = NextResponse.json(order, { status: 200 });
      if (isNew) attachUserCookie(res, userId);
      return res;
    }

    const filtered = (orders as any[]).filter((o) => (o.userId ?? "guest") === userId);
    const res = NextResponse.json(filtered, { status: 200 });
    if (isNew) attachUserCookie(res, userId);
    return res;
  } catch {
    return NextResponse.json(
      { error: "Failed to load orders" },
      { status: 500 }
    );
  }
}