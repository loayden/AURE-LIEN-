import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getProductById } from "@/lib/getAllProducts";
import { appendOrder } from "@/lib/orderStorage";
import { attachUserCookie, getOrCreateUserId } from "@/lib/userSession";
import { randomUUID } from "crypto";

function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }
  try {
    const { items, successUrl, cancelUrl, customerInfo } = await req.json();
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "items required" }, { status: 400 });
    }

    const { userId, isNew } = await getOrCreateUserId(req);
    const orderId = randomUUID();
    const resolvedItems = await Promise.all(
      items.map(async (item: { productId: string; quantity: number; size?: string | null; color?: string | null }) => {
        const quantity = Number(item.quantity);
        if (!item.productId || !Number.isInteger(quantity) || quantity <= 0) {
          throw new Error("Invalid checkout item");
        }
        const product = await getProductById(item.productId);
        if (!product) {
          throw new Error(`Product not found: ${item.productId}`);
        }
        if (typeof product.stock === "number" && product.stock <= 0) {
          throw new Error(`${product.name} is sold out`);
        }
        if (typeof product.stock === "number" && quantity > product.stock) {
          throw new Error(`Only ${product.stock} available for ${product.name}`);
        }
        return {
          product,
          quantity,
          size: item.size ?? null,
          color: item.color ?? null,
        };
      })
    );

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = resolvedItems.map(
      ({ product, quantity }) => ({
        price_data: {
            currency: "egp",
            product_data: {
              name: product.name,
              images: product.images?.length ? [new URL(product.images[0], process.env.NEXT_PUBLIC_URL || "http://localhost:3000").toString()] : undefined,
            },
            unit_amount: Math.round(product.price * 100),
        },
        quantity,
      })
    );

    const shippingCost = Number(customerInfo?.shippingCost ?? 0) || 0;
    const totalPrice = resolvedItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      shippingCost
    );

    const success = successUrl || `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/checkout/confirmation?paymentStatus=paid`;
    const successWithOrder = `${success}${success.includes("?") ? "&" : "?"}orderId=${encodeURIComponent(orderId)}`;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: successWithOrder,
      cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_URL}/cart`,
      client_reference_id: userId,
      metadata: {
        orderId,
        userId,
      },
    });

    await appendOrder({
      _id: orderId,
      userId,
      items: resolvedItems.map(({ product, quantity, size, color }) => ({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity,
        image: product.images?.[0] || "/images/placeholder.svg",
        size,
        color,
      })),
      totalPrice,
      status: "pending",
      paymentStatus: "unpaid",
      paymentMethod: "card",
      stripeSessionId: session.id,
      customer: {
        email: customerInfo?.email || "",
        firstName: customerInfo?.firstName || "",
        lastName: customerInfo?.lastName || "",
        name: customerInfo?.name || "",
        address: customerInfo?.address || "",
        apartment: customerInfo?.apartment || "",
        city: customerInfo?.city || "",
        postalCode: customerInfo?.postalCode || "",
        country: customerInfo?.country || "",
        phone: customerInfo?.phone || "",
        shippingMethod: customerInfo?.shippingMethod || "",
        shippingCost,
      },
      createdAt: new Date().toISOString(),
    });

    const response = NextResponse.json({ url: session.url, sessionId: session.id, orderId });
    if (isNew) attachUserCookie(response, userId);
    return response;
  } catch (e) {
    console.error("Checkout error:", e);
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}
