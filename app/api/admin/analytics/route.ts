import { NextRequest, NextResponse } from "next/server";
import { getAuthFromRequest } from "@/lib/auth";
import { getOrdersJson } from "@/lib/orderStorage";
import { getUsersJson } from "@/lib/usersJson";
import { buildAdminCustomerIndex } from "@/lib/adminCustomers";
import productsData from "@/lib/productsData";

interface OrderRecord {
  id?: string;
  _id?: string;
  customer?: { email?: string };
  items?: { productId?: string; _id?: string; quantity?: number }[];
  products?: { _id: string; quantity: number }[];
  total?: number;
  status?: string;
  createdAt?: string;
  userId?: string;
  totalPrice?: number;
}

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store, max-age=0",
};

export async function GET(req: NextRequest) {
  try {
    const auth = await getAuthFromRequest(req);
    if (!auth || auth.role !== "admin") {
      return NextResponse.json({ message: "Not authorized" }, { status: 403 });
    }

    const [orders, users] = await Promise.all([
      getOrdersJson() as Promise<OrderRecord[]>,
      getUsersJson(),
    ]);

    const customerIndex = buildAdminCustomerIndex(users, orders);

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    let totalRevenue = 0;
    let ordersToday = 0;
    const revenueByMonth: Record<string, number> = {};
    const productCount: Record<string, number> = {};

    for (const order of orders) {
      const total = Number(order.totalPrice ?? order.total ?? 0);
      totalRevenue += total;

      const created = order.createdAt ? new Date(order.createdAt) : null;
      if (created && created >= todayStart) {
        ordersToday += 1;
      }

      if (created) {
        const key = `${created.getFullYear()}-${String(created.getMonth() + 1).padStart(2, "0")}`;
        revenueByMonth[key] = (revenueByMonth[key] || 0) + total;
      }

      const lineItems =
        Array.isArray(order.items) && order.items.length > 0
          ? order.items.map((item) => ({
              id: item.productId || item._id || "",
              quantity: item.quantity || 1,
            }))
          : (order.products || []).map((item) => ({
              id: item._id || "",
              quantity: item.quantity || 1,
            }));

      for (const product of lineItems) {
        const id = product.id || "";
        if (id) {
          productCount[id] = (productCount[id] || 0) + (product.quantity || 1);
        }
      }
    }

    const topProducts = Object.entries(productCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([id, quantity]) => {
        const product = productsData.find((item) => item._id === id);
        return { id, name: product?.name || "Unknown", quantity };
      });

    const revenueChart = Object.entries(revenueByMonth)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-12)
      .map(([month, revenue]) => ({ month, revenue }));

    const recentCustomers = customerIndex.customers
      .slice(0, 5)
      .map((customer) => ({
        _id: customer._id,
        name: customer.name,
        email: customer.email,
        orders: customer.orders,
        totalSpent: customer.totalSpent,
        lastOrderAt: customer.lastOrderAt || customer.createdAt,
        source: customer.source,
      }));

    return NextResponse.json(
      {
        totalRevenue,
        ordersToday,
        totalOrders: orders.length,
        totalCustomers: customerIndex.customers.length,
        bestSellingProducts: topProducts,
        revenueByMonth: revenueChart,
        recentCustomers,
      },
      { headers: NO_STORE_HEADERS }
    );
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json(
      {
        totalRevenue: 0,
        ordersToday: 0,
        totalOrders: 0,
        totalCustomers: 0,
        bestSellingProducts: [],
        revenueByMonth: [],
        recentCustomers: [],
      },
      { status: 200, headers: NO_STORE_HEADERS }
    );
  }
}
