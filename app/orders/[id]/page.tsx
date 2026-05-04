"use client";

import { CheckCircle2, Clock3, CreditCard, Hash, Package, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const STEPS = ["Pending", "Paid", "Processing", "Shipped", "Delivered"];

function activeStep(status: string) {
  if (status === "completed" || status === "delivered") return 4;
  if (status === "shipped") return 3;
  if (status === "processing") return 2;
  if (status === "paid") return 1;
  return 0;
}

export default function OrderDetailsPage() {
  const params = useParams();
  const orderId = Array.isArray(params?.id) ? params.id[0] : String(params?.id ?? "");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!orderId) return;
    const controller = new AbortController();
    fetch(`/api/orders?orderId=${encodeURIComponent(orderId)}`, { cache: "no-store", signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Unable to load order");
        return response.json();
      })
      .then((data) => setOrder(Array.isArray(data.orders) ? data.orders[0] ?? null : null))
      .catch((requestError) => {
        if (!controller.signal.aborted) setError(requestError instanceof Error ? requestError.message : "Unable to load order");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [orderId]);

  if (loading) {
    return (
      <main className="liquid-page flex min-h-screen items-center justify-center">
        <p className="eyebrow">Loading Order</p>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="liquid-page flex min-h-screen items-center px-4 py-24 sm:px-6 md:px-10">
        <div className="page-wrap max-w-2xl">
          <div className="glass-panel p-6 text-center sm:p-8">
            <p className="eyebrow mb-4">Order Details</p>
            <h1 className="title-display text-[2.4rem]">Order <em className="gold-italic">Unavailable</em></h1>
            <p className="body-copy mx-auto mt-4 text-center">{error || "We could not find this order."}</p>
            <Link href="/orders" className="btn-gold mt-6 justify-center">Back to Orders</Link>
          </div>
        </div>
      </main>
    );
  }

  const items = order.items || [];
  const total = Number(order.totalPrice ?? order.total ?? 0);
  const paymentPaid = order.paymentStatus === "paid";
  const step = activeStep(order.status);

  return (
    <main className="liquid-page px-4 pb-24 pt-20 sm:px-6 sm:pt-28 md:px-10">
      <div className="page-wrap max-w-5xl">
        <div className="mb-8">
          <p className="eyebrow mb-4">Order Details</p>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h1 className="title-display text-[clamp(2.4rem,6vw,4.8rem)]">
              Order <em className="gold-italic">{String(order._id).slice(-6).toUpperCase()}</em>
            </h1>
            <span className="count-pill">
              {order.status || "pending"}
            </span>
          </div>
          <div className="page-header-divider mt-6" />
        </div>

        <div className="grid gap-5 lg:grid-cols-[1fr_22rem]">
          <section className="glass-panel p-5 sm:p-6">
            <div className="mb-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <Hash className="mb-3 h-4 w-4 text-[#A87935]" strokeWidth={1.35} />
                <p className="eyebrow mb-2">Order Number</p>
                <p className="break-all text-sm tracking-[0.08em] text-white/72">{order._id}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <CreditCard className="mb-3 h-4 w-4 text-[#A87935]" strokeWidth={1.35} />
                <p className="eyebrow mb-2">Payment</p>
                <p className="text-sm uppercase tracking-[0.16em] text-white/72">{paymentPaid ? "Paid" : "Pending"}</p>
              </div>
            </div>

            <div className="mb-6">
              <p className="eyebrow mb-4">Timeline</p>
              <div className="grid grid-cols-5 gap-1">
                {STEPS.map((label, index) => (
                  <div key={label}>
                    <div className={`h-1.5 rounded-full ${index <= step ? "bg-[#A87935]" : "bg-white/10"}`} />
                    <p className={`mt-2 truncate text-[8px] uppercase tracking-[0.14em] ${index <= step ? "text-[#A87935]" : "text-white/25"}`}>
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {items.map((item: any, index: number) => (
                <article key={`${item.productId || item._id}-${index}`} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.035] p-3">
                  <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-xl bg-white/[0.05]">
                    {item.image ? <Image src={item.image} alt={item.name || "Order item"} fill sizes="64px" className="object-cover" /> : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-serif text-lg tracking-[0.04em] text-white/76">{item.name}</p>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-white/32">
                      Qty {item.quantity ?? 1}
                      {item.size ? ` / Size ${item.size}` : ""}
                      {item.color ? ` / ${item.color}` : ""}
                    </p>
                  </div>
                  <p className="font-serif text-lg text-[#A87935]">EGP {Number((item.price || 0) * (item.quantity || 1)).toLocaleString()}</p>
                </article>
              ))}
            </div>
          </section>

          <aside className="dark-panel flex flex-col gap-4 p-5 sm:p-6">
            <div>
              <p className="eyebrow mb-3">Summary</p>
              <p className="font-serif text-3xl font-light tracking-[0.04em] text-[#A87935]">EGP {total.toLocaleString()}</p>
            </div>
            <div className="space-y-3 border-y border-white/10 py-4">
              <div className="flex items-center gap-3 text-white/52">
                {paymentPaid ? <CheckCircle2 className="h-4 w-4 text-[rgba(80,200,120,0.75)]" strokeWidth={1.35} /> : <Clock3 className="h-4 w-4 text-[#A87935]" strokeWidth={1.35} />}
                <span className="text-[10px] uppercase tracking-[0.22em]">{paymentPaid ? "Payment confirmed" : "Payment pending"}</span>
              </div>
              <div className="flex items-center gap-3 text-white/52">
                <Truck className="h-4 w-4 text-[#A87935]" strokeWidth={1.35} />
                <span className="text-[10px] uppercase tracking-[0.22em]">Delivery in Egypt</span>
              </div>
              <div className="flex items-center gap-3 text-white/52">
                <Package className="h-4 w-4 text-[#A87935]" strokeWidth={1.35} />
                <span className="text-[10px] uppercase tracking-[0.22em]">Support available</span>
              </div>
            </div>
            <Link href="/orders" className="btn-ghost justify-center">
              Back to Orders
            </Link>
          </aside>
        </div>
      </div>
    </main>
  );
}
