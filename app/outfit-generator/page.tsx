"use client";

import type { Product } from "@/lib/types";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronDown, ShoppingBag, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Outfit = { name: string; items: Product[] };

/* ── Custom glass select ── */
function GlassSelect({
  label, value, onChange, options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  const [open, setOpen] = useState(false);
  const current = options.find((o) => o.value === value);

  return (
    <div className="flex flex-col gap-2 relative">
      <label className="text-white/20 text-[9px] tracking-[0.4em] uppercase"
             style={{ fontFamily:"'Jost', sans-serif" }}>
        {label}
      </label>

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="relative flex min-h-[44px] min-w-[44px] items-center justify-between rounded-2xl px-4 py-3.5 text-left transition-all duration-300 sm:px-5"
        style={{
          background:"linear-gradient(135deg, rgba(255,248,236,0.07) 0%, rgba(255,248,236,0.02) 100%)",
          backdropFilter:"blur(16px)",
          border: open ? "1px solid rgba(201,168,106,0.45)" : "1px solid rgba(255,248,236,0.09)",
          boxShadow: open ? "0 0 0 3px rgba(201,168,106,0.08)" : "none",
        }}
      >
        <span className="text-white/70 text-sm font-light tracking-wide"
              style={{ fontFamily:"'Jost', sans-serif" }}>
          {current?.label}
        </span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration:0.3 }}>
          <ChevronDown strokeWidth={1.3} className="w-4 h-4 text-white/30" />
        </motion.span>
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity:0, y:6, scale:0.97 }}
            animate={{ opacity:1, y:0, scale:1 }}
            exit={{ opacity:0, y:6, scale:0.97 }}
            transition={{ duration:0.2, ease:[0.22,1,0.36,1] }}
            className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 overflow-hidden rounded-2xl"
            style={{
              background:"linear-gradient(160deg, rgba(30,24,22,0.96) 0%, rgba(20,17,15,0.98) 100%)",
              backdropFilter:"blur(32px) saturate(180%)",
              border:"1px solid rgba(255,248,236,0.09)",
              boxShadow:"0 24px 60px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,248,236,0.10)",
            }}
          >
            <div className="absolute inset-x-4 top-0 h-px pointer-events-none"
                 style={{ background:"linear-gradient(90deg, transparent, rgba(255,248,236,0.16), transparent)" }} />
            {options.map((opt, i) => (
              <li key={opt.value}>
                <button
                  type="button"
                  onClick={() => { onChange(opt.value); setOpen(false); }}
                  className="flex min-h-[44px] min-w-[44px] w-full items-center justify-between px-4 py-3 text-left transition-all duration-200 hover:bg-white/[0.05] sm:px-5"
                  style={{
                    color: opt.value === value ? "#C9A86A" : "rgba(255,248,236,0.50)",
                    fontSize:"11px",
                    letterSpacing:"0.15em",
                    fontFamily:"'Jost', sans-serif",
                    fontWeight:300,
                  }}
                >
                  <span className="uppercase">{opt.label}</span>
                  {opt.value === value && (
                    <span className="w-1 h-1 rounded-full" style={{ background:"#C9A86A" }} />
                  )}
                </button>
                {i < options.length - 1 && (
                  <div className="mx-4 h-px" style={{ background:"rgba(255,248,236,0.05)" }} />
                )}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Single outfit card ── */
function OutfitCard({ outfit, index, onAddToCart }: {
  outfit: Outfit;
  index: number;
  onAddToCart: (items: Product[]) => void;
}) {
  const total = outfit.items.reduce((a, p) => a + (p.price ?? 0), 0);

  return (
    <motion.div
      initial={{ opacity:0, y:32, scale:0.97 }}
      animate={{ opacity:1, y:0, scale:1 }}
      transition={{ delay: index * 0.12, duration:0.8, ease:[0.22,1,0.36,1] }}
      className="relative overflow-hidden rounded-2xl flex flex-col"
      style={{
        background:"linear-gradient(135deg, rgba(255,248,236,0.08) 0%, rgba(255,248,236,0.025) 100%)",
        backdropFilter:"blur(24px) saturate(160%)",
        border:"1px solid rgba(255,248,236,0.09)",
        boxShadow:"0 24px 64px rgba(0,0,0,0.40), inset 0 1px 0 rgba(255,248,236,0.14)",
      }}
    >
      {/* Specular top line */}
      <div className="absolute inset-x-5 top-0 h-px pointer-events-none"
           style={{ background:"linear-gradient(90deg, transparent, rgba(255,248,236,0.20), transparent)" }} />

      {/* Card header */}
      <div className="px-4 pb-4 pt-5 sm:px-6 sm:pt-6" style={{ borderBottom:"1px solid rgba(255,248,236,0.06)" }}>
        <div className="flex items-center gap-3 mb-1">
          <span className="text-[#C9A86A] text-[9px] tracking-[0.35em] uppercase font-light"
                style={{ fontFamily:"'Jost', sans-serif" }}>
            Look {String(index + 1).padStart(2, "0")}
          </span>
        </div>
        <h3
          className="font-light text-white leading-tight"
          style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:"1.3rem", letterSpacing:"0.06em" }}
        >
          {outfit.name}
        </h3>
      </div>

      {/* Items */}
      <div className="flex-1 px-4 py-4 flex flex-col gap-2">
        {outfit.items.map((p) => (
          <Link
            key={p._id}
            href={`/product/${p._id}`}
            className="group flex items-center gap-3 p-2.5 rounded-xl transition-all duration-300"
            style={{ border:"1px solid transparent" }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(255,248,236,0.07)")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "transparent")}
          >
            {/* Thumbnail */}
            <div
              className="relative w-12 h-14 rounded-xl overflow-hidden flex-shrink-0"
              style={{ boxShadow:"0 4px 14px rgba(0,0,0,0.45)" }}
            >
              {p.images?.[0] ? (
                <Image
                  src={p.images[0]}
                  alt={p.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="48px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center"
                     style={{ background:"rgba(255,248,236,0.04)" }}>
                  <span className="text-white/20 text-[8px]">—</span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-white/65 font-light truncate"
                 style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:"0.9rem", letterSpacing:"0.05em" }}>
                {p.name}
              </p>
              {p.category && (
                <p className="text-white/20 text-[8px] tracking-[0.25em] uppercase mt-0.5"
                   style={{ fontFamily:"'Jost', sans-serif" }}>
                  {p.category}
                </p>
              )}
            </div>

            {/* Price */}
            <p className="text-white/40 text-xs font-light shrink-0"
               style={{ fontFamily:"'Cormorant Garamond', serif", letterSpacing:"0.06em" }}>
              EGP {p.price?.toLocaleString()}
            </p>
          </Link>
        ))}
      </div>

      {/* Card footer */}
      <div className="flex flex-col gap-3 px-4 pb-5 pt-4 sm:px-6 sm:pb-6"
           style={{ borderTop:"1px solid rgba(255,248,236,0.06)" }}>
        {/* Total */}
        <div className="flex items-center justify-between">
          <span className="text-white/20 text-[9px] tracking-[0.3em] uppercase"
                style={{ fontFamily:"'Jost', sans-serif" }}>
            Outfit Total
          </span>
          <span className="font-light" style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:"1.1rem", color:"#C9A86A", letterSpacing:"0.06em" }}>
            EGP {total.toLocaleString()}
          </span>
        </div>

        {/* Add to cart */}
        <motion.button
          type="button"
          onClick={() => onAddToCart(outfit.items)}
          whileHover={{ scale:1.015 }}
          whileTap={{ scale:0.985 }}
          className="relative flex min-h-[44px] min-w-[44px] w-full items-center justify-center gap-2 rounded-full py-3 font-light transition-all duration-400 overflow-hidden sm:gap-3"
          style={{
            background:"linear-gradient(135deg, rgba(201,168,106,0.20), rgba(201,168,106,0.07))",
            backdropFilter:"blur(16px)",
            border:"1px solid rgba(201,168,106,0.32)",
            boxShadow:"0 0 24px rgba(201,168,106,0.10), inset 0 1px 0 rgba(255,248,236,0.14)",
            color:"#C9A86A",
            fontSize:"10px",
            letterSpacing:"0.28em",
            fontFamily:"'Jost', sans-serif",
          }}
        >
          <div className="absolute inset-0 pointer-events-none"
               style={{ background:"linear-gradient(105deg, transparent 40%, rgba(255,248,236,0.07) 50%, transparent 60%)" }} />
          <ShoppingBag strokeWidth={1.3} className="w-3.5 h-3.5 relative z-10" />
          <span className="relative z-10 uppercase">Add Outfit to Cart</span>
        </motion.button>
      </div>
    </motion.div>
  );
}

/* ── Page ── */
const OCCASIONS = [
  { value:"formal",   label:"Formal" },
  { value:"business", label:"Business" },
  { value:"casual",   label:"Casual" },
  { value:"evening",  label:"Evening" },
];

const STYLES = [
  { value:"minimal", label:"Minimal" },
  { value:"classic", label:"Classic" },
  { value:"modern",  label:"Modern" },
  { value:"street",  label:"Street" },
];

function getColorValue(color: unknown): string {
  if (typeof color === "string") return color;
  if (typeof color === "object" && color !== null && "name" in color) {
    return String((color as { name?: unknown }).name ?? "");
  }
  return "";
}

export default function OutfitGeneratorPage() {
  const router = useRouter();
  const [occasion, setOccasion] = useState("formal");
  const [style, setStyle] = useState("minimal");
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function generate() {
    setLoading(true);
    setError("");
    setOutfits([]);
    try {
      const res = await fetch("/api/outfit-generate", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ occasion, style, season:"all" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Unable to generate outfits.");
      setOutfits(data.outfits || []);
    } catch (requestError) {
      setOutfits([]);
      setError(requestError instanceof Error ? requestError.message : "Unable to generate outfits.");
    } finally {
      setLoading(false);
    }
  }

  async function addOutfitToCart(items: Product[]) {
    setError("");

    const itemNeedingVariant = items.find((product) => {
      const sizes = Array.isArray(product.size) ? product.size : [];
      const colors = Array.isArray(product.colors) ? product.colors : [];
      return sizes.length > 1 || colors.length > 1;
    });

    if (itemNeedingVariant) {
      setError(`${itemNeedingVariant.name} needs a size or color choice. Open the product page to add it with variants.`);
      return;
    }

    try {
      for (const p of items) {
        const res = await fetch("/api/cart", {
          method:"POST",
          headers:{"Content-Type":"application/json"},
          body: JSON.stringify({
            productId:p._id,
            quantity:1,
            size: Array.isArray(p.size) && p.size.length === 1 ? p.size[0] : "One Size",
            color: Array.isArray(p.colors) && p.colors.length === 1 ? getColorValue(p.colors[0]) : "Default",
          }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data?.error || "Unable to add outfit to cart.");
        }
      }
      window.dispatchEvent(new Event("cart:changed"));
      router.push("/cart");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to add outfit to cart.");
    }
  }

  return (
    <>
      <style>{`
        body { background: #0A0908; }
        ::selection { background: #C9A86A; color: #0A0908; }
      `}</style>

      <main className="relative min-h-screen bg-[#0A0908] px-4 pb-16 pt-16 text-white sm:px-6 sm:pb-24 sm:pt-24 md:px-10 md:pb-32"
            style={{ fontFamily:"'Jost', sans-serif" }}>

        <div className="relative z-10 max-w-6xl mx-auto">

          {/* ── HEADER ── */}
          <motion.div
            initial={{ opacity:0, y:20 }}
            animate={{ opacity:1, y:0 }}
            transition={{ duration:0.8 }}
            className="mb-6 sm:mb-8 md:mb-10"
          >
            <p className="text-white/20 text-[9px] tracking-[0.45em] uppercase mb-4">Curated Styling</p>
            <div className="flex items-end gap-4 flex-wrap justify-between">
              <h1
                className="font-light text-white leading-none"
                style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:"clamp(2.5rem, 6vw, 4.5rem)", letterSpacing:"0.04em" }}
              >
                Outfit <em style={{ color:"#C9A86A", fontStyle:"italic" }}>Generator</em>
              </h1>
              <span
                className="inline-flex min-h-[44px] min-w-[44px] items-center gap-2 px-4 py-2 rounded-full"
                style={{
                  background:"linear-gradient(135deg, rgba(201,168,106,0.12), rgba(201,168,106,0.04))",
                  border:"1px solid rgba(201,168,106,0.20)",
                  backdropFilter:"blur(14px)",
                }}
              >
                <Sparkles strokeWidth={1.3} className="w-3 h-3" style={{ color:"#C9A86A" }} />
                <span className="text-[#C9A86A] text-[9px] tracking-[0.3em] uppercase font-light">Curated Picks</span>
              </span>
            </div>
            <div className="mt-5 h-px"
                 style={{ background:"linear-gradient(90deg, rgba(201,168,106,0.4), transparent)" }} />
          </motion.div>

          {/* ── CONTROLS ── */}
          <motion.div
            initial={{ opacity:0, y:16 }}
            animate={{ opacity:1, y:0 }}
            transition={{ duration:0.8, delay:0.1 }}
            className="relative mb-6 overflow-hidden rounded-3xl p-5 sm:mb-8 sm:p-8 md:mb-10"
            style={{
              background:"linear-gradient(135deg, rgba(255,248,236,0.07) 0%, rgba(255,248,236,0.02) 100%)",
              backdropFilter:"blur(24px) saturate(160%)",
              border:"1px solid rgba(255,248,236,0.09)",
              boxShadow:"0 20px 56px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,248,236,0.13)",
            }}
          >
            {/* Specular */}
            <div className="absolute inset-x-6 top-0 h-px pointer-events-none"
                 style={{ background:"linear-gradient(90deg, transparent, rgba(255,248,236,0.18), transparent)" }} />

            <p className="text-white/20 text-[9px] tracking-[0.35em] uppercase mb-6"
               style={{ fontFamily:"'Jost', sans-serif" }}>
              Configure Your Look
            </p>

            <div className="mb-6 grid gap-4 sm:mb-8 sm:grid-cols-2 sm:gap-6">
              <GlassSelect
                label="Occasion"
                value={occasion}
                onChange={setOccasion}
                options={OCCASIONS}
              />
              <GlassSelect
                label="Style"
                value={style}
                onChange={setStyle}
                options={STYLES}
              />
            </div>

            <motion.button
              type="button"
              onClick={generate}
              disabled={loading}
              whileHover={{ scale:1.015 }}
              whileTap={{ scale:0.985 }}
              className="relative overflow-hidden inline-flex items-center gap-3 px-9 py-4 rounded-full font-light disabled:opacity-45 transition-all duration-400"
              style={{
                background:"linear-gradient(135deg, rgba(201,168,106,0.22), rgba(201,168,106,0.08))",
                backdropFilter:"blur(16px)",
                border:"1px solid rgba(201,168,106,0.35)",
                boxShadow:"0 0 28px rgba(201,168,106,0.12), inset 0 1px 0 rgba(255,248,236,0.16)",
                color:"#C9A86A",
                fontSize:"10px",
                letterSpacing:"0.32em",
                fontFamily:"'Jost', sans-serif",
              }}
            >
              <div className="absolute inset-0 pointer-events-none"
                   style={{ background:"linear-gradient(105deg, transparent 40%, rgba(255,248,236,0.08) 50%, transparent 60%)" }} />
              {loading ? (
                <>
                  <motion.span
                    animate={{ rotate:360 }}
                    transition={{ repeat:Infinity, duration:1.2, ease:"linear" }}
                    className="relative z-10"
                  >
                    <Sparkles strokeWidth={1.3} className="w-3.5 h-3.5" />
                  </motion.span>
                  <span className="relative z-10 uppercase">Generating…</span>
                </>
              ) : (
                <>
                  <Sparkles strokeWidth={1.3} className="relative z-10 w-3.5 h-3.5" />
                  <span className="relative z-10 uppercase">Generate 3 Outfits</span>
                  <ArrowRight strokeWidth={1.3} className="relative z-10 w-3.5 h-3.5" />
                </>
              )}
            </motion.button>
          </motion.div>

          {/* ── Loading shimmer ── */}
          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity:0 }}
                animate={{ opacity:1 }}
                exit={{ opacity:0 }}
                className="grid md:grid-cols-3 gap-6"
              >
                {[0,1,2].map((i) => (
                  <div key={i} className="rounded-2xl overflow-hidden h-96 relative"
                       style={{ background:"rgba(255,248,236,0.04)", border:"1px solid rgba(255,248,236,0.06)" }}>
                    <motion.div
                      animate={{ x:["-100%","100%"] }}
                      transition={{ repeat:Infinity, duration:1.8, delay: i * 0.2, ease:"easeInOut" }}
                      className="absolute inset-0"
                      style={{ background:"linear-gradient(90deg, transparent, rgba(255,248,236,0.04), transparent)" }}
                    />
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {error && !loading && (
            <motion.div
              initial={{ opacity:0, y:8 }}
              animate={{ opacity:1, y:0 }}
              className="mb-6 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-red-100/70"
            >
              <p className="text-[10px] uppercase tracking-[0.25em]">{error}</p>
            </motion.div>
          )}

          {/* ── Outfit cards ── */}
          <AnimatePresence>
            {outfits.length > 0 && (
              <motion.div
                initial={{ opacity:0 }}
                animate={{ opacity:1 }}
                className="grid md:grid-cols-3 gap-6"
              >
                {outfits.map((outfit, i) => (
                  <OutfitCard
                    key={i}
                    outfit={outfit}
                    index={i}
                    onAddToCart={addOutfitToCart}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </main>
    </>
  );
}
