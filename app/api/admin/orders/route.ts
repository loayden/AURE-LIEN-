import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, requireAdminWrite } from "@/lib/adminRoles";
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

function resolveOrderUserId(order: any, customerSummary: any, customer: any) {
  const accountId = String(customerSummary?.accountId ?? "").trim();
  if (accountId) return accountId;

  const email = String(customerSummary?.email ?? customer?.email ?? "").trim();
  if (email) return email;

  const rawUserId = String(order?.userId ?? "").trim();
  return rawUserId || "guest";
}

export async function GET(req: NextRequest) {
  const gate = await requireAdmin(req);
  if ("response" in gate) {
    return NextResponse.json({ message: "Not authorized" }, { status: 403, headers: NO_STORE_HEADERS });
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
        userId: resolveOrderUserId(order, customerSummary, rawCustomer),
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

    const url = new URL(req.url);
    if (url.searchParams.has("page") || url.searchParams.has("limit")) {
      const { paginateArray, parsePaginationParams } = await import("@/lib/pagination");
      const { page, limit } = parsePaginationParams(url);
      const { data, pagination } = paginateArray(orders, page, limit);
      return NextResponse.json({ orders: data, pagination }, { headers: NO_STORE_HEADERS });
    }

    return NextResponse.json({ orders }, { headers: NO_STORE_HEADERS });
  } catch (error) {
    console.error("Admin orders API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500, headers: NO_STORE_HEADERS }
    );
  }
}

const ORDER_STATUSES = ["pending", "paid", "processing", "shipped", "delivered", "cancelled", "refunded"] as const;
const PAYMENT_STATUSES = ["pending", "unpaid", "paid", "refunded"] as const;

/** PATCH: update order status / payment status (admin; support allowed). Appends timeline + notifies customer. */
export async function PATCH(req: NextRequest) {
  const gate = await requireAdminWrite(req, "orders");
  if ("response" in gate) {
    return NextResponse.json({ message: "Not authorized" }, { status: 403, headers: NO_STORE_HEADERS });
  }
  const auth = gate.auth;
  try {
    const body = await req.json().catch(() => ({}));
    const orderId = String(body.orderId ?? "").trim();
    const status = body.status === undefined ? undefined : String(body.status);
    const paymentStatus = body.paymentStatus === undefined ? undefined : String(body.paymentStatus);
    const trackingNumber = body.trackingNumber === undefined ? undefined : String(body.trackingNumber).slice(0, 120);
    const note = String(body.note ?? "").slice(0, 500);
    if (!orderId) {
      return NextResponse.json({ error: "orderId required" }, { status: 400, headers: NO_STORE_HEADERS });
    }
    if (status !== undefined && !(ORDER_STATUSES as readonly string[]).includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400, headers: NO_STORE_HEADERS });
    }
    if (paymentStatus !== undefined && !(PAYMENT_STATUSES as readonly string[]).includes(paymentStatus)) {
      return NextResponse.json({ error: "Invalid paymentStatus" }, { status: 400, headers: NO_STORE_HEADERS });
    }

    const orders = await getOrdersJson();
    const index = orders.findIndex((o) => String(o._id ?? o.id) === orderId);
    if (index === -1) {
      return NextResponse.json({ error: "Order not found" }, { status: 404, headers: NO_STORE_HEADERS });
    }
    const before = { status: orders[index].status, paymentStatus: orders[index].paymentStatus };

    // Real Stripe refund when moving a card order to refunded (keys required).
    if (status === "refunded" && before.status !== "refunded" && orders[index].paymentMethod === "card") {
      const stripeSessionId = String(orders[index].stripeSessionId ?? "");
      if (stripeSessionId && process.env.STRIPE_SECRET_KEY?.trim()) {
        try {
          const { default: Stripe } = await import("stripe");
          const stripe = new Stripe(process.env.STRIPE_SECRET_KEY.trim());
          const session = await stripe.checkout.sessions.retrieve(stripeSessionId);
          const paymentIntent = typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id;
          if (!paymentIntent) throw new Error("No payment intent on session");
          await stripe.refunds.create({ payment_intent: paymentIntent });
        } catch (stripeError) {
          return NextResponse.json(
            { error: `Stripe refund failed: ${stripeError instanceof Error ? stripeError.message : "unknown error"}. Order not marked refunded.` },
            { status: 402, headers: NO_STORE_HEADERS }
          );
        }
      }
    }

    if (status !== undefined) orders[index].status = status;
    if (paymentStatus !== undefined) orders[index].paymentStatus = paymentStatus;
    if (trackingNumber !== undefined) orders[index].trackingNumber = trackingNumber;    const timeline = Array.isArray(orders[index].timeline) ? orders[index].timeline : [];
    timeline.push({
      status: status ?? before.status,
      at: new Date().toISOString(),
      note: note || `Updated by admin (${before.status}/${before.paymentStatus})`,
    });
    orders[index].timeline = timeline.slice(-50);

    const { setOrdersJson } = await import("@/lib/orderStorage");
    await setOrdersJson(orders);

    const { logAdminAction, getClientIpFromHeaders } = await import("@/lib/adminAudit");
    await logAdminAction({
      action: "admin.order.status",
      actorId: auth.userId,
      actorEmail: auth.email,
      targetType: "order",
      targetId: orderId,
      detail: { before, after: { status: orders[index].status, paymentStatus: orders[index].paymentStatus } },
      ip: getClientIpFromHeaders(req.headers),
    });

    // Customer notifications (fire-and-forget, never fail the request).
    try {
      const { sendEmailAsync } = await import("@/lib/email/sender");
      const customer = orders[index].customer ?? {};
      const email = String(customer.email ?? "").trim();
      const name =
        String(customer.name ?? "").trim() ||
        [customer.firstName, customer.lastName].filter(Boolean).join(" ") ||
        "BOUT customer";
      if (email && status !== undefined && status !== before.status) {
        if (status === "shipped") {
          const { getOrderShippedEmailHtml } = await import("@/lib/email/templates/shipping");
          sendEmailAsync({ to: email, subject: `BOUT order shipped · ${orderId}`, html: getOrderShippedEmailHtml({ orderId, customerName: name }) });
        } else if (status === "delivered") {
          const { getOrderDeliveredEmailHtml } = await import("@/lib/email/templates/shipping");
          sendEmailAsync({ to: email, subject: `BOUT order delivered · ${orderId}`, html: getOrderDeliveredEmailHtml({ orderId, customerName: name }) });
        } else if (status === "refunded") {
          const { getOrderRefundedEmailHtml } = await import("@/lib/email/templates/shipping");
          sendEmailAsync({
            to: email,
            subject: `BOUT refund issued · ${orderId}`,
            html: getOrderRefundedEmailHtml({ orderId, customerName: name, amount: Number(orders[index].totalPrice ?? orders[index].total ?? 0) }),
          });
        }
      }
    } catch {
      // ignore notification errors
    }

    return NextResponse.json({ success: true, order: orders[index] }, { headers: NO_STORE_HEADERS });
  } catch (error) {
    console.error("Admin order PATCH error:", error instanceof Error ? error.message : String(error));
    return NextResponse.json({ error: "Failed to update order" }, { status: 500, headers: NO_STORE_HEADERS });
  }
}
