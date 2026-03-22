import { NextRequest, NextResponse } from "next/server";
import { getAuthFromRequest } from "@/lib/auth";
import { getOrdersJson } from "@/lib/orderStorage";
import productsData from "@/lib/productsData";

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store, max-age=0",
};

function enrichItems(raw: any[]) {
  return (raw || []).map((p: any) => {
    const product = productsData.find((x) => String(x._id) === String(p._id || p.productId));
    return {
      productId: p._id || p.productId,
      quantity: p.quantity ?? 1,
      name: product?.name ?? "Unknown",
      price: product?.price ?? 0,
      image: product?.images?.[0] ?? "/images/placeholder.svg",
      size: p.size ?? null,
      color: p.color ?? null,
    };
  });
}

/** GET: return all orders for admin (everyone who placed an order, with or without account) */
export async function GET(req: NextRequest) {
  const auth = await getAuthFromRequest(req);
  if (!auth || auth.role !== "admin") {
    return NextResponse.json({ message: "Not authorized" }, { status: 403 });
  }

  try {
    const raw = await getOrdersJson(); // same store as saveorder (Blob when deployed) — every Place Order appears here

    const orders = raw.map((o) => {
      const items = o.items
        ? o.items.map((i: any) => ({
            productId: i.productId ?? i._id,
            quantity: i.quantity ?? 1,
            name: i.name ?? "Unknown",
            price: i.price ?? 0,
            image: i.image ?? "/images/placeholder.svg",
            size: i.size ?? null,
            color: i.color ?? null,
          }))
        : enrichItems(o.products || []);
      const totalPrice = o.totalPrice ?? o.total ?? 0;
      const customer = o.customer || {};
      return {
        _id: o._id ?? o.id ?? `legacy-${Date.now()}`,
        userId: o.userId ?? customer.email ?? "guest",
        items,
        totalPrice,
        status: o.status ?? "pending",
        createdAt: o.createdAt ?? new Date().toISOString(),
        customer: {
          email: customer.email ?? "",
          firstName: customer.firstName ?? "",
          lastName: customer.lastName ?? "",
          name: customer.name ?? "",
          phone: customer.phone ?? "",
          address: customer.address ?? "",
          apartment: customer.apartment ?? "",
          city: customer.city ?? "",
          postalCode: customer.postalCode ?? "",
          country: customer.country ?? "",
          newsletter: customer.newsletter ?? false,
          shippingMethod: customer.shippingMethod ?? "",
          shippingCost: customer.shippingCost ?? null,
        },
      };
    });

    return NextResponse.json({ orders }, { headers: NO_STORE_HEADERS });
  } catch (e) {
    console.error("Admin orders API error:", e);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
