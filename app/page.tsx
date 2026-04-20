"use client";

import ProductCard from "@/components/ProductCard";
import { withPublicAssetVersion } from "@/lib/publicAsset";
import products from "@/lib/productsData";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
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
  Shield,
  RefreshCcw,
  Truck,
  Star,
  Lock,
  Award,
  BadgeCheck,
  Phone,
  ChevronRight,
  TrendingUp,
  Heart,
  Package,
  Clock,
  Users,
  Gem,
} from "lucide-react";
import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";

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

// ── NEW TRUST & CONVERSION DATA ──────────────────────────────────────────────

const TRUST_BADGES = [
  {
    icon: Shield,
    title: "Secure Checkout",
    subtitle: "256-bit SSL encryption",
  },
  {
    icon: BadgeCheck,
    title: "Authenticity Guaranteed",
    subtitle: "Every piece verified",
  },
  {
    icon: RefreshCcw,
    title: "Easy Returns",
    subtitle: "14-day return policy",
  },
  {
    icon: Truck,
    title: "Express Delivery",
    subtitle: "Nationwide shipping",
  },
  {
    icon: Lock,
    title: "Secure Payments",
    subtitle: "Visa, Mastercard & more",
  },
  {
    icon: Phone,
    title: "Concierge Support",
    subtitle: "7 days a week",
  },
];

const STATS = [
  { value: "500+", label: "Curated Boutiques", icon: Gem },
  { value: "12,000+", label: "Luxury Pieces", icon: Package },
  { value: "98%", label: "Satisfaction Rate", icon: Heart },
  { value: "50,000+", label: "Happy Clients", icon: Users },
];

const TESTIMONIALS = [
  {
    name: "Farida M.",
    location: "Cairo",
    rating: 5,
    text: "The quality of pieces from BOUT is exceptional. I received my order faster than expected and every detail was perfect — exactly as described. This is now my go-to for luxury shopping.",
    product: "Silk Evening Gown",
    verified: true,
    timeAgo: "2 days ago",
  },
  {
    name: "Nadia K.",
    location: "Alexandria",
    rating: 5,
    text: "I was hesitant ordering luxury online but BOUT changed everything. The authentication guarantee gave me full confidence. The packaging alone felt like a 5-star unboxing experience.",
    product: "Leather Tote Bag",
    verified: true,
    timeAgo: "1 week ago",
  },
  {
    name: "Layla R.",
    location: "Giza",
    rating: 5,
    text: "Customer service was outstanding. When I had a question about sizing, they responded within minutes. The dress I ordered is even more beautiful in person. Absolute luxury experience.",
    product: "Embroidered Kaftan",
    verified: true,
    timeAgo: "3 days ago",
  },
];

const CATEGORIES = [
  { name: "Evening Wear", count: "124 pieces", emoji: "✦" },
  { name: "Day Dresses", count: "89 pieces", emoji: "◆" },
  { name: "Accessories", count: "210 pieces", emoji: "◇" },
  { name: "Handbags", count: "67 pieces", emoji: "▲" },
  { name: "Kaftans", count: "95 pieces", emoji: "✧" },
  { name: "Outerwear", count: "43 pieces", emoji: "◈" },
];

const PAYMENT_METHODS = ["Visa", "Mastercard", "Meeza", "Fawry", "Valu", "COD"];

const ANNOUNCEMENT_MESSAGES = [
  "✦  Free Delivery on Orders Over EGP 2,000  ✦  Authenticity Guaranteed on Every Piece  ✦  Easy 14-Day Returns",
  "✦  New Arrivals Every Week — Curated From Egypt's Finest Boutiques  ✦  Concierge Support 7 Days a Week",
  "✦  Secure Checkout with 256-bit Encryption  ✦  Shop With Full Confidence  ✦  Join 50,000+ Satisfied Clients",
];

interface FilterState {
  priceRange: number | null;
  search: string;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={12}
          className={star <= rating ? "text-[#C9A86A] fill-[#C9A86A]" : "text-white/20"}
        />
      ))}
    </div>
  );
}

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
          let start = 0;
          const duration = 2000;
          const step = (target / duration) * 16;
          const timer = setInterval(() => {
            start += step;
            if (start >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, hasStarted]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

export default function BoutPlatform() {
  const router = useRouter();
  const [sort, setSort] = useState("default");
  const [sortOpen, setSortOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filters, setFilters] = useState<FilterState>({
    priceRange: null,
    search: "",
  });
  const [announcementIndex, setAnnouncementIndex] = useState(0);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const heroRef = useRef<HTMLElement>(null);
  const shopRef = useRef<HTMLElement>(null);
  const sortMenuRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const deferredSearch = useDeferredValue(filters.search);

  // Rotate announcement bar
  useEffect(() => {
    const interval = setInterval(() => {
      setAnnouncementIndex((i) => (i + 1) % ANNOUNCEMENT_MESSAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...products];
    if (filters.priceRange !== null) {
      const range = PRICE_RANGES[filters.priceRange];
      result = result.filter((p) => p.price >= range.min && p.price <= range.max);
    }
    if (deferredSearch) {
      const normalizedSearch = deferredSearch.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(normalizedSearch) ||
          p.description?.toLowerCase().includes(normalizedSearch)
      );
    }
    return result;
  }, [deferredSearch, filters.priceRange]);

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
        * { --gold: #C9A86A; --gold-light: #E8C882; --gold-dim: rgba(201,168,106,0.22); --dark: #0A0908; --dark-2: #0F0D0C; }
        body { background: var(--dark); }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        @keyframes pulse-gold {
          0%, 100% { box-shadow: 0 0 0 0 rgba(201,168,106,0.18); }
          50% { box-shadow: 0 0 0 8px rgba(201,168,106,0); }
        }

        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        .sh1 { animation: fadeUp 1s cubic-bezier(0.22,1,0.36,1) 0.15s both; }
        .sh2 { animation: fadeUp 1s cubic-bezier(0.22,1,0.36,1) 0.35s both; }
        .sh3 { animation: fadeUp 1s cubic-bezier(0.22,1,0.36,1) 0.55s both; }

        .glass {
          background: linear-gradient(135deg, rgba(255,248,236,0.09) 0%, rgba(255,248,236,0.03) 100%);
          backdrop-filter: blur(24px) saturate(160%);
          -webkit-backdrop-filter: blur(24px) saturate(160%);
          border: 1px solid rgba(255,248,236,0.10);
          box-shadow: 0 16px 48px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,248,236,0.16);
        }
        .glass-md {
          background: linear-gradient(135deg, rgba(255,248,236,0.08) 0%, rgba(255,248,236,0.02) 100%);
          backdrop-filter: blur(20px) saturate(150%);
          -webkit-backdrop-filter: blur(20px) saturate(150%);
          border: 1px solid rgba(255,248,236,0.08);
          box-shadow: 0 12px 36px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,248,236,0.10);
        }
        .gold-glass {
          background: linear-gradient(135deg, rgba(201,168,106,0.14) 0%, rgba(201,168,106,0.04) 100%);
          backdrop-filter: blur(20px) saturate(150%);
          -webkit-backdrop-filter: blur(20px) saturate(150%);
          border: 1px solid rgba(201,168,106,0.22);
          box-shadow: 0 8px 32px rgba(201,168,106,0.08), inset 0 1px 0 rgba(255,248,236,0.14);
        }
        .gold-solid {
          background: linear-gradient(135deg, #C9A86A 0%, #B8935A 50%, #C9A86A 100%);
          box-shadow: 0 8px 32px rgba(201,168,106,0.35), 0 2px 8px rgba(201,168,106,0.2);
        }
        .gold-solid:hover {
          background: linear-gradient(135deg, #E8C882 0%, #C9A86A 50%, #E8C882 100%);
          box-shadow: 0 12px 40px rgba(201,168,106,0.45), 0 4px 12px rgba(201,168,106,0.3);
        }
        .trust-card {
          background: linear-gradient(135deg, rgba(255,248,236,0.06) 0%, rgba(255,248,236,0.02) 100%);
          border: 1px solid rgba(255,248,236,0.08);
          transition: all 0.3s cubic-bezier(0.22,1,0.36,1);
        }
        .trust-card:hover {
          background: linear-gradient(135deg, rgba(201,168,106,0.10) 0%, rgba(201,168,106,0.03) 100%);
          border-color: rgba(201,168,106,0.22);
          transform: translateY(-2px);
        }
        .announcement-bar {
          background: linear-gradient(90deg, #0A0908 0%, #1a1510 25%, #0A0908 50%, #1a1510 75%, #0A0908 100%);
          border-bottom: 1px solid rgba(201,168,106,0.15);
        }
        .home-hero-shell {
          isolation: isolate;
          background: #0A0908;
        }
        .home-hero-shell::after {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 1;
          background:
            radial-gradient(ellipse at 50% 0%, rgba(201,168,106,0.08) 0%, transparent 55%),
            linear-gradient(180deg, rgba(8,8,8,0.35) 0%, rgba(8,8,8,0.78) 100%);
        }
        .stat-card {
          background: linear-gradient(135deg, rgba(201,168,106,0.08) 0%, rgba(10,9,8,0.6) 100%);
          border: 1px solid rgba(201,168,106,0.15);
          position: relative;
          overflow: hidden;
        }
        .stat-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, transparent 40%, rgba(201,168,106,0.04) 100%);
          pointer-events: none;
        }
        .testimonial-card {
          background: linear-gradient(145deg, rgba(255,248,236,0.07) 0%, rgba(255,248,236,0.02) 100%);
          border: 1px solid rgba(255,248,236,0.09);
          position: relative;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.22,1,0.36,1);
        }
        .testimonial-card::before {
          content: '"';
          position: absolute;
          top: -10px;
          left: 16px;
          font-family: 'Cormorant Garamond', serif;
          font-size: 120px;
          color: rgba(201,168,106,0.06);
          line-height: 1;
          pointer-events: none;
        }
        .testimonial-card:hover {
          border-color: rgba(201,168,106,0.2);
          transform: translateY(-4px);
          box-shadow: 0 24px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(201,168,106,0.08);
        }
        .category-pill {
          background: linear-gradient(135deg, rgba(255,248,236,0.07) 0%, rgba(255,248,236,0.02) 100%);
          border: 1px solid rgba(255,248,236,0.09);
          transition: all 0.3s cubic-bezier(0.22,1,0.36,1);
          cursor: pointer;
          white-space: nowrap;
        }
        .category-pill:hover {
          background: linear-gradient(135deg, rgba(201,168,106,0.15) 0%, rgba(201,168,106,0.04) 100%);
          border-color: rgba(201,168,106,0.3);
          transform: translateY(-2px) scale(1.02);
        }
        .verified-badge {
          background: linear-gradient(135deg, rgba(34,197,94,0.15) 0%, rgba(34,197,94,0.05) 100%);
          border: 1px solid rgba(34,197,94,0.25);
        }
        .payment-badge {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.10);
          transition: all 0.2s;
        }
        .payment-badge:hover {
          background: rgba(255,255,255,0.10);
          border-color: rgba(201,168,106,0.25);
        }
        .luxury-filter-pill {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 36px;
          padding: 0 14px;
          border-radius: 999px;
          font-size: clamp(9px, 1.6vw, 10px);
          letter-spacing: 0.14em;
          text-transform: uppercase;
          font-weight: 300;
          white-space: nowrap;
          border: 1px solid rgba(255,248,236,0.10);
          background: transparent;
          color: rgba(255,255,255,0.55);
          transition: all 0.25s;
        }
        .luxury-filter-pill:hover,
        .luxury-filter-pill.is-active {
          background: linear-gradient(135deg, rgba(201,168,106,0.14) 0%, rgba(201,168,106,0.04) 100%);
          border-color: rgba(201,168,106,0.28);
          color: #C9A86A;
        }
        .luxury-icon-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 36px;
          min-width: 36px;
          border-radius: 8px;
          color: rgba(255,255,255,0.45);
          border: 1px solid rgba(255,248,236,0.08);
          background: transparent;
          transition: all 0.2s;
        }
        .luxury-icon-toggle.is-active,
        .luxury-icon-toggle:hover {
          color: #C9A86A;
          background: rgba(201,168,106,0.10);
          border-color: rgba(201,168,106,0.22);
        }
        .luxury-sort-trigger {
          display: inline-flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          min-height: 36px;
          padding: 0 14px;
          border-radius: 10px;
          font-size: clamp(9px, 1.4vw, 10px);
          letter-spacing: 0.14em;
          text-transform: uppercase;
          font-weight: 300;
          color: rgba(255,255,255,0.55);
          border: 1px solid rgba(255,248,236,0.10);
          background: transparent;
          transition: all 0.2s;
        }
        .luxury-sort-trigger.is-open,
        .luxury-sort-trigger:hover {
          color: #C9A86A;
          border-color: rgba(201,168,106,0.22);
          background: rgba(201,168,106,0.06);
        }
        .luxury-sort-label {
          font-family: 'Jost', sans-serif;
          font-size: clamp(9px, 1.4vw, 10px);
          letter-spacing: 0.14em;
        }
        .luxury-sort-icon {
          color: inherit;
        }
        .luxury-dropdown-panel {
          position: absolute;
          top: calc(100% + 6px);
          right: 0;
          min-width: 180px;
          border-radius: 12px;
          overflow: hidden;
          background: linear-gradient(145deg, rgba(20,17,14,0.98) 0%, rgba(15,13,12,0.98) 100%);
          border: 1px solid rgba(201,168,106,0.18);
          box-shadow: 0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,248,236,0.04);
          z-index: 50;
        }
        .luxury-dropdown-panel.mobile-centered {
          right: 0;
        }
        @media (max-width: 640px) {
          .luxury-dropdown-panel.mobile-centered {
            right: 0;
            left: auto;
          }
        }
        .luxury-dropdown-option {
          padding: 12px 18px;
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.55);
          cursor: pointer;
          transition: all 0.15s;
          border-bottom: 1px solid rgba(255,248,236,0.04);
          font-family: 'Jost', sans-serif;
        }
        .luxury-dropdown-option:last-child {
          border-bottom: none;
        }
        .luxury-dropdown-option:hover,
        .luxury-dropdown-option.active {
          background: rgba(201,168,106,0.10);
          color: #C9A86A;
        }

        input::placeholder { font-size: 16px; }
        @media (min-width: 641px) {
          input::placeholder { font-size: clamp(12px, 1.2vw, 14px); }
        }

        .scrollbar-hide { scrollbar-width: none; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }

        .gold-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(201,168,106,0.3), transparent);
        }

        .shimmer-text {
          background: linear-gradient(90deg, #C9A86A 0%, #E8C882 30%, #C9A86A 60%, #B8935A 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }

        .security-seal {
          background: linear-gradient(135deg, rgba(34,197,94,0.08) 0%, rgba(34,197,94,0.02) 100%);
          border: 1px solid rgba(34,197,94,0.18);
        }
      `}</style>

      {/* ── ANNOUNCEMENT BAR ── */}
      <div className="announcement-bar relative overflow-hidden py-2.5 z-50">
        <AnimatePresence mode="wait">
          <motion.p
            key={announcementIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
            className="text-center text-[#C9A86A] tracking-[0.22em] uppercase"
            style={{ fontSize: "clamp(9px, 1.5vw, 10px)", fontFamily: "'Jost', sans-serif" }}
          >
            {ANNOUNCEMENT_MESSAGES[announcementIndex]}
          </motion.p>
        </AnimatePresence>
      </div>

      <motion.main
        initial={false}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9 }}
        className="relative bg-[#0A0908] text-white min-h-screen"
        style={{ fontFamily: "'Jost', sans-serif" }}
      >

        {/* ── MAIN HERO SECTION ── */}
        <section
          ref={heroRef}
          className="home-hero-shell relative flex min-h-[72vh] items-center overflow-hidden px-4 pb-12 pt-14 sm:min-h-[82vh] sm:px-6 sm:pb-20 sm:pt-[4.5rem] md:min-h-[92vh] md:px-10 md:pb-28 md:pt-24"
        >
          <Image
            src={withPublicAssetVersion("/uploads/homepage.jpg")}
            alt="BOUT boutique interior"
            fill
            priority
            sizes="100vw"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ zIndex: 0 }}
          />

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
                <em style={{ color: "#C9A86A", fontStyle: "italic" }}>
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
                BOUT gives independent boutiques a calmer, more selective digital
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
                  aria-label="Shop the collection"
                  className="gold-solid px-7 sm:px-10 md:px-12 py-3.5 sm:py-4 rounded-full text-[#0A0908] font-medium transition-all min-h-[52px] min-w-[44px] flex items-center justify-center gap-2 group w-full sm:w-auto"
                  style={{ fontSize: "clamp(10px, 1.8vw, 12px)", letterSpacing: "0.18em", textTransform: "uppercase" }}
                >
                  Shop The Collection
                  <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => router.push("/login")}
                  aria-label="Join as a partner"
                  className="glass px-6 sm:px-8 md:px-10 py-3 sm:py-3.5 rounded-full text-white/80 text-[10px] sm:text-[11px] tracking-[0.18em] uppercase font-light hover:text-white transition-colors min-h-[52px] min-w-[44px] w-full sm:w-auto"
                >
                  Become A Partner
                </button>
              </motion.div>

              {/* Hero trust indicators */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1, duration: 0.8 }}
                className="mt-6 sm:mt-8 flex items-center justify-center gap-4 sm:gap-6 flex-wrap"
              >
                {[
                  { icon: Shield, text: "Secure Checkout" },
                  { icon: BadgeCheck, text: "Authentic Pieces" },
                  { icon: RefreshCcw, text: "Easy Returns" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-1.5">
                    <Icon size={12} className="text-[#C9A86A]" />
                    <span className="text-white/50 tracking-[0.12em] uppercase" style={{ fontSize: "9px" }}>{text}</span>
                  </div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* ── TRUST BADGES STRIP ── */}
        <section className="relative z-10 border-y border-white/[0.06] bg-[#0D0B0A]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-4 sm:py-5">
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
              {TRUST_BADGES.map((badge, i) => (
                <motion.div
                  key={badge.title}
                  initial={false}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07, duration: 0.5 }}
                  className="trust-card flex flex-col items-center text-center gap-1.5 py-3 px-2 rounded-xl"
                >
                  <badge.icon size={18} className="text-[#C9A86A]" strokeWidth={1.5} />
                  <div>
                    <p className="text-white/80 font-light" style={{ fontSize: "clamp(9px, 1.4vw, 10px)", letterSpacing: "0.06em" }}>
                      {badge.title}
                    </p>
                    <p className="text-white/35" style={{ fontSize: "clamp(8px, 1.2vw, 9px)", letterSpacing: "0.04em" }}>
                      {badge.subtitle}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── STATS / SOCIAL PROOF ── */}
        <section className="relative z-10 px-4 sm:px-6 md:px-10 py-10 sm:py-14 md:py-16">
          <div className="max-w-7xl mx-auto">
            <motion.p
              initial={false}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center text-white/35 uppercase tracking-[0.4em] mb-6 sm:mb-8"
              style={{ fontSize: "clamp(8px, 1.5vw, 9px)", fontFamily: "'Jost', sans-serif" }}
            >
              Trusted By Thousands Across Egypt
            </motion.p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
              {STATS.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={false}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  className="stat-card rounded-2xl p-4 sm:p-5 md:p-6 text-center"
                >
                  <stat.icon size={20} className="text-[#C9A86A] mx-auto mb-2 sm:mb-3" strokeWidth={1.3} />
                  <div
                    className="shimmer-text font-light mb-1"
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "clamp(1.6rem, 5vw, 2.8rem)",
                      letterSpacing: "0.02em",
                    }}
                  >
                    {stat.value}
                  </div>
                  <p className="text-white/45 font-light tracking-[0.08em]" style={{ fontSize: "clamp(9px, 1.5vw, 10px)" }}>
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <div className="gold-divider relative z-10 mx-auto px-4 sm:px-6 md:px-10 mb-8 sm:mb-10 md:mb-12 max-w-7xl" />

        {/* ── EXISTING EDITORIAL SECTION ── */}
        <section className="relative z-10 px-4 sm:px-6 md:px-10 mb-8 sm:mb-10 md:mb-14">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-4 sm:gap-5 lg:gap-8 items-start">
            <motion.div
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.75 }}
              className="glass-md relative overflow-hidden rounded-[26px] sm:rounded-[32px] p-5 sm:p-7 md:p-10"
              style={{ minHeight: "clamp(320px, 50vw, 520px)" }}
            >
              <Image
                src={withPublicAssetVersion("/uploads/main.jpg")}
                alt="BOUT editorial portrait"
                fill
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,9,8,0.2)_0%,rgba(10,9,8,0.56)_42%,rgba(10,9,8,0.88)_100%)]" />
              <div
                className="absolute inset-x-5 top-0 h-px pointer-events-none"
                style={{ background: "linear-gradient(90deg, transparent, rgba(255,248,236,0.20), transparent)" }}
              />
              <div className="relative z-10 h-full flex flex-col justify-end">
                <p className="text-white/45 uppercase mb-2" style={{ fontSize: "clamp(8px, 1.5vw, 9px)", letterSpacing: "0.4em" }}>
                  The BOUT Standard
                </p>
                <h2
                  className="font-light text-white mb-3"
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.5rem, 4vw, 2.6rem)", letterSpacing: "0.02em", lineHeight: 1 }}
                >
                  Where Discerning Taste
                  <br />
                  <em style={{ color: "#C9A86A" }}>Finds Its Platform.</em>
                </h2>
                <p className="text-white/58 leading-relaxed" style={{ fontSize: "clamp(11px, 2vw, 13px)" }}>
                  Every boutique on BOUT is reviewed for consistency, quality, and distinctiveness before its first listing goes live.
                </p>
              </div>
            </motion.div>

            <div className="flex flex-col gap-3 sm:gap-4">
              {BENEFITS.map((benefit, i) => (
                <motion.div
                  key={benefit.title}
                  initial={false}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12, duration: 0.7 }}
                  className="gold-glass rounded-xl sm:rounded-2xl p-4 sm:p-5"
                >
                  <h3
                    className="text-white font-light mb-1.5"
                    style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1rem, 2.5vw, 1.2rem)", letterSpacing: "0.02em" }}
                  >
                    {benefit.title}
                  </h3>
                  <p className="text-white/55 leading-relaxed mb-2" style={{ fontSize: "clamp(11px, 2vw, 12px)" }}>
                    {benefit.description}
                  </p>
                  <ul className="space-y-1">
                    {benefit.points.map((point) => (
                      <li key={point} className="flex items-center gap-2 text-[10px] text-white/55">
                        <Check size={12} className="text-[#C9A86A] flex-shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CATEGORY BROWSE ── */}
        <section className="relative z-10 px-4 sm:px-6 md:px-10 mb-8 sm:mb-10 md:mb-14">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={false}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex items-end justify-between mb-4 sm:mb-6"
            >
              <div>
                <p className="text-white/35 uppercase tracking-[0.35em] mb-1.5" style={{ fontSize: "clamp(8px, 1.5vw, 9px)" }}>
                  Browse By Category
                </p>
                <h2
                  className="font-light text-white"
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.2rem, 4vw, 2rem)", letterSpacing: "0.02em" }}
                >
                  Shop By <em style={{ color: "#C9A86A" }}>Collection</em>
                </h2>
              </div>
              <button
                onClick={() => router.push("/collection")}
                className="hidden sm:flex items-center gap-1.5 text-white/45 hover:text-[#C9A86A] transition-colors"
                style={{ fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase" }}
              >
                View All <ChevronRight size={13} />
              </button>
            </motion.div>

            <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {CATEGORIES.map((cat, i) => (
                <motion.button
                  key={cat.name}
                  initial={false}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07, duration: 0.5 }}
                  onClick={() => router.push("/collection")}
                  className="category-pill flex flex-col items-start rounded-xl p-3 sm:p-4 min-w-[120px] sm:min-w-[140px]"
                >
                  <span className="text-[#C9A86A] mb-1.5 text-base">{cat.emoji}</span>
                  <p className="text-white/80 font-light mb-0.5" style={{ fontSize: "clamp(11px, 2vw, 13px)", letterSpacing: "0.03em" }}>
                    {cat.name}
                  </p>
                  <p className="text-white/35" style={{ fontSize: "clamp(9px, 1.5vw, 10px)", letterSpacing: "0.08em" }}>
                    {cat.count}
                  </p>
                </motion.button>
              ))}
            </div>
          </div>
        </section>

        <div className="gold-divider relative z-10 mx-auto px-4 sm:px-6 md:px-10 mb-8 sm:mb-10 md:mb-12 max-w-7xl" />

        {/* ── TESTIMONIALS ── */}
        <section className="relative z-10 px-4 sm:px-6 md:px-10 mb-8 sm:mb-10 md:mb-14">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={false}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-6 sm:mb-8 md:mb-10"
            >
              <p className="text-white/35 uppercase tracking-[0.4em] mb-2" style={{ fontSize: "clamp(8px, 1.5vw, 9px)" }}>
                Client Reviews
              </p>
              <h2
                className="font-light text-white mb-2"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.3rem, 5vw, 2.8rem)", letterSpacing: "0.02em" }}
              >
                What Our Clients <em style={{ color: "#C9A86A" }}>Say</em>
              </h2>
              {/* Overall rating */}
              <div className="flex items-center justify-center gap-2 mt-2">
                <div className="flex items-center gap-0.5">
                  {[1,2,3,4,5].map(s => <Star key={s} size={14} className="text-[#C9A86A] fill-[#C9A86A]" />)}
                </div>
                <span className="text-white/50" style={{ fontSize: "11px", letterSpacing: "0.05em" }}>4.9 / 5 · Based on 2,400+ reviews</span>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-5">
              {TESTIMONIALS.map((t, i) => (
                <motion.div
                  key={t.name}
                  initial={false}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12, duration: 0.7 }}
                  className="testimonial-card rounded-2xl p-5 sm:p-6"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <StarRating rating={t.rating} />
                    </div>
                    {t.verified && (
                      <span className="verified-badge flex items-center gap-1 px-2 py-0.5 rounded-full text-green-400 flex-shrink-0" style={{ fontSize: "8px", letterSpacing: "0.1em" }}>
                        <BadgeCheck size={9} />
                        Verified
                      </span>
                    )}
                  </div>
                  <p
                    className="text-white/68 leading-relaxed mb-4 relative z-10"
                    style={{ fontSize: "clamp(11px, 2vw, 13px)", letterSpacing: "0.02em" }}
                  >
                    {t.text}
                  </p>
                  <div className="border-t border-white/[0.06] pt-3 flex items-end justify-between gap-2">
                    <div>
                      <p className="text-white/80 font-light" style={{ fontSize: "clamp(11px, 2vw, 12px)", letterSpacing: "0.03em" }}>
                        {t.name}
                      </p>
                      <p className="text-white/35" style={{ fontSize: "9px", letterSpacing: "0.08em" }}>
                        {t.location} · {t.timeAgo}
                      </p>
                    </div>
                    <p className="text-[#C9A86A]" style={{ fontSize: "9px", letterSpacing: "0.08em", textAlign: "right" }}>
                      {t.product}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
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
            <p className="text-white/35 uppercase mb-2 sm:mb-3" style={{ fontSize: "clamp(8px, 1.5vw, 9px)", letterSpacing: "0.4em" }}>
              Partner Journey
            </p>
            <h2
              className="font-light text-white mb-3 sm:mb-4"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.3rem, 5vw, 3rem)", letterSpacing: "0.02em" }}
            >
              How The Partnership
              <br />
              <em style={{ color: "#C9A86A", fontStyle: "italic" }}>Unfolds</em>
            </h2>
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
                  className="font-light text-white/6 mb-3 sm:mb-4"
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(3.2rem, 8vw, 5rem)", lineHeight: 0.9 }}
                >
                  {step.number}
                </div>
                <h3 className="text-white font-light mb-1.5" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.2rem, 3vw, 1.65rem)" }}>
                  {step.title}
                </h3>
                <p className="text-[#C9A86A] uppercase font-light mb-3" style={{ fontSize: "clamp(9px, 2vw, 11px)", letterSpacing: "0.14em" }}>
                  {step.subtitle}
                </p>
                <p className="text-white/55 leading-relaxed" style={{ fontSize: "clamp(11px, 2vw, 13px)" }}>
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── PLATFORM EXPERIENCE ── */}
        <section className="px-4 sm:px-6 md:px-10 py-10 sm:py-14 md:py-18 relative z-10">
          <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-[0.92fr_1.08fr] gap-4 sm:gap-5 lg:gap-8 items-start">
            <motion.div
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.75 }}
              className="gold-glass relative overflow-hidden rounded-[26px] sm:rounded-[32px] p-5 sm:p-7 md:p-10"
              style={{ minHeight: "clamp(320px, 45vw, 480px)" }}
            >
              <Image
                src={withPublicAssetVersion("/uploads/collections.jpg")}
                alt="BOUT platform experience editorial"
                fill
                sizes="(max-width: 1024px) 100vw, 46vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,9,8,0.26)_0%,rgba(10,9,8,0.6)_40%,rgba(10,9,8,0.9)_100%)]" />
              <div className="absolute inset-x-5 top-0 h-px pointer-events-none" style={{ background: "linear-gradient(90deg, transparent, rgba(255,248,236,0.20), transparent)" }} />
              <div className="relative z-10 h-full flex flex-col justify-end">
                <p className="text-white/45 uppercase mb-3 sm:mb-4" style={{ fontSize: "clamp(8px, 1.5vw, 9px)", letterSpacing: "0.36em" }}>
                  Platform Experience
                </p>
                <h2 className="font-light text-white mb-4 sm:mb-5" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.55rem, 5vw, 3rem)", lineHeight: 1 }}>
                  Designed for modern boutique growth.
                </h2>
              </div>
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
                      <Check size={16} className="text-[#C9A86A]" />
                    </div>
                    <div>
                      <h3 className="text-white font-light mb-1.5" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1rem, 2.5vw, 1.35rem)" }}>
                        {item.title}
                      </h3>
                      <p className="text-white/55 leading-relaxed" style={{ fontSize: "clamp(11px, 2vw, 13px)" }}>
                        {item.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Mini security seal */}
              <motion.div
                initial={false}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="security-seal rounded-xl p-4 flex items-center gap-3"
              >
                <Shield size={20} className="text-green-400 flex-shrink-0" />
                <div>
                  <p className="text-green-400 font-light" style={{ fontSize: "11px", letterSpacing: "0.06em" }}>
                    100% Secure & Trusted Platform
                  </p>
                  <p className="text-white/40" style={{ fontSize: "9px", letterSpacing: "0.05em" }}>
                    All transactions are protected with bank-grade 256-bit SSL encryption
                  </p>
                </div>
              </motion.div>
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
            <p className="text-white/35 uppercase mb-2 sm:mb-3" style={{ fontSize: "clamp(8px, 1.5vw, 9px)", letterSpacing: "0.45em" }}>
              Standards
            </p>
            <h2
              className="font-light text-white"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.25rem, 5vw, 2.8rem)", letterSpacing: "0.04em" }}
            >
              The BOUT <em style={{ color: "#C9A86A", fontStyle: "italic" }}>Standard</em>
            </h2>
            <p className="mt-3 max-w-xl mx-auto text-white/45 font-light" style={{ fontSize: "clamp(10px, 2vw, 12px)", letterSpacing: "0.04em" }}>
              Each layer is shaped to keep the partnership elevated, consistent, and commercially credible.
            </p>
            <div className="mt-3 sm:mt-4 mx-auto w-8 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(201,168,106,0.55), transparent)" }} />
          </motion.div>

          <div className="mx-auto grid max-w-7xl grid-cols-1 md:grid-cols-2 gap-3 sm:gap-5 lg:gap-6">
            {PARTNERSHIP_STANDARDS.map((item, i) => (
              <motion.div
                key={item.label}
                initial={false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                className="gold-glass rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6"
              >
                <div className="flex items-start justify-between gap-3 mb-5">
                  <span
                    className="inline-flex items-center rounded-full px-3 py-2 min-h-[36px] text-white/55 uppercase"
                    style={{ background: "linear-gradient(135deg, rgba(255,248,236,0.08) 0%, rgba(255,248,236,0.03) 100%)", border: "1px solid rgba(255,248,236,0.08)", fontSize: "clamp(8px, 1.5vw, 9px)", letterSpacing: "0.24em" }}
                  >
                    {item.label}
                  </span>
                  <div className="h-px flex-1 self-center" style={{ background: "linear-gradient(90deg, rgba(201,168,106,0.35), transparent)" }} />
                </div>
                <h3 className="text-white font-light mb-3 sm:mb-4" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.05rem, 2.8vw, 1.5rem)", lineHeight: 1.12 }}>
                  {item.title}
                </h3>
                <p className="text-white/55 leading-relaxed" style={{ fontSize: "clamp(11px, 2vw, 13px)" }}>
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        <div className="gold-divider relative z-10 mx-auto px-4 sm:px-6 md:px-10 mb-8 sm:mb-10 md:mb-12 max-w-7xl" />

        {/* ── SHOP / PRODUCT SECTION HEADER ── */}
        <section
          ref={shopRef}
          className="relative z-10 px-4 sm:px-6 md:px-10 mb-4 sm:mb-6 md:mb-8"
        >
          <motion.div
            initial={false}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-4 sm:mb-6 md:mb-8 max-w-7xl mx-auto"
          >
            <p className="text-white/35 uppercase mb-2 sm:mb-3" style={{ fontSize: "clamp(8px, 1.5vw, 9px)", letterSpacing: "0.4em" }}>
              The Boutique Edit
            </p>
            <h2
              className="font-light text-white mb-2 sm:mb-3 md:mb-4"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.35rem, 5vw, 3rem)", letterSpacing: "0.02em" }}
            >
              Discover The
              <br />
              <em style={{ color: "#C9A86A", fontStyle: "italic" }}>Collection Experience</em>
            </h2>
            <p className="text-white/45 font-light max-w-xl mx-auto" style={{ fontSize: "clamp(10px, 2vw, 12px)", letterSpacing: "0.04em" }}>
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
            <div className="glass-md flex items-center gap-3 px-4 py-3 sm:py-3.5 rounded-2xl min-h-[52px]">
              <Search size={16} className="text-white/40 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search pieces, silhouettes, or details..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                aria-label="Search collections"
                className="bg-transparent flex-1 outline-none text-white placeholder-white/28 tracking-wide text-[16px] sm:text-sm"
              />
              {filters.search && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setFilters({ ...filters, search: "" })}
                  aria-label="Clear search"
                  className="flex min-h-[44px] min-w-[44px] flex-shrink-0 items-center justify-center rounded-lg p-2 text-white/55 transition-colors hover:text-white"
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
                <SlidersHorizontal strokeWidth={1.3} className="h-4 w-4 flex-shrink-0 text-white/40" />
                <div className="w-px h-5" style={{ background: "rgba(255,248,236,0.08)" }} />
                <span className="text-white/28 tracking-[0.35em] uppercase flex-shrink-0" style={{ fontSize: "clamp(9px, 1.5vw, 10px)" }}>
                  {sortedProducts.length} Results
                </span>
              </div>

              <div className="sm:hidden flex items-center justify-between w-full gap-2">
                <span className="text-white/28 tracking-[0.35em] uppercase" style={{ fontSize: "clamp(9px, 1.5vw, 10px)" }}>
                  {sortedProducts.length}
                </span>
                <div className="flex items-center gap-2">
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setViewMode("grid")} aria-label="Grid view" className={`luxury-icon-toggle ${viewMode === "grid" ? "is-active" : ""}`}>
                    <Grid size={16} />
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setViewMode("list")} aria-label="List view" className={`luxury-icon-toggle ${viewMode === "list" ? "is-active" : ""}`}>
                    <List size={16} />
                  </motion.button>
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-2">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setViewMode("grid")} aria-label="Grid view" className={`luxury-icon-toggle ${viewMode === "grid" ? "is-active" : ""}`}>
                  <Grid size={16} />
                </motion.button>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setViewMode("list")} aria-label="List view" className={`luxury-icon-toggle ${viewMode === "list" ? "is-active" : ""}`}>
                  <List size={16} />
                </motion.button>
              </div>

              <div ref={sortMenuRef} className={`relative w-full sm:w-auto ${sortOpen ? "z-30" : "z-10"}`}>
                <button
                  onClick={() => setSortOpen(!sortOpen)}
                  aria-expanded={sortOpen}
                  aria-haspopup="listbox"
                  aria-label="Sort products"
                  className={`luxury-sort-trigger w-full sm:w-auto ${sortOpen ? "is-open" : ""}`}
                >
                  <span className="luxury-sort-label">{activeLabel}</span>
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

            {/* Price filters */}
            <motion.div
              initial={false}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide"
            >
              <span className="text-white/28 tracking-widest uppercase flex-shrink-0" style={{ fontSize: "clamp(8px, 1.5vw, 9px)" }}>
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
            style={{ background: "linear-gradient(90deg, transparent, rgba(201,168,106,0.18), transparent)" }}
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
                    transition={{ delay: (i % (viewMode === "grid" ? 4 : 1)) * 0.05, duration: 0.6 }}
                    className={viewMode === "list" ? "glass-md rounded-xl sm:rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-start min-h-[120px]" : ""}
                  >
                    {viewMode === "list" && (
                      <div className="w-full sm:w-24 h-40 sm:h-24 rounded-lg glass flex-shrink-0 relative overflow-hidden bg-white/5">
                        {product.images?.[0] && <div className="w-full h-full" />}
                      </div>
                    )}
                    <div className={viewMode === "list" ? "flex-1 min-w-0 flex flex-col justify-between" : ""}>
                      <ProductCard product={product} />
                      {viewMode === "list" && (
                        <div className="mt-2 sm:mt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="text-white/55 leading-relaxed line-clamp-2" style={{ fontSize: "clamp(11px, 2vw, 13px)" }}>
                              {product.description}
                            </p>
                            <p className="text-white font-light mt-1.5 sm:mt-2" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#C9A86A", fontSize: "clamp(13px, 2.5vw, 16px)" }}>
                              EGP {product.price.toLocaleString()}
                            </p>
                          </div>
                          <motion.button
                            type="button"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => router.push(`/product/${encodeURIComponent(String(product._id))}`)}
                            aria-label={`View details for ${product.name}`}
                            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 self-end rounded-full border border-white/10 px-4 py-3 text-[10px] uppercase tracking-[0.22em] text-white/60 transition-colors hover:text-white sm:self-auto"
                            style={{ fontFamily: "'Jost', sans-serif", background: "rgba(255,248,236,0.04)" }}
                          >
                            Details <ArrowRight strokeWidth={1.2} className="h-3.5 w-3.5" />
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
                <p className="mb-5 text-white/45 tracking-[0.1em] font-light sm:mb-6" style={{ fontSize: "clamp(12px, 2vw, 14px)" }}>
                  No pieces match your filters
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFilters({ priceRange: null, search: "" })}
                  aria-label="Clear all filters"
                  className="gold-glass px-5 sm:px-8 md:px-10 py-3 rounded-full text-white/70 uppercase font-light hover:text-white transition-colors min-h-[44px]"
                  style={{ fontSize: "clamp(9px, 1.5vw, 10px)", letterSpacing: "0.2em" }}
                >
                  Clear All Filters
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* ── PAYMENT & SECURITY SECTION ── */}
        <section className="relative z-10 px-4 sm:px-6 md:px-10 py-10 sm:py-14 border-t border-white/[0.06]">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={false}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-6 sm:mb-8"
            >
              <p className="text-white/35 uppercase tracking-[0.4em] mb-2" style={{ fontSize: "clamp(8px, 1.5vw, 9px)" }}>
                Safe & Secure
              </p>
              <h3
                className="font-light text-white"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.1rem, 3.5vw, 2rem)" }}
              >
                Multiple Ways to Pay, <em style={{ color: "#C9A86A" }}>All Fully Secure</em>
              </h3>
            </motion.div>

            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8 sm:mb-10">
              {PAYMENT_METHODS.map((method, i) => (
                <motion.div
                  key={method}
                  initial={false}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, duration: 0.4 }}
                  className="payment-badge rounded-lg px-4 sm:px-5 py-2.5 sm:py-3"
                >
                  <span className="text-white/65 font-light" style={{ fontSize: "clamp(10px, 1.8vw, 12px)", letterSpacing: "0.06em" }}>
                    {method}
                  </span>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-3xl mx-auto">
              {[
                { icon: Lock, title: "256-bit SSL Encryption", desc: "Bank-grade security on every transaction" },
                { icon: Award, title: "Authenticity Certificate", desc: "Every item comes with proof of authenticity" },
                { icon: Clock, title: "Real-Time Order Tracking", desc: "Know exactly where your order is at all times" },
              ].map(({ icon: Icon, title, desc }, i) => (
                <motion.div
                  key={title}
                  initial={false}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  className="trust-card rounded-xl p-4 text-center"
                >
                  <Icon size={20} className="text-[#C9A86A] mx-auto mb-2" strokeWidth={1.4} />
                  <p className="text-white/75 font-light mb-1" style={{ fontSize: "clamp(10px, 1.8vw, 12px)", letterSpacing: "0.04em" }}>
                    {title}
                  </p>
                  <p className="text-white/35" style={{ fontSize: "clamp(9px, 1.4vw, 10px)", letterSpacing: "0.03em" }}>
                    {desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── NEWSLETTER / CTA ── */}
        <section className="relative z-10 px-4 sm:px-6 md:px-10 py-10 sm:py-14 border-t border-white/[0.06] bg-[#0D0B0A]">
          <div className="max-w-2xl mx-auto text-center">
            <motion.div
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <TrendingUp size={28} className="text-[#C9A86A] mx-auto mb-3" strokeWidth={1.3} />
              <h3
                className="font-light text-white mb-2"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.3rem, 4vw, 2.2rem)", letterSpacing: "0.02em" }}
              >
                First Access to New Arrivals
              </h3>
              <p className="text-white/45 font-light mb-6" style={{ fontSize: "clamp(11px, 2vw, 13px)", letterSpacing: "0.03em" }}>
                Be the first to discover new boutique additions, exclusive offers, and curated edits.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-1 glass-md rounded-full px-5 py-3 text-white placeholder-white/25 outline-none text-sm bg-transparent min-h-[50px]"
                  style={{ letterSpacing: "0.03em" }}
                />
                <button
                  className="gold-solid px-6 py-3 rounded-full text-[#0A0908] font-medium min-h-[50px] whitespace-nowrap transition-all"
                  style={{ fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase" }}
                >
                  Subscribe
                </button>
              </div>
              <p className="text-white/25 mt-3" style={{ fontSize: "9px", letterSpacing: "0.08em" }}>
                No spam, ever. Unsubscribe at any time. Your data is protected.
              </p>
            </motion.div>
          </div>
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
              style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.25rem, 4vw, 2.4rem)", letterSpacing: "0.02em" }}
            >
              If The Collection Is Distinctive,
              <br />
              The Platform Should Be Too.
            </h3>
            <p className="mx-auto mb-6 max-w-2xl font-light text-white/45 sm:mb-8 md:mb-10" style={{ fontSize: "clamp(11px, 2.5vw, 14px)", letterSpacing: "0.04em" }}>
              BOUT is intended for boutiques that want growth to feel aligned with their identity: selective, elevated, and easier for clients to navigate on every screen.
            </p>
            <div className="flex flex-col gap-2 sm:gap-3 sm:flex-row sm:items-center sm:justify-center mb-8 sm:mb-10">
              <button
                onClick={() => router.push("/login")}
                aria-label="List your collection"
                className="gold-solid px-8 sm:px-10 md:px-12 py-3.5 rounded-full text-[#0A0908] font-medium uppercase transition-all min-h-[52px] w-full sm:w-auto"
                style={{ fontSize: "clamp(9px, 1.5vw, 11px)", letterSpacing: "0.18em" }}
              >
                Start Partner Review
              </button>
              <button
                onClick={() => router.push("/login")}
                aria-label="Contact us"
                className="glass px-5 sm:px-8 md:px-10 py-3 sm:py-3.5 rounded-full text-white/60 uppercase font-light hover:text-white transition-colors min-h-[52px] w-full sm:w-auto"
                style={{ fontSize: "clamp(9px, 1.5vw, 11px)", letterSpacing: "0.18em" }}
              >
                Speak With Us
              </button>
            </div>

            {/* Footer trust strip */}
            <div className="border-t border-white/[0.06] pt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              {[
                { icon: Shield, text: "Secure Checkout" },
                { icon: BadgeCheck, text: "Authenticity Guaranteed" },
                { icon: RefreshCcw, text: "14-Day Returns" },
                { icon: Truck, text: "Nationwide Delivery" },
                { icon: Phone, text: "Concierge Support" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-1.5">
                  <Icon size={11} className="text-[#C9A86A]" />
                  <span className="text-white/35 uppercase tracking-[0.12em]" style={{ fontSize: "9px" }}>{text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </section>
      </motion.main>
    </>
  );
}