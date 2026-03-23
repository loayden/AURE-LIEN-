"use client";

import ProductCard from "@/components/ProductCard";
import products from "@/lib/productsData";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Grid,
  Heart,
  List,
  Search,
  SlidersHorizontal,
  Sparkles,
  X,
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
  { label: "Under 1,000 EGP", min: 0, max: 1000 },
  { label: "1,000 - 5,000 EGP", min: 1000, max: 5000 },
  { label: "5,000 - 10,000 EGP", min: 5000, max: 10000 },
  { label: "10,000+ EGP", min: 10000, max: Infinity },
];

const BENEFITS = [
  {
    title: "Visibility Without Compromise",
    description: "Reach discerning customers searching for exclusive pieces. Position your boutique as a premium destination.",
    points: ["Global audience of luxury-conscious shoppers", "Premium brand positioning", "Editorial curation and storytelling"],
  },
  {
    title: "Seamless Integration",
    description: "No inventory management headaches. List once, sell across our network.",
    points: ["Simple product submission", "Real-time inventory sync", "Automatic order fulfillment"],
  },
  {
    title: "Complete Control",
    description: "Your collection stays yours. You set pricing. You approve placement.",
    points: ["Full editorial control", "Pricing autonomy", "Your brand story, your way"],
  },
];

const STEPS = [
  {
    number: "01",
    title: "Curate",
    subtitle: "Your boutique. Your voice. Your vision.",
    description: "Tell us about your boutique. Share your philosophy, aesthetic, and most-loved pieces.",
  },
  {
    number: "02",
    title: "List",
    subtitle: "From your store to our platform in days, not months.",
    description: "Submit your curated collection. We handle photography and positioning. You maintain oversight.",
  },
  {
    number: "03",
    title: "Sell",
    subtitle: "Growth that feels effortless.",
    description: "Customers discover your pieces. Orders flow in. You fulfill them your way.",
  },
];

function Orbs() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      <motion.div
        animate={{ opacity: [0.04, 0.08, 0.04] }}
        transition={{ duration: 8, repeat: Infinity }}
        style={{
          position: "absolute",
          width: 400,
          height: 400,
          top: "-18%",
          right: "-15%",
          background: "radial-gradient(circle, rgba(198,169,98,0.07) 0%, transparent 65%)",
          filter: "blur(100px)",
        }}
      />
      <motion.div
        animate={{ opacity: [0.03, 0.06, 0.03] }}
        transition={{ duration: 10, repeat: Infinity }}
        style={{
          position: "absolute",
          width: 300,
          height: 300,
          bottom: "5%",
          left: "-15%",
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

export default function AureLienPlatform() {
  const router = useRouter();
  const [sort, setSort] = useState("default");
  const [sortOpen, setSortOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filters, setFilters] = useState<FilterState>({
    priceRange: null,
    search: "",
  });
  const [wishlist, setWishlist] = useState<string[]>([]);
  const heroRef = useRef<HTMLElement>(null);
  const shopRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  const filteredProducts = useMemo(() => {
    let result = [...products];
    if (filters.priceRange !== null) {
      const range = PRICE_RANGES[filters.priceRange];
      result = result.filter((p) => p.price >= range.min && p.price <= range.max);
    }
    if (filters.search) {
      result = result.filter(
        (p) =>
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
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((w) => w !== id) : [...prev, id]
    );
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@200;300;400;500&display=swap');
        * { --gold: #C6A962; --dark: #080808; }
        body { background: var(--dark); }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }

        .sh1 { animation: fadeUp 1s cubic-bezier(0.22,1,0.36,1) 0.15s both; }
        .sh2 { animation: fadeUp 1s cubic-bezier(0.22,1,0.36,1) 0.35s both; }
        .sh3 { animation: fadeUp 1s cubic-bezier(0.22,1,0.36,1) 0.55s both; }
        .sh4 { animation: fadeUp 1s cubic-bezier(0.22,1,0.36,1) 0.75s both; }

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

        .sort-dropdown {
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
        .sort-option {
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
        .sort-option:last-child { border-bottom: none; }
        .sort-option:hover { background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.85); }
        .sort-option.active { color: var(--gold); background: rgba(198,169,98,0.07); }

        .scrollbar-hide { scrollbar-width: none; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }

        @media (max-width: 640px) {
          .sort-dropdown {
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

        {/* ── MAIN HERO SECTION ── */}
        <section
          ref={heroRef}
          className="relative pt-16 sm:pt-24 md:pt-32 pb-16 sm:pb-20 md:pb-32 px-4 sm:px-6 overflow-hidden"
        >
          {/* Video Background */}
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              zIndex: 0,
            }}
          >
            <source
              src="/uploads/0316 (3).mp4"
              type="video/mp4"
            />
          </video>

          {/* Dark overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 50% 0%, rgba(198,169,98,0.06) 0%, transparent 60%), linear-gradient(180deg, rgba(8,8,8,0.4) 0%, rgba(8,8,8,0.7) 100%)",
              zIndex: 1,
            }}
          />

          <motion.div
            style={{ y: heroY, opacity: heroOpacity }}
            className="relative z-20 text-center max-w-4xl mx-auto"
          >
            <div className="sh1 mb-4 sm:mb-6 md:mb-8 flex justify-center">
              <span className="glass inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full text-[8px] sm:text-[9px] text-white/45 tracking-[0.34em] uppercase font-light">
                <Sparkles size={13} />
                Luxury Platform for Boutiques
              </span>
            </div>

            <h1
              className="sh2 font-light text-white leading-tight mb-4 sm:mb-6 md:mb-8"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(2.2rem, 8vw, 7.5rem)",
                letterSpacing: "0.02em",
              }}
            >
              Elevate Your Boutique.
              <br />
              <em style={{ color: "#C6A962", fontStyle: "italic" }}>
                Reach Beyond.
              </em>
            </h1>

            <p
              className="sh3 text-white/40 font-light max-w-2xl mx-auto leading-relaxed text-[12px] sm:text-base"
              style={{ letterSpacing: "0.04em" }}
            >
              A curated luxury platform that amplifies independent boutiques through
              seamless digital presence—connecting your carefully curated collections to
              discerning customers worldwide.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="mt-8 sm:mt-10 md:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5"
            >
              <button
                onClick={() => router.push("/collection")}
                className="gold-glass px-7 sm:px-9 py-3.5 sm:py-4 rounded-full text-white/90 text-[10px] sm:text-[11px] tracking-[0.2em] uppercase font-light hover:text-white transition-colors min-h-[48px] flex items-center gap-2 group"
              >
                Explore Collections
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => router.push("/login")}
                className="glass px-7 sm:px-9 py-3.5 sm:py-4 rounded-full text-white/70 text-[10px] sm:text-[11px] tracking-[0.2em] uppercase font-light hover:text-white transition-colors min-h-[48px]"
              >
                Join as a Partner
              </button>
            </motion.div>
          </motion.div>
        </section>

        {/* ── SECTION DIVIDER ── */}
        <div
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 mb-20 sm:mb-28 md:mb-36 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(198,169,98,0.18), transparent)",
          }}
        />

        {/* ── VALUE PROPOSITION ── */}
        <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 mb-20 sm:mb-28 md:mb-36">
          <motion.div
            initial={false}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 sm:mb-16 md:mb-20"
          >
            <h2
              className="font-light text-white mb-3 sm:mb-4"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(2rem, 6vw, 4.5rem)",
                letterSpacing: "0.02em",
              }}
            >
              Your Curated Vision.
              <br />
              <span style={{ color: "#C6A962" }}>Our Platform.</span> Unlimited Potential.
            </h2>
            <p className="text-white/35 font-light max-w-xl mx-auto text-[11px] sm:text-sm"
               style={{ letterSpacing: "0.05em" }}>
              Partner with AURE-LIEN to extend your boutique's reach without the
              operational burden. We handle the complexity. You focus on curation.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7 md:gap-8">
            {BENEFITS.map((benefit, i) => (
              <motion.div
                key={i}
                initial={false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.7 }}
                className="gold-glass rounded-2xl p-6 sm:p-7 md:p-8"
              >
                <h3 className="text-white font-light mb-2 sm:mb-3"
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "clamp(1.1rem, 3vw, 1.4rem)",
                      letterSpacing: "0.02em",
                    }}>
                  {benefit.title}
                </h3>
                <p className="text-white/40 text-[11px] sm:text-xs leading-relaxed mb-5 sm:mb-6"
                   style={{ letterSpacing: "0.03em" }}>
                  {benefit.description}
                </p>
                <ul className="space-y-2.5 sm:space-y-3">
                  {benefit.points.map((point, j) => (
                    <li
                      key={j}
                      className="flex items-start gap-2.5 text-[10px] sm:text-[11px] text-white/45 leading-relaxed"
                    >
                      <Check size={14} className="text-[#C6A962] flex-shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 mb-20 sm:mb-28 md:mb-36">
          <motion.h2
            initial={false}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center font-light text-white mb-16 sm:mb-20 md:mb-24"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(2rem, 6vw, 4.5rem)",
              letterSpacing: "0.02em",
            }}
          >
            How It Works
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 md:gap-12 relative">
            {STEPS.map((step, i) => (
              <motion.div
                key={i}
                initial={false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, duration: 0.7 }}
              >
                <div className="relative">
                  <div
                    className="text-6xl sm:text-7xl font-light text-white/5 mb-4 sm:mb-6"
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {step.number}
                  </div>
                  <h3
                    className="text-white font-light mb-2 sm:mb-3"
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "clamp(1.3rem, 4vw, 1.8rem)",
                      letterSpacing: "0.02em",
                    }}
                  >
                    {step.title}
                  </h3>
                  <p
                    className="text-[#C6A962] text-[10px] sm:text-[11px] tracking-[0.15em] uppercase font-light mb-3 sm:mb-4"
                  >
                    {step.subtitle}
                  </p>
                  <p className="text-white/40 text-[11px] sm:text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

{/* ── FEATURED COLLECTIONS ── */}
        <section
          ref={shopRef}
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 mb-12 sm:mb-16 md:mb-20"
        >
          <div
            className="mb-12 sm:mb-16 md:mb-20 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(198,169,98,0.18), transparent)",
            }}
          />

          <motion.div
            initial={false}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-14 md:mb-16"
          >
            <h2
              className="font-light text-white mb-3 sm:mb-4"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(2rem, 6vw, 4.5rem)",
                letterSpacing: "0.02em",
              }}
            >
              The Quiet
              <br />
              <em style={{ color: "#C6A962", fontStyle: "italic" }}>Luxury Edit</em>
            </h2>
            <p className="text-white/35 font-light max-w-xl mx-auto text-[11px] sm:text-sm"
               style={{ letterSpacing: "0.05em" }}>
              Every piece crafted with meticulous care — timeless elegance, refined
              for the modern connoisseur.
            </p>
          </motion.div>

          {/* Search bar */}
          <motion.div
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-6 sm:mb-8"
          >
            <div className="glass-md flex items-center gap-3 px-4 py-3 sm:py-3.5 rounded-2xl min-h-[44px]">
              <Search size={16} className="text-white/40 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search collections..."
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

          {/* Controls */}
          <div className="flex flex-col gap-4 sm:gap-0 mb-8 sm:mb-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 px-3 sm:px-6 py-3 sm:py-4 rounded-2xl glass-md">
              <div className="hidden sm:flex items-center gap-4">
                <SlidersHorizontal
                  strokeWidth={1.3}
                  className="w-4 h-4 text-white/25"
                />
                <div
                  className="w-px h-5"
                  style={{ background: "rgba(255,255,255,0.08)" }}
                />
                <span className="text-white/30 text-[10px] tracking-[0.35em] uppercase">
                  {sortedProducts.length} Results
                </span>
              </div>

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
                    style={
                      viewMode === "grid"
                        ? {
                            background: "rgba(198,169,98,0.15)",
                            border: "1px solid rgba(198,169,98,0.3)",
                            color: "#C6A962",
                          }
                        : {
                            background: "rgba(255,255,255,0.05)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            color: "rgba(255,255,255,0.4)",
                          }
                    }
                  >
                    <Grid size={16} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setViewMode("list")}
                    className="p-2 rounded-lg transition-all min-h-[44px] min-w-[44px] flex items-center justify-center"
                    style={
                      viewMode === "list"
                        ? {
                            background: "rgba(198,169,98,0.15)",
                            border: "1px solid rgba(198,169,98,0.3)",
                            color: "#C6A962",
                          }
                        : {
                            background: "rgba(255,255,255,0.05)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            color: "rgba(255,255,255,0.4)",
                          }
                    }
                  >
                    <List size={16} />
                  </motion.button>
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode("grid")}
                  className="p-2.5 rounded-lg transition-all"
                  style={
                    viewMode === "grid"
                      ? {
                          background: "rgba(198,169,98,0.15)",
                          border: "1px solid rgba(198,169,98,0.3)",
                          color: "#C6A962",
                        }
                      : {
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          color: "rgba(255,255,255,0.4)",
                        }
                  }
                >
                  <Grid size={16} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode("list")}
                  className="p-2.5 rounded-lg transition-all"
                  style={
                    viewMode === "list"
                      ? {
                          background: "rgba(198,169,98,0.15)",
                          border: "1px solid rgba(198,169,98,0.3)",
                          color: "#C6A962",
                        }
                      : {
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          color: "rgba(255,255,255,0.4)",
                        }
                  }
                >
                  <List size={16} />
                </motion.button>
              </div>

              <div className="relative w-full sm:w-auto">
                <button
                  onClick={() => setSortOpen(!sortOpen)}
                  className="w-full sm:w-auto flex items-center justify-between sm:justify-center gap-2 px-4 sm:px-5 py-3 sm:py-2.5 rounded-full transition-all duration-300 min-h-[44px]"
                  style={
                    sortOpen
                      ? {
                          background:
                            "linear-gradient(135deg, rgba(198,169,98,0.14), rgba(198,169,98,0.05))",
                          border: "1px solid rgba(198,169,98,0.25)",
                          backdropFilter: "blur(16px)",
                        }
                      : {
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.09)",
                          backdropFilter: "blur(16px)",
                        }
                  }
                >
                  <span
                    className="text-[9px] sm:text-[10px] tracking-[0.28em] uppercase font-light"
                    style={{
                      color: sortOpen ? "#C6A962" : "rgba(255,255,255,0.55)",
                    }}
                  >
                    {activeLabel}
                  </span>
                  <motion.span
                    animate={{ rotate: sortOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown
                      strokeWidth={1.3}
                      className="w-4 h-4"
                      style={{
                        color: sortOpen ? "#C6A962" : "rgba(255,255,255,0.35)",
                      }}
                    />
                  </motion.span>
                </button>

                {sortOpen && (
                  <motion.div
                    initial={false}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{
                      duration: 0.25,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="sort-dropdown"
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <div
                        key={opt.value}
                        className={`sort-option ${sort === opt.value ? "active" : ""}`}
                        onClick={() => {
                          setSort(opt.value);
                          setSortOpen(false);
                        }}
                      >
                        {opt.label}
                      </div>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>

            {/* Price filters */}
            <motion.div
              initial={false}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15, duration: 0.6 }}
              className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide"
            >
              <span className="text-white/30 text-[9px] tracking-widest uppercase flex-shrink-0">
                Price:
              </span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilters({ ...filters, priceRange: null })}
                className="px-3 py-2 rounded-full text-[9px] tracking-[0.2em] uppercase font-light transition-all whitespace-nowrap flex-shrink-0 min-h-[36px]"
                style={
                  filters.priceRange === null
                    ? {
                        background: "rgba(198,169,98,0.15)",
                        border: "1px solid rgba(198,169,98,0.3)",
                        color: "#C6A962",
                      }
                    : {
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        color: "rgba(255,255,255,0.4)",
                      }
                }
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
                  style={
                    filters.priceRange === i
                      ? {
                          background: "rgba(198,169,98,0.15)",
                          border: "1px solid rgba(198,169,98,0.3)",
                          color: "#C6A962",
                        }
                      : {
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          color: "rgba(255,255,255,0.4)",
                        }
                  }
                >
                  {range.label.length > 20
                    ? `${range.label.split(" ")[0]} ${range.label.split(" ")[1]}`
                    : range.label}
                </motion.button>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── PRODUCT GRID / LIST ── */}
        <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-24 sm:pb-32">
          <div
            className="mb-6 sm:mb-8 md:mb-10 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(198,169,98,0.18), transparent)",
            }}
          />

          <AnimatePresence mode="wait">
            {sortedProducts.length > 0 ? (
              <motion.div
                key={viewMode}
                initial={false}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6"
                    : "space-y-3 sm:space-y-4"
                }
              >
                {sortedProducts.map((product, i) => (
                  <motion.div
                    key={product._id}
                    initial={false}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: (i % (viewMode === "grid" ? 4 : 1)) * 0.07,
                      duration: 0.75,
                    }}
                    className={
                      viewMode === "list"
                        ? "glass-md rounded-2xl p-4 sm:p-5 flex gap-4 sm:gap-5 items-start min-h-[120px]"
                        : ""
                    }
                  >
                    {viewMode === "list" && (
                      <div className="w-24 sm:w-28 h-24 sm:h-28 rounded-lg glass flex-shrink-0 relative overflow-hidden">
                        {product.images?.[0] && (
                          <div className="w-full h-full bg-white/5" />
                        )}
                      </div>
                    )}
                    <div
                      className={
                        viewMode === "list"
                          ? "flex-1 min-w-0 flex flex-col justify-between"
                          : ""
                      }
                    >
                      <ProductCard product={product} />
                      {viewMode === "list" && (
                        <div className="mt-3 sm:mt-4 flex items-end sm:items-center justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="text-white/70 text-[10px] sm:text-[11px] leading-relaxed line-clamp-2">
                              {product.description}
                            </p>
                            <p
                              className="text-white font-light mt-2 text-sm sm:text-base"
                              style={{
                                fontFamily: "'Cormorant Garamond', serif",
                                color: "#C6A962",
                              }}
                            >
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
                              className={
                                wishlist.includes(String(product._id))
                                  ? "fill-red-400 text-red-400"
                                  : "text-white/40"
                              }
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
                <p className="text-white/40 text-sm sm:text-base tracking-[0.1em] font-light mb-6 sm:mb-8">
                  No pieces match your filters
                </p>
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

        {/* ── FOOTER CTA ── */}
        <section className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-20 md:py-24 text-center border-t border-white/10">
          <motion.div
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h3
              className="font-light text-white mb-4 sm:mb-5"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(1.8rem, 5vw, 3.5rem)",
                letterSpacing: "0.02em",
              }}
            >
              Ready to Elevate Your Reach?
            </h3>
            <p className="text-white/40 font-light max-w-xl mx-auto mb-8 sm:mb-10 text-[11px] sm:text-sm"
               style={{ letterSpacing: "0.04em" }}>
              Your boutique deserves an audience that understands its value. Let's
              grow together.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5">
              <button
                onClick={() => router.push("/login")}
                className="gold-glass px-8 sm:px-10 py-4 sm:py-4 rounded-full text-white/90 text-[10px] sm:text-[11px] tracking-[0.2em] uppercase font-light hover:text-white transition-colors min-h-[48px] w-full sm:w-auto"
              >
                List Your Collection
              </button>
              <button
                onClick={() => router.push("/login")}
                className="glass px-8 sm:px-10 py-4 sm:py-4 rounded-full text-white/70 text-[10px] sm:text-[11px] tracking-[0.2em] uppercase font-light hover:text-white transition-colors min-h-[48px] w-full sm:w-auto"
              >
                Contact Us
              </button>
            </div>
          </motion.div>
        </section>
      </motion.main>
    </>
  );
}
