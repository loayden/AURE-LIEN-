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
    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      console.error("❌ Failed to parse JSON in saveorder:", parseError);
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const { customer, products, total, status, createdAt } = body;

    const name = customer?.name ?? (customer?.firstName || customer?.lastName ? `${customer.firstName || ""} ${customer.lastName || ""}`.trim() : "");
    const address = customer?.address ?? [customer?.address, customer?.apartment, customer?.city, customer?.postalCode, customer?.country].filter(Boolean).join(", ");

    // Validation
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
      console.warn("❌ Invalid order data in saveorder:", { customer, products, total, status, createdAt });
      return NextResponse.json(
        { error: "Invalid order data - missing required fields" },
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

    // 1) Get or create userId
    const auth = await getAuthFromRequest(req);
    const { userId, isNew } = auth?.userId
      ? { userId: auth.userId, isNew: false }
      : getOrCreateUserId(req);

    // 2) Read existing orders
    let ordersJson: any[];
    try {
      ordersJson = await getOrdersJson();
    } catch (readOrdersError) {
      console.error("❌ Failed to read orders:", readOrdersError instanceof Error ? readOrdersError.message : String(readOrdersError));
      return NextResponse.json(
        { error: "Failed to read existing orders" },
        { status: 500 }
      );
    }

    const ordersJsonOrder: OrdersJsonOrder = {
      id: body.id || randomUUID(),
      customer: normalizedCustomer,
      products,
      total,
      status,
      createdAt,
      userId,
    };

    // 3) Save to orders
    try {
      ordersJson.push(ordersJsonOrder);
      await setOrdersJson(ordersJson);
      console.log("✅ Order saved to ordersJson:", ordersJsonOrder.id);
    } catch (saveOrdersError) {
      console.error("❌ Failed to save to ordersJson:", saveOrdersError instanceof Error ? saveOrdersError.message : String(saveOrdersError));
      return NextResponse.json(
        { error: "Failed to save order" },
        { status: 500 }
      );
    }

    // 4) Save to ordersData (detailed format)
    let ordersData: any[];
    try {
      ordersData = await getOrdersDataJson();
    } catch (readOrdersDataError) {
      console.error("❌ Failed to read ordersData:", readOrdersDataError instanceof Error ? readOrdersDataError.message : String(readOrdersDataError));
      return NextResponse.json(
        { error: "Failed to read order analytics data" },
        { status: 500 }
      );
    }

    try {
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
      console.log("✅ Order saved to ordersData:", ordersJsonOrder.id);
    } catch (saveOrdersDataError) {
      console.error("❌ Failed to save to ordersData:", saveOrdersDataError instanceof Error ? saveOrdersDataError.message : String(saveOrdersDataError));
      // Non-critical - log but don't fail
    }

    // 5) Send confirmation email (non-blocking)
    try {
      sendEmailAsync({
        to: customer.email,
        subject: `Order Confirmation #${ordersJsonOrder.id} — Maison Aurelia`,
        html: getOrderConfirmationEmailHtml({
          orderId: String(ordersJsonOrder.id),
          customerName: normalizedCustomer.name,
          customerEmail: customer.email,
          products: (products as OrderProduct[]).map((p) => {
            const found = productsData.find((x) => String(x._id) === String(p._id));
            return {
              name: found?.name || "Product",
              price: Number(found?.price ?? 0),
              quantity: Number(p.quantity ?? 1),
              size: p.size ?? null,
              color: p.color ?? null,
            };
          }),
          totalPrice: total,
          shippingAddress: normalizedCustomer.address,
        }),
      });
      console.log("✅ Confirmation email queued for:", customer.email);
    } catch (emailError) {
      console.error("⚠️ Failed to queue confirmation email:", emailError instanceof Error ? emailError.message : String(emailError));
      // Non-critical - don't fail the entire request
    }

    const res = NextResponse.json(
      { message: "Order saved", id: ordersJsonOrder.id },
      { status: 200 }
    );
    if (isNew) attachUserCookie(res, userId);
    return res;
  } catch (error) {
    console.error("❌ Unexpected error in saveorder:", error instanceof Error ? error.message : String(error), error instanceof Error ? error.stack : "");
    return NextResponse.json(
      { error: "Failed to save order - unexpected error" },
      { status: 500 }
    );
  }
}