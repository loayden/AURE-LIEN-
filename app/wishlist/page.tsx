"use client";

import ProductCard from "@/components/ProductCard";
import { formatPrice, productMatchesStyleIntent } from "@/lib/commerce";
import type { StyleIntent } from "@/lib/commerce";
import type { Product } from "@/lib/types";
import { getWishlistInsights } from "@/lib/wishlistInsights";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Heart, Layers, Sparkles, Target, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function WishlistPage() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIntent, setSelectedIntent] = useState<StyleIntent>("all");

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/wishlist/list", { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error("Unable to load wishlist");
        return r.json();
      })
      .then((d) => setItems(d.items || []))
      .catch((requestError) => {
        if (controller.signal.aborted) return;
        setItems([]);
        setError(requestError instanceof Error ? requestError.message : "Unable to load wishlist");
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, []);

  const removeFromList = useCallback((productId: string) => {
    setItems((prev) => prev.filter((p) => p._id !== productId));
  }, []);

  const insights = useMemo(() => getWishlistInsights(items), [items]);
  const visibleItems = useMemo(
    () =>
      selectedIntent === "all"
        ? items
        : items.filter((product) => productMatchesStyleIntent(product, selectedIntent)),
    [items, selectedIntent]
  );

  /* ── Loading ── */
  if (loading) return (
    <div className="min-h-screen bg-[#F5F1E8] flex items-center justify-center">
      <motion.p
        animate={{ opacity:[0.3,0.7,0.3] }}
        transition={{ repeat:Infinity, duration:1.8 }}
        className="text-[#7B6E60] text-[10px] tracking-[0.4em] uppercase"
        style={{ fontFamily:"'Jost', sans-serif" }}
      >
        Loading Wishlist…
      </motion.p>
    </div>
  );

  return (
    <>
      <style>{`
        body { background: #F5F1E8; }
        ::selection { background: #A87935; color: #F5F1E8; }
      `}</style>

      <main
        className="relative min-h-screen bg-[#F5F1E8] px-4 pb-[calc(7.25rem+env(safe-area-inset-bottom))] pt-16 text-[#3D3025] sm:px-6 sm:pb-24 sm:pt-24 md:px-10 md:pb-32"
        style={{ fontFamily:"'Jost', sans-serif" }}
      >

        <div className="relative z-10 max-w-7xl mx-auto">
          {error ? (
            <div
              className="mb-5 rounded-2xl px-4 py-3"
              style={{ background: "rgba(154,34,34,0.08)", border: "1px solid rgba(154,34,34,0.22)" }}
            >
              <p className="text-[10px] uppercase tracking-[0.2em]" style={{ color: "#9A2222" }}>
                {error}
              </p>
            </div>
          ) : null}

          {/* ── HEADER ── */}
          <motion.div
            initial={{ opacity:0, y:20 }}
            animate={{ opacity:1, y:0 }}
            transition={{ duration:0.8 }}
            className="mb-6 sm:mb-8 md:mb-10"
          >
            <p className="text-[#A87935] text-[9px] tracking-[0.45em] uppercase mb-4">Account</p>
            <div className="flex items-end justify-between gap-4 flex-wrap">
              <h1
                className="font-light text-[#3D3025] leading-none"
                style={{
                  fontFamily:"'Cormorant Garamond', serif",
                  fontSize:"clamp(2.5rem, 6vw, 4.5rem)",
                  letterSpacing:"0.04em",
                }}
              >
                My <em style={{ color:"#A87935", fontStyle:"italic" }}>Wishlist</em>
              </h1>

              {/* Count pill */}
              {items.length > 0 && (
                <motion.span
                  initial={{ opacity:0, scale:0.85 }}
                  animate={{ opacity:1, scale:1 }}
                  className="inline-flex min-h-[44px] min-w-[44px] items-center gap-2 px-4 py-2 rounded-full"
                  style={{
                    background:"rgba(255,249,239,0.76)",
                    border:"1px solid rgba(168,121,53,0.22)",
                    backdropFilter:"blur(16px)",
                  }}
                >
                  <Heart strokeWidth={1.3} className="w-3 h-3" style={{ color:"#A87935" }} />
                  <span className="text-[#A87935] text-[10px] tracking-[0.3em] uppercase font-light">
                    {items.length} {items.length === 1 ? "Piece" : "Pieces"}
                  </span>
                </motion.span>
              )}
            </div>

            {/* Gold divider */}
            <div className="mt-5 h-px"
                 style={{ background:"linear-gradient(90deg, rgba(168,121,53,0.4), transparent)" }} />
          </motion.div>

          <section className="mb-5 rounded-[24px] border border-[#7B6752]/12 bg-white/68 p-4 shadow-[0_18px_48px_rgba(61,48,37,0.07)] backdrop-blur-2xl sm:p-6">
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)]">
              <div className="rounded-[20px] border border-[#A87935]/16 bg-[#FFF9EF]/72 p-4 sm:p-5">
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.28em] text-[#A87935]">Wishlist Stylist</p>
                    <h2 className="mt-2 font-serif text-[2rem] font-light leading-none tracking-[0.03em] text-[#3D3025] sm:text-[2.5rem]">
                      Decision <em className="gold-italic">Score</em>
                    </h2>
                  </div>
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] border border-[#A87935]/18 bg-white/70 text-[#A87935]">
                    <TrendingUp className="h-5 w-5" strokeWidth={1.25} />
                  </span>
                </div>

                <div className="grid gap-3 sm:grid-cols-[auto_1fr] sm:items-end">
                  <p className="font-serif text-[3.35rem] font-light leading-none text-[#3D3025]">
                    {insights.decisionScore}
                    <span className="ml-1 text-[1rem] text-[#7B6E60]">/100</span>
                  </p>
                  <div>
                    <div className="h-2 overflow-hidden rounded-full bg-[#7B6752]/12">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${insights.decisionScore}%` }}
                        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                        className="h-full rounded-full bg-[#A87935]"
                      />
                    </div>
                    <p className="mt-3 text-sm leading-6 text-[#6F6254]">
                      {insights.guidance.copy}
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-2 sm:grid-cols-3">
                  {[
                    { label: "Saved", value: `${insights.savedCount}`, icon: Heart },
                    { label: "Value", value: `EGP ${formatPrice(insights.totalValue)}`, icon: Target },
                    { label: "Top edit", value: insights.topCategory, icon: Layers },
                  ].map((stat) => {
                    const Icon = stat.icon;
                    return (
                      <div key={stat.label} className="rounded-[16px] border border-[#7B6752]/12 bg-white/60 p-3">
                        <div className="mb-2 flex items-center justify-between gap-3">
                          <span className="text-[8px] uppercase tracking-[0.2em] text-[#7B6E60]">{stat.label}</span>
                          <Icon className="h-3.5 w-3.5 text-[#A87935]" strokeWidth={1.25} />
                        </div>
                        <p className="truncate font-serif text-[1.05rem] font-light tracking-[0.03em] text-[#3D3025]">
                          {stat.value}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-[20px] border border-[#7B6752]/12 bg-white/64 p-4 sm:p-5">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.28em] text-[#A87935]">Next Action</p>
                    <h3 className="mt-2 font-serif text-[1.75rem] font-light leading-none text-[#3D3025]">
                      {insights.guidance.title}
                    </h3>
                  </div>
                  <Sparkles className="h-5 w-5 shrink-0 text-[#A87935]" strokeWidth={1.25} />
                </div>

                <Link
                  href={insights.guidance.href}
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-[#A87935]/24 bg-[#A87935]/10 px-5 text-[9px] uppercase tracking-[0.22em] text-[#7A581F] transition hover:border-[#A87935]/40 hover:bg-[#A87935]/14"
                >
                  {insights.guidance.label}
                  <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.35} />
                </Link>

                {insights.shortlist.length ? (
                  <div className="mt-5 space-y-2">
                    <p className="text-[9px] uppercase tracking-[0.24em] text-[#7B6E60]">Strongest saved pieces</p>
                    {insights.shortlist.map((product) => (
                      <Link
                        key={product._id}
                        href={`/product/${encodeURIComponent(product._id)}`}
                        className="flex items-center justify-between gap-3 rounded-[14px] border border-[#7B6752]/10 bg-[#FDFBF7]/74 px-3 py-2 transition hover:border-[#A87935]/24"
                      >
                        <span className="min-w-0 truncate text-sm text-[#3D3025]">{product.name}</span>
                        <span className="shrink-0 text-[9px] uppercase tracking-[0.16em] text-[#A87935]">
                          EGP {formatPrice(product.price)}
                        </span>
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
              <button
                type="button"
                onClick={() => setSelectedIntent("all")}
                className={`inline-flex min-h-[40px] shrink-0 items-center gap-2 rounded-full border px-4 text-[9px] uppercase tracking-[0.2em] transition ${
                  selectedIntent === "all"
                    ? "border-[#A87935]/36 bg-[#A87935]/12 text-[#7A581F]"
                    : "border-[#7B6752]/12 bg-white/58 text-[#6F6254]"
                }`}
              >
                <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={1.25} />
                All
              </button>
              {insights.intentInsights.map((intent) => (
                <button
                  key={intent.value}
                  type="button"
                  onClick={() => setSelectedIntent(intent.value)}
                  className={`inline-flex min-h-[40px] shrink-0 items-center gap-2 rounded-full border px-4 text-[9px] uppercase tracking-[0.2em] transition ${
                    selectedIntent === intent.value
                      ? "border-[#A87935]/36 bg-[#A87935]/12 text-[#7A581F]"
                      : "border-[#7B6752]/12 bg-white/58 text-[#6F6254]"
                  }`}
                >
                  {intent.label}
                  <span className="text-[#A87935]">{intent.count}</span>
                </button>
              ))}
            </div>
          </section>

          {/* ── EMPTY STATE ── */}
          {items.length === 0 ? (
            <motion.div
              initial={{ opacity:0, y:30 }}
              animate={{ opacity:1, y:0 }}
              transition={{ duration:0.8 }}
              className="flex flex-col items-center justify-center text-center py-28"
            >
              <div
                className="w-16 h-16 rounded-3xl flex items-center justify-center mb-6"
                style={{
                  background:"rgba(255,249,239,0.72)",
                  border:"1px solid rgba(123,103,82,0.12)",
                }}
              >
                <Heart strokeWidth={1} className="w-7 h-7 text-[#A87935]" />
              </div>
              <h2
                className="font-light text-[#3D3025] mb-3"
                style={{
                  fontFamily:"'Cormorant Garamond', serif",
                  fontSize:"1.8rem",
                  letterSpacing:"0.06em",
                }}
              >
                Your wishlist is <em style={{ color:"#A87935" }}>empty</em>
              </h2>
              <p className="text-[#6F6254] text-sm font-light tracking-widest mb-10 max-w-xs">
                Save pieces you love and come back to them any time.
              </p>
              <motion.div whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}>
                <Link
                  href="/shop"
                  className="inline-flex min-h-[44px] min-w-[44px] items-center gap-2 rounded-full px-6 py-3.5 text-[10px] font-light uppercase tracking-[0.3em] text-[#A87935] transition-all duration-500 sm:gap-3 sm:px-8"
                  style={{
                    background:"rgba(168,121,53,0.10)",
                    border:"1px solid rgba(168,121,53,0.25)",
                    backdropFilter:"blur(16px)",
                  }}
                >
                  Explore the Shop
                  <ArrowRight strokeWidth={1.3} className="w-3.5 h-3.5" />
                </Link>
              </motion.div>
            </motion.div>
          ) : (
            /* ── GRID ── */
            <AnimatePresence mode="popLayout">
              <div className="product-grid-shell lg:grid-cols-4">
                {visibleItems.map((product, i) => (
                  <motion.div
                    key={product._id}
                    layout
                    initial={{ opacity:0, y:24, scale:0.97 }}
                    animate={{ opacity:1, y:0, scale:1 }}
                    exit={{ opacity:0, scale:0.95, y:-12 }}
                    transition={{
                      delay: i * 0.07,
                      duration:0.65,
                      ease:[0.22,1,0.36,1],
                    }}
                  >
                    <ProductCard
                      product={product}
                      compact
                      onWishlistUpdate={removeFromList}
                      showRemoveFromWishlist
                    />
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          )}

          {items.length > 0 && visibleItems.length === 0 ? (
            <div className="rounded-[24px] border border-[#7B6752]/12 bg-white/62 px-5 py-12 text-center">
              <p className="font-serif text-2xl font-light text-[#3D3025]">No saved pieces in this intent.</p>
              <button
                type="button"
                onClick={() => setSelectedIntent("all")}
                className="mt-5 inline-flex min-h-[44px] items-center justify-center rounded-full border border-[#A87935]/24 bg-[#A87935]/10 px-5 text-[9px] uppercase tracking-[0.22em] text-[#7A581F]"
              >
                Show all saved pieces
              </button>
            </div>
          ) : null}

        </div>
      </main>
    </>
  );
}
