"use client";

import ProductCard from "@/components/ProductCard";
import type { Product } from "@/lib/types";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Heart } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

export default function WishlistPage() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  /* ── Loading ── */
  if (loading) return (
    <div className="min-h-screen bg-[#0A0908] flex items-center justify-center">
      <motion.p
        animate={{ opacity:[0.3,0.7,0.3] }}
        transition={{ repeat:Infinity, duration:1.8 }}
        className="text-white/30 text-[10px] tracking-[0.4em] uppercase"
        style={{ fontFamily:"'Jost', sans-serif" }}
      >
        Loading Wishlist…
      </motion.p>
    </div>
  );

  return (
    <>
      <style>{`
        body { background: #0A0908; }
        ::selection { background: #C9A86A; color: #0A0908; }
      `}</style>

      <main
        className="relative min-h-screen bg-[#0A0908] px-4 pb-16 pt-16 text-white sm:px-6 sm:pb-24 sm:pt-24 md:px-10 md:pb-32"
        style={{ fontFamily:"'Jost', sans-serif" }}
      >

        <div className="relative z-10 max-w-7xl mx-auto">
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
          <motion.div
            initial={{ opacity:0, y:20 }}
            animate={{ opacity:1, y:0 }}
            transition={{ duration:0.8 }}
            className="mb-6 sm:mb-8 md:mb-10"
          >
            <p className="text-white/20 text-[9px] tracking-[0.45em] uppercase mb-4">Account</p>
            <div className="flex items-end justify-between gap-4 flex-wrap">
              <h1
                className="font-light text-white leading-none"
                style={{
                  fontFamily:"'Cormorant Garamond', serif",
                  fontSize:"clamp(2.5rem, 6vw, 4.5rem)",
                  letterSpacing:"0.04em",
                }}
              >
                My <em style={{ color:"#C9A86A", fontStyle:"italic" }}>Wishlist</em>
              </h1>

              {/* Count pill */}
              {items.length > 0 && (
                <motion.span
                  initial={{ opacity:0, scale:0.85 }}
                  animate={{ opacity:1, scale:1 }}
                  className="inline-flex min-h-[44px] min-w-[44px] items-center gap-2 px-4 py-2 rounded-full"
                  style={{
                    background:"linear-gradient(135deg, rgba(201,168,106,0.14), rgba(201,168,106,0.04))",
                    border:"1px solid rgba(201,168,106,0.22)",
                    backdropFilter:"blur(16px)",
                  }}
                >
                  <Heart strokeWidth={1.3} className="w-3 h-3" style={{ color:"#C9A86A" }} />
                  <span className="text-[#C9A86A] text-[10px] tracking-[0.3em] uppercase font-light">
                    {items.length} {items.length === 1 ? "Piece" : "Pieces"}
                  </span>
                </motion.span>
              )}
            </div>

            {/* Gold divider */}
            <div className="mt-5 h-px"
                 style={{ background:"linear-gradient(90deg, rgba(201,168,106,0.4), transparent)" }} />
          </motion.div>

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
                  background:"linear-gradient(135deg, rgba(255,248,236,0.08), rgba(255,248,236,0.02))",
                  border:"1px solid rgba(255,248,236,0.09)",
                }}
              >
                <Heart strokeWidth={1} className="w-7 h-7 text-white/20" />
              </div>
              <h2
                className="font-light text-white mb-3"
                style={{
                  fontFamily:"'Cormorant Garamond', serif",
                  fontSize:"1.8rem",
                  letterSpacing:"0.06em",
                }}
              >
                Your wishlist is <em style={{ color:"#C9A86A" }}>empty</em>
              </h2>
              <p className="text-white/25 text-sm font-light tracking-widest mb-10 max-w-xs">
                Save pieces you love and come back to them any time.
              </p>
              <motion.div whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}>
                <Link
                  href="/shop"
                  className="inline-flex min-h-[44px] min-w-[44px] items-center gap-2 rounded-full px-6 py-3.5 text-[10px] font-light uppercase tracking-[0.3em] text-[#C9A86A] transition-all duration-500 sm:gap-3 sm:px-8"
                  style={{
                    background:"linear-gradient(135deg, rgba(201,168,106,0.14), rgba(201,168,106,0.04))",
                    border:"1px solid rgba(201,168,106,0.25)",
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
                {items.map((product, i) => (
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
                      onWishlistUpdate={removeFromList}
                      showRemoveFromWishlist
                    />
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          )}

        </div>
      </main>
    </>
  );
}
