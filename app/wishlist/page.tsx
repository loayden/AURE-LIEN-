"use client";

import ProductCard from "@/components/ProductCard";
import type { Product } from "@/lib/types";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Heart } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

function Orbs() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      <div style={{
        position:"absolute", width:680, height:680, top:"-12%", right:"-10%",
        background:"radial-gradient(circle, rgba(198,169,98,0.07) 0%, transparent 65%)",
        filter:"blur(90px)", animation:"wlOA 25s ease-in-out infinite",
      }} />
      <div style={{
        position:"absolute", width:520, height:520, bottom:"5%", left:"-8%",
        background:"radial-gradient(circle, rgba(200,80,120,0.05) 0%, transparent 65%)",
        filter:"blur(80px)", animation:"wlOB 31s ease-in-out infinite",
      }} />
      <style>{`
        @keyframes wlOA { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-28px,22px)} }
        @keyframes wlOB { 0%,100%{transform:translate(0,0)} 50%{transform:translate(32px,-18px)} }
      `}</style>
    </div>
  );
}

export default function WishlistPage() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/wishlist/list")
      .then((r) => r.json())
      .then((d) => setItems(d.items || []))
      .finally(() => setLoading(false));
  }, []);

  function removeFromList(productId: string) {
    setItems((prev) => prev.filter((p) => p._id !== productId));
  }

  /* ── Loading ── */
  if (loading) return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center">
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
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@200;300;400&display=swap');
        body { background: #080808; }
        ::selection { background: #C6A962; color: #080808; }
      `}</style>

      <main
        className="relative min-h-screen bg-[#080808] text-white pt-28 pb-32 px-6"
        style={{ fontFamily:"'Jost', sans-serif" }}
      >
        <Orbs />

        <div className="relative z-10 max-w-7xl mx-auto">

          {/* ── HEADER ── */}
          <motion.div
            initial={{ opacity:0, y:20 }}
            animate={{ opacity:1, y:0 }}
            transition={{ duration:0.8 }}
            className="mb-12"
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
                My <em style={{ color:"#C6A962", fontStyle:"italic" }}>Wishlist</em>
              </h1>

              {/* Count pill */}
              {items.length > 0 && (
                <motion.span
                  initial={{ opacity:0, scale:0.85 }}
                  animate={{ opacity:1, scale:1 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
                  style={{
                    background:"linear-gradient(135deg, rgba(198,169,98,0.14), rgba(198,169,98,0.04))",
                    border:"1px solid rgba(198,169,98,0.22)",
                    backdropFilter:"blur(16px)",
                  }}
                >
                  <Heart strokeWidth={1.3} className="w-3 h-3" style={{ color:"#C6A962" }} />
                  <span className="text-[#C6A962] text-[10px] tracking-[0.3em] uppercase font-light">
                    {items.length} {items.length === 1 ? "Piece" : "Pieces"}
                  </span>
                </motion.span>
              )}
            </div>

            {/* Gold divider */}
            <div className="mt-5 h-px"
                 style={{ background:"linear-gradient(90deg, rgba(198,169,98,0.4), transparent)" }} />
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
                  background:"linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))",
                  border:"1px solid rgba(255,255,255,0.09)",
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
                Your wishlist is <em style={{ color:"#C6A962" }}>empty</em>
              </h2>
              <p className="text-white/25 text-sm font-light tracking-widest mb-10 max-w-xs">
                Save pieces you love and come back to them any time.
              </p>
              <motion.div whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full text-[#C6A962] text-[10px] tracking-[0.3em] uppercase font-light transition-all duration-500"
                  style={{
                    background:"linear-gradient(135deg, rgba(198,169,98,0.14), rgba(198,169,98,0.04))",
                    border:"1px solid rgba(198,169,98,0.25)",
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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