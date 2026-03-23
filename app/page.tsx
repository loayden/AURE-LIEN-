"use client";

import ProductCard from "@/components/ProductCard";
import products from "@/lib/productsData";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import {
  ChevronDown,
  Grid,
  Heart,
  List,
  Search,
  SlidersHorizontal,
  Sparkles,
  X,
  ArrowRight,
  Check,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

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

const COLLECTION_HIGHLIGHTS = [
  {
    title: "Women's Edit",
    image: "/uploads/main.jpg",
    link: "/collection?category=jacket-coats",
  },
  {
    title: "Men's Selection",
    image: "/uploads/Knitwear.jpg",
    link: "/collection?category=jacket-coats",
  },
  {
    title: "Accessories",
    image: "/uploads/accessories.jpg",
    link: "/collection?category=accessories",
  },
  {
    title: "Curated Finds",
    image: "/uploads/collections.jpg",
    link: "/collection?category=jacket-coats",
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
          width: "min(340px, 78vw)",
          height: "min(340px, 78vw)",
          top: "-18%",
          right: "-15%",
          background: "radial-gradient(circle, rgba(198,169,98,0.07) 0%, transparent 65%)",
          filter: "blur(90px)",
        }}
      />
      <motion.div
        animate={{ opacity: [0.03, 0.06, 0.03] }}
        transition={{ duration: 10, repeat: Infinity }}
        style={{
          position: "absolute",
          width: "min(260px, 55vw)",
          height: "min(260px, 55vw)",
          bottom: "5%",
          left: "-15%",
          background: "radial-gradient(circle, rgba(150,140,220,0.05) 0%, transparent 65%)",
          filter: "blur(80px)",
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
  const sortMenuRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (!sortOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!sortMenuRef.current?.contains(event.target as Node)) {
        setSortOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSortOpen(false);
      }
    };

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [sortOpen]);

  return (
    <>
      <style>{`
        * { --gold: #C6A962; --dark: #080808; }
        body { background: var(--dark); }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
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

        .sort-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          width: min(220px, calc(100vw - 32px));
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
        .sort-dropdown::-webkit-scrollbar {
          width: 6px;
        }
        .sort-dropdown::-webkit-scrollbar-track {
          background: transparent;
        }
        .sort-dropdown::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.12);
          border-radius: 999px;
        }

        input::placeholder { font-size: 16px; }
        @media (min-width: 641px) {
          input::placeholder { font-size: clamp(12px, 1.2vw, 14px); }
        }

        @media (max-width: 640px) {
          .sort-dropdown {
            right: auto;
            left: 50%;
            transform: translateX(-50%);
          }
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

        {/* ── MAIN HERO SECTION ── */}
        <section
          ref={heroRef}
          className="relative min-h-[60vh] sm:min-h-[75vh] md:min-h-[85vh] flex items-center pt-16 sm:pt-24 md:pt-32 pb-10 sm:pb-20 md:pb-24 px-4 sm:px-6 md:px-10 overflow-hidden"
        >
          {/* Video Background */}
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            style={{ zIndex: 0 }}
          >
            <source src="/uploads/0316 (3).mp4" type="video/mp4" />
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
            <div className="sh1 mb-3 sm:mb-5 md:mb-8 flex justify-center">
              <span className="glass inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-[8px] sm:text-[9px] text-white/45 tracking-[0.34em] uppercase font-light min-h-[44px] justify-center">
                <Sparkles size={13} />
                {products.length} Curated Pieces
              </span>
            </div>

            <h1
              className="sh2 font-light text-white leading-tight mb-3 sm:mb-5 md:mb-8"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(1.8rem, 7vw, 4.5rem)",
                letterSpacing: "0.02em",
              }}
            >
              Elevate Your Boutique.
              <br />
              <em style={{ color: "#C6A962", fontStyle: "italic" }}>Reach Beyond.</em>
            </h1>

            <p
              className="sh3 text-white/40 font-light max-w-2xl mx-auto leading-relaxed"
              style={{
                fontSize: "clamp(11px, 3vw, 16px)",
                letterSpacing: "0.04em",
              }}
            >
              A curated luxury platform that amplifies independent boutiques through
              seamless digital presence—connecting your carefully curated collections to
              discerning customers worldwide.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="mt-6 sm:mt-8 md:mt-10 flex flex-col gap-2 sm:gap-3 sm:flex-row sm:items-center sm:justify-center"
            >
              <button
                onClick={() => router.push("/collection")}
                aria-label="Explore collections"
                className="gold-glass px-5 sm:px-7 md:px-9 py-3 sm:py-3.5 rounded-full text-white/90 text-[10px] sm:text-[11px] tracking-[0.2em] uppercase font-light hover:text-white transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center gap-2 group w-full sm:w-auto"
              >
                Explore Collections
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => router.push("/login")}
                aria-label="Join as a partner"
                className="glass px-5 sm:px-7 md:px-9 py-3 sm:py-3.5 rounded-full text-white/70 text-[10px] sm:text-[11px] tracking-[0.2em] uppercase font-light hover:text-white transition-colors min-h-[44px] min-w-[44px] w-full sm:w-auto"
              >
                Join as a Partner
              </button>
            </motion.div>
          </motion.div>
        </section>

        {/* ── SECTION DIVIDER ── */}
        <div
          className="relative z-10 mx-auto px-4 sm:px-6 md:px-10 mb-6 sm:mb-8 md:mb-10 h-px max-w-7xl"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(198,169,98,0.18), transparent)",
          }}
        />

        {/* ── VALUE PROPOSITION ── */}
        <section className="relative z-10 px-4 sm:px-6 md:px-10 mb-6 sm:mb-8 md:mb-10">
          <motion.div
            initial={false}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-6 sm:mb-8 md:mb-10 max-w-7xl mx-auto"
          >
            <h2
              className="font-light text-white mb-2 sm:mb-3 md:mb-4"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(1.25rem, 5vw, 3rem)",
                letterSpacing: "0.02em",
              }}
            >
              Your Curated Vision.
              <br />
              <span style={{ color: "#C6A962" }}>Our Platform.</span> Unlimited Potential.
            </h2>
            <p
              className="text-white/35 font-light max-w-xl mx-auto"
              style={{
                fontSize: "clamp(11px, 2.5vw, 14px)",
                letterSpacing: "0.05em",
              }}
            >
              Partner with AURE-LIEN to extend your boutique's reach without the
              operational burden. We handle the complexity. You focus on curation.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-5 lg:gap-6 max-w-7xl mx-auto">
            {BENEFITS.map((benefit, i) => (
              <motion.div
                key={i}
                initial={false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.7 }}
                className="gold-glass rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6"
              >
                <h3
                  className="text-white font-light mb-2 sm:mb-3"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "clamp(1rem, 2.5vw, 1.3rem)",
                    letterSpacing: "0.02em",
                  }}
                >
                  {benefit.title}
                </h3>
                <p
                  className="text-white/40 leading-relaxed mb-3 sm:mb-4"
                  style={{
                    fontSize: "clamp(11px, 2vw, 13px)",
                    letterSpacing: "0.03em",
                  }}
                >
                  {benefit.description}
                </p>
                <ul className="space-y-2 sm:space-y-2.5">
                  {benefit.points.map((point, j) => (
                    <li
                      key={j}
                      className="flex items-start gap-2 text-[10px] sm:text-[11px] text-white/45 leading-relaxed"
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
        <section className="relative z-10 px-4 sm:px-6 md:px-10 mb-6 sm:mb-8 md:mb-10">
          <motion.h2
            initial={false}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center font-light text-white mb-6 sm:mb-8 md:mb-10 max-w-7xl mx-auto"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(1.25rem, 5vw, 3rem)",
              letterSpacing: "0.02em",
            }}
          >
            How It Works
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 max-w-7xl mx-auto">
            {STEPS.map((step, i) => (
              <motion.div
                key={i}
                initial={false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.7 }}
              >
                <div
                  className="font-light text-white/5 mb-2 sm:mb-3"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "clamp(3rem, 8vw, 5rem)",
                    letterSpacing: "0.05em",
                  }}
                >
                  {step.number}
                </div>
                <h3
                  className="text-white font-light mb-1 sm:mb-2"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "clamp(1.2rem, 3vw, 1.6rem)",
                    letterSpacing: "0.02em",
                  }}
                >
                  {step.title}
                </h3>
                <p
                  className="text-[#C6A962] uppercase font-light mb-2 sm:mb-3"
                  style={{
                    fontSize: "clamp(9px, 2vw, 11px)",
                    letterSpacing: "0.15em",
                  }}
                >
                  {step.subtitle}
                </p>
                <p
                  className="text-white/40 leading-relaxed"
                  style={{
                    fontSize: "clamp(11px, 2vw, 13px)",
                  }}
                >
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── COLLECTION HIGHLIGHTS ── */}
        <section className="px-4 sm:px-6 md:px-10 py-10 sm:py-14 md:py-18 relative z-10">
          <motion.div
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-6 sm:mb-8 md:mb-10 max-w-7xl mx-auto"
          >
            <p
              className="text-white/20 uppercase mb-2 sm:mb-3"
              style={{
                fontSize: "clamp(8px, 1.5vw, 9px)",
                letterSpacing: "0.45em",
              }}
            >
              Categories
            </p>
            <h2
              className="font-light text-white"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(1.25rem, 5vw, 2.8rem)",
                letterSpacing: "0.06em",
              }}
            >
              Explore the{" "}
              <em style={{ color: "#C6A962", fontStyle: "italic" }}>Collection</em>
            </h2>
            <div
              className="mt-3 sm:mt-4 mx-auto w-8 h-px"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(198,169,98,0.55), transparent)",
              }}
            />
          </motion.div>

          <div className="mx-auto grid max-w-7xl grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
            {COLLECTION_HIGHLIGHTS.map((item, i) => (
              <motion.div
                key={i}
                initial={false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: i * 0.08,
                  duration: 0.75,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <Link
                  href={item.link}
                  aria-label={`Browse ${item.title}`}
                  className="group block relative overflow-hidden min-h-[240px] sm:min-h-[300px] md:min-h-[340px] min-w-[44px]"
                  style={{
                    borderRadius: 16,
                    boxShadow:
                      "0 20px 50px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.06)",
                  }}
                >
                  <div className="relative w-full h-full overflow-hidden bg-white/5">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-[1.6s] ease-out group-hover:scale-105"
                      sizes="(max-width:640px) 50vw, (max-width:1024px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-transparent to-black/10 group-hover:from-black/55 transition-all duration-700" />
                  </div>
                  <div
                    className="absolute inset-x-2 top-0 h-px pointer-events-none sm:inset-x-3"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, rgba(255,255,255,0.14), transparent)",
                    }}
                  />
                  <div
                    className="absolute bottom-2 left-2 right-2 px-2.5 py-2 rounded-lg sm:bottom-3 sm:left-3 sm:right-3 sm:px-3 sm:py-2.5"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(255,255,255,0.11) 0%, rgba(255,255,255,0.03) 100%)",
                      backdropFilter: "blur(16px)",
                      border: "1px solid rgba(255,255,255,0.10)",
                    }}
                  >
                    <p
                      className="text-white/80 font-light tracking-[0.08em]"
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: "clamp(0.85rem, 2vw, 1rem)",
                      }}
                    >
                      {item.title}
                    </p>
                    <div
                      className="mt-1.5 h-px w-0 group-hover:w-full transition-all duration-500"
                      style={{
                        background:
                          "linear-gradient(90deg, rgba(198,169,98,0.7), transparent)",
                      }}
                    />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── FEATURED COLLECTIONS ── */}
        <section
          ref={shopRef}
          className="px-4 sm:px-6 md:px-10 relative z-10 mb-6 sm:mb-8 md:mb-10"
        >
          <div
            className="mb-6 sm:mb-8 md:mb-10 h-px max-w-7xl mx-auto"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(198,169,98,0.18), transparent)",
            }}
          />

          <motion.div
            initial={false}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-6 sm:mb-8 md:mb-10 max-w-7xl mx-auto"
          >
            <h2
              className="font-light text-white mb-2 sm:mb-3"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(1.25rem, 5vw, 3rem)",
                letterSpacing: "0.02em",
              }}
            >
              The Quiet
              <br />
              <em style={{ color: "#C6A962", fontStyle: "italic" }}>Luxury Edit</em>
            </h2>
            <p
              className="text-white/35 font-light max-w-xl mx-auto"
              style={{
                fontSize: "clamp(11px, 2.5vw, 14px)",
                letterSpacing: "0.05em",
              }}
            >
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
            className="mb-4 sm:mb-6 md:mb-8 max-w-7xl mx-auto"
          >
            <div className="glass-md flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl min-h-[44px]">
              <Search size={16} className="text-white/40 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search collections..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                aria-label="Search collections"
                className="bg-transparent flex-1 outline-none text-white placeholder-white/30 tracking-wide text-[16px] sm:text-sm"
              />
              {filters.search && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setFilters({ ...filters, search: "" })}
                  aria-label="Clear search"
                  className="text-white/40 hover:text-white/70 transition-colors flex-shrink-0 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg"
                >
                  <X size={16} />
                </motion.button>
              )}
            </div>
          </motion.div>

          {/* Controls */}
          <div className="flex flex-col gap-2 sm:gap-3 mb-6 sm:mb-8 md:mb-10 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 px-3 sm:px-4 py-3 rounded-xl sm:rounded-2xl glass-md">
              <div className="hidden sm:flex items-center gap-3 md:gap-4">
                <SlidersHorizontal
                  strokeWidth={1.3}
                  className="w-4 h-4 text-white/25 flex-shrink-0"
                />
                <div
                  className="w-px h-5"
                  style={{ background: "rgba(255,255,255,0.08)" }}
                />
                <span
                  className="text-white/30 tracking-[0.35em] uppercase flex-shrink-0"
                  style={{ fontSize: "clamp(9px, 1.5vw, 10px)" }}
                >
                  {sortedProducts.length} Results
                </span>
              </div>

              <div className="sm:hidden flex items-center justify-between w-full gap-2">
                <span
                  className="text-white/30 tracking-[0.35em] uppercase"
                  style={{ fontSize: "clamp(9px, 1.5vw, 10px)" }}
                >
                  {sortedProducts.length}
                </span>
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setViewMode("grid")}
                    aria-label="Switch to grid view"
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
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setViewMode("list")}
                    aria-label="Switch to list view"
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

              <div className="hidden sm:flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode("grid")}
                  aria-label="Switch to grid view"
                  className="p-2 sm:p-2.5 rounded-lg transition-all min-h-[44px] min-w-[44px] flex items-center justify-center"
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
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode("list")}
                  aria-label="Switch to list view"
                  className="p-2 sm:p-2.5 rounded-lg transition-all min-h-[44px] min-w-[44px] flex items-center justify-center"
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

              <div ref={sortMenuRef} className="relative w-full sm:w-auto">
                <button
                  onClick={() => setSortOpen(!sortOpen)}
                  aria-expanded={sortOpen}
                  aria-haspopup="listbox"
                  aria-label="Sort products"
                  className="w-full sm:w-auto flex items-center justify-between gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full transition-all duration-300 min-h-[44px] min-w-[44px]"
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
                    className="tracking-[0.28em] uppercase font-light"
                    style={{
                      fontSize: "clamp(9px, 1.5vw, 10px)",
                      color: sortOpen
                        ? "#C6A962"
                        : "rgba(255,255,255,0.55)",
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
                        color: sortOpen
                          ? "#C6A962"
                          : "rgba(255,255,255,0.35)",
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
                    role="listbox"
                    className="sort-dropdown"
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <div
                        key={opt.value}
                        role="option"
                        aria-selected={sort === opt.value}
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
              transition={{ delay: 0.1, duration: 0.6 }}
              className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide"
            >
              <span
                className="text-white/30 tracking-widest uppercase flex-shrink-0"
                style={{ fontSize: "clamp(8px, 1.5vw, 9px)" }}
              >
                Price:
              </span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilters({ ...filters, priceRange: null })}
                aria-label="Show all prices"
                className="px-2.5 sm:px-3 py-2 rounded-full uppercase font-light transition-all whitespace-nowrap flex-shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center"
                style={{
                  fontSize: "clamp(8px, 1.5vw, 9px)",
                  letterSpacing: "0.2em",
                  background:
                    filters.priceRange === null
                      ? "rgba(198,169,98,0.15)"
                      : "rgba(255,255,255,0.05)",
                  border:
                    filters.priceRange === null
                      ? "1px solid rgba(198,169,98,0.3)"
                      : "1px solid rgba(255,255,255,0.1)",
                  color:
                    filters.priceRange === null
                      ? "#C6A962"
                      : "rgba(255,255,255,0.4)",
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
                  aria-label={`Filter by ${range.label}`}
                  className="px-2 sm:px-2.5 py-2 rounded-full uppercase font-light transition-all whitespace-nowrap flex-shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center"
                  style={{
                    fontSize: "clamp(8px, 1.5vw, 9px)",
                    letterSpacing: "0.2em",
                    background:
                      filters.priceRange === i
                        ? "rgba(198,169,98,0.15)"
                        : "rgba(255,255,255,0.05)",
                    border:
                      filters.priceRange === i
                        ? "1px solid rgba(198,169,98,0.3)"
                        : "1px solid rgba(255,255,255,0.1)",
                    color:
                      filters.priceRange === i
                        ? "#C6A962"
                        : "rgba(255,255,255,0.4)",
                  }}
                >
                  {range.label.length > 18
                    ? `${range.label.split(" ")[0]} ${range.label.split(" ")[1]}`
                    : range.label}
                </motion.button>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── PRODUCT GRID / LIST ── */}
        <section className="relative z-10 px-4 sm:px-6 md:px-10 pb-10 sm:pb-16 md:pb-20">
          <div
            className="mb-4 sm:mb-6 md:mb-8 h-px max-w-7xl mx-auto"
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
                    ? "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6 max-w-7xl mx-auto"
                    : "space-y-2 sm:space-y-3 max-w-7xl mx-auto"
                }
              >
                {sortedProducts.map((product, i) => (
                  <motion.div
                    key={product._id}
                    initial={false}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: (i % (viewMode === "grid" ? 4 : 1)) * 0.05,
                      duration: 0.6,
                    }}
                    className={
                      viewMode === "list"
                        ? "glass-md rounded-xl sm:rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-start min-h-[120px]"
                        : ""
                    }
                  >
                    {viewMode === "list" && (
                      <div className="w-full sm:w-24 h-40 sm:h-24 rounded-lg glass flex-shrink-0 relative overflow-hidden bg-white/5">
                        {product.images?.[0] && (
                          <div className="w-full h-full" />
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
                        <div className="mt-2 sm:mt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3">
                          <div className="flex-1 min-w-0">
                            <p
                              className="text-white/70 leading-relaxed line-clamp-2"
                              style={{ fontSize: "clamp(11px, 2vw, 13px)" }}
                            >
                              {product.description}
                            </p>
                            <p
                              className="text-white font-light mt-1.5 sm:mt-2"
                              style={{
                                fontFamily: "'Cormorant Garamond', serif",
                                color: "#C6A962",
                                fontSize: "clamp(13px, 2.5vw, 16px)",
                              }}
                            >
                              EGP {product.price.toLocaleString()}
                            </p>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.12 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => toggleWishlist(String(product._id))}
                            aria-label={`Toggle wishlist for ${product.name}`}
                            className="p-2 sm:p-2.5 rounded-lg transition-all flex-shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center self-end sm:self-auto"
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
                className="py-12 sm:py-16 md:py-20 text-center max-w-7xl mx-auto"
              >
                <p
                  className="text-white/40 tracking-[0.1em] font-light mb-5 sm:mb-6"
                  style={{ fontSize: "clamp(12px, 2vw, 14px)" }}
                >
                  No pieces match your filters
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFilters({ priceRange: null, search: "" })}
                  aria-label="Clear all filters"
                  className="gold-glass px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 rounded-full text-white/80 uppercase font-light hover:text-white transition-colors min-h-[44px] min-w-[44px]"
                  style={{
                    fontSize: "clamp(9px, 1.5vw, 10px)",
                    letterSpacing: "0.2em",
                  }}
                >
                  Clear All Filters
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* ── FOOTER CTA ── */}
        <section className="relative z-10 px-4 sm:px-6 md:px-10 py-10 sm:py-14 md:py-18 text-center border-t border-white/10">
          <motion.div
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <h3
              className="font-light text-white mb-2 sm:mb-3 md:mb-4"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(1.25rem, 4vw, 2.4rem)",
                letterSpacing: "0.02em",
              }}
            >
              Ready to Elevate Your Reach?
            </h3>
            <p
              className="text-white/40 font-light max-w-xl mx-auto mb-6 sm:mb-8 md:mb-10"
              style={{
                fontSize: "clamp(11px, 2.5vw, 14px)",
                letterSpacing: "0.04em",
              }}
            >
              Your boutique deserves an audience that understands its value. Let's
              grow together.
            </p>
            <div className="flex flex-col gap-2 sm:gap-3 sm:flex-row sm:items-center sm:justify-center">
              <button
                onClick={() => router.push("/login")}
                aria-label="List your collection"
                className="gold-glass px-5 sm:px-8 md:px-10 py-3 sm:py-3.5 rounded-full text-white/90 uppercase font-light hover:text-white transition-colors min-h-[44px] min-w-[44px] w-full sm:w-auto"
                style={{
                  fontSize: "clamp(9px, 1.5vw, 11px)",
                  letterSpacing: "0.2em",
                }}
              >
                List Your Collection
              </button>
              <button
                onClick={() => router.push("/login")}
                aria-label="Contact us"
                className="glass px-5 sm:px-8 md:px-10 py-3 sm:py-3.5 rounded-full text-white/70 uppercase font-light hover:text-white transition-colors min-h-[44px] min-w-[44px] w-full sm:w-auto"
                style={{
                  fontSize: "clamp(9px, 1.5vw, 11px)",
                  letterSpacing: "0.2em",
                }}
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
