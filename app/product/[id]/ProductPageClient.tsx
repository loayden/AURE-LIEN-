"use client";

import ProductCard from "@/components/ProductCard";
import { showToast } from "@/components/ToastProvider";
import { usePerformanceProfile } from "@/hooks/usePerformanceProfile";
import { useTimeoutRegistry } from "@/hooks/useTimeoutRegistry";
import { getProductColorHex as getColorHex } from "@/lib/productColors";
import { getProductPageContent, type ProductPageSpecification } from "@/lib/productPageContent";
import products from "@/lib/productsData";
import type { Product } from "@/lib/types";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import {
  Award,
  Box,
  Check,
  ChevronRight,
  Copy,
  PackageCheck,
  Ruler,
  ShoppingBag,
  X,
  Zap
} from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { FaFacebookF, FaLinkedinIn, FaTwitter } from "react-icons/fa";

/* ────────────────────────────────────────────────────────────────── */
/* DESIGN TOKENS */
/* ────────────────────────────────────────────────────────────────── */

function getOriginalPrice(price: number, discount?: number) {
  if (!discount || discount <= 0 || discount >= 100) return null;
  return Math.round(price / (1 - discount / 100));
}

const glass = {
  background: "linear-gradient(135deg, rgba(255,248,236,0.09) 0%, rgba(255,248,236,0.03) 100%)",
  backdropFilter: "blur(24px) saturate(160%)",
  WebkitBackdropFilter: "blur(24px) saturate(160%)",
  border: "1px solid rgba(255,248,236,0.10)",
  boxShadow: "0 16px 48px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,248,236,0.16)",
};

const goldGlass = {
  background: "linear-gradient(135deg, rgba(201,168,106,0.22) 0%, rgba(178,149,78,0.10) 100%)",
  backdropFilter: "blur(20px) saturate(160%)",
  WebkitBackdropFilter: "blur(20px) saturate(160%)",
  border: "1px solid rgba(201,168,106,0.28)",
  boxShadow: "0 8px 32px rgba(201,168,106,0.12), inset 0 1px 0 rgba(255,248,236,0.14)",
};

/* ────────────────────────────────────────────────────────────────── */
/* HORIZONTAL SCROLL GALLERY COMPONENT */
/* ────────────────────────────────────────────────────────────────── */

interface HorizontalGalleryProps {
  images: string[];
  productName: string;
  onOpenImage?: (index: number) => void;
}

function HorizontalScrollGallery({ images, productName, onOpenImage }: HorizontalGalleryProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
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
    container.addEventListener("scroll", checkScroll, { passive: true });
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
              onClick={() => {
                setSelectedIndex(i);
                onOpenImage?.(i);
              }}
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
                    ? "0 24px 64px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,248,236,0.16)"
                    : "0 16px 48px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,248,236,0.16)",
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
              backgroundColor: selectedIndex === i ? "#C9A86A" : "rgba(255,248,236,0.2)",
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
  const { registerTimeout } = useTimeoutRegistry();

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = `Check out ${product.name}`;

  const handleCopyLink = () => {
    if (!navigator.clipboard?.writeText) return;
    void navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    registerTimeout(() => setCopied(false), 2000);
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
        <FaFacebookF size={16} className="text-white/60" />
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, "_blank")}
        className="p-2.5 rounded-full hover:bg-white/10 transition-colors"
      >
        <FaTwitter size={16} className="text-white/60" />
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, "_blank")}
        className="p-2.5 rounded-full hover:bg-white/10 transition-colors"
      >
        <FaLinkedinIn size={16} className="text-white/60" />
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
  const { shouldReduceDecorativeMotion } = usePerformanceProfile();
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
  const [activeTab, setActiveTab] = useState<"specs" | "details">("specs");
  const [actionError, setActionError] = useState<string | null>(null);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>([]);
  const { registerTimeout } = useTimeoutRegistry();
  const p = product;
  const allMedia = useMemo(() => {
    if (!p) return [];

    const media = [...(p.images || []), ...(p.media360 || [])].filter(
      (item): item is string => typeof item === "string" && item.trim() !== ""
    );

    return media.length > 0 ? media : ["/images/placeholder.svg"];
  }, [p]);
  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products.filter((r) => r.category === product.category && r._id !== product._id).slice(0, 4) as Product[];
  }, [product]);
  const pageContent = useMemo(() => (product ? getProductPageContent(product) : null), [product]);
  const highlightIcons = useMemo(() => [Award, PackageCheck, Check, Box], []);

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

    if (fallbackProduct) {
      return;
    }

    const controller = new AbortController();

    (async () => {
      try {
        const res = await fetch(`/api/products/${encodeURIComponent(id)}`, {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!res.ok) {
          if (!controller.signal.aborted && !fallbackProduct) {
            setProduct(null);
          }
          return;
        }

        const data = await res.json();
        if (!controller.signal.aborted) {
          setProduct(data);
        }
      } catch {
        if (!controller.signal.aborted && !fallbackProduct) {
          setProduct(null);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoadingProduct(false);
        }
      }
    })();

    return () => {
      controller.abort();
    };
  }, [id]);

  useEffect(() => {
    if (!product?._id || typeof window === "undefined") return;

    const storageKey = "bout:recently-viewed";
    let current: unknown = [];
    try {
      current = JSON.parse(window.localStorage.getItem(storageKey) || "[]");
    } catch {
      current = [];
    }
    const ids = Array.isArray(current) ? current.map((value) => String(value)) : [];
    const nextIds = [product._id, ...ids.filter((value) => value !== product._id)].slice(0, 8);
    window.localStorage.setItem(storageKey, JSON.stringify(nextIds));
    setRecentlyViewedIds(nextIds.filter((value) => value !== product._id));
  }, [product?._id]);

  if (loadingProduct) {
    return (
      <div className="min-h-screen bg-[#0A0908] flex items-center justify-center">
        <p className="text-white/50 font-light tracking-widest" style={{ fontFamily: "'Jost', sans-serif" }}>
          Loading product...
        </p>
      </div>
    );
  }

  if (!product || !p || !pageContent) {
    return (
      <div className="min-h-screen bg-[#0A0908] flex items-center justify-center">
        <p className="text-white/50 font-light tracking-widest" style={{ fontFamily: "'Jost', sans-serif" }}>
          Product not found.
        </p>
      </div>
    );
  }

  const sizes = product.size || [];
  const colors = product.colors || [];
  const originalPrice = getOriginalPrice(product.price, product.discount);
  const stock = typeof product.stock === "number" ? product.stock : null;
  const isSoldOut = stock === 0;
  const isLowStock = stock !== null && stock > 0 && stock < 5;
  const stockLabel = isSoldOut ? "Sold out" : isLowStock ? `${stock} left` : stock !== null ? "In stock" : "Available";
  const stockTone = isSoldOut ? "text-red-300" : isLowStock ? "text-amber-300" : "text-emerald-300";
  const recentlyViewedProducts = products
    .filter((entry) => recentlyViewedIds.includes(String(entry._id)) && String(entry._id) !== String(product._id))
    .slice(0, 4) as Product[];
  const showActionError = (message: string) => {
    setActionError(message);
    registerTimeout(() => setActionError(null), 2500);
  };

  const handleAddToCart = async () => {
    if (isSoldOut) {
      showActionError("This piece is sold out.");
      return;
    }
    if (sizes.length > 0 && !selectedSize) {
      showActionError("Please select a size first.");
      return;
    }
    if (colors.length > 0 && !selectedColor) {
      showActionError("Please select a color first.");
      return;
    }
    try {
      setLoading(true);
      setActionError(null);
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
      window.dispatchEvent(new Event("cart:changed"));
      showToast({ tone: "success", title: "Cart", message: `${product.name} added to cart.` });
      setAdded(true);
      registerTimeout(() => setAdded(false), 2500);
    } catch {
      showToast({ tone: "error", title: "Cart", message: "Failed to add this piece to the cart." });
      showActionError("Failed to add this piece to the cart.");
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = () => {
    if (isSoldOut) {
      showActionError("This piece is sold out.");
      return;
    }
    if (sizes.length > 0 && !selectedSize) {
      showActionError("Please select a size first.");
      return;
    }
    if (colors.length > 0 && !selectedColor) {
      showActionError("Please select a color first.");
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
    <MotionConfig reducedMotion={shouldReduceDecorativeMotion ? "always" : "never"}>
    <>
      <style>{`
        
        * {
          --gold: #C9A86A;
          --dark: #0A0908;
          --border: rgba(255,248,236,0.1);
        }
        
        body { background: var(--dark); overflow-x: hidden; }

        /* Scrollbar hide for scroll gallery */
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }

        .anim-hero { animation: fadeSlideUp 1s cubic-bezier(0.22,1,0.36,1) 0.1s both; }
        .anim-content { animation: fadeSlideUp 1s cubic-bezier(0.22,1,0.36,1) 0.3s both; }
        .anim-gallery { animation: fadeSlideUp 1.1s cubic-bezier(0.22,1,0.36,1) 0.5s both; }

        .float-animation { animation: float 3s ease-in-out infinite; }

        /* Selection highlight */
        ::selection { background: rgba(201, 168, 106, 0.3); color: white; }

        /* Smooth scroll */
        html { scroll-behavior: smooth; }
      `}</style>

      <AnimatePresence>
        {actionError ? (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="fixed inset-x-4 top-20 z-[70] flex justify-center sm:top-24"
          >
            <div
              className="rounded-2xl px-4 py-3"
              style={{
                background: "rgba(255,60,60,0.07)",
                border: "1px solid rgba(255,80,80,0.18)",
                backdropFilter: "blur(16px)",
              }}
            >
              <p className="text-[10px] uppercase tracking-[0.2em]" style={{ color: "rgba(255,120,120,0.75)" }}>
                {actionError}
              </p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {lightboxIndex !== null ? (
          <motion.div
            className="fixed inset-0 z-[90] bg-black/86 backdrop-blur-md"
            role="dialog"
            aria-modal="true"
            aria-label={`${product.name} image preview`}
          >
            <button
              type="button"
              onClick={() => setLightboxIndex(null)}
              className="absolute right-4 top-4 z-20 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-white/70 transition-colors hover:text-white"
              aria-label="Close image preview"
            >
              <X className="h-5 w-5" strokeWidth={1.4} />
            </button>
            <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-8">
              <motion.div
                key={lightboxIndex}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="relative h-[82vh] w-full max-w-5xl overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.035]"
              >
                <Image
                  src={allMedia[lightboxIndex] ?? "/images/placeholder.svg"}
                  alt={`${product.name} enlarged view`}
                  fill
                  sizes="100vw"
                  className="object-contain"
                />
              </motion.div>
            </div>
            {allMedia.length > 1 ? (
              <div className="absolute inset-x-4 bottom-4 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setLightboxIndex((current) => (current === null ? 0 : (current - 1 + allMedia.length) % allMedia.length))}
                  className="flex min-h-[44px] items-center rounded-full border border-white/10 bg-white/[0.06] px-5 text-[10px] uppercase tracking-[0.22em] text-white/70"
                >
                  Previous
                </button>
                <span className="rounded-full bg-black/35 px-4 py-3 text-[10px] uppercase tracking-[0.22em] text-white/52">
                  {lightboxIndex + 1} / {allMedia.length}
                </span>
                <button
                  type="button"
                  onClick={() => setLightboxIndex((current) => (current === null ? 0 : (current + 1) % allMedia.length))}
                  className="flex min-h-[44px] items-center rounded-full border border-white/10 bg-white/[0.06] px-5 text-[10px] uppercase tracking-[0.22em] text-white/70"
                >
                  Next
                </button>
              </div>
            ) : null}
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {sizeGuideOpen ? (
          <motion.div className="fixed inset-0 z-[88]" role="dialog" aria-modal="true" aria-label="Size guide">
            <motion.button
              type="button"
              className="absolute inset-0 cursor-default bg-black/62 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSizeGuideOpen(false)}
              aria-label="Close size guide"
            />
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.98 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-x-3 bottom-3 rounded-[28px] border border-white/10 bg-[#14110F] p-5 shadow-2xl sm:left-1/2 sm:top-1/2 sm:bottom-auto sm:w-[min(560px,calc(100vw-2rem))] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:p-7"
            >
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <p className="eyebrow mb-3">Size Guide</p>
                  <h2 className="font-serif text-3xl font-light text-white">Choose your fit</h2>
                </div>
                <button type="button" onClick={() => setSizeGuideOpen(false)} className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-white/55" aria-label="Close size guide">
                  <X className="h-4 w-4" strokeWidth={1.4} />
                </button>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                <p className="mb-4 text-sm leading-6 text-white/52">
                  Available sizes for this product are shown below. Select the size you normally wear for this category, then confirm color before adding to cart.
                </p>
                <div className="flex flex-wrap gap-2">
                  {sizes.length > 0 ? sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => {
                        setSelectedSize(size);
                        setSizeGuideOpen(false);
                      }}
                      className="min-h-[44px] rounded-full border border-white/10 px-5 text-sm text-white/72 transition-colors hover:border-brass/40 hover:text-brass"
                    >
                      {size}
                    </button>
                  )) : (
                    <span className="text-sm text-white/45">This item has no size selection.</span>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div
        className="min-h-screen bg-[#0A0908] text-white overflow-hidden"
        style={{ fontFamily: "'Jost', sans-serif" }}
      >
        {/* Ambient background glows */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div
            style={{
              position: "absolute",
              width: shouldReduceDecorativeMotion ? 620 : 1000,
              height: shouldReduceDecorativeMotion ? 620 : 1000,
              top: "-30%",
              right: "-20%",
              background: "radial-gradient(circle, rgba(201,168,106,0.08) 0%, transparent 60%)",
              filter: shouldReduceDecorativeMotion ? "blur(72px)" : "blur(100px)",
              opacity: shouldReduceDecorativeMotion ? 0.05 : undefined,
            }}
          />
          <div
            style={{
              position: "absolute",
              width: shouldReduceDecorativeMotion ? 520 : 800,
              height: shouldReduceDecorativeMotion ? 520 : 800,
              bottom: "-10%",
              left: "-15%",
              background: "radial-gradient(circle, rgba(160,160,220,0.06) 0%, transparent 65%)",
              filter: shouldReduceDecorativeMotion ? "blur(60px)" : "blur(80px)",
              opacity: shouldReduceDecorativeMotion ? 0.04 : undefined,
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
          <HorizontalScrollGallery images={allMedia} productName={product.name} onOpenImage={setLightboxIndex} />
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
                    color: "#C9A86A",
                    background: "linear-gradient(135deg, rgba(201,168,106,0.12), rgba(201,168,106,0.04))",
                    border: "1px solid rgba(201,168,106,0.2)",
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

              {/* Availability */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="mb-8 flex flex-wrap items-center gap-3"
              >
                <span className={`inline-flex min-h-[42px] items-center gap-2 rounded-full border border-white/10 bg-white/[0.045] px-4 text-[10px] uppercase tracking-[0.22em] ${stockTone}`}>
                  <PackageCheck className="h-4 w-4" strokeWidth={1.4} />
                  {stockLabel}
                </span>
                {isLowStock ? (
                  <span className="text-[10px] uppercase tracking-[0.22em] text-white/38">
                    Limited quantity
                  </span>
                ) : null}
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
                  style={{ fontSize: "2.2rem", color: "#C9A86A", letterSpacing: "0.05em", fontFamily: "'Cormorant Garamond', serif" }}
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
                style={{ background: "linear-gradient(90deg, rgba(201,168,106,0.8), transparent)" }}
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
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <p className="text-white/30 text-[9px] tracking-[0.35em] uppercase font-light">
                      Size {selectedSize ? <span className="ml-2 text-white/55 normal-case tracking-normal">— {selectedSize}</span> : null}
                    </p>
                    <button
                      type="button"
                      onClick={() => setSizeGuideOpen(true)}
                      className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-white/10 px-4 text-[10px] uppercase tracking-[0.18em] text-white/52 transition-colors hover:text-white"
                    >
                      <Ruler className="h-3.5 w-3.5" strokeWidth={1.4} />
                      Guide
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {sizes.map((size) => (
                      <motion.button
                        key={size}
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedSize(size)}
                        className="min-h-[48px] px-6 py-3 rounded-full text-sm font-light tracking-[0.1em] transition-all duration-300"
                        style={selectedSize === size ? {
                          background: "linear-gradient(135deg, rgba(201,168,106,0.25), rgba(201,168,106,0.1))",
                          border: "1px solid rgba(201,168,106,0.5)",
                          color: "#C9A86A",
                          backdropFilter: "blur(12px)",
                          boxShadow: "0 8px 24px rgba(201,168,106,0.15)",
                        } : {
                          background: "rgba(255,248,236,0.05)",
                          border: "1px solid rgba(255,248,236,0.1)",
                          color: "rgba(255,248,236,0.6)",
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
                          aria-label={`Select ${color}`}
                          className="rounded-full transition-all duration-300 relative"
                          style={{
                            width: 44, height: 44,
                            backgroundColor: hex,
                            border: selectedColor === color
                              ? "2px solid rgba(201,168,106,0.9)"
                              : "2px solid rgba(255,248,236,0.15)",
                            boxShadow: selectedColor === color
                              ? "0 0 0 4px rgba(201,168,106,0.2), 0 8px 24px rgba(0,0,0,0.5)"
                              : "0 4px 12px rgba(0,0,0,0.3)",
                          }}
                        >
                          {selectedColor === color && (
                            <motion.div
                              layoutId="colorSelected"
                              className="absolute inset-0 rounded-full"
                              style={{
                                background: "linear-gradient(135deg, rgba(255,248,236,0.3), transparent)",
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
                  disabled={loading || isSoldOut}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative flex-1 overflow-hidden rounded-full px-8 py-5 text-[11px] font-light uppercase tracking-[0.15em] disabled:cursor-not-allowed disabled:opacity-50"
                  style={added ? {
                    ...goldGlass,
                    transition: "all 0.5s cubic-bezier(0.22,1,0.36,1)",
                  } : {
                    ...glass,
                    transition: "all 0.5s cubic-bezier(0.22,1,0.36,1)",
                  }}
                >
                  <div className="shimmer absolute inset-0 pointer-events-none opacity-70" />
                  <div className="relative z-10 flex items-center justify-center gap-3">
                  <ShoppingBag
                    strokeWidth={1.3}
                    className="relative z-10 h-5 w-5"
                    style={{ color: added ? "#C9A86A" : "rgba(255,248,236,0.7)" }}
                  />
                  <span
                    className="relative z-10"
                    style={{ color: added ? "#C9A86A" : "rgba(255,248,236,0.8)" }}
                  >
                    {isSoldOut ? "Sold Out" : loading ? "Adding…" : added ? "Added" : "Add to Cart"}
                  </span>
                  </div>
                </motion.button>

                {/* Buy Now */}
                <motion.button
                  onClick={handleBuyNow}
                  disabled={isSoldOut}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative flex-1 overflow-hidden rounded-full px-8 py-5 text-[11px] font-light uppercase tracking-[0.15em] disabled:cursor-not-allowed disabled:opacity-50"
                  style={goldGlass}
                >
                  <div className="shimmer absolute inset-0 pointer-events-none opacity-80" />
                  <div className="relative z-10 flex items-center justify-center gap-3">
                    <Zap strokeWidth={1.3} className="relative z-10 h-5 w-5" style={{ color: "#C9A86A" }} />
                    <span className="relative z-10" style={{ color: "#C9A86A" }}>
                      {isSoldOut ? "Unavailable" : "Buy Now"}
                    </span>
                  </div>
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
                color: "#C9A86A",
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
                            background: "linear-gradient(135deg, rgba(201,168,106,0.16), rgba(201,168,106,0.05))",
                            border: "1px solid rgba(201,168,106,0.24)",
                            color: "#C9A86A",
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
                  color: "#C9A86A",
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

        {recentlyViewedProducts.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative z-10 mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-16"
          >
            <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-white/25 text-[9px] tracking-[0.4em] uppercase mb-3">Recently Viewed</p>
                <h2
                  className="font-light text-white leading-none"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "clamp(2rem, 4vw, 3rem)",
                    letterSpacing: "0.06em",
                    color: "#C9A86A",
                  }}
                >
                  Continue Browsing
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {recentlyViewedProducts.map((rp, i) => (
                <motion.div
                  key={rp._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.6 }}
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
    </MotionConfig>
  );
}
