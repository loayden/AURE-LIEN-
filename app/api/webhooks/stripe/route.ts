import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { clearCartByUser } from "@/lib/cartStorage";
import { getOrdersJson, setOrdersJson } from "@/lib/orderStorage";
import { notifyOrderPlaced } from "@/lib/notifications";

function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  return key ? new Stripe(key) : null;
}
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  if (!webhookSecret || !stripe) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }
  try {
    const body = await req.text();
    const sig = req.headers.get("stripe-signature");
    if (!sig) return NextResponse.json({ error: "No signature" }, { status: 400 });

    const event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.orderId;
      const userId = session.metadata?.userId || session.client_reference_id || "";

      if (orderId) {
        const orders = await getOrdersJson();
        const index = orders.findIndex((order: any) => String(order._id ?? order.id) === String(orderId));

        if (index !== -1) {
          const wasAlreadyPaid = orders[index]?.paymentStatus === "paid";
          orders[index] = {
            ...orders[index],
            status: "paid",
            paymentStatus: "paid",
            stripeSessionId: session.id,
            paidAt: new Date().toISOString(),
          };
          await setOrdersJson(orders);
          if (!wasAlreadyPaid) {
            // Best-effort atomic stock reservation (first paid transition only → no double-decrement on retries).
            try {
              const { tryDecrementStock } = await import("@/lib/inventory");
              const lineItems = Array.isArray(orders[index]?.items) ? orders[index].items : [];
              await tryDecrementStock(
                lineItems.map((item: { productId?: string; quantity?: number; name?: string }) => ({
                  productId: String(item.productId ?? ""),
                  quantity: Number(item.quantity ?? 1),
                  name: String(item.name ?? ""),
                }))
              );
            } catch (error) {
              console.warn("Stripe stock reservation skipped:", error instanceof Error ? error.message : String(error));
            }
            notifyOrderPlaced(orders[index]);
          }
        }
      }

      if (userId) {
        await clearCartByUser(userId);
      }
    }
    return NextResponse.json({ received: true });
  } catch (e) {
    console.error("Stripe webhook error:", e);
    return NextResponse.json({ error: "Webhook failed" }, { status: 400 });
  }
}
