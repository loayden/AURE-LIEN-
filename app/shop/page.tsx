"use client";

import ProductCard from "@/components/ProductCard";
import products from "@/lib/productsData";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import {
  ChevronDown,
  Grid,
  Heart,
  List, Search,
  SlidersHorizontal,
  Sparkles,
  X
} from "lucide-react";
import { useMemo, useRef, useState } from "react";

const SORT_OPTIONS = [
  { value: "default", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
];

const PRICE_RANGES = [
  { label: "Under 1,000 EGP", min: 0, max: 1000 },
  { label: "1,000 - 5,000 EGP", min: 1000, max: 5000 },
  { label: "5,000 - 10,000 EGP", min: 5000, max: 10000 },
  { label: "10,000+ EGP", min: 10000, max: Infinity },
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
  const [sort, setSort] = useState("default");
  const [sortOpen, setSortOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filters, setFilters] = useState<FilterState>({
    priceRange: null,
    search: "",
  });
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);
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
  const toggleWishlist = (id: string) => {
    setWishlist((prev) => prev.includes(id) ? prev.filter((w) => w !== id) : [...prev, id]);
  };

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

        .sort-dropdown, .filter-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          min-width: 200px;
          z-index: 50;
          background: linear-gradient(135deg, rgba(18,18,20,0.95) 0%, rgba(10,10,12,0.98) 100%);
          backdrop-filter: blur(28px) saturate(160%);
          -webkit-backdrop-filter: blur(28px) saturate(160%);
          border: 1px solid rgba(255,255,255,0.10);
          box-shadow: 0 24px 60px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.10);
          border-radius: 16px;
          overflow: hidden;
          max-height: 400px;
          overflow-y: auto;
        }
        .sort-option, .filter-option {
          padding: 12px 16px;
          font-size: 10px;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          font-family: 'Jost', sans-serif;
          font-weight: 300;
          color: rgba(255,255,255,0.5);
          cursor: pointer;
          transition: all 0.25s;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          min-height: 44px;
          display: flex;
          align-items: center;
        }
        .sort-option:last-child, .filter-option:last-child { border-bottom: none; }
        .sort-option:hover, .filter-option:hover { background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.85); }
        .sort-option.active, .filter-option.active { color: var(--gold); background: rgba(198,169,98,0.07); }

        .sort-dropdown::-webkit-scrollbar, .filter-dropdown::-webkit-scrollbar {
          width: 6px;
        }
        .sort-dropdown::-webkit-scrollbar-track, .filter-dropdown::-webkit-scrollbar-track {
          background: transparent;
        }
        .sort-dropdown::-webkit-scrollbar-thumb, .filter-dropdown::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.1);
          border-radius: 3px;
        }

        .scrollbar-hide { scrollbar-width: none; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }

        @media (max-width: 640px) {
          .sort-dropdown, .filter-dropdown {
            right: -50%;
            transform: translateX(50%);
            min-width: 220px;
          }
        }
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
                    className="p-2 rounded-lg transition-all min-h-[44px] min-w-[44px] flex items-center justify-center"
                    style={viewMode === "grid" ? {
                      background: "rgba(198,169,98,0.15)",
                      border: "1px solid rgba(198,169,98,0.3)",
                      color: "#C6A962",
                    } : {
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "rgba(255,255,255,0.4)",
                    }}
                  >
                    <Grid size={16} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setViewMode("list")}
                    className="p-2 rounded-lg transition-all min-h-[44px] min-w-[44px] flex items-center justify-center"
                    style={viewMode === "list" ? {
                      background: "rgba(198,169,98,0.15)",
                      border: "1px solid rgba(198,169,98,0.3)",
                      color: "#C6A962",
                    } : {
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "rgba(255,255,255,0.4)",
                    }}
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
                  className="p-2.5 rounded-lg transition-all"
                  style={viewMode === "grid" ? {
                    background: "rgba(198,169,98,0.15)",
                    border: "1px solid rgba(198,169,98,0.3)",
                    color: "#C6A962",
                  } : {
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "rgba(255,255,255,0.4)",
                  }}
                >
                  <Grid size={16} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode("list")}
                  className="p-2.5 rounded-lg transition-all"
                  style={viewMode === "list" ? {
                    background: "rgba(198,169,98,0.15)",
                    border: "1px solid rgba(198,169,98,0.3)",
                    color: "#C6A962",
                  } : {
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "rgba(255,255,255,0.4)",
                  }}
                >
                  <List size={16} />
                </motion.button>
              </div>

              {/* Sort dropdown */}
              <div className="relative w-full sm:w-auto">
                <button
                  onClick={() => setSortOpen(!sortOpen)}
                  className="w-full sm:w-auto flex items-center justify-between sm:justify-center gap-2 px-4 sm:px-5 py-3 sm:py-2.5 rounded-full transition-all duration-300 min-h-[44px]"
                  style={sortOpen ? {
                    background: "linear-gradient(135deg, rgba(198,169,98,0.14), rgba(198,169,98,0.05))",
                    border: "1px solid rgba(198,169,98,0.25)",
                    backdropFilter: "blur(16px)",
                  } : {
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.09)",
                    backdropFilter: "blur(16px)",
                  }}
                >
                  <span className="text-[9px] sm:text-[10px] tracking-[0.28em] uppercase font-light"
                        style={{ color: sortOpen ? "#C6A962" : "rgba(255,255,255,0.55)" }}>
                    {activeLabel}
                  </span>
                  <motion.span animate={{ rotate: sortOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                    <ChevronDown strokeWidth={1.3} className="w-4 h-4"
                                 style={{ color: sortOpen ? "#C6A962" : "rgba(255,255,255,0.35)" }} />
                  </motion.span>
                </button>

                {sortOpen && (
                  <motion.div
                    initial={false}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className="sort-dropdown"
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <div
                        key={opt.value}
                        className={`sort-option ${sort === opt.value ? "active" : ""}`}
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
                className="px-3 py-2 rounded-full text-[9px] tracking-[0.2em] uppercase font-light transition-all whitespace-nowrap flex-shrink-0 min-h-[36px]"
                style={filters.priceRange === null ? {
                  background: "rgba(198,169,98,0.15)",
                  border: "1px solid rgba(198,169,98,0.3)",
                  color: "#C6A962",
                } : {
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "rgba(255,255,255,0.4)",
                }}
              >
                All
              </motion.button>
              {PRICE_RANGES.map((range, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFilters({ ...filters, priceRange: i })}
                  className="px-2.5 sm:px-3 py-2 rounded-full text-[8px] sm:text-[9px] tracking-[0.2em] uppercase font-light transition-all whitespace-nowrap flex-shrink-0 min-h-[36px]"
                  style={filters.priceRange === i ? {
                    background: "rgba(198,169,98,0.15)",
                    border: "1px solid rgba(198,169,98,0.3)",
                    color: "#C6A962",
                  } : {
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "rgba(255,255,255,0.4)",
                  }}
                >
                  {range.label.length > 20 ? `${range.label.split(' ')[0]} ${range.label.split(' ')[1]}` : range.label}
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
                            whileHover={{ scale: 1.15 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => toggleWishlist(String(product._id))}
                            className="p-2.5 sm:p-3 rounded-full transition-all flex-shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center"
                            style={{
                              background: wishlist.includes(String(product._id))
                                ? "rgba(255,80,80,0.15)"
                                : "rgba(255,255,255,0.05)",
                              border: wishlist.includes(String(product._id))
                                ? "1px solid rgba(255,100,100,0.3)"
                                : "1px solid rgba(255,255,255,0.1)",
                            }}
                          >
                            <Heart
                              size={18}
                              className={wishlist.includes(String(product._id)) ? "fill-red-400 text-red-400" : "text-white/40"}
                            />
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
