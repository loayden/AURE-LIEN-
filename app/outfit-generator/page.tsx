"use client";

import type { Product } from "@/lib/types";
import { showToast } from "@/components/ToastProvider";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronDown, ShoppingBag, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Outfit = { name: string; items: Product[] };

const ink = "#3D3025";
const inkSoft = "#6F6254";
const inkMuted = "rgba(61,48,37,0.76)";
const warmLine = "rgba(123,103,82,0.18)";
const brass = "#7A581F";
const creamGlass = "linear-gradient(135deg, rgba(255,255,255,0.76) 0%, rgba(255,249,239,0.58) 100%)";
const creamPanelShadow = "0 18px 48px rgba(61,48,37,0.12), inset 0 1px 0 rgba(255,255,255,0.72)";

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
      <label className="text-[9px] tracking-[0.4em] uppercase"
             style={{ fontFamily:"'Jost', sans-serif", color: inkMuted }}>
        {label}
      </label>

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="relative flex min-h-[44px] min-w-[44px] items-center justify-between rounded-2xl px-4 py-3.5 text-left transition-all duration-300 sm:px-5"
        style={{
          background: creamGlass,
          backdropFilter:"blur(16px)",
          border: open ? "1px solid rgba(168,121,53,0.45)" : `1px solid ${warmLine}`,
          boxShadow: open ? "0 0 0 3px rgba(168,121,53,0.10), 0 12px 28px rgba(61,48,37,0.10)" : "0 8px 22px rgba(61,48,37,0.07)",
        }}
      >
        <span className="text-sm font-light tracking-wide"
              style={{ fontFamily:"'Jost', sans-serif", color: ink }}>
          {current?.label}
        </span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration:0.3 }}>
          <ChevronDown strokeWidth={1.3} className="w-4 h-4" style={{ color: inkSoft }} />
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
              background:"linear-gradient(160deg, rgba(255,255,255,0.96) 0%, rgba(255,249,239,0.98) 100%)",
              backdropFilter:"blur(32px) saturate(180%)",
              border:`1px solid ${warmLine}`,
              boxShadow:"0 24px 54px rgba(61,48,37,0.16), inset 0 1px 0 rgba(255,255,255,0.82)",
            }}
          >
            <div className="absolute inset-x-4 top-0 h-px pointer-events-none"
                 style={{ background:"linear-gradient(90deg, transparent, rgba(255,255,255,0.88), transparent)" }} />
            {options.map((opt, i) => (
              <li key={opt.value}>
                <button
                  type="button"
                  onClick={() => { onChange(opt.value); setOpen(false); }}
                  className="flex min-h-[44px] min-w-[44px] w-full items-center justify-between px-4 py-3 text-left transition-all duration-200 hover:bg-[rgba(168,121,53,0.08)] sm:px-5"
                  style={{
                    color: opt.value === value ? brass : "rgba(61,48,37,0.74)",
                    fontSize:"11px",
                    letterSpacing:"0.15em",
                    fontFamily:"'Jost', sans-serif",
                    fontWeight:300,
                  }}
                >
                  <span className="uppercase">{opt.label}</span>
                  {opt.value === value && (
                    <span className="w-1 h-1 rounded-full" style={{ background:"#A87935" }} />
                  )}
                </button>
                {i < options.length - 1 && (
                  <div className="mx-4 h-px" style={{ background:"rgba(123,103,82,0.12)" }} />
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
        background: creamGlass,
        backdropFilter:"blur(24px) saturate(160%)",
        border:`1px solid ${warmLine}`,
        boxShadow: creamPanelShadow,
      }}
    >
      {/* Specular top line */}
      <div className="absolute inset-x-5 top-0 h-px pointer-events-none"
           style={{ background:"linear-gradient(90deg, transparent, rgba(255,255,255,0.88), transparent)" }} />

      {/* Card header */}
      <div className="px-4 pb-4 pt-5 sm:px-6 sm:pt-6" style={{ borderBottom:"1px solid rgba(123,103,82,0.12)" }}>
        <div className="flex items-center gap-3 mb-1">
          <span className="text-[#A87935] text-[9px] tracking-[0.35em] uppercase font-light"
                style={{ fontFamily:"'Jost', sans-serif" }}>
            Look {String(index + 1).padStart(2, "0")}
          </span>
        </div>
        <h3
          className="font-light leading-tight"
          style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:"1.3rem", letterSpacing:"0.06em", color: ink }}
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
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(123,103,82,0.16)")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "transparent")}
          >
            {/* Thumbnail */}
            <div
              className="relative w-12 h-14 rounded-xl overflow-hidden flex-shrink-0"
              style={{ boxShadow:"0 8px 18px rgba(61,48,37,0.14)" }}
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
                     style={{ background:"rgba(255,255,255,0.44)" }}>
                  <span className="text-[8px]" style={{ color: inkMuted }}>—</span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="font-light truncate"
                 style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:"0.9rem", letterSpacing:"0.05em", color: ink }}>
                {p.name}
              </p>
              {p.category && (
                <p className="text-[8px] tracking-[0.25em] uppercase mt-0.5"
                   style={{ fontFamily:"'Jost', sans-serif", color: inkMuted }}>
                  {p.category}
                </p>
              )}
            </div>

            {/* Price */}
            <p className="text-xs font-light shrink-0"
               style={{ fontFamily:"'Cormorant Garamond', serif", letterSpacing:"0.06em", color: inkSoft }}>
              EGP {p.price?.toLocaleString()}
            </p>
          </Link>
        ))}
      </div>

      {/* Card footer */}
      <div className="flex flex-col gap-3 px-4 pb-5 pt-4 sm:px-6 sm:pb-6"
           style={{ borderTop:"1px solid rgba(123,103,82,0.12)" }}>
        {/* Total */}
        <div className="flex items-center justify-between">
          <span className="text-[9px] tracking-[0.3em] uppercase"
                style={{ fontFamily:"'Jost', sans-serif", color: inkMuted }}>
            Outfit Total
          </span>
          <span className="font-light" style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:"1.1rem", color:"#A87935", letterSpacing:"0.06em" }}>
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
            background:"linear-gradient(135deg, rgba(168,121,53,0.20), rgba(168,121,53,0.07))",
            backdropFilter:"blur(16px)",
            border:"1px solid rgba(168,121,53,0.32)",
            boxShadow:"0 12px 28px rgba(168,121,53,0.12), inset 0 1px 0 rgba(255,255,255,0.45)",
            color:"#A87935",
            fontSize:"10px",
            letterSpacing:"0.28em",
            fontFamily:"'Jost', sans-serif",
          }}
        >
          <div className="absolute inset-0 pointer-events-none"
               style={{ background:"linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.22) 50%, transparent 60%)" }} />
          <ShoppingBag strokeWidth={1.3} className="w-3.5 h-3.5 relative z-10" />
          <span className="relative z-10 uppercase">Add Outfit to Cart</span>
        </motion.button>
        <p className="text-center text-[9px] uppercase tracking-[0.22em]" style={{ color: inkMuted }}>
          Size and color are selected on product pages when required.
        </p>
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
      if (!res.ok) {
        throw new Error(data?.error || "Unable to curate outfits");
      }
      setOutfits(data.outfits || []);
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : "Unable to curate outfits";
      setOutfits([]);
      setError(message);
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  }

  async function addOutfitToCart(items: Product[]) {
    const needsVariantChoice = items.some(
      (item) => (item.size?.length ?? 0) > 0 || (item.colors?.length ?? 0) > 0
    );

    if (needsVariantChoice) {
      const message = "Open each product to choose size and color before adding the full look.";
      setError(message);
      showToast(message, "error");
      return;
    }

    try {
      for (const p of items) {
        const response = await fetch("/api/cart", {
          method:"POST",
          headers:{"Content-Type":"application/json"},
          body: JSON.stringify({ productId:p._id, quantity:1 }),
        });
        if (!response.ok) {
          throw new Error(`Unable to add ${p.name}`);
        }
      }
      window.dispatchEvent(new Event("cart:changed"));
      showToast("Outfit added to cart.", "success");
      router.push("/cart");
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : "Unable to add outfit";
      setError(message);
      showToast(message, "error");
    }
  }

  return (
    <>
      <style>{`
        body { background: #F5F1E8; }
        ::selection { background: #A87935; color: #F5F1E8; }
      `}</style>

      <main className="relative min-h-screen bg-[#F5F1E8] px-4 pb-16 pt-16 text-[#3D3025] sm:px-6 sm:pb-24 sm:pt-24 md:px-10 md:pb-32"
            style={{ fontFamily:"'Jost', sans-serif" }}>

        <div className="relative z-10 max-w-6xl mx-auto">

          {/* ── HEADER ── */}
          <motion.div
            initial={{ opacity:0, y:20 }}
            animate={{ opacity:1, y:0 }}
            transition={{ duration:0.8 }}
            className="mb-6 sm:mb-8 md:mb-10"
          >
            <p className="text-[9px] tracking-[0.45em] uppercase mb-4" style={{ color: inkMuted }}>Curated Styling</p>
            <div className="flex items-end gap-4 flex-wrap justify-between">
              <h1
                className="font-light leading-none"
                style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:"clamp(2.5rem, 6vw, 4.5rem)", letterSpacing:"0.04em", color: ink }}
              >
                Outfit <em style={{ color:brass, fontStyle:"italic" }}>Generator</em>
              </h1>
              <span
                className="inline-flex min-h-[44px] min-w-[44px] items-center gap-2 px-4 py-2 rounded-full"
                style={{
                  background:"linear-gradient(135deg, rgba(168,121,53,0.12), rgba(168,121,53,0.04))",
                  border:"1px solid rgba(168,121,53,0.20)",
                  backdropFilter:"blur(14px)",
                }}
              >
                <Sparkles strokeWidth={1.3} className="w-3 h-3" style={{ color:"#A87935" }} />
                <span className="text-[#A87935] text-[9px] tracking-[0.3em] uppercase font-light">Stylist Curated</span>
              </span>
            </div>
            <div className="mt-5 h-px"
                 style={{ background:"linear-gradient(90deg, rgba(168,121,53,0.4), transparent)" }} />
          </motion.div>

          {/* ── CONTROLS ── */}
          <motion.div
            initial={{ opacity:0, y:16 }}
            animate={{ opacity:1, y:0 }}
            transition={{ duration:0.8, delay:0.1 }}
            className="relative mb-6 overflow-hidden rounded-3xl p-5 sm:mb-8 sm:p-8 md:mb-10"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.76) 0%, rgba(255,249,239,0.54) 100%)",
              backdropFilter:"blur(24px) saturate(160%)",
              border:`1px solid ${warmLine}`,
              boxShadow: creamPanelShadow,
            }}
          >
            {/* Specular */}
            <div className="absolute inset-x-6 top-0 h-px pointer-events-none"
                 style={{ background:"linear-gradient(90deg, transparent, rgba(255,255,255,0.88), transparent)" }} />

            <p className="text-[9px] tracking-[0.35em] uppercase mb-6"
               style={{ fontFamily:"'Jost', sans-serif", color: inkMuted }}>
              Configure Your Look
            </p>
            {error ? (
              <div className="mb-5 rounded-2xl border border-red-300/20 bg-red-400/[0.06] px-4 py-3">
                <p className="text-[10px] uppercase tracking-[0.18em] text-red-700/75">{error}</p>
              </div>
            ) : null}

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
                background:"linear-gradient(135deg, rgba(168,121,53,0.22), rgba(168,121,53,0.08))",
                backdropFilter:"blur(16px)",
                border:"1px solid rgba(168,121,53,0.35)",
                boxShadow:"0 12px 28px rgba(168,121,53,0.12), inset 0 1px 0 rgba(255,255,255,0.45)",
                color:"#A87935",
                fontSize:"10px",
                letterSpacing:"0.32em",
                fontFamily:"'Jost', sans-serif",
              }}
            >
              <div className="absolute inset-0 pointer-events-none"
                   style={{ background:"linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.22) 50%, transparent 60%)" }} />
              {loading ? (
                <>
                  <motion.span
                    animate={{ rotate:360 }}
                    transition={{ repeat:Infinity, duration:1.2, ease:"linear" }}
                    className="relative z-10"
                  >
                    <Sparkles strokeWidth={1.3} className="w-3.5 h-3.5" />
                  </motion.span>
                  <span className="relative z-10 uppercase">Curating…</span>
                </>
              ) : (
                <>
                  <Sparkles strokeWidth={1.3} className="relative z-10 w-3.5 h-3.5" />
                  <span className="relative z-10 uppercase">Build 3 Looks</span>
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
                       style={{ background:"rgba(255,255,255,0.38)", border:"1px solid rgba(123,103,82,0.12)" }}>
                    <motion.div
                      animate={{ x:["-100%","100%"] }}
                      transition={{ repeat:Infinity, duration:1.8, delay: i * 0.2, ease:"easeInOut" }}
                      className="absolute inset-0"
                      style={{ background:"linear-gradient(90deg, transparent, rgba(255,255,255,0.56), transparent)" }}
                    />
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

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
