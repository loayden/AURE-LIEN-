"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Calendar, CheckCircle2, Clock, CreditCard, Hash, Package, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

/* ── Status badge ── */
function StatusBadge({ status }: { status: string }) {
  const isPending = status === "pending";
  return (
    <div
      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full"
      style={isPending ? {
        background: "linear-gradient(135deg, rgba(255,180,50,0.14), rgba(255,160,30,0.05))",
        border: "1px solid rgba(255,180,50,0.25)",
        backdropFilter: "blur(12px)",
      } : {
        background: "linear-gradient(135deg, rgba(80,200,120,0.12), rgba(60,180,100,0.04))",
        border: "1px solid rgba(80,200,120,0.22)",
        backdropFilter: "blur(12px)",
      }}
    >
      {isPending
        ? <Clock strokeWidth={1.3} className="w-3 h-3" style={{ color:"rgba(255,190,60,0.8)" }} />
        : <CheckCircle2 strokeWidth={1.3} className="w-3 h-3" style={{ color:"rgba(80,200,120,0.8)" }} />
      }
      <span className="text-[9px] tracking-[0.3em] uppercase font-light"
            style={{ color: isPending ? "rgba(255,190,60,0.75)" : "rgba(80,200,120,0.75)", fontFamily:"'Jost', sans-serif" }}>
        {isPending ? "Pending" : "Completed"}
      </span>
    </div>
  );
}

function PaymentBadge({ status }: { status?: string }) {
  const paid = status === "paid";
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full px-3 py-1.5"
      style={{
        background: paid ? "rgba(80,200,120,0.08)" : "rgba(168,121,53,0.08)",
        border: paid ? "1px solid rgba(80,200,120,0.18)" : "1px solid rgba(168,121,53,0.2)",
      }}
    >
      <CreditCard className="h-3 w-3" strokeWidth={1.3} style={{ color: paid ? "rgba(80,200,120,0.75)" : "#A87935" }} />
      <span className="text-[9px] uppercase tracking-[0.24em]" style={{ color: paid ? "rgba(80,200,120,0.72)" : "#A87935" }}>
        {paid ? "Paid" : "Payment Pending"}
      </span>
    </span>
  );
}

function OrderTimeline({ status }: { status: string }) {
  const steps = ["Pending", "Paid", "Processing", "Shipped", "Delivered"];
  const normalized = status === "completed" ? "Delivered" : status === "paid" ? "Paid" : "Pending";
  const activeIndex = Math.max(0, steps.findIndex((step) => step.toLowerCase() === normalized.toLowerCase()));
  return (
    <div className="mt-4 grid grid-cols-5 gap-1">
      {steps.map((step, index) => (
        <div key={step} className="min-w-0">
          <div className={`h-1 rounded-full ${index <= activeIndex ? "bg-[#A87935]" : "bg-white/10"}`} />
          <p className={`mt-2 truncate text-[8px] uppercase tracking-[0.14em] ${index <= activeIndex ? "text-[#A87935]" : "text-white/24"}`}>
            {step}
          </p>
        </div>
      ))}
    </div>
  );
}

/* ── Single order card ── */
function OrderCard({ order, index, onPending }: { order: any; index: number; onPending: (o: any) => void }) {
  const items = order.items || [];
  const totalQty = items.reduce((a: number, i: any) => a + (i.quantity ?? 1), 0);
  const totalPrice = Number(order.totalPrice ?? order.total ?? 0);
  const isPending = order.status === "pending";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -30, scale: 0.97 }}
      transition={{ delay: index * 0.08, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-2xl"
      style={{
        background: "linear-gradient(135deg, rgba(255,248,236,0.08) 0%, rgba(255,248,236,0.025) 100%)",
        backdropFilter: "blur(24px) saturate(160%)",
        WebkitBackdropFilter: "blur(24px) saturate(160%)",
        border: "1px solid rgba(255,248,236,0.09)",
        boxShadow: "0 20px 56px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,248,236,0.14)",
      }}
    >
      {/* Specular top line */}
      <div className="absolute inset-x-5 top-0 h-px pointer-events-none"
           style={{ background: "linear-gradient(90deg, transparent, rgba(255,248,236,0.18), transparent)" }} />

      {/* ── Card header ── */}
      <div className="flex items-start justify-between gap-4 px-4 pt-5 pb-4 sm:px-6 sm:pt-6 sm:pb-5"
           style={{ borderBottom: "1px solid rgba(255,248,236,0.06)" }}>
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl"
               style={{ background:"linear-gradient(135deg, rgba(168,121,53,0.14), rgba(168,121,53,0.04))", border:"1px solid rgba(168,121,53,0.2)" }}>
            <ShoppingBag strokeWidth={1.3} className="w-4 h-4" style={{ color:"#A87935" }} />
          </div>
          <div>
            <p className="text-white/20 text-[9px] tracking-[0.35em] uppercase mb-0.5"
               style={{ fontFamily:"'Jost', sans-serif" }}>
              Order
            </p>
            <div className="flex items-center gap-2">
              <Hash strokeWidth={1.2} className="w-3 h-3 text-white/25" />
              <p className="text-white/40 text-[10px] tracking-[0.2em] font-light"
                 style={{ fontFamily:"'Jost', sans-serif" }}>
                {String(order._id).slice(-8).toUpperCase()}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <StatusBadge status={order.status} />
          <PaymentBadge status={order.paymentStatus} />
          <div className="flex items-center gap-1.5">
            <Calendar strokeWidth={1.2} className="w-3 h-3 text-white/20" />
            <p className="text-white/25 text-[9px] tracking-widest"
               style={{ fontFamily:"'Jost', sans-serif" }}>
              {new Date(order.createdAt).toLocaleDateString("en-GB", { day:"2-digit", month:"short", year:"numeric" })}
            </p>
          </div>
        </div>
      </div>

      {/* ── Items ── */}
      <div className="flex flex-col gap-3 px-4 py-4 sm:px-6 sm:py-5">
        {items.map((item: any, i: number) => (
          <div
            key={`${order._id}-${item.productId||item._id||i}-${i}`}
            className="flex items-center gap-4 p-3 rounded-xl"
            style={{
              background: "rgba(255,248,236,0.03)",
              border: "1px solid rgba(255,248,236,0.05)",
            }}
          >
            {/* Thumbnail */}
            {item.image && (
              <div className="relative w-12 h-14 flex-shrink-0 overflow-hidden rounded-lg"
                   style={{ boxShadow:"0 4px 14px rgba(0,0,0,0.4)" }}>
                <Image src={item.image} alt={item.name} fill className="object-cover" sizes="48px" />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <p className="text-white/65 font-light truncate"
                 style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:"0.95rem", letterSpacing:"0.05em" }}>
                {item.name}
              </p>
              <div className="mt-0.5 flex flex-wrap items-center gap-1">
                {item.category && (
                  <p className="text-white/20 text-[9px] tracking-[0.25em] uppercase"
                     style={{ fontFamily:"'Jost', sans-serif" }}>
                    {item.category}
                  </p>
                )}
                {(item.size || item.color) && (
                  <p className="text-white/30 text-[9px] tracking-[0.22em] uppercase"
                     style={{ fontFamily:"'Jost', sans-serif" }}>
                    {item.size && <> · Size {item.size}</>}
                    {item.color && <> · Color {item.color}</>}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {/* Qty pill */}
              <div className="px-2.5 py-1 rounded-full"
                   style={{ background:"rgba(255,248,236,0.06)", border:"1px solid rgba(255,248,236,0.08)" }}>
                <p className="text-white/35 text-[9px] tracking-[0.2em] font-light"
                   style={{ fontFamily:"'Jost', sans-serif" }}>
                  ×{item.quantity ?? 1}
                </p>
              </div>
              {/* Item price */}
              {item.price && (
                <p className="text-white/40 text-xs font-light"
                   style={{ fontFamily:"'Cormorant Garamond', serif", letterSpacing:"0.06em" }}>
                  EGP {(item.price * (item.quantity ?? 1)).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="px-4 pb-4 sm:px-6">
        <OrderTimeline status={order.status} />
      </div>

      {/* ── Card footer ── */}
      <div className="flex flex-col items-start justify-between gap-4 px-4 pb-5 pt-3 sm:flex-row sm:items-center sm:px-6 sm:pb-6"
           style={{ borderTop: "1px solid rgba(255,248,236,0.06)" }}>

        {/* Left — qty + total */}
        <div className="flex items-center gap-5">
          <div>
            <p className="text-white/20 text-[9px] tracking-[0.3em] uppercase mb-0.5"
               style={{ fontFamily:"'Jost', sans-serif" }}>
              Items
            </p>
            <p className="text-white/50 text-sm font-light"
               style={{ fontFamily:"'Cormorant Garamond', serif", letterSpacing:"0.06em" }}>
              {totalQty} {totalQty === 1 ? "Piece" : "Pieces"}
            </p>
          </div>
          <div className="w-px h-8" style={{ background:"rgba(255,248,236,0.07)" }} />
          <div>
            <p className="text-white/20 text-[9px] tracking-[0.3em] uppercase mb-0.5"
               style={{ fontFamily:"'Jost', sans-serif" }}>
              Total
            </p>
            <p className="font-light"
               style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:"1.15rem", color:"#A87935", letterSpacing:"0.06em" }}>
              EGP {totalPrice.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Right — action */}
        <div className="flex flex-col gap-2 sm:flex-row">
        <Link
          href={`/orders/${encodeURIComponent(order._id)}`}
          className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 rounded-full border border-white/10 px-5 py-3 text-[10px] uppercase tracking-[0.24em] text-white/60 transition-colors hover:text-white"
        >
          Details
          <ArrowRight strokeWidth={1.3} className="w-3.5 h-3.5" />
        </Link>
        {isPending ? (
          <motion.button
            type="button"
            onClick={() => onPending(order)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex min-h-[44px] min-w-[44px] items-center gap-2 px-5 py-3 rounded-full font-light transition-all duration-400 sm:gap-3 sm:px-6"
            style={{
              background: "linear-gradient(135deg, rgba(255,180,50,0.18), rgba(255,160,30,0.06))",
              border: "1px solid rgba(255,180,50,0.28)",
              backdropFilter: "blur(16px)",
              color: "rgba(255,190,60,0.85)",
              fontFamily: "'Jost', sans-serif",
              fontSize: "10px",
              letterSpacing: "0.3em",
            }}
          >
            Pay Now
            <ArrowRight strokeWidth={1.3} className="w-3.5 h-3.5" />
          </motion.button>
        ) : (
          <div
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full"
            style={{
              background: "rgba(80,200,120,0.06)",
              border: "1px solid rgba(80,200,120,0.14)",
              backdropFilter: "blur(12px)",
            }}
          >
            <Package strokeWidth={1.2} className="w-3.5 h-3.5" style={{ color:"rgba(80,200,120,0.6)" }} />
            <span className="text-[9px] tracking-[0.3em] uppercase font-light"
                  style={{ color:"rgba(80,200,120,0.6)", fontFamily:"'Jost', sans-serif" }}>
              Completed
            </span>
          </div>
        )}
        </div>
      </div>
    </motion.div>
  );
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        const query = orderId ? `?orderId=${encodeURIComponent(orderId)}` : "";
        const res = await fetch(`/api/orders${query}`, { cache: "no-store", signal: controller.signal });
        if (!res.ok) throw new Error("Unable to load orders");
        const data = await res.json();
        setOrders(data.orders || []);
      } catch (requestError) {
        if (controller.signal.aborted) return;
        setOrders([]);
        setError(requestError instanceof Error ? requestError.message : "Unable to load orders");
      }
      finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    })();
    return () => controller.abort();
  }, [orderId]);

  async function handlePending(order: any) {
    if (typeof window !== "undefined") sessionStorage.setItem("selectedOrder", JSON.stringify(order));
    setOrders((prev) => prev.filter((o) => o._id !== order._id));
    try { await fetch(`/api/orders?orderId=${encodeURIComponent(order._id)}`, { method:"DELETE" }); } catch {}
    router.push("/checkout");
  }

  /* ── Loading ── */
  if (loading) return (
    <div className="min-h-screen bg-[#F5F1E8] flex items-center justify-center">
      <motion.p animate={{ opacity:[0.3,0.7,0.3] }} transition={{ repeat:Infinity, duration:1.8 }}
        className="text-white/30 text-[10px] tracking-[0.4em] uppercase"
        style={{ fontFamily:"'Jost', sans-serif" }}>
        Loading Orders…
      </motion.p>
    </div>
  );

  return (
    <>
      <style>{`
        body { background: #F5F1E8; }
        ::selection { background: #A87935; color: #F5F1E8; }
      `}</style>

      <div className="relative min-h-screen bg-[#F5F1E8] text-white" style={{ fontFamily:"'Jost', sans-serif" }}>

        <div className="relative z-10 mx-auto max-w-4xl px-4 pt-16 pb-16 sm:px-6 sm:pt-24 sm:pb-24 md:px-10 md:pb-32">
          {error ? (
            <div
              className="mb-5 rounded-2xl px-4 py-3"
              style={{ background: "rgba(255,60,60,0.07)", border: "1px solid rgba(255,80,80,0.18)" }}
            >
              <p className="text-[10px] uppercase tracking-[0.2em]" style={{ color: "rgba(255,120,120,0.75)" }}>
                {error}
              </p>
            </div>
          ) : null}

          {/* ── HEADER ── */}
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.8 }} className="mb-6 sm:mb-8 md:mb-10">
            <p className="text-white/20 text-[9px] tracking-[0.45em] uppercase mb-4">Account</p>
            <div className="flex items-end justify-between gap-4 flex-wrap">
              <h1 className="font-light text-white leading-none"
                  style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:"clamp(2.5rem, 6vw, 4.5rem)", letterSpacing:"0.04em" }}>
                Your <em style={{ color:"#A87935", fontStyle:"italic" }}>Orders</em>
              </h1>
              {orders.length > 0 && (
                <span className="inline-flex min-h-[44px] min-w-[44px] items-center gap-2 px-4 py-2 rounded-full"
                      style={{ background:"linear-gradient(135deg, rgba(168,121,53,0.14), rgba(168,121,53,0.04))", border:"1px solid rgba(168,121,53,0.22)", backdropFilter:"blur(16px)" }}>
                  <span className="text-[#A87935] text-[10px] tracking-[0.3em] uppercase font-light">
                    {orders.length} {orders.length === 1 ? "Order" : "Orders"}
                  </span>
                </span>
              )}
            </div>
            <div className="mt-5 h-px" style={{ background:"linear-gradient(90deg, rgba(168,121,53,0.4), transparent)" }} />
          </motion.div>

          {/* ── EMPTY STATE ── */}
          {orders.length === 0 ? (
            <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.8 }}
              className="flex flex-col items-center justify-center text-center py-28">
              <div className="w-16 h-16 rounded-3xl flex items-center justify-center mb-6"
                   style={{ background:"linear-gradient(135deg, rgba(255,248,236,0.08), rgba(255,248,236,0.02))", border:"1px solid rgba(255,248,236,0.09)" }}>
                <ShoppingBag strokeWidth={1} className="w-7 h-7 text-white/20" />
              </div>
              <h2 className="font-light text-white mb-3"
                  style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:"1.8rem", letterSpacing:"0.06em" }}>
                No orders <em style={{ color:"#A87935" }}>yet</em>
              </h2>
              <p className="text-white/25 text-sm font-light tracking-widest mb-10 max-w-xs">
                You haven't made any purchases. Explore the collection and find your favorites.
              </p>
              <motion.button
                type="button"
                onClick={() => router.push("/shop")}
                whileHover={{ scale:1.02 }}
                whileTap={{ scale:0.97 }}
                className="inline-flex min-h-[44px] min-w-[44px] items-center gap-2 rounded-full px-6 py-3.5 text-[10px] font-light uppercase tracking-[0.3em] text-[#A87935] transition-all duration-500 sm:gap-3 sm:px-8"
                style={{ background:"linear-gradient(135deg, rgba(168,121,53,0.14), rgba(168,121,53,0.04))", border:"1px solid rgba(168,121,53,0.25)", backdropFilter:"blur(16px)" }}
              >
                Browse Collection
                <ArrowRight strokeWidth={1.3} className="w-3.5 h-3.5" />
              </motion.button>
            </motion.div>
          ) : (
            /* ── ORDER LIST ── */
            <AnimatePresence mode="popLayout">
              <div className="flex flex-col gap-5">
                {orders.map((order, i) => (
                  <OrderCard key={order._id} order={order} index={i} onPending={handlePending} />
                ))}
              </div>
            </AnimatePresence>
          )}

        </div>
      </div>
    </>
  );
}
