"use client";

import ProductCard from "@/components/ProductCard";
import productsData from "@/lib/productsData";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Package, ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CartPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/cart", { cache: "no-store" });
        const cartItems = await res.json();
        if (!cartItems.items || !Array.isArray(cartItems.items)) { setItems([]); return; }
        const sanitized = cartItems.items.map((item: any) => {
          const product = productsData.find((p) => p._id === item.productId);
          return {
            productId: item.productId,
            quantity: item.quantity ?? 1,
            name: item.name ?? product?.name ?? "Unknown Product",
            price: item.price ?? product?.price ?? 0,
            image: item.image ?? product?.images?.[0] ?? "/images/placeholder.svg",
            category: product?.category ?? "",
            size: item.size ?? null,
            color: item.color ?? null,
          };
        });
        setItems(sanitized);
      } catch { setItems([]); }
      finally { setLoading(false); }
    })();
  }, []);

  const removeFromCart = async (productId: string, size?: string | null, color?: string | null) => {
    setRemoving(productId);
    try {
      await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, size, color }),
      });
      setItems((prev) =>
        prev.filter(
          (i) =>
            !(
              i.productId === productId &&
              (i.size ?? null) === (size ?? null) &&
              (i.color ?? null) === (color ?? null)
            )
        )
      );
    } catch { console.error("Remove failed"); }
    finally { setRemoving(null); }
  };

  const updateQuantity = async (productId: string, size: string | null, color: string | null, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(productId, size, color);
      return;
    }
    try {
      await fetch("/api/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity, size, color }),
      });
      setItems((prev) =>
        prev.map((i) =>
          i.productId === productId &&
          (i.size ?? null) === (size ?? null) &&
          (i.color ?? null) === (color ?? null)
            ? { ...i, quantity }
            : i
        )
      );
    } catch {
      console.error("Update quantity failed");
    }
  };

  const totalItems = items.reduce((a, i) => a + (i.quantity ?? 1), 0);
  const totalPrice = items.reduce((a, i) => a + i.price * (i.quantity ?? 1), 0);

  const cartIds = new Set(items.map((i) => i.productId));
  const recommended = productsData.filter((p) => !cartIds.has(p._id)).slice(0, 4);

  /* ── Loading ── */
  if (loading) return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center">
      <motion.div
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ repeat: Infinity, duration: 1.8 }}
        className="text-white/30 text-[10px] tracking-[0.4em] uppercase"
        style={{ fontFamily: "'Jost', sans-serif" }}
      >
        Loading Cart…
      </motion.div>
    </div>
  );

  return (
    <>
      <style>{`
        body { background: #080808; }
        ::selection { background: #C6A962; color: #080808; }

        .glass {
          background: linear-gradient(135deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.03) 100%);
          backdrop-filter: blur(24px) saturate(160%);
          -webkit-backdrop-filter: blur(24px) saturate(160%);
          border: 1px solid rgba(255,255,255,0.10);
          box-shadow: 0 16px 48px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.15);
        }
        .gold-glass {
          background: linear-gradient(135deg, rgba(198,169,98,0.16) 0%, rgba(198,169,98,0.05) 100%);
          backdrop-filter: blur(20px) saturate(150%);
          -webkit-backdrop-filter: blur(20px) saturate(150%);
          border: 1px solid rgba(198,169,98,0.25);
          box-shadow: 0 8px 32px rgba(198,169,98,0.10), inset 0 1px 0 rgba(255,255,255,0.14);
        }
      `}</style>

      <div
        className="relative min-h-screen bg-[#080808] text-white"
        style={{ fontFamily: "'Jost', sans-serif" }}
      >

        <div className="relative z-10 mx-auto max-w-6xl px-4 pt-16 pb-16 sm:px-6 sm:pt-24 sm:pb-24 md:px-10 md:pb-32">

          {/* ── PAGE HEADER ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6 sm:mb-8 md:mb-10"
          >
            <p className="text-white/20 text-[9px] tracking-[0.45em] uppercase mb-4">Review & Checkout</p>
            <div className="flex items-end justify-between gap-4 flex-wrap">
              <h1
                className="font-light text-white leading-none"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(2.5rem, 6vw, 5rem)",
                  letterSpacing: "0.04em",
                }}
              >
                Your <em style={{ color: "#C6A962", fontStyle: "italic" }}>Cart</em>
              </h1>
              {items.length > 0 && (
                <span className="gold-glass inline-flex min-h-[44px] min-w-[44px] items-center rounded-full px-4 py-2 text-[10px] font-light uppercase tracking-[0.3em] text-[#C6A962]">
                  {totalItems} {totalItems === 1 ? "Piece" : "Pieces"}
                </span>
              )}
            </div>
            {/* Gold divider */}
            <div className="mt-6 h-px"
                 style={{ background: "linear-gradient(90deg, rgba(198,169,98,0.4), transparent)" }} />
          </motion.div>

          {/* ── EMPTY STATE ── */}
          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center justify-center text-center py-28"
            >
              <div
                className="glass w-20 h-20 rounded-3xl flex items-center justify-center mb-8"
              >
                <ShoppingBag strokeWidth={1} className="w-8 h-8 text-white/25" />
              </div>
              <h2
                className="font-light text-white mb-3"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2.2rem", letterSpacing: "0.06em" }}
              >
                Your cart is <em style={{ color: "#C6A962" }}>empty</em>
              </h2>
              <p className="text-white/30 text-sm font-light tracking-widest mb-10 max-w-xs">
                Explore the collection and find your next defining piece.
              </p>
              <button
                onClick={() => router.push("/shop")}
                className="gold-glass inline-flex min-h-[44px] min-w-[44px] items-center gap-2 rounded-full px-6 py-3.5
                           text-[#C6A962] text-[10px] tracking-[0.3em] uppercase font-light
                           hover:scale-[1.02] transition-all duration-500 sm:gap-3 sm:px-8"
              >
                Browse Collection
                <ArrowRight strokeWidth={1.3} className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">

              {/* ── LEFT — Cart items ── */}
              <div className="flex flex-col gap-4">
                <AnimatePresence mode="popLayout">
                  {items.map((item, i) => (
                    <motion.div
                      key={i}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -30, scale: 0.97 }}
                      transition={{ delay: i * 0.06, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                      className="glass rounded-2xl p-5 flex items-center gap-5 relative overflow-hidden"
                    >
                      {/* Specular top line */}
                      <div className="absolute inset-x-4 top-0 h-px pointer-events-none"
                           style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)" }} />

                      {/* Product image */}
                      <div className="relative w-20 h-24 flex-shrink-0 overflow-hidden rounded-xl"
                           style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.4)" }}>
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        {item.category && (
                          <p className="text-white/25 text-[9px] tracking-[0.3em] uppercase mb-1">{item.category}</p>
                        )}
                        <h2
                          className="text-white font-light leading-snug mb-1 truncate"
                          style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", letterSpacing: "0.05em" }}
                        >
                          {item.name}
                        </h2>
                        <p className="font-light" style={{ color: "#C6A962", fontSize: "0.95rem", letterSpacing: "0.06em" }}>
                          EGP {item.price.toLocaleString()}
                        </p>
                        <div className="mt-2 flex items-center gap-3 flex-wrap">
                          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 px-2 py-1 text-[10px] tracking-[0.18em] uppercase">
                            <button
                              type="button"
                              className="flex h-6 w-6 items-center justify-center rounded-full bg-white/5 transition-transform active:scale-95"
                              onClick={() => updateQuantity(item.productId, item.size ?? null, item.color ?? null, (item.quantity ?? 1) - 1)}
                            >
                              -
                            </button>
                            <span className="min-w-[1.5rem] text-center">
                              {item.quantity ?? 1}
                            </span>
                            <button
                              type="button"
                              className="flex h-6 w-6 items-center justify-center rounded-full bg-white/5 transition-transform active:scale-95"
                              onClick={() => updateQuantity(item.productId, item.size ?? null, item.color ?? null, (item.quantity ?? 1) + 1)}
                            >
                              +
                            </button>
                          </div>
                          <p className="text-white/30 text-[9px] tracking-[0.25em] uppercase">
                            {item.size && <>Size {item.size}</>}
                            {item.color && <> · Color {item.color}</>}
                          </p>
                        </div>
                      </div>

                      {/* Line total */}
                      <div className="hidden sm:block text-right shrink-0">
                        <p className="text-white/35 text-[9px] tracking-[0.25em] uppercase mb-0.5">Total</p>
                        <p className="font-light text-white"
                           style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", letterSpacing: "0.06em" }}>
                          EGP {(item.price * (item.quantity ?? 1)).toLocaleString()}
                        </p>
                      </div>

                      {/* Remove */}
                      <motion.button
                        onClick={() => removeFromCart(item.productId, item.size ?? null, item.color ?? null)}
                        disabled={removing === item.productId}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.88 }}
                        className="p-2.5 rounded-full ml-2 flex-shrink-0 transition-all duration-300 disabled:opacity-40"
                        style={{
                          background: "rgba(255,80,80,0.08)",
                          border: "1px solid rgba(255,80,80,0.15)",
                          backdropFilter: "blur(12px)",
                        }}
                        aria-label={`Remove ${item.name}`}
                      >
                        <Trash2 strokeWidth={1.3} className="w-3.5 h-3.5 text-red-400/70" />
                      </motion.button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* ── RIGHT — Order Summary ── */}
              <motion.aside
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="mobile-sticky-top glass sticky flex flex-col gap-5 overflow-hidden rounded-2xl p-5 sm:p-6"
              >
                {/* Specular */}
                <div className="absolute inset-x-4 top-0 h-px pointer-events-none"
                     style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)" }} />

                <div>
                  <p className="text-white/20 text-[9px] tracking-[0.4em] uppercase mb-4">Summary</p>
                  <h3
                    className="font-light text-white leading-none mb-5"
                    style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.6rem", letterSpacing: "0.06em" }}
                  >
                    Order <em style={{ color: "#C6A962" }}>Overview</em>
                  </h3>
                  <div className="h-px mb-5"
                       style={{ background: "linear-gradient(90deg, rgba(198,169,98,0.3), transparent)" }} />
                </div>

                {/* Line items */}
                <div className="flex flex-col gap-3">
                  {items.map((item, i) => (
                    <div key={`${item.productId}-${item.size || "nosize"}-${item.color || "nocolor"}-${i}`} className="flex items-center justify-between gap-3">
                      <p className="text-white/45 text-[10px] font-light tracking-wide truncate flex-1"
                         style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.85rem" }}>
                        {item.name}
                        <span className="text-white/20 ml-1.5 text-[9px]">×{item.quantity}</span>
                        {(item.size || item.color) && (
                          <span className="text-white/25 ml-1.5 text-[9px] tracking-[0.18em] uppercase">
                            {item.size && <> · {item.size}</>}
                            {item.color && <> · {item.color}</>}
                          </span>
                        )}
                      </p>
                      <p className="text-white/55 text-[10px] font-light tracking-wide shrink-0">
                        EGP {(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Divider */}
                <div className="h-px"
                     style={{ background: "rgba(255,255,255,0.06)" }} />

                {/* Totals */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <p className="text-white/30 text-[9px] tracking-[0.3em] uppercase">Subtotal</p>
                    <p className="text-white/55 text-sm font-light">EGP {totalPrice.toLocaleString()}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-white/30 text-[9px] tracking-[0.3em] uppercase">Shipping</p>
                    <p className="text-white/30 text-[10px] tracking-widest uppercase">Calculated at checkout</p>
                  </div>
                </div>

                {/* Total */}
                <div
                  className="gold-glass rounded-xl px-5 py-4 flex justify-between items-center"
                >
                  <p className="text-[#C6A962] text-[9px] tracking-[0.35em] uppercase font-light">Total</p>
                  <p
                    className="font-light"
                    style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem", color: "#C6A962", letterSpacing: "0.06em" }}
                  >
                    EGP {totalPrice.toLocaleString()}
                  </p>
                </div>

                {/* CTA */}
                <motion.button
                  onClick={() => router.push("/checkout")}
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.985 }}
                  className="relative flex min-h-[44px] min-w-[44px] w-full items-center justify-center gap-2 overflow-hidden rounded-full py-4 sm:gap-3"
                  style={{
                    background: "linear-gradient(135deg, rgba(198,169,98,0.22), rgba(178,149,78,0.10))",
                    border: "1px solid rgba(198,169,98,0.35)",
                    backdropFilter: "blur(16px)",
                    boxShadow: "0 0 28px rgba(198,169,98,0.12), inset 0 1px 0 rgba(255,255,255,0.14)",
                  }}
                >
                  <span className="text-[#C6A962] text-[10px] tracking-[0.3em] uppercase font-light">
                    Proceed to Checkout
                  </span>
                  <ArrowRight strokeWidth={1.3} className="w-3.5 h-3.5 text-[#C6A962]" />
                </motion.button>

                {/* Trust note */}
                <div className="flex items-center justify-center gap-2">
                  <Package strokeWidth={1.2} className="w-3 h-3 text-white/20" />
                  <p className="text-white/20 text-[9px] tracking-[0.25em] uppercase">Free returns on all orders</p>
                </div>
              </motion.aside>
            </div>
          )}

          {/* ── RECOMMENDATIONS ── */}
          {recommended.length > 0 && items.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9 }}
              className="mt-20"
            >
              <div className="mb-6 flex flex-wrap items-end justify-between gap-4 sm:mb-8 md:mb-10">
                <div>
                  <p className="text-white/20 text-[9px] tracking-[0.45em] uppercase mb-3">Handpicked For You</p>
                  <h2
                    className="font-light leading-none"
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "clamp(1.6rem, 3vw, 2.6rem)",
                      letterSpacing: "0.06em",
                      color: "#C6A962",
                    }}
                  >
                    You May Also Like
                  </h2>
                </div>
                <div className="hidden sm:block flex-1 mx-8 h-px"
                     style={{ background: "linear-gradient(90deg, rgba(198,169,98,0.2), transparent)" }} />
              </div>

              <div className="mb-6 h-px sm:mb-8 md:mb-10"
                   style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)" }} />

              <div className="product-grid-shell lg:grid-cols-4">
                {recommended.map((product, i) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.75 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

        </div>
      </div>
    </>
  );
}
