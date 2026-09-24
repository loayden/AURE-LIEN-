import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getProductById } from "@/lib/getAllProducts";
import { appendOrder } from "@/lib/orderStorage";
import { attachUserCookie, getOrCreateUserId } from "@/lib/userSession";
import { getPublicBaseUrl } from "@/lib/baseUrl";
import { RATE_LIMITS, rateLimitResponse } from "@/lib/rateLimit";
import { isOriginAllowed } from "@/lib/csrf";
import { randomUUID } from "crypto";

function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

function appendQueryParam(url: string, key: string, value: string) {
  return `${url}${url.includes("?") ? "&" : "?"}${key}=${encodeURIComponent(value)}`;
}

export async function POST(req: NextRequest) {
  const limited = await rateLimitResponse(req, RATE_LIMITS.checkout);
  if (limited) return limited;
  if (!isOriginAllowed(req)) {
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  }
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }
  try {
    const { items, successUrl, cancelUrl, customerInfo, idempotencyKey } = await req.json();
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
      ({ product, quantity }) => {
        const baseUrl = getPublicBaseUrl(req) || req.nextUrl.origin || (process.env.NODE_ENV === "production" ? "" : "http://localhost:3000");
        let imageUrl: string | undefined;
        try {
          if (product.images?.length) {
            imageUrl = product.images[0].startsWith("http")
              ? product.images[0]
              : new URL(product.images[0], baseUrl).toString();
          }
        } catch {
          imageUrl = undefined;
        }
        return {
          price_data: {
            currency: "egp",
            product_data: {
              name: product.name,
              images: imageUrl ? [imageUrl] : undefined,
            },
            unit_amount: Math.round(product.price * 100),
          },
          quantity,
        };
      }
    );

    const shippingCost = Number(customerInfo?.shippingCost ?? 0) || 0;
    const totalPrice = resolvedItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      shippingCost
    );

    const baseUrl = getPublicBaseUrl(req) || req.nextUrl.origin || (process.env.NODE_ENV === "production" ? "" : "http://localhost:3000");
    const success = successUrl || `${baseUrl}/checkout/confirmation?paymentStatus=paid`;
    const successWithOrder = `${success}${success.includes("?") ? "&" : "?"}orderId=${encodeURIComponent(orderId)}`;
    const cancel = cancelUrl || `${baseUrl}/checkout?canceled=1`;
    const cancelWithOrder = appendQueryParam(cancel, "orderId", orderId);

    const stripeIdempotencyKey =
      (typeof idempotencyKey === "string" && idempotencyKey.trim()) ||
      req.headers.get("Idempotency-Key")?.trim() ||
      orderId;

    const session = await stripe.checkout.sessions.create(
      {
        mode: "payment",
        line_items: lineItems,
        success_url: successWithOrder,
        cancel_url: cancelWithOrder,
        client_reference_id: userId,
        metadata: {
          orderId,
          userId,
        },
      },
      { idempotencyKey: `checkout-${userId}-${stripeIdempotencyKey}`.slice(0, 255) }
    );

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
