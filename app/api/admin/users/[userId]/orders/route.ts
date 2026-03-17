import { NextRequest, NextResponse } from "next/server";
import { getAuthFromRequest } from "@/lib/auth";
import { promises as fs } from "fs";
import { paths } from "@/lib/dataPaths";
import { getOrdersJson } from "@/lib/orderStorage";
import productsData from "@/lib/productsData";

function enrichOrderItems(raw: any[]) {
  return (raw || []).map((p: any) => {
    const product = productsData.find((x) => String(x._id) === String(p._id || p.productId));
    return {
      productId: p._id || p.productId,
      quantity: p.quantity ?? 1,
      name: product?.name ?? "Unknown",
      price: product?.price ?? 0,
      image: product?.images?.[0] ?? "/images/placeholder.svg",
    };
  });
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const auth = await getAuthFromRequest(req);
  if (!auth || auth.role !== "admin") {
    return NextResponse.json({ message: "Not authorized" }, { status: 403 });
  }
  const { userId } = await params;
  if (!userId) {
    return NextResponse.json({ error: "userId required" }, { status: 400 });
  }
  try {
    let user: { id: string; name: string; email: string } | null = null;
    try {
      const usersData = await fs.readFile(paths.users, "utf-8");
      const users: Array<{ id: string; name: string; email: string }> = JSON.parse(usersData);
      user = users.find((u) => u.id === userId) ?? null;
    } catch {
      // users.json missing — resolve from orders below
    }

    const raw: any[] = await getOrdersJson();

    const userOrders = raw.filter((o: any) => {
      if (o.userId === userId) return true;
      if (user && o.customer?.email && o.customer.email.toLowerCase() === user.email.toLowerCase()) return true;
      // Customer from orders only: id might be "order-email" or actual userId from order
      if (userId.startsWith("order-") && o.customer?.email) {
        const email = userId.slice(6).toLowerCase();
        return o.customer.email.toLowerCase() === email;
      }
      return false;
    });

    if (userOrders.length === 0 && !user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!user && userOrders.length > 0) {
      const first = userOrders[0];
      const c = first.customer;
      const name = (c?.name ?? [c?.firstName, c?.lastName].filter(Boolean).join(" ").trim()) || "—";
      user = {
        id: userId,
        name: name || (c?.email ?? ""),
        email: c?.email ?? "",
      };
    }

    const orders = userOrders.map((o) => {
      const items = o.items
        ? o.items
        : enrichOrderItems(o.products || []);
      const totalPrice = o.totalPrice ?? o.total ?? 0;
      return {
        _id: o._id ?? o.id ?? `legacy-${Date.now()}`,
        items,
        totalPrice,
        status: o.status ?? "pending",
        createdAt: o.createdAt ?? new Date().toISOString(),
      };
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email }, orders });
  } catch (e) {
    console.error("Admin user orders API error:", e);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
