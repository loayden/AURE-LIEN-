import { NextRequest, NextResponse } from "next/server";
import { getAuthFromRequest } from "@/lib/auth";
import { getOrdersJson } from "@/lib/orderStorage";
import { getUsersJson } from "@/lib/usersJson";
import { buildAddress, buildAdminCustomerIndex, getCustomerForOrder } from "@/lib/adminCustomers";
import productsData from "@/lib/productsData";

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store, max-age=0",
};

function enrichItems(raw: any[]) {
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

function resolveCustomerName(customer: any) {
  const explicitName = String(customer?.name ?? "").trim();
  if (explicitName) return explicitName;

  const combinedName = [customer?.firstName, customer?.lastName]
    .map((part) => String(part ?? "").trim())
    .filter(Boolean)
    .join(" ");
  return combinedName || "—";
}

export async function GET(req: NextRequest) {
  const auth = await getAuthFromRequest(req);
  if (!auth || auth.role !== "admin") {
    return NextResponse.json({ message: "Not authorized" }, { status: 403 });
  }

  try {
    const [rawOrders, users] = await Promise.all([getOrdersJson(), getUsersJson()]);
    const customerIndex = buildAdminCustomerIndex(users, rawOrders);

    const orders = rawOrders.map((order) => {
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
          : enrichItems(order.products || []);

      const totalPrice = Number(order.totalPrice ?? order.total ?? 0);
      const rawCustomer = order.customer || {};
      const customerSummary = getCustomerForOrder(customerIndex, order);

      return {
        _id: String(order._id ?? order.id ?? `legacy-${Date.now()}`),
        userId: String(order.userId ?? customerSummary?.accountId ?? rawCustomer.email ?? "guest"),
        items,
        totalPrice,
        status: order.status ?? "pending",
        createdAt: order.createdAt ?? new Date().toISOString(),
        customer: {
          accountId: customerSummary?.accountId ?? null,
          source: customerSummary?.source ?? "guest",
          totalOrders: customerSummary?.orders ?? 1,
          totalSpent: customerSummary?.totalSpent ?? totalPrice,
          joinedAt: customerSummary?.createdAt ?? order.createdAt ?? new Date().toISOString(),
          lastOrderAt: customerSummary?.lastOrderAt ?? order.createdAt ?? new Date().toISOString(),
          email: customerSummary?.email ?? rawCustomer.email ?? "",
          firstName: rawCustomer.firstName ?? "",
          lastName: rawCustomer.lastName ?? "",
          name: customerSummary?.name ?? resolveCustomerName(rawCustomer),
          phone: customerSummary?.phone ?? rawCustomer.phone ?? "",
          address:
            String(rawCustomer.address ?? "").trim() ||
            customerSummary?.address ||
            "",
          apartment: rawCustomer.apartment ?? "",
          fullAddress:
            buildAddress([
              String(rawCustomer.address ?? "").trim() || customerSummary?.address,
              rawCustomer.apartment ?? "",
            ]) || "",
          city: customerSummary?.city ?? rawCustomer.city ?? "",
          postalCode: customerSummary?.postalCode ?? rawCustomer.postalCode ?? "",
          country: customerSummary?.country ?? rawCustomer.country ?? "",
          newsletter: rawCustomer.newsletter ?? false,
          shippingMethod: rawCustomer.shippingMethod ?? "",
          shippingCost: rawCustomer.shippingCost ?? null,
        },
      };
    });

    return NextResponse.json({ orders }, { headers: NO_STORE_HEADERS });
  } catch (error) {
    console.error("Admin orders API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500, headers: NO_STORE_HEADERS }
    );
  }
}
