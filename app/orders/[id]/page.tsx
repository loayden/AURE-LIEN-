"use client";

import { ArrowRight, Calendar, CheckCircle2, Clock3, CreditCard, Hash, Package, ShieldCheck, Truck } from "lucide-react";
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
    <main className="liquid-page mobile-comfort px-4 pb-[calc(7.25rem+env(safe-area-inset-bottom))] pt-16 sm:px-6 sm:pb-24 sm:pt-28 md:px-10">
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
          <p className="body-copy mt-4 max-w-2xl">
            Review payment state, delivery progress, and the exact pieces attached to this order.
          </p>
          <div className="page-header-divider mt-6" />
        </div>

        <div className="grid gap-5 lg:grid-cols-[1fr_22rem]">
          <section className="rounded-[24px] border border-[#7B6752]/12 bg-white/72 p-4 shadow-[0_20px_56px_rgba(61,48,37,0.08)] backdrop-blur-2xl sm:p-6">
            <div className="mb-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-[#7B6752]/12 bg-[#FFF9EF]/70 p-4">
                <Hash className="mb-3 h-4 w-4 text-[#A87935]" strokeWidth={1.35} />
                <p className="eyebrow mb-2">Order Number</p>
                <p className="break-all text-sm tracking-[0.08em] text-[#3D3025]/78">{order._id}</p>
              </div>
              <div className="rounded-2xl border border-[#7B6752]/12 bg-[#FFF9EF]/70 p-4">
                <CreditCard className="mb-3 h-4 w-4 text-[#A87935]" strokeWidth={1.35} />
                <p className="eyebrow mb-2">Payment</p>
                <p className="text-sm uppercase tracking-[0.16em] text-[#3D3025]/78">{paymentPaid ? "Paid" : "Pending"}</p>
              </div>
              <div className="rounded-2xl border border-[#7B6752]/12 bg-[#FFF9EF]/70 p-4">
                <Calendar className="mb-3 h-4 w-4 text-[#A87935]" strokeWidth={1.35} />
                <p className="eyebrow mb-2">Order Date</p>
                <p className="text-sm uppercase tracking-[0.16em] text-[#3D3025]/78">
                  {order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "Not listed"}
                </p>
              </div>
              <div className="rounded-2xl border border-[#7B6752]/12 bg-[#FFF9EF]/70 p-4">
                <ShieldCheck className="mb-3 h-4 w-4 text-[#A87935]" strokeWidth={1.35} />
                <p className="eyebrow mb-2">Support</p>
                <p className="text-sm uppercase tracking-[0.16em] text-[#3D3025]/78">Available</p>
              </div>
            </div>

            <div className="mb-6">
              <p className="eyebrow mb-4">Timeline</p>
              <div className="grid grid-cols-5 gap-1">
                {STEPS.map((label, index) => (
                  <div key={label}>
                    <div className={`h-1.5 rounded-full ${index <= step ? "bg-[#A87935]" : "bg-[#7B6752]/12"}`} />
                    <p className={`mt-2 truncate text-[8px] uppercase tracking-[0.14em] ${index <= step ? "text-[#A87935]" : "text-[#7B6E60]/58"}`}>
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {items.map((item: any, index: number) => (
                <article key={`${item.productId || item._id}-${index}`} className="flex items-center gap-3 rounded-2xl border border-[#7B6752]/12 bg-white/68 p-3 shadow-[0_12px_34px_rgba(61,48,37,0.05)] sm:gap-4">
                  <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-xl bg-[#F5F1E8]">
                    {item.image ? <Image src={item.image} alt={item.name || "Order item"} fill sizes="64px" className="object-cover" /> : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-serif text-lg tracking-[0.04em] text-[#3D3025]">{item.name}</p>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-[#7B6E60]">
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

          <aside className="flex flex-col gap-4 rounded-[24px] border border-[#7B6752]/12 bg-[#FFF9EF]/80 p-5 shadow-[0_20px_56px_rgba(61,48,37,0.08)] backdrop-blur-2xl sm:p-6">
            <div>
              <p className="eyebrow mb-3">Summary</p>
              <p className="font-serif text-3xl font-light tracking-[0.04em] text-[#A87935]">EGP {total.toLocaleString()}</p>
            </div>
            <div className="space-y-3 border-y border-[#7B6752]/12 py-4">
              <div className="flex items-center gap-3 text-[#6F6254]">
                {paymentPaid ? <CheckCircle2 className="h-4 w-4 text-[rgba(80,200,120,0.75)]" strokeWidth={1.35} /> : <Clock3 className="h-4 w-4 text-[#A87935]" strokeWidth={1.35} />}
                <span className="text-[10px] uppercase tracking-[0.22em]">{paymentPaid ? "Payment confirmed" : "Payment pending"}</span>
              </div>
              <div className="flex items-center gap-3 text-[#6F6254]">
                <Truck className="h-4 w-4 text-[#A87935]" strokeWidth={1.35} />
                <span className="text-[10px] uppercase tracking-[0.22em]">Delivery in Egypt</span>
              </div>
              <div className="flex items-center gap-3 text-[#6F6254]">
                <Package className="h-4 w-4 text-[#A87935]" strokeWidth={1.35} />
                <span className="text-[10px] uppercase tracking-[0.22em]">Support available</span>
              </div>
            </div>
            <Link href="/orders" className="btn-ghost justify-center">
              Back to Orders
            </Link>
            <Link href="/shop" className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-[#A87935]/22 bg-[#A87935]/10 px-5 py-3 text-[10px] uppercase tracking-[0.22em] text-[#7A581F]">
              Continue shopping
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.25} />
            </Link>
          </aside>
        </div>
      </div>
    </main>
  );
}
