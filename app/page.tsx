"use client";

import ProductCard from "@/components/ProductCard";
import products from "@/lib/productsData";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import {
  ChevronDown,
  Grid,
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
  { label: "Under 1,000 EGP", mobileLabel: "Under 1k", min: 0, max: 1000 },
  { label: "1,000 - 5,000 EGP", mobileLabel: "1k to 5k", min: 1000, max: 5000 },
  { label: "5,000 - 10,000 EGP", mobileLabel: "5k to 10k", min: 5000, max: 10000 },
  { label: "10,000+ EGP", mobileLabel: "10k+", min: 10000, max: Infinity },
];

const BENEFITS = [
  {
    title: "Luxury Presence, Preserved",
    description:
      "Your boutique appears in a composed setting designed to elevate perception.",
    points: [
      "Editorial discovery",
      "Calmer product context",
      "Brand voice preserved",
    ],
  },
  {
    title: "Growth With Restraint",
    description:
      "Reach the right client without diluting tone, selectivity, or price confidence.",
    points: [
      "Selective exposure",
      "Better audience fit",
      "Considered shopping rhythm",
    ],
  },
  {
    title: "Operational Calm",
    description:
      "Reduce friction for both your team and your clients from onboarding to order flow.",
    points: [
      "Simpler partner onboarding",
      "Clear fulfilment flow",
      "Less manual work",
    ],
  },
];

const STEPS = [
  {
    number: "01",
    title: "Align",
    subtitle: "Your point of view comes first.",
    description:
      "We define the brand direction, assortment focus, and client experience first.",
  },
  {
    number: "02",
    title: "Present",
    subtitle: "A cleaner digital expression of your boutique.",
    description:
      "Your collection is translated into a cleaner, more refined digital presentation.",
  },
  {
    number: "03",
    title: "Grow",
    subtitle: "Reach expands without diluting identity.",
    description:
      "Clients discover the collection in a clearer setting and move through a smoother purchase path.",
  },
];

const PLATFORM_PERSPECTIVES = [
  {
    label: "Refined Discovery",
    title: "A calmer environment for premium product.",
    description:
      "A quieter product stage where material, cut, and story carry the weight.",
  },
  {
    label: "Selective Context",
    title: "Positioning that supports perceived value.",
    description:
      "Collections sit in aligned company and within the right tone.",
  },
  {
    label: "Mobile Comfort",
    title: "Luxury browsing that still feels easy in the hand.",
    description:
      "Spacing and touch targets keep mobile browsing polished, readable, and relaxed.",
  },
];

const PLATFORM_EXPERIENCE_POINTS = [
  {
    title: "A more considered presence",
    description:
      "Collections appear in a calm, structured setting where each piece can stand on its own.",
  },
  {
    title: "Clarity in presentation",
    description:
      "Product layout and copy highlight value without overwhelming the viewer.",
  },
  {
    title: "Consistency in positioning",
    description:
      "From discovery to checkout, the tone stays aligned with your in-store standard.",
  },
];

const PARTNERSHIP_STANDARDS = [
  {
    label: "Editorial Positioning",
    title: "A premium brand environment from the first impression.",
    description:
      "Your collection is shown with refined storytelling and disciplined visual direction.",
  },
  {
    label: "Selective Curation",
    title: "Every placement supports quality, coherence, and trust.",
    description:
      "We focus on alignment over volume so every placement supports a clear luxury point of view.",
  },
  {
    label: "Operational Ease",
    title: "A lighter workflow for boutiques with higher expectations.",
    description:
      "The system reduces manual friction so your team can focus on product and client relationships.",
  },
  {
    label: "Client Experience",
    title: "Service that feels consistent with the products you sell.",
    description:
      "Customers browse in a calm environment built to support confidence and intent.",
  },
];

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
        .home-hero-shell {
          isolation: isolate;
          background: #080808;
        }
        .home-hero-shell::after {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 1;
          background:
            radial-gradient(ellipse at 50% 0%, rgba(198,169,98,0.08) 0%, transparent 55%),
            linear-gradient(180deg, rgba(8,8,8,0.35) 0%, rgba(8,8,8,0.78) 100%);
        }

        input::placeholder { font-size: 16px; }
        @media (min-width: 641px) {
          input::placeholder { font-size: clamp(12px, 1.2vw, 14px); }
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

        {/* ── MAIN HERO SECTION ── */}
        <section
          ref={heroRef}
          className="home-hero-shell relative flex min-h-[72vh] items-center overflow-hidden px-4 pb-12 pt-14 sm:min-h-[82vh] sm:px-6 sm:pb-20 sm:pt-[4.5rem] md:min-h-[92vh] md:px-10 md:pb-28 md:pt-24"
        >
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

          <motion.div
            style={{ y: heroY, opacity: heroOpacity }}
            className="relative z-20 w-full max-w-5xl mx-auto"
          >
            <div className="text-center max-w-3xl mx-auto">
              <div className="sh1 mb-4 sm:mb-5 md:mb-8 flex justify-center">
                <span className="glass inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-[8px] sm:text-[9px] text-white/50 tracking-[0.32em] uppercase font-light min-h-[44px] justify-center">
                  <Sparkles size={13} />
                  Boutique Platform For Independent Luxury
                </span>
              </div>

              <h1
                className="sh2 font-light text-white leading-[0.95] mb-4 sm:mb-5 md:mb-7"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(2.2rem, 8vw, 5.6rem)",
                  letterSpacing: "0.02em",
                }}
              >
                Luxury Reach,
                <br />
                <em style={{ color: "#C6A962", fontStyle: "italic" }}>
                  Without Marketplace Noise.
                </em>
              </h1>

              <p
                className="sh3 mx-auto max-w-xl font-light leading-relaxed text-white/62"
                style={{
                  fontSize: "clamp(10px, 2.5vw, 14px)",
                  letterSpacing: "0.03em",
                }}
              >
                AURE-LIEN gives independent boutiques a calmer, more selective digital
                presence built for stronger presentation and easier mobile discovery.
              </p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="mt-6 sm:mt-8 md:mt-10 flex flex-col gap-2.5 sm:gap-3 sm:flex-row sm:items-center sm:justify-center"
              >
                <button
                  onClick={() => router.push("/collection")}
                  aria-label="Explore collections"
                  className="gold-glass px-5 sm:px-7 md:px-9 py-3 sm:py-3.5 rounded-full text-white/90 text-[10px] sm:text-[11px] tracking-[0.18em] uppercase font-light hover:text-white transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center gap-2 group w-full sm:w-auto"
                >
                  Explore Collections
                  <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => router.push("/login")}
                  aria-label="Join as a partner"
                  className="glass px-5 sm:px-7 md:px-9 py-3 sm:py-3.5 rounded-full text-white/72 text-[10px] sm:text-[11px] tracking-[0.18em] uppercase font-light hover:text-white transition-colors min-h-[44px] min-w-[44px] w-full sm:w-auto"
                >
                  Become A Partner
                </button>
              </motion.div>
            </div>

          </motion.div>
        </section>

        <div
          className="relative z-10 mx-auto px-4 sm:px-6 md:px-10 mb-8 sm:mb-10 md:mb-12 h-px max-w-7xl"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(198,169,98,0.18), transparent)",
          }}
        />

        <section className="relative z-10 px-4 sm:px-6 md:px-10 mb-8 sm:mb-10 md:mb-14">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-4 sm:gap-5 lg:gap-8 items-start">
            <motion.div
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.75 }}
              className="glass-md rounded-[26px] sm:rounded-[32px] p-5 sm:p-7 md:p-10"
            >
              <p
                className="text-white/52 uppercase mb-3 sm:mb-4"
                style={{
                  fontSize: "clamp(8px, 1.5vw, 9px)",
                  letterSpacing: "0.34em",
                }}
              >
                Platform Perspective
              </p>
              <h2
                className="font-light text-white mb-4 sm:mb-5 md:mb-6"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(1.6rem, 5vw, 3.2rem)",
                  letterSpacing: "0.02em",
                  lineHeight: 0.98,
                }}
              >
                Digital growth should feel as refined as the in-store experience.
              </h2>
              <p
                className="text-white/62 leading-relaxed mb-4 sm:mb-5"
                style={{
                  fontSize: "clamp(11px, 2.2vw, 14px)",
                  letterSpacing: "0.025em",
                }}
              >
                AURE-LIEN gives premium boutiques a quieter digital stage for product,
                material, and brand point of view.
              </p>
              <p
                className="text-white/58 leading-relaxed"
                style={{
                  fontSize: "clamp(10px, 2vw, 13px)",
                  letterSpacing: "0.025em",
                }}
              >
                On mobile, the experience stays readable, spacious, and intentional.
              </p>
            </motion.div>

            <div className="space-y-3 sm:space-y-4">
              {PLATFORM_PERSPECTIVES.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={false}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.65 }}
                  className="gold-glass rounded-2xl p-4 sm:p-5 md:p-6"
                >
                  <p
                    className="text-[#C6A962] uppercase mb-2"
                    style={{
                      fontSize: "clamp(8px, 1.4vw, 9px)",
                      letterSpacing: "0.26em",
                    }}
                  >
                    {item.label}
                  </p>
                  <h3
                    className="text-white font-light mb-2.5 sm:mb-3"
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "clamp(1.05rem, 2.8vw, 1.45rem)",
                      letterSpacing: "0.02em",
                      lineHeight: 1.08,
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="text-white/58 leading-relaxed"
                    style={{
                      fontSize: "clamp(10px, 1.9vw, 12px)",
                      letterSpacing: "0.025em",
                    }}
                  >
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── VALUE PROPOSITION ── */}
        <section className="relative z-10 px-4 sm:px-6 md:px-10 mb-8 sm:mb-10 md:mb-14">
          <motion.div
            initial={false}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-6 sm:mb-8 md:mb-10 max-w-7xl mx-auto"
          >
            <p
              className="text-white/48 uppercase mb-2 sm:mb-3"
              style={{
                fontSize: "clamp(8px, 1.5vw, 9px)",
                letterSpacing: "0.4em",
              }}
            >
              What The Platform Delivers
            </p>
            <h2
              className="font-light text-white mb-2 sm:mb-3 md:mb-4"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(1.35rem, 5vw, 3rem)",
                letterSpacing: "0.02em",
              }}
            >
              A More Considered Way
              <br />
              To <span style={{ color: "#C6A962" }}>Expand Your Reach</span>
            </h2>
            <p
              className="text-white/58 font-light max-w-xl mx-auto"
              style={{
                fontSize: "clamp(10px, 2vw, 12px)",
                letterSpacing: "0.04em",
              }}
            >
              More visibility matters only when it comes with stronger positioning and a
              cleaner premium experience.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-5 lg:gap-6 max-w-7xl mx-auto">
            {BENEFITS.map((benefit, i) => (
              <motion.div
                key={benefit.title}
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
                    fontSize: "clamp(1.05rem, 2.5vw, 1.35rem)",
                    letterSpacing: "0.02em",
                  }}
                >
                  {benefit.title}
                </h3>
                <p
                  className="text-white/58 leading-relaxed mb-3 sm:mb-4"
                  style={{
                    fontSize: "clamp(11px, 2vw, 13px)",
                    letterSpacing: "0.03em",
                  }}
                >
                  {benefit.description}
                </p>
                <ul className="space-y-2 sm:space-y-2.5">
                  {benefit.points.map((point) => (
                    <li
                      key={point}
                      className="flex items-start gap-2 text-[10px] leading-relaxed text-white/62 sm:text-[11px]"
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
        <section className="relative z-10 px-4 sm:px-6 md:px-10 mb-8 sm:mb-10 md:mb-14">
          <motion.div
            initial={false}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-6 sm:mb-8 md:mb-10 max-w-7xl mx-auto"
          >
            <p
              className="text-white/48 uppercase mb-2 sm:mb-3"
              style={{
                fontSize: "clamp(8px, 1.5vw, 9px)",
                letterSpacing: "0.4em",
              }}
            >
              Partner Journey
            </p>
            <h2
              className="font-light text-white mb-3 sm:mb-4"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(1.3rem, 5vw, 3rem)",
                letterSpacing: "0.02em",
              }}
            >
              How The Partnership
              <br />
              <em style={{ color: "#C6A962", fontStyle: "italic" }}>Unfolds</em>
            </h2>
            <p
              className="text-white/58 font-light max-w-xl mx-auto"
              style={{
                fontSize: "clamp(10px, 2vw, 12px)",
                letterSpacing: "0.04em",
              }}
            >
              The path is simple: align the brand, shape the presentation, and support conversion cleanly.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 max-w-7xl mx-auto">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.number}
                initial={false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.7 }}
                className="glass-md rounded-2xl p-5 sm:p-6 md:p-7"
              >
                <div
                  className="font-light text-white/8 mb-3 sm:mb-4"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "clamp(3.2rem, 8vw, 5rem)",
                    letterSpacing: "0.05em",
                    lineHeight: 0.9,
                  }}
                >
                  {step.number}
                </div>
                <h3
                  className="text-white font-light mb-1.5 sm:mb-2"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "clamp(1.2rem, 3vw, 1.65rem)",
                    letterSpacing: "0.02em",
                  }}
                >
                  {step.title}
                </h3>
                <p
                  className="text-[#C6A962] uppercase font-light mb-3 sm:mb-4"
                  style={{
                    fontSize: "clamp(9px, 2vw, 11px)",
                    letterSpacing: "0.14em",
                  }}
                >
                  {step.subtitle}
                </p>
                <p
                  className="text-white/58 leading-relaxed"
                  style={{
                    fontSize: "clamp(11px, 2vw, 13px)",
                    letterSpacing: "0.02em",
                  }}
                >
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="px-4 sm:px-6 md:px-10 py-10 sm:py-14 md:py-18 relative z-10">
          <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-[0.92fr_1.08fr] gap-4 sm:gap-5 lg:gap-8 items-start">
            <motion.div
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.75 }}
              className="gold-glass rounded-[26px] sm:rounded-[32px] p-5 sm:p-7 md:p-10"
            >
              <p
                className="text-white/48 uppercase mb-3 sm:mb-4"
                style={{
                  fontSize: "clamp(8px, 1.5vw, 9px)",
                  letterSpacing: "0.36em",
                }}
              >
                Platform Experience
              </p>
              <h2
                className="font-light text-white mb-4 sm:mb-5"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(1.55rem, 5vw, 3rem)",
                  letterSpacing: "0.02em",
                  lineHeight: 1,
                }}
              >
                Designed for modern boutique growth.
              </h2>
              <p
                className="text-white/62 leading-relaxed mb-4 sm:mb-5"
                style={{
                  fontSize: "clamp(11px, 2.2vw, 14px)",
                  letterSpacing: "0.025em",
                }}
              >
                The platform translates the presence of your boutique into a refined
                digital experience with clarity, structure, and intention.
              </p>
              <p
                className="text-white/58 leading-relaxed"
                style={{
                  fontSize: "clamp(10px, 2vw, 12px)",
                  letterSpacing: "0.02em",
                }}
              >
                Visibility should support identity, not weaken it.
              </p>
            </motion.div>

            <div className="space-y-3 sm:space-y-4">
              {PLATFORM_EXPERIENCE_POINTS.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={false}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.65 }}
                  className="glass-md rounded-2xl p-4 sm:p-5 md:p-6"
                >
                  <div className="flex items-start gap-3">
                    <div className="gold-glass rounded-full p-2 min-h-[44px] min-w-[44px] flex items-center justify-center flex-shrink-0">
                      <Check size={16} className="text-[#C6A962]" />
                    </div>
                    <div>
                      <h3
                        className="text-white font-light mb-1.5 sm:mb-2"
                        style={{
                          fontFamily: "'Cormorant Garamond', serif",
                          fontSize: "clamp(1rem, 2.5vw, 1.35rem)",
                          letterSpacing: "0.02em",
                        }}
                      >
                        {item.title}
                      </h3>
                      <p
                        className="text-white/58 leading-relaxed"
                        style={{
                          fontSize: "clamp(11px, 2vw, 13px)",
                          letterSpacing: "0.025em",
                        }}
                      >
                        {item.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PARTNERSHIP STANDARDS ── */}
        <section className="px-4 sm:px-6 md:px-10 py-10 sm:py-14 md:py-18 relative z-10">
          <motion.div
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-6 sm:mb-8 md:mb-10 max-w-7xl mx-auto"
          >
            <p
              className="text-white/48 uppercase mb-2 sm:mb-3"
              style={{
                fontSize: "clamp(8px, 1.5vw, 9px)",
                letterSpacing: "0.45em",
              }}
            >
              Standards
            </p>
            <h2
              className="font-light text-white"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(1.25rem, 5vw, 2.8rem)",
                letterSpacing: "0.04em",
              }}
            >
              The AURE-LIEN{" "}
              <em style={{ color: "#C6A962", fontStyle: "italic" }}>Standard</em>
            </h2>
            <p
              className="mt-3 max-w-xl mx-auto text-white/58 font-light"
              style={{
                fontSize: "clamp(10px, 2vw, 12px)",
                letterSpacing: "0.04em",
              }}
            >
              Each layer is shaped to keep the partnership elevated, consistent, and commercially credible.
            </p>
            <div
              className="mt-3 sm:mt-4 mx-auto w-8 h-px"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(198,169,98,0.55), transparent)",
              }}
            />
          </motion.div>

          <div className="mx-auto grid max-w-7xl grid-cols-1 md:grid-cols-2 gap-3 sm:gap-5 lg:gap-6">
            {PARTNERSHIP_STANDARDS.map((item, i) => (
              <motion.div
                key={item.label}
                initial={false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: i * 0.08,
                  duration: 0.75,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="gold-glass rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6"
              >
                <div className="flex items-start justify-between gap-3 mb-5">
                  <span
                    className="inline-flex items-center rounded-full px-3 py-2 min-h-[44px] text-white/55 uppercase"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      fontSize: "clamp(8px, 1.5vw, 9px)",
                      letterSpacing: "0.24em",
                    }}
                  >
                    {item.label}
                  </span>
                  <div
                    className="h-px flex-1 self-center"
                    style={{
                      background:
                        "linear-gradient(90deg, rgba(198,169,98,0.35), transparent)",
                    }}
                  />
                </div>
                <h3
                  className="text-white font-light mb-3 sm:mb-4"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "clamp(1.05rem, 2.8vw, 1.5rem)",
                    letterSpacing: "0.03em",
                    lineHeight: 1.12,
                  }}
                >
                  {item.title}
                </h3>
                <p
                  className="text-white/58 leading-relaxed"
                  style={{
                    fontSize: "clamp(11px, 2vw, 13px)",
                    letterSpacing: "0.025em",
                  }}
                >
                  {item.description}
                </p>
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
            <p
              className="text-white/48 uppercase mb-2 sm:mb-3"
              style={{
                fontSize: "clamp(8px, 1.5vw, 9px)",
                letterSpacing: "0.42em",
              }}
            >
              Selected Pieces
            </p>
            <h2
              className="font-light text-white mb-2 sm:mb-3"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(1.25rem, 5vw, 3rem)",
                letterSpacing: "0.02em",
              }}
            >
              Discover The
              <br />
              <em style={{ color: "#C6A962", fontStyle: "italic" }}>
                Collection Experience
              </em>
            </h2>
            <p
              className="text-white/58 font-light max-w-xl mx-auto"
              style={{
                fontSize: "clamp(10px, 2vw, 12px)",
                letterSpacing: "0.04em",
              }}
            >
              A preview of calmer browsing, cleaner controls, and product-led presentation.
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
            <div className="glass-md flex items-center gap-3 px-4 py-3 sm:py-3.5 rounded-2xl min-h-[44px]">
              <Search size={16} className="text-white/60 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search pieces, silhouettes, or details..."
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
                  className="flex min-h-[44px] min-w-[44px] flex-shrink-0 items-center justify-center rounded-lg p-2 text-white/72 transition-colors hover:text-white"
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
                  className="h-4 w-4 flex-shrink-0 text-white/52"
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
                    className={`luxury-icon-toggle ${viewMode === "grid" ? "is-active" : ""}`}
                  >
                    <Grid size={16} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setViewMode("list")}
                    aria-label="Switch to list view"
                    className={`luxury-icon-toggle ${viewMode === "list" ? "is-active" : ""}`}
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
                  className={`luxury-icon-toggle ${viewMode === "grid" ? "is-active" : ""}`}
                >
                  <Grid size={16} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode("list")}
                  aria-label="Switch to list view"
                  className={`luxury-icon-toggle ${viewMode === "list" ? "is-active" : ""}`}
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
                  className={`luxury-sort-trigger w-full sm:w-auto ${sortOpen ? "is-open" : ""}`}
                >
                  <span className="luxury-sort-label">
                    {activeLabel}
                  </span>
                  <motion.span
                    animate={{ rotate: sortOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown
                      strokeWidth={1.3}
                      className="luxury-sort-icon w-4 h-4"
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
                    className="luxury-dropdown-panel mobile-centered"
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <div
                        key={opt.value}
                        role="option"
                        aria-selected={sort === opt.value}
                        className={`luxury-dropdown-option ${sort === opt.value ? "active" : ""}`}
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
                  aria-label={`Filter by ${range.label}`}
                  className={`luxury-filter-pill ${filters.priceRange === i ? "is-active" : ""}`}
                >
                  <span className="sm:hidden">{range.mobileLabel}</span>
                  <span className="hidden sm:inline">{range.label}</span>
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
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6 max-w-7xl mx-auto"
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
                            type="button"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => router.push(`/product/${encodeURIComponent(String(product._id))}`)}
                            aria-label={`View details for ${product.name}`}
                            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 self-end rounded-full border border-white/10 px-4 py-3 text-[10px] uppercase tracking-[0.22em] text-white/72 transition-colors hover:text-white sm:self-auto"
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
                className="py-12 sm:py-16 md:py-20 text-center max-w-7xl mx-auto"
              >
                <p
                  className="mb-5 text-white/60 tracking-[0.1em] font-light sm:mb-6"
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
              If The Collection Is Distinctive,
              <br />
              The Platform Should Be Too.
            </h3>
            <p
              className="mx-auto mb-6 max-w-2xl font-light text-white/60 sm:mb-8 md:mb-10"
              style={{
                fontSize: "clamp(11px, 2.5vw, 14px)",
                letterSpacing: "0.04em",
              }}
            >
              AURE-LIEN is intended for boutiques that want growth to feel aligned with
              their identity: selective, elevated, and easier for clients to navigate on
              every screen.
            </p>
            <div className="flex flex-col gap-2 sm:gap-3 sm:flex-row sm:items-center sm:justify-center">
              <button
                onClick={() => router.push("/login")}
                aria-label="List your collection"
                className="gold-glass px-5 sm:px-8 md:px-10 py-3 sm:py-3.5 rounded-full text-white/90 uppercase font-light hover:text-white transition-colors min-h-[44px] min-w-[44px] w-full sm:w-auto"
                style={{
                  fontSize: "clamp(9px, 1.5vw, 11px)",
                  letterSpacing: "0.18em",
                }}
              >
                Start Partner Review
              </button>
              <button
                onClick={() => router.push("/login")}
                aria-label="Contact us"
                className="glass px-5 sm:px-8 md:px-10 py-3 sm:py-3.5 rounded-full text-white/70 uppercase font-light hover:text-white transition-colors min-h-[44px] min-w-[44px] w-full sm:w-auto"
                style={{
                  fontSize: "clamp(9px, 1.5vw, 11px)",
                  letterSpacing: "0.18em",
                }}
              >
                Speak With Us
              </button>
            </div>
          </motion.div>
        </section>
      </motion.main>
    </>
  );
}
