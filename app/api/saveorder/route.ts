import { NextRequest, NextResponse } from "next/server";
import productsData from "@/lib/productsData";
import { randomUUID } from "crypto";
import { attachUserCookie, getOrCreateUserId } from "@/lib/userSession";
import { getAuthFromRequest } from "@/lib/auth";
import { sendEmailAsync } from "@/lib/email/sender";
import { getOrderConfirmationEmailHtml } from "@/lib/email/templates/order-confirmation";
import { getOrdersJson, getOrdersDataJson, setOrdersJson, setOrdersDataJson } from "@/lib/orderStorage";

interface FormData {
  name?: string;
  email: string;
  phone: string;
  address?: string;
  firstName?: string;
  lastName?: string;
  country?: string;
  apartment?: string;
  city?: string;
  postalCode?: string;
  newsletter?: boolean;
  shippingMethod?: string;
  shippingCost?: number;
}

interface OrderProduct {
  _id: string;
  quantity: number;
  size?: string | null;
  color?: string | null;
}

interface OrdersJsonOrder {
  id?: string;
  customer: FormData;
  products: OrderProduct[];
  total: number;
  status: string;
  createdAt: string;
  userId?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { customer, products, total, status, createdAt } = body;

    const name = customer?.name ?? (customer?.firstName || customer?.lastName ? `${customer.firstName || ""} ${customer.lastName || ""}`.trim() : "");
    const address = customer?.address ?? [customer?.address, customer?.apartment, customer?.city, customer?.postalCode, customer?.country].filter(Boolean).join(", ");

    if (
      !customer ||
      !customer.email ||
      !customer.phone ||
      !Array.isArray(products) ||
      products.length === 0 ||
      typeof total !== "number" ||
      !status ||
      !createdAt
    ) {
      return NextResponse.json(
        { error: "Invalid order data" },
        { status: 400 }
      );
    }

    if (!name && (!customer.firstName || !customer.lastName)) {
      return NextResponse.json(
        { error: "First name and last name are required" },
        { status: 400 }
      );
    }

    if (!address && (!customer.address || !customer.city)) {
      return NextResponse.json(
        { error: "Address and city are required" },
        { status: 400 }
      );
    }

    const normalizedCustomer = {
      email: customer.email,
      firstName: customer.firstName ?? "",
      lastName: customer.lastName ?? "",
      name: name || `${customer.firstName || ""} ${customer.lastName || ""}`.trim(),
      phone: customer.phone,
      address: address || `${customer.address || ""}, ${customer.city || ""}${customer.postalCode ? " " + customer.postalCode : ""}, ${customer.country || ""}`.trim(),
      apartment: customer.apartment ?? "",
      city: customer.city ?? "",
      postalCode: customer.postalCode ?? "",
      country: customer.country ?? "",
      newsletter: Boolean(customer.newsletter),
      shippingMethod: customer.shippingMethod ?? "",
      shippingCost: customer.shippingCost ?? null,
    };

    // 1) Save to orders (local files or Vercel Blob when deployed) — same store used by Admin Orders so all data appears there (with or without account)
    const ordersJson: any[] = await getOrdersJson();
    const auth = await getAuthFromRequest(req);
    const { userId, isNew } = auth?.userId
      ? { userId: auth.userId, isNew: false }
      : getOrCreateUserId(req);
    const ordersJsonOrder: OrdersJsonOrder = {
      id: body.id || randomUUID(),
      customer: normalizedCustomer,
      products,
      total,
      status,
      createdAt,
      userId,
    };
    ordersJson.push(ordersJsonOrder);
    await setOrdersJson(ordersJson);

    // 2) Save to ordersData (detailed format for admin/analytics)
    const ordersData: any[] = await getOrdersDataJson();
    const productsDetailed = (products as OrderProduct[]).map((p) => {
      const found = productsData.find((x) => String(x._id) === String(p._id));
      return {
        name: found?.name || "Product",
        price: Number(found?.price ?? 0),
        quantity: Number(p.quantity ?? 1),
        size: p.size ?? null,
        color: p.color ?? null,
      };
    });
    const ordersDataOrder = {
      id: ordersJsonOrder.id,
      status: status || "Completed",
      products: productsDetailed,
      totalPrice: total,
      user: normalizedCustomer,
      userId: ordersJsonOrder.userId,
      createdAt,
    };
    ordersData.push(ordersDataOrder);
    await setOrdersDataJson(ordersData);

    // Send order confirmation email asynchronously (non-blocking)
    sendEmailAsync({
      to: customer.email,
      subject: `Order Confirmation #${ordersJsonOrder.id} — Maison Aurelia`,
      html: getOrderConfirmationEmailHtml({
        orderId: String(ordersJsonOrder.id),
        customerName: normalizedCustomer.name,
        customerEmail: customer.email,
        products: productsDetailed,
        totalPrice: total,
        shippingAddress: normalizedCustomer.address,
      }),
    });

    const res = NextResponse.json({ message: "Order saved", id: ordersJsonOrder.id }, { status: 200 });
    if (isNew) attachUserCookie(res, userId);
    return res;
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to save order" },
      { status: 500 }
    );
  }
}