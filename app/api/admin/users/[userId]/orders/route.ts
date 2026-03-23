import { NextRequest, NextResponse } from "next/server";
import { getAuthFromRequest } from "@/lib/auth";
import { getOrdersJson } from "@/lib/orderStorage";
import { getUsersJson } from "@/lib/usersJson";
import { buildAdminCustomerIndex, getCustomerForOrder } from "@/lib/adminCustomers";
import productsData from "@/lib/productsData";

function enrichOrderItems(raw: any[]) {
  return (raw || []).map((item: any) => {
    const product = productsData.find((productRow) => {
      return String(productRow._id) === String(item._id || item.productId);
    });

    return {
      productId: item._id || item.productId,
      quantity: item.quantity ?? 1,
      name: item.name ?? product?.name ?? "Unknown",
      price: item.price ?? product?.price ?? 0,
      image: item.image ?? product?.images?.[0] ?? "/images/placeholder.svg",
      size: item.size ?? null,
      color: item.color ?? null,
    };
  });
}

function getEmailFromGuestUserId(userId: string): string {
  if (!userId.startsWith("order-")) return "";
  return userId.slice("order-".length).trim().toLowerCase();
}

function getOrderIdFromGuestUserId(userId: string): string {
  if (!userId.startsWith("guest-")) return "";
  return userId.slice("guest-".length).trim();
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
    const [users, rawOrders] = await Promise.all([getUsersJson(), getOrdersJson()]);
    const customerIndex = buildAdminCustomerIndex(users, rawOrders);

    const guestEmail = getEmailFromGuestUserId(userId);
    const guestOrderId = getOrderIdFromGuestUserId(userId);

    const user =
      customerIndex.byAccountId.get(userId) ??
      (guestEmail ? customerIndex.byEmail.get(guestEmail) : null) ??
      (guestOrderId ? customerIndex.byOrderId.get(guestOrderId) : null) ??
      null;

    const orders = rawOrders
      .filter((order) => {
        const customer = getCustomerForOrder(customerIndex, order);
        if (!customer) return false;
        return customer._id === userId || customer.accountId === userId;
      })
      .map((order) => {
        const items =
          Array.isArray(order.items) && order.items.length > 0
            ? order.items.map((item: any) => ({
                productId: item.productId ?? item._id,
                quantity: item.quantity ?? 1,
                name: item.name ?? "Unknown",
                price: item.price ?? 0,
                image: item.image ?? "/images/placeholder.svg",
                size: item.size ?? null,
                color: item.color ?? null,
              }))
            : enrichOrderItems(order.products || []);

        return {
          _id: String(order._id ?? order.id ?? `legacy-${Date.now()}`),
          items,
          totalPrice: Number(order.totalPrice ?? order.total ?? 0),
          status: order.status ?? "pending",
          createdAt: order.createdAt ?? new Date().toISOString(),
        };
      });

    if (!user && orders.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      user: user
        ? {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            address: user.address,
            city: user.city,
            postalCode: user.postalCode,
            country: user.country,
            orders: user.orders,
            totalSpent: user.totalSpent,
            source: user.source,
            createdAt: user.createdAt,
            lastOrderAt: user.lastOrderAt,
          }
        : null,
      orders,
    });
  } catch (error) {
    console.error("Admin user orders API error:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
