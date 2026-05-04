import { NextRequest, NextResponse } from "next/server";
import { getAuthFromRequest } from "@/lib/auth";
import { getOrdersJson } from "@/lib/orderStorage";
import { getUsersJson } from "@/lib/usersJson";
import { buildAdminCustomerIndex } from "@/lib/adminCustomers";
import { getAllProducts } from "@/lib/getAllProducts";

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
  paymentStatus?: string;
  paymentMethod?: string;
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

    const [orders, users, products] = await Promise.all([
      getOrdersJson() as Promise<OrderRecord[]>,
      getUsersJson(),
      getAllProducts(),
    ]);

    const customerIndex = buildAdminCustomerIndex(users, orders);

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    let totalRevenue = 0;
    let ordersToday = 0;
    const revenueByMonth: Record<string, number> = {};
    const productCount: Record<string, number> = {};
    let pendingPayments = 0;

    for (const order of orders) {
      const total = Number(order.totalPrice ?? order.total ?? 0);
      totalRevenue += total;

      const paymentStatus = String(order.paymentStatus ?? "").toLowerCase();
      const status = String(order.status ?? "").toLowerCase();
      if (paymentStatus === "pending" || paymentStatus === "unpaid" || status === "pending") {
        pendingPayments += 1;
      }

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
        const product = products.find((item) => item._id === id);
        return { id, name: product?.name || "Unknown", quantity };
      });

    const lowStockProducts = products
      .filter((product) => typeof product.stock === "number" && product.stock > 0 && product.stock <= 5)
      .slice(0, 8)
      .map((product) => ({
        id: product._id,
        name: product.name,
        stock: product.stock,
        category: product.category,
      }));

    const recentOrders = orders
      .slice()
      .sort((a, b) => {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bTime - aTime;
      })
      .slice(0, 6)
      .map((order) => ({
        id: order._id ?? order.id ?? "",
        total: Number(order.totalPrice ?? order.total ?? 0),
        status: order.status ?? "pending",
        paymentStatus: order.paymentStatus ?? "pending",
        paymentMethod: order.paymentMethod ?? "",
        createdAt: order.createdAt ?? "",
        email: order.customer?.email ?? order.userId ?? "guest",
      }));

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
        pendingPayments,
        lowStockProducts,
        recentOrders,
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
        pendingPayments: 0,
        lowStockProducts: [],
        recentOrders: [],
        bestSellingProducts: [],
        revenueByMonth: [],
        recentCustomers: [],
      },
      { status: 200, headers: NO_STORE_HEADERS }
    );
  }
}
