"use client";

import ProductCard from "@/components/ProductCard";
import { getProductPageContent, type ProductPageSpecification } from "@/lib/productPageContent";
import products from "@/lib/productsData";
import type { Product } from "@/lib/types";
import { AnimatePresence, motion } from "framer-motion";
import {
  Award,
  Box,
  Check,
  ChevronRight,
  Copy,
  Facebook,
  Heart,
  Linkedin,
  ShoppingBag,
  Star,
  Twitter,
  Zap
} from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/* ────────────────────────────────────────────────────────────────── */
/* DESIGN TOKENS */
/* ────────────────────────────────────────────────────────────────── */

const COLOR_MAP: Record<string, string> = {
  black: "#0A0A0A", brown: "#5D4037", navy: "#1A237E", gray: "#616161",
  white: "#FAFAFA", cream: "#FFF8E7", tan: "#D2B48C", camel: "#C19A6B",
  olive: "#556B2F", sand: "#C2B280", chocolate: "#3E2723", stone: "#78909C",
  charcoal: "#37474F", midnight: "#263238", gold: "#C6A75E", silver: "#9E9E9E",
  tortoise: "#5D4037", sky: "#87CEEB",
};

function getColorHex(color: string) {
  return COLOR_MAP[color.toLowerCase()] || color;
}

function getOriginalPrice(price: number, discount?: number) {
  if (!discount || discount <= 0 || discount >= 100) return null;
  return Math.round(price / (1 - discount / 100));
}

const glass = {
  background: "linear-gradient(135deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.03) 100%)",
  backdropFilter: "blur(24px) saturate(160%)",
  WebkitBackdropFilter: "blur(24px) saturate(160%)",
  border: "1px solid rgba(255,255,255,0.10)",
  boxShadow: "0 16px 48px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.16)",
};

const goldGlass = {
  background: "linear-gradient(135deg, rgba(198,169,98,0.22) 0%, rgba(178,149,78,0.10) 100%)",
  backdropFilter: "blur(20px) saturate(160%)",
  WebkitBackdropFilter: "blur(20px) saturate(160%)",
  border: "1px solid rgba(198,169,98,0.28)",
  boxShadow: "0 8px 32px rgba(198,169,98,0.12), inset 0 1px 0 rgba(255,255,255,0.14)",
};

/* ────────────────────────────────────────────────────────────────── */
/* HORIZONTAL SCROLL GALLERY COMPONENT */
/* ────────────────────────────────────────────────────────────────── */

interface HorizontalGalleryProps {
  images: string[];
  productName: string;
}

function HorizontalScrollGallery({ images, productName }: HorizontalGalleryProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    const scrollAmount =
      typeof window !== "undefined" && window.innerWidth < 640
        ? Math.max(window.innerWidth - 80, 260)
        : 400;
    scrollContainerRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const checkScroll = () => {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(container.scrollLeft < container.scrollWidth - container.clientWidth - 10);
    };

    checkScroll();
    container.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);

    return () => {
      container.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="relative"
    >
      {/* Section header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-white/25 text-[9px] tracking-[0.4em] uppercase mb-2">Gallery</p>
          <h2
            className="font-light text-white leading-none"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(1.4rem, 3vw, 2.2rem)",
              letterSpacing: "0.06em",
            }}
          >
            Explore Every Angle
          </h2>
        </div>
        <div className="hidden sm:flex gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleScroll("left")}
            disabled={!canScrollLeft}
            className={`p-3 rounded-full transition-all ${
              canScrollLeft ? "bg-white/10 hover:bg-white/20" : "bg-white/5 opacity-50"
            }`}
          >
            <ChevronRight className="w-4 h-4 rotate-180 text-white" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleScroll("right")}
            disabled={!canScrollRight}
            className={`p-3 rounded-full transition-all ${
              canScrollRight ? "bg-white/10 hover:bg-white/20" : "bg-white/5 opacity-50"
            }`}
          >
            <ChevronRight className="w-4 h-4 text-white" />
          </motion.button>
        </div>
      </div>

      {/* Main scroll container */}
      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4"
          style={{
            scrollBehavior: "smooth",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {images.map((image, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.6 }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => setSelectedIndex(i)}
              className="snap-center flex-shrink-0 cursor-pointer group"
              style={{ width: "min(82vw, 400px)", aspectRatio: "4 / 5" }}
            >
              <motion.div
                animate={{ scale: hoveredIndex === i ? 1.02 : 1 }}
                transition={{ duration: 0.3 }}
                className="relative w-full h-full rounded-3xl overflow-hidden"
                style={{
                  ...glass,
                  boxShadow: hoveredIndex === i
                    ? "0 24px 64px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.16)"
                    : "0 16px 48px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.16)",
                }}
              >
                {/* Image */}
                <Image
                  src={image}
                alt={`${productName} - View ${i + 1}`}
                fill
                className="object-cover"
                sizes="(max-width:640px) 82vw, 400px"
              />

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                {/* Hover magnifier effect */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hoveredIndex === i ? 1 : 0 }}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                >
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md text-white text-[11px] tracking-widest uppercase font-light">
                    <span>🔍</span>
                    View
                  </div>
                </motion.div>

                {/* Index badge */}
                <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-white text-[10px] tracking-widest uppercase font-light">
                  {i + 1} / {images.length}
                </div>

                {/* Active indicator */}
                {selectedIndex === i && (
                  <motion.div
                    layoutId="activeSlide"
                    className="absolute inset-0 rounded-3xl border-2 border-yellow-400/50"
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Fade overlay left */}
        <div
          className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-8 bg-gradient-to-r from-black to-transparent sm:w-12"
          style={{ opacity: canScrollLeft ? 1 : 0 }}
        />

        {/* Fade overlay right */}
        <div
          className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-8 bg-gradient-to-l from-black to-transparent sm:w-12"
          style={{ opacity: canScrollRight ? 1 : 0 }}
        />
      </div>

      {/* Thumbnail indicators below */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="flex gap-2 justify-start mt-6 overflow-x-auto pb-2"
      >
        {images.map((_, i) => (
          <motion.button
            key={i}
            onClick={() => {
              setSelectedIndex(i);
              const slideWidth =
                typeof window !== "undefined" && window.innerWidth < 640
                  ? window.innerWidth * 0.82
                  : 400;
              scrollContainerRef.current?.scrollBy({
                left: (i - selectedIndex) * slideWidth,
                behavior: "smooth",
              });
            }}
            animate={{
              width: selectedIndex === i ? 32 : 8,
              backgroundColor: selectedIndex === i ? "#C6A75E" : "rgba(255,255,255,0.2)",
            }}
            className="h-1 rounded-full transition-all"
          />
        ))}
      </motion.div>
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────────────── */
/* SHARE BUTTONS COMPONENT */
/* ────────────────────────────────────────────────────────────────── */

function ShareButtons({ product }: { product: Product }) {
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = `Check out ${product.name}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex gap-3 items-center">
      <span className="text-white/40 text-[10px] tracking-widest uppercase font-light">Share</span>
      <motion.button
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => window.open(`https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, "_blank")}
        className="p-2.5 rounded-full hover:bg-white/10 transition-colors"
      >
        <Facebook size={16} className="text-white/60" />
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, "_blank")}
        className="p-2.5 rounded-full hover:bg-white/10 transition-colors"
      >
        <Twitter size={16} className="text-white/60" />
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, "_blank")}
        className="p-2.5 rounded-full hover:bg-white/10 transition-colors"
      >
        <Linkedin size={16} className="text-white/60" />
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleCopyLink}
        className="p-2.5 rounded-full hover:bg-white/10 transition-colors"
      >
        {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} className="text-white/60" />}
      </motion.button>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────── */
/* SPECIFICATIONS TAB */
/* ────────────────────────────────────────────────────────────────── */

function SpecificationsTab({ specs }: { specs: ProductPageSpecification[] }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      {specs.map((spec, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.05 }}
          className="p-5 rounded-2xl"
          style={glass}
        >
          <p className="text-white/40 text-[10px] tracking-[0.3em] uppercase mb-2">{spec.label}</p>
          <p className="text-white font-light text-base" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            {spec.value}
          </p>
        </motion.div>
      ))}
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────────────── */
/* MAIN PRODUCT PAGE */
/* ────────────────────────────────────────────────────────────────── */

export default function PremiumProductPage() {
  const params = useParams();
  const idParam = params?.id;
  const id = Array.isArray(idParam) ? idParam[0] : String(idParam ?? "");
  const initialProduct =
    (products.find((entry) => String(entry._id) === id) as
      | (Product & { media360?: string[]; videoUrl?: string })
      | undefined) ?? null;

  const [product, setProduct] = useState<(Product & { media360?: string[]; videoUrl?: string }) | null>(initialProduct);
  const [loadingProduct, setLoadingProduct] = useState(!initialProduct);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState<"specs" | "details">("specs");
  const p = product;
  const allMedia = p ? [...(p.images || []), ...(p.media360 || [])] : [];

  useEffect(() => {
    if (!id) {
      setProduct(null);
      setLoadingProduct(false);
      return;
    }

    const fallbackProduct =
      (products.find((entry) => String(entry._id) === id) as
        | (Product & { media360?: string[]; videoUrl?: string })
        | undefined) ?? null;

    setProduct(fallbackProduct);
    setLoadingProduct(!fallbackProduct);

    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(`/api/products/${encodeURIComponent(id)}`, {
          cache: "no-store",
        });

        if (!res.ok) {
          if (!cancelled && !fallbackProduct) {
            setProduct(null);
          }
          return;
        }

        const data = await res.json();
        if (!cancelled) {
          setProduct(data);
        }
      } catch {
        if (!cancelled && !fallbackProduct) {
          setProduct(null);
        }
      } finally {
        if (!cancelled) {
          setLoadingProduct(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loadingProduct) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center">
        <p className="text-white/50 font-light tracking-widest" style={{ fontFamily: "'Jost', sans-serif" }}>
          Loading product...
        </p>
      </div>
    );
  }

  if (!product || !p) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center">
        <p className="text-white/50 font-light tracking-widest" style={{ fontFamily: "'Jost', sans-serif" }}>
          Product not found.
        </p>
      </div>
    );
  }

  const relatedProducts = products
    .filter((r) => r.category === product.category && r._id !== product._id)
    .slice(0, 4) as Product[];
  const pageContent = getProductPageContent(product);
  const highlightIcons = [Award, Star, Check, Box];

  const sizes = product.size || [];
  const colors = product.colors || [];
  const originalPrice = getOriginalPrice(product.price, product.discount);

  const handleAddToCart = async () => {
    if (sizes.length > 0 && !selectedSize) {
      alert("Please select a size first.");
      return;
    }
    if (colors.length > 0 && !selectedColor) {
      alert("Please select a color first.");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product._id,
          quantity: 1,
          size: selectedSize,
          color: selectedColor,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setAdded(true);
      setTimeout(() => setAdded(false), 2500);
    } catch {
      alert("Failed to add to cart.");
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = () => {
    if (sizes.length > 0 && !selectedSize) {
      alert("Please select a size first.");
      return;
    }
    if (colors.length > 0 && !selectedColor) {
      alert("Please select a color first.");
      return;
    }
    const checkoutItems = [{
      productId: product._id,
      _id: product._id,
      quantity: 1,
      name: product.name,
      price: product.price,
      image: product.images?.[0] ?? "/images/placeholder.svg",
      size: selectedSize,
      color: selectedColor,
    }];
    if (typeof window !== "undefined")
      sessionStorage.setItem("checkoutItems", JSON.stringify(checkoutItems));
    window.location.href = "/checkout";
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@200;300;400;500&display=swap');
        
        * {
          --gold: #C6A75E;
          --dark: #080808;
          --border: rgba(255,255,255,0.1);
        }
        
        body { background: var(--dark); overflow-x: hidden; }

        /* Scrollbar hide for scroll gallery */
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(250%) skewX(-12deg); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }

        .anim-hero { animation: fadeSlideUp 1s cubic-bezier(0.22,1,0.36,1) 0.1s both; }
        .anim-content { animation: fadeSlideUp 1s cubic-bezier(0.22,1,0.36,1) 0.3s both; }
        .anim-gallery { animation: fadeSlideUp 1.1s cubic-bezier(0.22,1,0.36,1) 0.5s both; }

        .shimmer-btn:hover .shimmer-sweep { animation: shimmer 2.5s ease-in-out infinite; }

        .float-animation { animation: float 3s ease-in-out infinite; }

        /* Selection highlight */
        ::selection { background: rgba(198, 169, 98, 0.3); color: white; }

        /* Smooth scroll */
        html { scroll-behavior: smooth; }
      `}</style>

      <div
        className="min-h-screen bg-[#080808] text-white overflow-hidden"
        style={{ fontFamily: "'Jost', sans-serif" }}
      >
        {/* Ambient background glows */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          {/* Gold glow - top right */}
          <motion.div
            animate={{ opacity: [0.04, 0.08, 0.04] }}
            transition={{ duration: 8, repeat: Infinity }}
            style={{
              position: "absolute", width: 1000, height: 1000,
              top: "-30%", right: "-20%",
              background: "radial-gradient(circle, rgba(198,169,98,0.08) 0%, transparent 60%)",
              filter: "blur(100px)",
            }}
          />
          {/* Blue glow - bottom left */}
          <motion.div
            animate={{ opacity: [0.03, 0.06, 0.03] }}
            transition={{ duration: 10, repeat: Infinity }}
            style={{
              position: "absolute", width: 800, height: 800,
              bottom: "-10%", left: "-15%",
              background: "radial-gradient(circle, rgba(160,160,220,0.06) 0%, transparent 65%)",
              filter: "blur(80px)",
            }}
          />
        </div>

        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 flex flex-wrap items-center gap-2 px-4 pt-8 pb-4 text-[9px] uppercase tracking-[0.3em] text-white/25 sm:px-6 lg:px-16"
        >
          <span>Shop</span>
          <ChevronRight className="w-3 h-3" />
          <span>{product.category}</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-white/50">{product.name}</span>
        </motion.div>

        {/* Horizontal Scroll Gallery - NOW AT TOP */}
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-16">
          <HorizontalScrollGallery images={allMedia} productName={product.name} />
        </div>

        {/* Hero Section - Product Title & CTA */}
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:px-16">
          <div className="grid grid-cols-1 items-start gap-10 sm:gap-16">
            {/* Product info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="anim-hero"
            >
              {/* Category badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-6 inline-block"
              >
                <span
                  className="inline-block px-4 py-2 rounded-full text-[8px] tracking-[0.4em] uppercase font-light"
                  style={{
                    color: "#C6A962",
                    background: "linear-gradient(135deg, rgba(198,169,98,0.12), rgba(198,169,98,0.04))",
                    border: "1px solid rgba(198,169,98,0.2)",
                    backdropFilter: "blur(12px)",
                  }}
                >
                  {product.category}
                </span>
              </motion.div>

              {/* Main title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.25 }}
                className="font-light text-white leading-tight mb-6"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(2.8rem, 6vw, 5rem)",
                  letterSpacing: "0.03em",
                  lineHeight: "1.1",
                }}
              >
                {product.name}
              </motion.h1>

              {/* Rating */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="flex items-center gap-3 mb-8"
              >
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < 4 ? "fill-amber-400 text-amber-400" : "text-white/20"}
                    />
                  ))}
                </div>
                <span className="text-white/50 text-[12px] tracking-widest">4.8 / 5</span>
              </motion.div>

              {/* Price - Luxe styling */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mb-8"
              >
                <p className="text-white/40 text-[10px] tracking-[0.35em] uppercase mb-3">Price</p>
                {originalPrice ? (
                  <p
                    className="mb-2 text-white/35 line-through"
                    style={{ fontSize: "0.95rem", letterSpacing: "0.12em", fontFamily: "'Jost', sans-serif" }}
                  >
                    EGP {originalPrice.toLocaleString()}
                  </p>
                ) : null}
                <p
                  className="font-light"
                  style={{ fontSize: "2.2rem", color: "#C6A962", letterSpacing: "0.05em", fontFamily: "'Cormorant Garamond', serif" }}
                >
                  EGP {product.price.toLocaleString()}
                </p>
              </motion.div>

              {/* Divider */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: 40 }}
                transition={{ delay: 0.45, duration: 0.6 }}
                className="mb-8 h-px"
                style={{ background: "linear-gradient(90deg, rgba(198,169,98,0.8), transparent)" }}
              />

              {/* Description */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-white/45 font-light leading-relaxed mb-10"
                style={{ fontSize: "0.95rem", letterSpacing: "0.02em", lineHeight: "1.7" }}
              >
                {pageContent.story}
              </motion.p>

              {/* Size selector */}
              {sizes.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 }}
                  className="mb-8"
                >
                  <p className="text-white/30 text-[9px] tracking-[0.35em] uppercase mb-4 font-light">Size</p>
                  <div className="flex flex-wrap gap-3">
                    {sizes.map((size) => (
                      <motion.button
                        key={size}
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedSize(size)}
                        className="px-6 py-3 rounded-full text-sm font-light tracking-[0.1em] transition-all duration-300"
                        style={selectedSize === size ? {
                          background: "linear-gradient(135deg, rgba(198,169,98,0.25), rgba(198,169,98,0.1))",
                          border: "1px solid rgba(198,169,98,0.5)",
                          color: "#C6A962",
                          backdropFilter: "blur(12px)",
                          boxShadow: "0 8px 24px rgba(198,169,98,0.15)",
                        } : {
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          color: "rgba(255,255,255,0.6)",
                          backdropFilter: "blur(12px)",
                        }}
                      >
                        {size}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Color selector */}
              {colors.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="mb-10"
                >
                  <p className="text-white/30 text-[9px] tracking-[0.35em] uppercase mb-4 font-light">
                    Color {selectedColor && <span className="ml-2 text-white/50 normal-case tracking-normal" style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic" }}>— {selectedColor}</span>}
                  </p>
                  <div className="flex gap-3 flex-wrap">
                    {colors.map((color) => {
                      const hex = getColorHex(color);
                      return (
                        <motion.button
                          key={color}
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setSelectedColor(color)}
                          title={color}
                          className="rounded-full transition-all duration-300 relative"
                          style={{
                            width: 44, height: 44,
                            backgroundColor: hex,
                            border: selectedColor === color
                              ? "2px solid rgba(198,169,98,0.9)"
                              : "2px solid rgba(255,255,255,0.15)",
                            boxShadow: selectedColor === color
                              ? "0 0 0 4px rgba(198,169,98,0.2), 0 8px 24px rgba(0,0,0,0.5)"
                              : "0 4px 12px rgba(0,0,0,0.3)",
                          }}
                        >
                          {selectedColor === color && (
                            <motion.div
                              layoutId="colorSelected"
                              className="absolute inset-0 rounded-full"
                              style={{
                                background: "linear-gradient(135deg, rgba(255,255,255,0.3), transparent)",
                              }}
                            />
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65 }}
                className="flex flex-col sm:flex-row gap-4 mb-8"
              >
                {/* Add to Cart */}
                <motion.button
                  onClick={handleAddToCart}
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="shimmer-btn relative flex-1 overflow-hidden rounded-full py-5 px-8 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed font-light tracking-[0.15em] uppercase text-[11px]"
                  style={added ? {
                    ...goldGlass,
                    transition: "all 0.5s cubic-bezier(0.22,1,0.36,1)",
                  } : {
                    ...glass,
                    transition: "all 0.5s cubic-bezier(0.22,1,0.36,1)",
                  }}
                >
                  <div
                    className="shimmer-sweep absolute inset-0 pointer-events-none"
                    style={{ background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.09) 50%, transparent 60%)" }}
                  />
                  <ShoppingBag
                    strokeWidth={1.3}
                    className="w-5 h-5 relative z-10"
                    style={{ color: added ? "#C6A962" : "rgba(255,255,255,0.7)" }}
                  />
                  <span
                    className="relative z-10"
                    style={{ color: added ? "#C6A962" : "rgba(255,255,255,0.8)" }}
                  >
                    {loading ? "Adding…" : added ? "Added" : "Add to Cart"}
                  </span>
                </motion.button>

                {/* Buy Now */}
                <motion.button
                  onClick={handleBuyNow}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="shimmer-btn relative flex-1 overflow-hidden rounded-full py-5 px-8 flex items-center justify-center gap-3 font-light tracking-[0.15em] uppercase text-[11px]"
                  style={goldGlass}
                >
                  <div
                    className="shimmer-sweep absolute inset-0 pointer-events-none"
                    style={{ background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.12) 50%, transparent 60%)" }}
                  />
                  <Zap strokeWidth={1.3} className="w-5 h-5 relative z-10" style={{ color: "#C6A962" }} />
                  <span className="relative z-10" style={{ color: "#C6A962" }}>
                    Buy Now
                  </span>
                </motion.button>

                {/* Wishlist */}
                <motion.button
                  onClick={() => setWishlisted(!wishlisted)}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-5 rounded-full"
                  style={wishlisted ? {
                    background: "linear-gradient(135deg, rgba(255,80,80,0.18), rgba(255,80,80,0.06))",
                    border: "1px solid rgba(255,100,100,0.3)",
                    backdropFilter: "blur(16px)",
                    boxShadow: "0 0 16px rgba(255,80,80,0.08)",
                  } : glass}
                >
                  <Heart
                    strokeWidth={1.5}
                    className={`w-5 h-5 transition-all ${wishlisted ? "fill-red-400 text-red-400" : "text-white/60"}`}
                  />
                </motion.button>
              </motion.div>

              {/* Share buttons */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="pt-8 border-t border-white/10"
              >
                <ShareButtons product={product} />
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Specifications Section */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative z-10 mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-16"
        >
          <div className="mb-12">
            <p className="text-white/25 text-[9px] tracking-[0.4em] uppercase mb-3">Craftsmanship</p>
            <h2
              className="font-light text-white leading-none"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(2rem, 4vw, 3rem)",
                letterSpacing: "0.06em",
                color: "#C6A962",
              }}
            >
              Product Details
            </h2>
          </div>

          {/* Tabs */}
          <div className="flex gap-8 mb-12 border-b border-white/10 pb-6">
            <motion.button
              onClick={() => setActiveTab("specs")}
              className={`text-[11px] tracking-widest uppercase font-light pb-3 border-b-2 transition-colors ${
                activeTab === "specs"
                  ? "border-b-yellow-400 text-white"
                  : "border-b-transparent text-white/40 hover:text-white/60"
              }`}
            >
              <span className="flex items-center gap-2">
                <Box size={14} />
                Specifications
              </span>
            </motion.button>
            <motion.button
              onClick={() => setActiveTab("details")}
              className={`text-[11px] tracking-widest uppercase font-light pb-3 border-b-2 transition-colors ${
                activeTab === "details"
                  ? "border-b-yellow-400 text-white"
                  : "border-b-transparent text-white/40 hover:text-white/60"
              }`}
            >
              <span className="flex items-center gap-2">
                <Award size={14} />
                Highlights
              </span>
            </motion.button>
          </div>

          {/* Tab content */}
          <AnimatePresence mode="wait">
            {activeTab === "specs" && (
              <motion.div
                key="specs"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <SpecificationsTab specs={pageContent.specs} />
              </motion.div>
            )}

            {activeTab === "details" && (
              <motion.div
                key="details"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {pageContent.highlights.map((item, i) => {
                    const Icon = highlightIcons[i % highlightIcons.length];

                    return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="p-6 rounded-2xl text-center"
                      style={glass}
                    >
                      <div className="mb-4 flex justify-center">
                        <div
                          className="flex h-12 w-12 items-center justify-center rounded-full"
                          style={{
                            background: "linear-gradient(135deg, rgba(198,169,98,0.16), rgba(198,169,98,0.05))",
                            border: "1px solid rgba(198,169,98,0.24)",
                            color: "#C6A962",
                          }}
                        >
                          <Icon size={18} strokeWidth={1.4} />
                        </div>
                      </div>
                      <p className="text-white font-light mb-1" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem" }}>
                        {item.title}
                      </p>
                      <p className="text-white/40 text-[12px]">{item.desc}</p>
                    </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative z-10 mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-16"
          >
            <div className="mb-12">
              <p className="text-white/25 text-[9px] tracking-[0.4em] uppercase mb-3">Curated Collection</p>
              <h2
                className="font-light text-white leading-none"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(2rem, 4vw, 3rem)",
                  letterSpacing: "0.06em",
                  color: "#C6A962",
                }}
              >
                You May Also Like
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rp, i) => (
                <motion.div
                  key={rp._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                >
                  <ProductCard product={rp} />
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Footer spacer */}
        <div className="h-10" />
      </div>
    </>
  );
}
