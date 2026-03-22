import { NextRequest, NextResponse } from "next/server";
import { getAuthFromRequest } from "@/lib/auth";
import { getOrdersJson } from "@/lib/orderStorage";
import { getUsersJson } from "@/lib/usersJson";

type OrderRow = {
  id?: string;
  _id?: string;
  userId?: string;
  customer?: { email?: string; firstName?: string; lastName?: string; name?: string };
  total?: number;
  totalPrice?: number;
  createdAt?: string;
};

export async function GET(req: NextRequest) {
  const auth = await getAuthFromRequest(req);
  if (!auth || auth.role !== "admin") {
    return NextResponse.json({ message: "Not authorized" }, { status: 403 });
  }
  try {
    const users = await getUsersJson();
    const orders = (await getOrdersJson()) as OrderRow[];

    // Build map: email (lowercase) -> { _id, name, email, createdAt, orders count, totalSpent }
    const byEmail = new Map<
      string,
      { _id: string; name: string; email: string; createdAt: string; orders: number; totalSpent: number }
    >();

    for (const u of users) {
      const key = u.email.toLowerCase().trim();
      if (!key) continue;
      const userOrders = orders.filter(
        (o) =>
          o.userId === u.id ||
          (o.customer?.email && o.customer.email.toLowerCase().trim() === key)
      );
      const totalSpent = userOrders.reduce(
        (sum, o) => sum + (Number(o.totalPrice ?? o.total) || 0),
        0
      );
      byEmail.set(key, {
        _id: u.id,
        name: u.name,
        email: u.email,
        createdAt: u.createdAt,
        orders: userOrders.length,
        totalSpent,
      });
    }

    // Add everyone who placed an order (with or without account) so all data appears in Admin Users
    for (const o of orders) {
      const email = o.customer?.email?.toLowerCase().trim();
      if (!email) continue;
      const orderTotal = Number(o.totalPrice ?? o.total) || 0;
      const existing = byEmail.get(email);
      if (existing) {
        if (existing._id.startsWith("order-")) {
          existing.orders += 1;
          existing.totalSpent += orderTotal;
        }
        continue;
      }
      const rawName =
        o.customer?.name ||
        [o.customer?.firstName, o.customer?.lastName].filter(Boolean).join(" ").trim();
      const name = rawName && rawName !== "—" ? rawName : `Guest (${o.customer?.email ?? email})`;
      const createdAt = o.createdAt ?? new Date().toISOString();
      byEmail.set(email, {
        _id: `order-${email}`,
        name,
        email: o.customer?.email ?? email,
        createdAt,
        orders: 1,
        totalSpent: orderTotal,
      });
    }

    let result = Array.from(byEmail.values());

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.toLowerCase().trim();
    const sort = searchParams.get("sort") || "newest";

    if (search) {
      result = result.filter(
        (u) =>
          u.email.toLowerCase().includes(search) ||
          u.name.toLowerCase().includes(search)
      );
    }

    if (sort === "newest") {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sort === "orders") {
      result.sort((a, b) => b.orders - a.orders);
    } else if (sort === "spent") {
      result.sort((a, b) => b.totalSpent - a.totalSpent);
    }

    return NextResponse.json(result);
  } catch (e) {
    console.error("Admin users API error:", e);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
