"use client";

import ProductCard from "@/components/ProductCard";
import products from "@/lib/productsData";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  ChevronDown,
  Grid,
  List, Search,
  SlidersHorizontal,
  Sparkles,
  X
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";

const SORT_OPTIONS = [
  { value: "default", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
];

const PRICE_RANGES = [
  { label: "Under 1,000 EGP", mobileLabel: "Under 1k", min: 0, max: 1000 },
  { label: "1,000 - 5,000 EGP", mobileLabel: "1k to 5k", min: 1000, max: 5000 },
  { label: "5,000 - 10,000 EGP", mobileLabel: "5k to 10k", min: 5000, max: 10000 },
  { label: "10,000+ EGP", mobileLabel: "10k+", min: 10000, max: Infinity },
];

function Orbs() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      <motion.div
        animate={{ opacity: [0.04, 0.08, 0.04] }}
        transition={{ duration: 8, repeat: Infinity }}
        style={{
          position: "absolute", width: 400, height: 400, top: "-18%", right: "-15%",
          background: "radial-gradient(circle, rgba(198,169,98,0.07) 0%, transparent 65%)",
          filter: "blur(100px)",
        }}
      />
      <motion.div
        animate={{ opacity: [0.03, 0.06, 0.03] }}
        transition={{ duration: 10, repeat: Infinity }}
        style={{
          position: "absolute", width: 300, height: 300, bottom: "5%", left: "-15%",
          background: "radial-gradient(circle, rgba(150,140,220,0.05) 0%, transparent 65%)",
          filter: "blur(90px)",
        }}
      />
    </div>
  );
}

interface FilterState {
  priceRange: number | null;
  search: string;
}

export default function EnhancedShopPage() {
  const router = useRouter();
  const [sort, setSort] = useState("default");
  const [sortOpen, setSortOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filters, setFilters] = useState<FilterState>({
    priceRange: null,
    search: "",
  });
  const [filtersOpen, setFiltersOpen] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Price filter
    if (filters.priceRange !== null) {
      const range = PRICE_RANGES[filters.priceRange];
      result = result.filter((p) => p.price >= range.min && p.price <= range.max);
    }

    // Search filter
    if (filters.search) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        p.description?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    return result;
  }, [filters]);

  const sortedProducts = useMemo(() => {
    const arr = [...filteredProducts];
    if (sort === "price-low") arr.sort((a, b) => a.price - b.price);
    if (sort === "price-high") arr.sort((a, b) => b.price - a.price);
    return arr;
  }, [filteredProducts, sort]);

  const activeLabel = SORT_OPTIONS.find((o) => o.value === sort)?.label ?? "Featured";

  return (
    <>
      <style>{`
        * { --gold: #C6A962; --dark: #080808; }
        body { background: var(--dark); }

        @keyframes fadeUp {
          from { opacity:0; transform:translateY(20px); }
          to { opacity:1; transform:translateY(0); }
        }
        @keyframes slideIn {
          from { opacity:0; transform:translateX(-20px); }
          to { opacity:1; transform:translateX(0); }
        }

        .sh1 { animation: fadeUp 1s cubic-bezier(0.22,1,0.36,1) 0.15s both; }
        .sh2 { animation: fadeUp 1s cubic-bezier(0.22,1,0.36,1) 0.35s both; }
        .sh3 { animation: fadeUp 1s cubic-bezier(0.22,1,0.36,1) 0.55s both; }

        .glass {
          background: linear-gradient(135deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.03) 100%);
          backdrop-filter: blur(24px) saturate(160%);
          -webkit-backdrop-filter: blur(24px) saturate(160%);
          border: 1px solid rgba(255,255,255,0.10);
          box-shadow: 0 16px 48px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.16);
        }
        .glass-md {
          background: linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%);
          backdrop-filter: blur(20px) saturate(150%);
          -webkit-backdrop-filter: blur(20px) saturate(150%);
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow: 0 12px 36px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.10);
        }
        .gold-glass {
          background: linear-gradient(135deg, rgba(198,169,98,0.14) 0%, rgba(198,169,98,0.04) 100%);
          backdrop-filter: blur(20px) saturate(150%);
          -webkit-backdrop-filter: blur(20px) saturate(150%);
          border: 1px solid rgba(198,169,98,0.22);
          box-shadow: 0 8px 32px rgba(198,169,98,0.08), inset 0 1px 0 rgba(255,255,255,0.14);
        }

        .scrollbar-hide { scrollbar-width: none; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>

      <motion.main
        initial={false}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9 }}
        className="relative bg-[#080808] text-white min-h-screen"
        style={{ fontFamily: "'Jost', sans-serif" }}
      >
        <Orbs />

        {/* ── HERO HEADER (Mobile optimized) ── */}
        <section ref={heroRef} className="relative overflow-hidden px-4 pb-10 pt-16 sm:px-6 sm:pb-14 sm:pt-24 md:px-10 md:pb-24 md:pt-32">
          <div className="absolute inset-0 pointer-events-none"
               style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(198,169,98,0.06) 0%, transparent 60%)" }} />

          <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 text-center max-w-3xl mx-auto">
            <div className="sh1 mb-3 sm:mb-5 md:mb-7 flex justify-center">
              <span className="glass inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-[8px] sm:text-[9px] text-white/45 tracking-[0.34em] uppercase font-light">
                <Sparkles size={12} />
                {products.length} Curated Pieces
              </span>
            </div>

            <h1
              className="sh2 font-light text-white leading-none mb-3 sm:mb-4 md:mb-5"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(1.8rem, 7vw, 7rem)",
                letterSpacing: "0.04em",
              }}
            >
              The Quiet<br />
              <em style={{ color: "#C6A962", fontStyle: "italic" }}>Luxury Edit</em>
            </h1>

            <p className="sh3 text-white/35 font-light max-w-md mx-auto leading-relaxed text-[11px] sm:text-sm"
               style={{ letterSpacing: "0.08em" }}>
              Every piece crafted with meticulous care — timeless elegance, refined for the modern connoisseur.
            </p>
          </motion.div>
        </section>

        {/* ── TOOLBAR (Mobile optimized) ── */}
        <div className="relative z-10 mx-auto mb-6 max-w-7xl px-4 sm:mb-8 sm:px-6 md:mb-10 md:px-10">
          {/* Search bar */}
          <motion.div
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-4 sm:mb-5"
          >
            <div className="glass-md flex items-center gap-3 px-4 py-3 sm:py-3.5 rounded-2xl min-h-[44px]">
              <Search size={16} className="text-white/40 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="bg-transparent flex-1 outline-none text-white placeholder-white/30 text-sm tracking-wide"
              />
              {filters.search && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setFilters({ ...filters, search: "" })}
                  className="text-white/40 hover:text-white/70 transition-colors flex-shrink-0 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                  <X size={16} />
                </motion.button>
              )}
            </div>
          </motion.div>

          {/* Filters & Sort controls */}
          <div className="flex flex-col gap-4 sm:gap-0">
            {/* Main control bar */}
            <div className="flex flex-col gap-2 rounded-2xl px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:px-6 sm:py-4 glass-md">
              {/* Left — count (Hidden on mobile) */}
              <div className="hidden sm:flex items-center gap-4">
                <SlidersHorizontal strokeWidth={1.3} className="w-4 h-4 text-white/25" />
                <div className="w-px h-5" style={{ background: "rgba(255,255,255,0.08)" }} />
                <span className="text-white/30 text-[10px] tracking-[0.35em] uppercase">
                  {sortedProducts.length} Results
                </span>
              </div>

              {/* Mobile: Results count + controls row */}
              <div className="sm:hidden flex items-center justify-between w-full">
                <span className="text-white/30 text-[9px] tracking-[0.35em] uppercase">
                  {sortedProducts.length}
                </span>
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setViewMode("grid")}
                    className={`luxury-icon-toggle ${viewMode === "grid" ? "is-active" : ""}`}
                  >
                    <Grid size={16} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setViewMode("list")}
                    className={`luxury-icon-toggle ${viewMode === "list" ? "is-active" : ""}`}
                  >
                    <List size={16} />
                  </motion.button>
                </div>
              </div>

              {/* Tablet+: View mode and Sort */}
              <div className="hidden sm:flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode("grid")}
                  className={`luxury-icon-toggle ${viewMode === "grid" ? "is-active" : ""}`}
                >
                  <Grid size={16} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode("list")}
                  className={`luxury-icon-toggle ${viewMode === "list" ? "is-active" : ""}`}
                >
                  <List size={16} />
                </motion.button>
              </div>

              {/* Sort dropdown */}
              <div className="relative w-full sm:w-auto">
                <button
                  onClick={() => setSortOpen(!sortOpen)}
                  className={`luxury-sort-trigger w-full sm:w-auto ${sortOpen ? "is-open" : ""}`}
                >
                  <span className="luxury-sort-label">
                    {activeLabel}
                  </span>
                  <motion.span animate={{ rotate: sortOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                    <ChevronDown strokeWidth={1.3} className="luxury-sort-icon w-4 h-4" />
                  </motion.span>
                </button>

                {sortOpen && (
                  <motion.div
                    initial={false}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    role="listbox"
                    className="luxury-dropdown-panel mobile-centered"
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <div
                        key={opt.value}
                        role="option"
                        aria-selected={sort === opt.value}
                        className={`luxury-dropdown-option ${sort === opt.value ? "active" : ""}`}
                        onClick={() => { setSort(opt.value); setSortOpen(false); }}
                      >
                        {opt.label}
                      </div>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>

            {/* Price range filter pills */}
            <motion.div
              initial={false}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15, duration: 0.6 }}
              className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide"
            >
              <span className="text-white/30 text-[9px] tracking-widest uppercase flex-shrink-0">Price:</span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilters({ ...filters, priceRange: null })}
                className={`luxury-filter-pill ${filters.priceRange === null ? "is-active" : ""}`}
              >
                All
              </motion.button>
              {PRICE_RANGES.map((range, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFilters({ ...filters, priceRange: i })}
                  className={`luxury-filter-pill ${filters.priceRange === i ? "is-active" : ""}`}
                >
                  <span className="sm:hidden">{range.mobileLabel}</span>
                  <span className="hidden sm:inline">{range.label}</span>
                </motion.button>
              ))}
            </motion.div>
          </div>
        </div>

        {/* ── PRODUCT GRID / LIST (Mobile optimized) ── */}
        <section className="relative z-10 mx-auto max-w-7xl px-4 pb-24 sm:px-6 sm:pb-32 md:px-10">
          <div className="mb-6 sm:mb-8 md:mb-10 h-px"
               style={{ background: "linear-gradient(90deg, transparent, rgba(198,169,98,0.18), transparent)" }} />

          <AnimatePresence mode="wait">
            {sortedProducts.length > 0 ? (
              <motion.div
                key={viewMode}
                initial={false}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={viewMode === "grid" 
                  ? "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6"
                  : "space-y-3 sm:space-y-4"}
              >
                {sortedProducts.map((product, i) => (
                  <motion.div
                    key={product._id}
                    initial={false}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: (i % (viewMode === "grid" ? 4 : 1)) * 0.07, duration: 0.75 }}
                    className={viewMode === "list" ? "glass-md rounded-2xl p-4 sm:p-5 flex gap-4 sm:gap-5 items-start min-h-[120px]" : ""}
                  >
                    {viewMode === "list" && (
                      <div className="w-24 sm:w-28 h-24 sm:h-28 rounded-lg glass flex-shrink-0 relative overflow-hidden">
                        {product.images?.[0] && (
                          <div className="w-full h-full bg-white/5" />
                        )}
                      </div>
                    )}
                    <div className={viewMode === "list" ? "flex-1 min-w-0 flex flex-col justify-between" : ""}>
                      <ProductCard product={product} />
                      {viewMode === "list" && (
                        <div className="mt-3 sm:mt-4 flex items-end sm:items-center justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="text-white/70 text-[10px] sm:text-[11px] leading-relaxed line-clamp-2">{product.description}</p>
                            <p className="text-white font-light mt-2 text-sm sm:text-base" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#C6A962" }}>
                              EGP {product.price.toLocaleString()}
                            </p>
                          </div>
                          <motion.button
                            type="button"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => router.push(`/product/${encodeURIComponent(String(product._id))}`)}
                            aria-label={`View details for ${product.name}`}
                            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 rounded-full border border-white/10 px-4 py-3 text-[10px] uppercase tracking-[0.22em] text-white/72 transition-colors hover:text-white"
                            style={{
                              fontFamily: "'Jost', sans-serif",
                              background: "rgba(255,255,255,0.04)",
                            }}
                          >
                            Details
                            <ArrowRight strokeWidth={1.2} className="h-3.5 w-3.5" />
                          </motion.button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={false}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="py-20 sm:py-28 md:py-32 text-center"
              >
                <p className="text-white/40 text-sm sm:text-base tracking-[0.1em] font-light mb-6 sm:mb-8">No pieces match your filters</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFilters({ priceRange: null, search: "" })}
                  className="gold-glass px-6 sm:px-8 py-3 sm:py-3.5 rounded-full text-white/80 text-[10px] tracking-[0.2em] uppercase font-light hover:text-white transition-colors min-h-[44px]"
                >
                  Clear All Filters
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

      </motion.main>
    </>
  );
}
