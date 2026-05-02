"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Calendar, CheckCircle2, Clock, Hash, Package, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

function timelineIndex(status?: string) {
  const normalized = String(status || "pending").toLowerCase();
  if (normalized === "delivered") return 4;
  if (normalized === "shipped") return 3;
  if (normalized === "processing") return 2;
  if (normalized === "paid" || normalized === "completed") return 1;
  return 0;
}

export default function OrderDetailPage() {
  const params = useParams();
  const orderIdParam = params?.orderId;
  const orderId = Array.isArray(orderIdParam) ? orderIdParam[0] : String(orderIdParam ?? "");
  const [order, setOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!orderId) return;
    const controller = new AbortController();

    (async () => {
      try {
        const res = await fetch(`/api/getorder?orderId=${encodeURIComponent(orderId)}`, {
          cache: "no-store",
          signal: controller.signal,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Unable to load order");
        setOrder(data);
      } catch (requestError) {
        if (controller.signal.aborted) return;
        setError(requestError instanceof Error ? requestError.message : "Unable to load order");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [orderId]);

  const items = useMemo(() => order?.items || order?.products || [], [order]);
  const activeIndex = timelineIndex(order?.status);
  const total = Number(order?.totalPrice ?? order?.total ?? 0);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0A0908] text-white">
        <p className="text-[10px] uppercase tracking-[0.4em] text-white/30">Loading Order...</p>
      </main>
    );
  }

  return (
    <main className="liquid-page pb-28">
      <section className="px-4 pt-20 sm:px-6 sm:pt-28 md:px-10">
        <div className="page-wrap max-w-5xl">
          <Link href="/orders" className="mb-8 inline-flex min-h-[44px] items-center gap-2 rounded-full border border-white/10 px-5 text-[10px] uppercase tracking-[0.22em] text-white/55 transition-colors hover:text-white">
            <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.4} />
            Orders
          </Link>

          {error || !order ? (
            <div className="rounded-[28px] border border-white/10 bg-white/[0.035] px-5 py-14 text-center">
              <Package className="mx-auto mb-4 h-9 w-9 text-white/25" strokeWidth={1.3} />
              <h1 className="font-serif text-3xl font-light text-white">Order not found</h1>
              <p className="body-copy mt-3">{error || "This order could not be loaded."}</p>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="rounded-[30px] border border-white/10 bg-white/[0.035] p-5 sm:p-7">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="eyebrow mb-4">Order Details</p>
                    <h1 className="font-serif text-4xl font-light text-white sm:text-6xl">
                      Order <em className="gold-italic">summary</em>
                    </h1>
                    <div className="mt-5 flex flex-wrap gap-3">
                      <span className="inline-flex min-h-[40px] items-center gap-2 rounded-full border border-white/10 px-4 text-[10px] uppercase tracking-[0.22em] text-white/52">
                        <Hash className="h-3.5 w-3.5" strokeWidth={1.4} />
                        {String(order._id || order.id || orderId).slice(-10).toUpperCase()}
                      </span>
                      {order.createdAt ? (
                        <span className="inline-flex min-h-[40px] items-center gap-2 rounded-full border border-white/10 px-4 text-[10px] uppercase tracking-[0.22em] text-white/52">
                          <Calendar className="h-3.5 w-3.5" strokeWidth={1.4} />
                          {new Date(order.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-brass/25 bg-brass/10 px-5 py-4 text-brass">
                    <p className="mb-1 text-[9px] uppercase tracking-[0.28em]">Total</p>
                    <p className="font-serif text-2xl font-light">EGP {total.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-white/[0.035] p-5 sm:p-6">
                <p className="eyebrow mb-5">Timeline</p>
                <div className="grid grid-cols-5 gap-2">
                  {["Pending", "Paid", "Processing", "Shipped", "Delivered"].map((step, index) => {
                    const active = index <= activeIndex;
                    return (
                      <div key={step}>
                        <div className="mb-2 h-1 rounded-full" style={{ background: active ? "rgba(201,168,106,0.82)" : "rgba(255,248,236,0.10)" }} />
                        <p className={active ? "text-brass" : "text-white/25"} style={{ fontSize: 9, letterSpacing: "0.16em", textTransform: "uppercase" }}>
                          {step}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-white/[0.035] p-5 sm:p-6">
                <div className="mb-5 flex items-center gap-3">
                  <ShoppingBag className="h-5 w-5 text-brass" strokeWidth={1.4} />
                  <h2 className="font-serif text-2xl font-light text-white">Items</h2>
                </div>
                <div className="space-y-3">
                  {items.map((item: any, index: number) => (
                    <div key={`${item.productId || item._id || index}`} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                      {item.image ? (
                        <div className="relative h-16 w-14 overflow-hidden rounded-xl">
                          <Image src={item.image} alt={item.name || "Order item"} fill sizes="56px" className="object-cover" />
                        </div>
                      ) : (
                        <div className="flex h-16 w-14 items-center justify-center rounded-xl bg-white/[0.05]">
                          <Package className="h-5 w-5 text-white/25" strokeWidth={1.3} />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-serif text-lg font-light text-white/78">{item.name || item._id || item.productId}</p>
                        <p className="mt-1 text-[9px] uppercase tracking-[0.22em] text-white/30">
                          Qty {item.quantity ?? 1}
                          {item.size ? ` · Size ${item.size}` : ""}
                          {item.color ? ` · Color ${item.color}` : ""}
                        </p>
                      </div>
                      {item.price ? (
                        <p className="text-sm text-brass">EGP {(item.price * (item.quantity ?? 1)).toLocaleString()}</p>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-white/[0.035] p-5 sm:p-6">
                <p className="eyebrow mb-4">Status</p>
                <div className="flex flex-wrap gap-3">
                  <span className="inline-flex min-h-[40px] items-center gap-2 rounded-full border border-white/10 px-4 text-[10px] uppercase tracking-[0.22em] text-white/62">
                    <Clock className="h-3.5 w-3.5 text-brass" strokeWidth={1.4} />
                    Order {order.status || "pending"}
                  </span>
                  <span className="inline-flex min-h-[40px] items-center gap-2 rounded-full border border-white/10 px-4 text-[10px] uppercase tracking-[0.22em] text-white/62">
                    <CheckCircle2 className="h-3.5 w-3.5 text-brass" strokeWidth={1.4} />
                    Payment {order.paymentStatus || "pending"}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </main>
  );
}
