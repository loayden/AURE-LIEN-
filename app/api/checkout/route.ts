import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import productsData from "@/lib/productsData";

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
    const { items, successUrl, cancelUrl } = await req.json();
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "items required" }, { status: 400 });
    }

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map(
      (item: { productId: string; quantity: number }) => {
        const product = productsData.find((p) => p._id === item.productId);
        return {
          price_data: {
            currency: "egp",
            product_data: {
              name: product?.name || "Product",
              images: product?.images?.length ? [new URL(product.images[0], process.env.NEXT_PUBLIC_URL || "http://localhost:3000").toString()] : undefined,
            },
            unit_amount: Math.round((product?.price ?? 0) * 100),
          },
          quantity: item.quantity || 1,
        };
      }
    );

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: successUrl || `${process.env.NEXT_PUBLIC_URL}/orders?success=1`,
      cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_URL}/cart`,
    });

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (e) {
    console.error("Checkout error:", e);
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}
