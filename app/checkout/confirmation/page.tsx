"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Clock3, CreditCard, Hash, PackageCheck, RotateCcw, Truck } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

type ConfirmItem = { productId?: string; name?: string; price?: number; quantity?: number; image?: string; size?: string | null; color?: string | null };
type ConfirmOrder = {
  _id: string;
  status?: string;
  paymentStatus?: string;
  totalPrice?: number;
  total?: number;
  createdAt?: string;
  items?: ConfirmItem[];
  customer?: { city?: string; shippingMethod?: string };
};

function titleCase(value?: string) {
  if (!value) return "Pending";
  return value.replace(/[-_]/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

function ConfirmationContent() {
  const searchParams = useSearchParams();  const orderId = searchParams.get("orderId") || "";
  const paymentStatus = searchParams.get("paymentStatus") || (searchParams.get("session_id") ? "paid" : "pending");
  const paid = paymentStatus === "paid";
  const [order, setOrder] = useState<ConfirmOrder | null>(null);
  const [reordering, setReordering] = useState(false);
  const [reorderMessage, setReorderMessage] = useState("");

  useEffect(() => {
    if (!orderId) return;
    fetch(`/api/orders?orderId=${encodeURIComponent(orderId)}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        const found = Array.isArray(d.orders) ? d.orders[0] : null;
        if (found) setOrder(found);
      })
      .catch(() => undefined);
  }, [orderId]);

  async function reorder() {
    if (!order || reordering) return;
    setReordering(true);
    setReorderMessage("");
    try {
      const items = (order.items ?? []).filter((i) => i.productId);
      for (const item of items) {
        const res = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: item.productId, quantity: Number(item.quantity ?? 1), size: item.size ?? null, color: item.color ?? null }),
        });
        if (!res.ok) throw new Error("Some items are no longer available");
      }
      window.dispatchEvent(new Event("cart:changed"));
      window.location.href = "/cart";
    } catch (e) {
      setReorderMessage(e instanceof Error ? e.message : "Could not reorder");
    } finally {
      setReordering(false);
    }
  }

  return (
    <main className="liquid-page flex min-h-screen items-center px-4 py-24 sm:px-6 md:px-10">
      <motion.section
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="page-wrap max-w-3xl"
      >
        <div className="glass-panel p-6 text-center sm:p-9">
          <div
            className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl"
            style={{
              background: paid ? "rgba(80,200,120,0.1)" : "rgba(168,121,53,0.12)",
              border: paid ? "1px solid rgba(80,200,120,0.22)" : "1px solid rgba(168,121,53,0.28)",
            }}
          >
            {paid ? (
              <CheckCircle2 className="h-8 w-8 text-[rgba(110,220,145,0.86)]" strokeWidth={1.25} />
            ) : (
              <Clock3 className="h-8 w-8 text-[#A87935]" strokeWidth={1.25} />
            )}
          </div>

          <p className="eyebrow mb-4">Order Confirmation</p>
          <h1 className="title-display text-[clamp(2.4rem,7vw,4.8rem)]">
            Order <em className="gold-italic">{paid ? "paid" : "received"}</em>
          </h1>
          <p className="body-copy mx-auto mt-5 max-w-xl text-center">
            {paid
              ? "Your card payment was completed. Keep the confirmation details below for support."
              : "Your order was created and is waiting for payment on delivery or manual confirmation."}
          </p>

          <div className="mx-auto mt-7 grid max-w-xl gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-left">
              <Hash className="mb-3 h-4 w-4 text-[#A87935]" strokeWidth={1.35} />
              <p className="eyebrow mb-2">Order Number</p>
              <p className="break-all text-sm tracking-[0.08em] text-white/72">
                {orderId || "Stripe session order"}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-left">
              <CreditCard className="mb-3 h-4 w-4 text-[#A87935]" strokeWidth={1.35} />
              <p className="eyebrow mb-2">Payment Status</p>
              <p className="text-sm uppercase tracking-[0.16em] text-white/72">
                {order ? (order.paymentStatus === "paid" ? "Paid" : titleCase(order.paymentStatus)) : paid ? "Paid" : "Pending"}
              </p>
            </div>
            {order && (
              <>
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-left sm:col-span-2">
                  <Truck className="mb-3 h-4 w-4 text-[#A87935]" strokeWidth={1.35} />
                  <p className="eyebrow mb-2">Receipt</p>
                  <div className="space-y-1.5">
                    {(order.items ?? []).map((item, i) => (
                      <p key={i} className="flex justify-between gap-3 text-sm text-white/72">
                        <span className="truncate">{item.name || "Product"} × {item.quantity ?? 1}</span>
                        <span className="shrink-0">EGP {((item.price ?? 0) * (item.quantity ?? 1)).toLocaleString()}</span>
                      </p>
                    ))}
                    <p className="flex justify-between gap-3 border-t border-white/10 pt-2 text-sm text-white/85">
                      <span>Total</span>
                      <span>EGP {Number(order.totalPrice ?? order.total ?? 0).toLocaleString()}</span>
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href={orderId ? `/orders?orderId=${encodeURIComponent(orderId)}` : "/orders"} className="btn-gold justify-center">
              View Orders
              <ArrowRight className="h-4 w-4" strokeWidth={1.3} />
            </Link>
            {order && (order.items ?? []).length > 0 && (
              <button type="button" onClick={reorder} disabled={reordering} className="btn-ghost justify-center disabled:opacity-50">
                <RotateCcw className="h-4 w-4" strokeWidth={1.3} />
                {reordering ? "Adding…" : "Reorder"}
              </button>
            )}
            <Link href="/shop" className="btn-ghost justify-center">
              Continue Shopping
            </Link>
          </div>
          {reorderMessage && <p className="mt-3 text-sm text-red-300/80" role="alert">{reorderMessage}</p>}
        </div>

        <div className="mt-4 flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.24em] text-white/28">
          <PackageCheck className="h-3.5 w-3.5" strokeWidth={1.3} />
          Pending orders can be reviewed from your account.
        </div>
      </motion.section>
    </main>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<main className="liquid-page flex min-h-screen items-center justify-center"><p className="eyebrow">Loading Confirmation</p></main>}>
      <ConfirmationContent />
    </Suspense>
  );
}
