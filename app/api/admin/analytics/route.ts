import { NextRequest, NextResponse } from "next/server";
import { getAuthFromRequest } from "@/lib/auth";
import { getOrdersJson } from "@/lib/orderStorage";
import productsData from "@/lib/productsData";

interface OrderRecord {
  id?: string;
  _id?: string;
  customer?: { email: string };
  items?: { productId?: string; _id?: string; quantity?: number }[];
  products?: { _id: string; quantity: number }[];
  total?: number;
  status?: string;
  createdAt?: string;
  userId?: string;
  totalPrice?: number;
}

export async function GET(req: NextRequest) {
  try {
    const auth = await getAuthFromRequest(req);
    if (!auth || auth.role !== "admin") {
      return NextResponse.json({ message: "Not authorized" }, { status: 403 });
    }

    const orders: OrderRecord[] = await getOrdersJson();

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    let totalRevenue = 0;
    let ordersToday = 0;
    const revenueByMonth: Record<string, number> = {};
    const productCount: Record<string, number> = {};
    const uniqueCustomers = new Set<string>();

    for (const o of orders) {
      const total = Number(o.totalPrice ?? o.total ?? 0);
      totalRevenue += total;

      const created = o.createdAt ? new Date(o.createdAt) : null;
      if (created && created >= todayStart) ordersToday++;

      if (created) {
        const key = `${created.getFullYear()}-${String(created.getMonth() + 1).padStart(2, "0")}`;
        revenueByMonth[key] = (revenueByMonth[key] || 0) + total;
      }

      const uid = o.userId || o.customer?.email || "guest";
      uniqueCustomers.add(uid);

      const lineItems =
        Array.isArray(o.items) && o.items.length > 0
          ? o.items.map((item) => ({
              id: item.productId || item._id || "",
              quantity: item.quantity || 1,
            }))
          : (o.products || []).map((item) => ({
              id: item._id || "",
              quantity: item.quantity || 1,
            }));

      for (const p of lineItems) {
        const id = p.id || "";
        if (id) productCount[id] = (productCount[id] || 0) + (p.quantity || 1);
      }
    }

    const topProducts = Object.entries(productCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([id, qty]) => {
        const p = productsData.find((x) => x._id === id);
        return { id, name: p?.name || "Unknown", quantity: qty };
      });

    const revenueChart = Object.entries(revenueByMonth)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-12)
      .map(([month, value]) => ({ month, revenue: value }));

    return NextResponse.json(
      {
        totalRevenue,
        ordersToday,
        totalOrders: orders.length,
        totalCustomers: uniqueCustomers.size,
        bestSellingProducts: topProducts,
        revenueByMonth: revenueChart,
      },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (e) {
    console.error("Analytics error:", e);
    return NextResponse.json(
      {
        totalRevenue: 0,
        ordersToday: 0,
        totalOrders: 0,
        totalCustomers: 0,
        bestSellingProducts: [],
        revenueByMonth: [],
      },
      { status: 200 }
    );
  }
}
