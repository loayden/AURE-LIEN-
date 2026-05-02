import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getAllProducts } from "@/lib/getAllProducts";
import { getAuthFromRequest } from "@/lib/auth";
import { getOrdersJson } from "@/lib/orderStorage";
import { attachUserCookie, getOrCreateUserId } from "@/lib/userSession";

function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

async function resolveUserId(req: NextRequest): Promise<{ userId: string; isNew: boolean }> {
  const auth = await getAuthFromRequest(req);
  if (auth?.userId) return { userId: auth.userId, isNew: false };
  return getOrCreateUserId(req);
}

function toAbsoluteImageUrl(image: string | undefined, origin: string): string | undefined {
  if (!image) return undefined;
  try {
    return new URL(image, origin).toString();
  } catch {
    return undefined;
  }
}

function createLineItem(input: {
  name: string;
  price: number;
  quantity: number;
  image?: string;
  origin: string;
}): Stripe.Checkout.SessionCreateParams.LineItem | null {
  const unitAmount = Math.round(Number(input.price ?? 0) * 100);
  const quantity = Number(input.quantity);

  if (!input.name || !Number.isFinite(unitAmount) || unitAmount <= 0) return null;
  if (!Number.isInteger(quantity) || quantity < 1) return null;

  const imageUrl = toAbsoluteImageUrl(input.image, input.origin);

  return {
    price_data: {
      currency: "egp",
      product_data: {
        name: input.name,
        images: imageUrl ? [imageUrl] : undefined,
      },
      unit_amount: unitAmount,
    },
    quantity,
  };
}

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }
  try {
    const { userId, isNew } = await resolveUserId(req);
    const { items, orderId, successUrl, cancelUrl } = await req.json();
    const origin = process.env.NEXT_PUBLIC_URL || req.nextUrl.origin;
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
    const checkoutOrderId = typeof orderId === "string" ? orderId.trim() : "";
    let customerEmail: string | undefined;
    let orderShippingCost = 0;

    if (checkoutOrderId) {
      const orders = await getOrdersJson();
      const order = orders.find((candidate) => {
        const id = String(candidate?._id ?? candidate?.id ?? "");
        return id === checkoutOrderId && String(candidate?.userId ?? "") === userId;
      });

      if (!order) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      if (order.status === "completed" || order.paymentStatus === "paid") {
        return NextResponse.json({ error: "Order is already paid" }, { status: 409 });
      }

      const orderItems = Array.isArray(order.items) && order.items.length > 0
        ? order.items
        : order.products;

      if (!Array.isArray(orderItems) || orderItems.length === 0) {
        return NextResponse.json({ error: "Order has no checkout items" }, { status: 400 });
      }

      for (const item of orderItems) {
        const lineItem = createLineItem({
          name: String(item?.name ?? "Product"),
          price: Number(item?.price ?? 0),
          quantity: Number(item?.quantity ?? 1),
          image: item?.image,
          origin,
        });

        if (!lineItem) {
          return NextResponse.json({ error: "Invalid order item" }, { status: 400 });
        }

        lineItems.push(lineItem);
      }

      orderShippingCost = Number(order?.customer?.shippingCost ?? 0);
      customerEmail = String(order?.customer?.email ?? "").trim() || undefined;
    } else {
      if (!Array.isArray(items) || items.length === 0) {
        return NextResponse.json({ error: "items required" }, { status: 400 });
      }

      const products = await getAllProducts();
      const productMap = new Map(products.map((product) => [String(product._id), product]));

      for (const item of items as Array<{ productId?: string; quantity?: number }>) {
        const productId = String(item?.productId ?? "").trim();
        const quantity = Number(item?.quantity);
        const product = productMap.get(productId);

        if (!product || !Number.isInteger(quantity) || quantity < 1) {
          return NextResponse.json({ error: "Invalid checkout item" }, { status: 400 });
        }

        const lineItem = createLineItem({
          name: product.name,
          price: Number(product.price ?? 0),
          quantity,
          image: product.images?.[0],
          origin,
        });

        if (!lineItem) {
          return NextResponse.json({ error: "Product is not available for checkout" }, { status: 400 });
        }

        lineItems.push(lineItem);
      }
    }

    if (orderShippingCost > 0) {
      lineItems.push({
        price_data: {
          currency: "egp",
          product_data: { name: "Shipping" },
          unit_amount: Math.round(orderShippingCost * 100),
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: successUrl || `${origin}/orders?success=1`,
      cancel_url: cancelUrl || `${origin}/cart`,
      customer_email: customerEmail,
      metadata: {
        orderId: checkoutOrderId,
        userId,
      },
    });

    const response = NextResponse.json({ url: session.url, sessionId: session.id });
    if (isNew) attachUserCookie(response, userId);
    return response;
  } catch (e) {
    console.error("Checkout error:", e);
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}
