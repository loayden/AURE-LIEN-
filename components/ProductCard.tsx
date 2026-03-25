"use client";

import type { Product } from "@/lib/types";
import {
  AnimatePresence,
  motion,
  useMotionValue, useSpring, useTransform,
} from "framer-motion";
import { ArrowRight, ChevronDown, Heart, ShoppingBag, Star, Zap } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  MouseEvent as ReactMouseEvent,
  KeyboardEvent as ReactKeyboardEvent,
  TouchEvent as ReactTouchEvent,
  useCallback, useEffect, useRef, useState,
} from "react";

interface ColorOption {
  name: string;
  hex: string;
}

interface ExtendedProduct extends Omit<Product, "colors"> {
  rating?: number;
  reviews?: number;
  badge?: "new" | "sale" | "bestseller" | "trending";
  discount?: number;
  stock?: number;
  sizes?: string[];
  colors?: ColorOption[] | string[]; // override Product.colors type safely
}

interface ProductCardProps {
  product: ExtendedProduct;
  className?: string;
  onWishlistUpdate?: (productId: string) => void;
  showRemoveFromWishlist?: boolean;
}

type WishlistSnapshotListener = (ids: Set<string>) => void;

const AUTO_MS = 3000;
const DRAG_SUPPRESS_MS = 220;
const WISHLIST_INVALIDATE_EVENT = "wishlist:invalidate";
const wishlistListeners = new Set<WishlistSnapshotListener>();

let wishlistIdsCache: Set<string> | null = null;
let wishlistIdsRequest: Promise<Set<string>> | null = null;
let wishlistInvalidationBound = false;

const badgeStyles = {
  new: { bg: "rgba(102, 153, 255, 0.85)", text: "#fff", label: "New" },
  sale: { bg: "rgba(255, 102, 102, 0.85)", text: "#fff", label: "Sale" },
  bestseller: { bg: "rgba(198, 169, 98, 0.85)", text: "#fff", label: "Best Seller" },
  trending: { bg: "rgba(255, 179, 71, 0.85)", text: "#fff", label: "Trending" },
};

// Color name to hex mapping
const COLOR_HEX_MAP: Record<string, string> = {
  black: "#000000",
  white: "#ffffff",
  cream: "#FFFDD0",
  beige: "#F5F5DC",
  navy: "#001f3f",
  gray: "#808080",
  grey: "#808080",
  brown: "#8B4513",
  camel: "#C19A6B",
  violet: "#EE82EE",
  mocha: "#6F4E37",
  green: "#008000",
  olive: "#808000",
  tan: "#D2B48C",
  sand: "#C2B280",
  charcoal: "#36454F",
  indigo: "#4B0082",
  khaki: "#F0E68C",
};

function getColorHex(colorName: string): string {
  const normalized = colorName.toLowerCase().trim();
  return COLOR_HEX_MAP[normalized] || "#000000";
}

function getOriginalPrice(price: number, discount?: number): number | null {
  if (!discount || discount <= 0 || discount >= 100) return null;
  return Math.round(price / (1 - discount / 100));
}

function formatCategoryLabel(category: string): string {
  return category
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" / ");
}

function formatSizeSummary(values: string[]): string {
  if (values.length === 0) return "Open";
  if (values.length === 1) return values[0];
  return `${values[0]} - ${values[values.length - 1]}`;
}

function cloneWishlistIds(ids?: Iterable<string>) {
  return new Set(ids ?? []);
}

function emitWishlistIds(ids: Iterable<string>) {
  wishlistIdsCache = cloneWishlistIds(ids);
  for (const listener of wishlistListeners) {
    listener(cloneWishlistIds(wishlistIdsCache));
  }
}

function subscribeToWishlist(listener: WishlistSnapshotListener) {
  wishlistListeners.add(listener);
  if (wishlistIdsCache) {
    listener(cloneWishlistIds(wishlistIdsCache));
  }

  return () => {
    wishlistListeners.delete(listener);
  };
}

async function loadWishlistIds() {
  if (wishlistIdsCache) return cloneWishlistIds(wishlistIdsCache);
  if (!wishlistIdsRequest) {
    wishlistIdsRequest = fetch("/api/wishlist/list?ids=1")
      .then((response) => response.json())
      .then((data) => {
        const nextIds = Array.isArray(data?.ids) ? data.ids.map((value: unknown) => String(value)) : [];
        emitWishlistIds(nextIds);
        return cloneWishlistIds(nextIds);
      })
      .catch(() => {
        emitWishlistIds([]);
        return new Set<string>();
      })
      .finally(() => {
        wishlistIdsRequest = null;
      });
  }

  return wishlistIdsRequest.then((ids) => cloneWishlistIds(ids));
}

function updateWishlistIds(productId: string, isInWishlist: boolean) {
  const nextIds = cloneWishlistIds(wishlistIdsCache ?? undefined);
  if (isInWishlist) {
    nextIds.add(productId);
  } else {
    nextIds.delete(productId);
  }
  emitWishlistIds(nextIds);
}

if (typeof window !== "undefined" && !wishlistInvalidationBound) {
  window.addEventListener(WISHLIST_INVALIDATE_EVENT, () => {
    wishlistIdsCache = null;
    wishlistIdsRequest = null;
  });
  wishlistInvalidationBound = true;
}

export default function ProductCard({
  product,
  className = "",
  onWishlistUpdate,
  showRemoveFromWishlist,
}: ProductCardProps) {
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);

  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inWishlist, setInWishlist] = useState(Boolean(showRemoveFromWishlist));
  const [added, setAdded] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [showSizeSelector, setShowSizeSelector] = useState(false);
  const [showColorSelector, setShowColorSelector] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const productHref = product._id
    ? `/product/${encodeURIComponent(String(product._id))}`
    : null;


  const images: string[] = (product.images || [])
    .filter((img): img is string => typeof img === "string" && img.trim() !== "");
  const count = images.length;

  // Get sizes (handle both size and sizes fields)
  const sizes = product.sizes || product.size || [];

  // Normalize colors to ColorOption[]
  const normalizedColors: ColorOption[] = (() => {
    const colorData = product.colors;
    if (!colorData || !Array.isArray(colorData)) return [];
    
    return colorData.map((color) => {
      if (typeof color === "string") {
        return { name: color, hex: getColorHex(color) };
      }
      return color as ColorOption;
    });
  })();

  const isLowStock = (product.stock ?? 10) < 5;
  const outOfStock = (product.stock ?? 1) === 0;
  const originalPrice = getOriginalPrice(product.price ?? 0, product.discount);
  const selectedColorOption = normalizedColors.find((color) => color.hex === selectedColor) ?? null;
  const displayColorOption = selectedColorOption ?? normalizedColors[0] ?? null;
  const resolvedSize = selectedSize ?? (sizes.length === 1 ? sizes[0] : null);
  const resolvedColor = selectedColor ?? (normalizedColors.length === 1 ? normalizedColors[0].hex : null);
  const categoryLabel = formatCategoryLabel(product.category ?? "");
  const sizeSummary = resolvedSize ?? formatSizeSummary(sizes);
  const colorSummary = selectedColorOption?.name ?? (displayColorOption ? displayColorOption.name : "Mono");
  const descriptionPreview =
    product.description?.trim() ||
    "Refined wardrobe staple with a composed silhouette and a more considered finish.";
  const availabilityLabel = outOfStock ? "Sold Out" : isLowStock ? "Limited" : "Ready";
  const imageCounterLabel = count > 1
    ? `${String(current + 1).padStart(2, "0")} / ${String(count).padStart(2, "0")}`
    : "Single View";

  const isInteractiveTarget = useCallback((target: EventTarget | null) => {
    if (!(target instanceof Element)) return false;

    return Boolean(
      target.closest("button, a, input, select, textarea, [role='button'], [data-card-action='true']")
    );
  }, []);

  const openProductPage = useCallback(() => {
    if (!productHref) return;
    router.push(productHref);
  }, [productHref, router]);

  function openCategoryPage(e: ReactMouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    if (!product.category) return;
    router.push(`/${encodeURIComponent(product.category)}`);
  }

  function handleViewDetails(e: ReactMouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    openProductPage();
  }

  function toggleDetailsPanel(e: ReactMouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    setDetailsOpen((currentOpen) => {
      if (currentOpen) {
        setShowSizeSelector(false);
        setShowColorSelector(false);
      }
      return !currentOpen;
    });
  }

  function onCardKeyDown(e: ReactKeyboardEvent<HTMLDivElement>) {
    if (dragging || isInteractiveTarget(e.target)) return;
    if (e.key !== "Enter" && e.key !== " ") return;

    e.preventDefault();
    openProductPage();
  }

  /* ── Auto-advance ── */
  const goTo = useCallback((idx: number, dir?: number) => {
    const next = (idx + count) % count;
    setDirection(dir ?? (next > current ? 1 : -1));
    setCurrent(next);
  }, [count, current]);

  useEffect(() => {
    if (count < 2 || paused) return;
    const t = setTimeout(() => goTo(current + 1, 1), AUTO_MS);
    return () => clearTimeout(t);
  }, [current, paused, count, goTo]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(max-width: 639px)");
    const syncViewport = (matches: boolean) => {
      setIsMobileViewport(matches);
      if (matches) {
        setDetailsOpen(true);
      }
    };

    syncViewport(mediaQuery.matches);

    const handleViewportChange = (event: MediaQueryListEvent) => {
      syncViewport(event.matches);
    };

    mediaQuery.addEventListener("change", handleViewportChange);
    return () => mediaQuery.removeEventListener("change", handleViewportChange);
  }, []);

  /* ── Touch ── */
  const tx = useRef(0), ty = useRef(0), sg = useRef<boolean | null>(null);
  function onTouchStart(e: ReactTouchEvent) { tx.current = e.touches[0].clientX; ty.current = e.touches[0].clientY; sg.current = null; setPaused(true); }
  function onTouchMove(e: ReactTouchEvent) { const dx = e.touches[0].clientX - tx.current, dy = e.touches[0].clientY - ty.current; if (sg.current === null) sg.current = Math.abs(dy) > Math.abs(dx); if (!sg.current) e.preventDefault(); }
  function onTouchEnd(e: ReactTouchEvent) {
    if (sg.current) { setPaused(false); return; }
    const dx = e.changedTouches[0].clientX - tx.current;
    if (Math.abs(dx) > 36) {
      goTo(current + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
    } else if (!isInteractiveTarget(e.target)) {
      openProductPage();
    }
    setTimeout(() => setPaused(false), 4000);
  }

  /* ── Mouse drag ── */
  const dx0 = useRef(0);
  function onMouseDown(e: ReactMouseEvent) { dx0.current = e.clientX; setDragging(false); setPaused(true); }
  function onMouseUp(e: ReactMouseEvent) {
    const d = e.clientX - dx0.current;
    if (Math.abs(d) > 36) {
      goTo(current + (d < 0 ? 1 : -1), d < 0 ? 1 : -1);
      setDragging(true);
      setTimeout(() => setDragging(false), DRAG_SUPPRESS_MS);
    }
    setTimeout(() => setPaused(false), 4000);
  }

  /* ── Tilt ── */
  const mx = useMotionValue(0), my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 90, damping: 20 });
  const sy = useSpring(my, { stiffness: 90, damping: 20 });
  const rX = useTransform(sy, v => ((v / (cardRef.current?.offsetHeight ?? 400)) - 0.5) * -3);
  const rY = useTransform(sx, v => ((v / (cardRef.current?.offsetWidth ?? 300)) - 0.5) * 3);
  function onMouseMove({ currentTarget, clientX, clientY }: ReactMouseEvent) { const { left, top } = currentTarget.getBoundingClientRect(); mx.set(clientX - left); my.set(clientY - top); }
  function onMouseLeave() { mx.set(0); my.set(0); setPaused(false); }

  /* ── Wishlist ── */
  useEffect(() => {
    if (showRemoveFromWishlist) {
      setInWishlist(true);
      return;
    }

    let active = true;
    const syncWishlistState = (ids: Set<string>) => {
      if (!active) return;
      setInWishlist(ids.has(product._id));
    };

    const unsubscribe = subscribeToWishlist(syncWishlistState);
    loadWishlistIds().then(syncWishlistState).catch(() => {});

    return () => {
      active = false;
      unsubscribe();
    };
  }, [product._id, showRemoveFromWishlist]);

  async function toggleWishlist(e: ReactMouseEvent) {
    e.preventDefault(); e.stopPropagation();
    if (!product._id) return;

    const nextInWishlist = !inWishlist;
    setInWishlist(nextInWishlist);
    updateWishlistIds(product._id, nextInWishlist);

    try {
      const response = await fetch(
        inWishlist ? "/api/wishlist/remove" : "/api/wishlist/add",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: product._id }),
        }
      );

      if (!response.ok) throw new Error("Wishlist request failed");
      if (!nextInWishlist) onWishlistUpdate?.(product._id);
    } catch {
      setInWishlist(inWishlist);
      updateWishlistIds(product._id, inWishlist);
      router.push("/login");
    }
  }

  async function handleAddToCart(e: ReactMouseEvent) {
    e.stopPropagation();
    if (!product._id || outOfStock) return;
    if (sizes.length > 1 && !selectedSize) {
      setDetailsOpen(true);
      setShowSizeSelector(true);
      setShowColorSelector(false);
      return;
    }
    if (normalizedColors.length > 1 && !selectedColor) {
      setDetailsOpen(true);
      setShowColorSelector(true);
      setShowSizeSelector(false);
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
          size: resolvedSize,
          color: resolvedColor,
        }),
      });
      if (!res.ok) throw new Error();
      setAdded(true);
      setTimeout(() => setAdded(false), 2200);
    } catch { alert("Failed to add to cart."); }
    finally { setLoading(false); }
  }


  const variants = {
    enter: (d: number) => ({ x: d * 24, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d * -24, opacity: 0 }),
  };

  return (
    <motion.div
      ref={cardRef}
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      onClick={(e) => {
        if (dragging || isInteractiveTarget(e.target)) return;
        openProductPage();
      }}
      onKeyDown={onCardKeyDown}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      role={productHref ? "link" : undefined}
      tabIndex={productHref ? 0 : -1}
      aria-label={productHref ? `Open ${product.name}` : undefined}
      style={{
        rotateX: rX, rotateY: rY,
        transformStyle: "preserve-3d",
        perspective: 900,
        borderRadius: 18,
        boxShadow: "0 1px 0 rgba(255,255,255,0.07), 0 24px 60px rgba(0,0,0,0.50)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
      whileHover={{ y: -5, boxShadow: "0 1px 0 rgba(255,255,255,0.10), 0 36px 80px rgba(0,0,0,0.60), 0 0 0 1px rgba(198,169,98,0.08)", transition: { type: "spring", stiffness: 260, damping: 26 } }}
      className={`group relative w-full flex flex-col overflow-hidden cursor-pointer select-none ${className}`}
    >

      {/* ══════════ CAROUSEL ══════════ */}
      <div
        className="relative overflow-hidden"
        style={{ aspectRatio: "4/5", touchAction: "pan-y" }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseEnter={() => setPaused(true)}
      >
        {/* Slides */}
        <AnimatePresence initial={false} custom={direction} mode="sync">
          <motion.div
            key={current}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            {images[current] ? (
              <Image
                src={images[current]}
                alt={`${product.name} — ${current + 1}`}
                fill
                sizes="(max-width:640px) 92vw, (max-width:1024px) 46vw, 25vw"
                className="object-cover"
                draggable={false}
                priority={current === 0}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-[#0f0f0f]">
                <span className="text-white/10 text-[9px] tracking-[0.4em] uppercase" style={{ fontFamily: "'Jost',sans-serif" }}>No Image</span>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Vignette */}
        <div className="absolute inset-0 pointer-events-none z-10"
          style={{ background: "linear-gradient(to top, rgba(4,4,6,0.92) 0%, rgba(4,4,6,0.18) 38%, transparent 62%)" }} />

        {/* ── Badge ── */}
        {(product.badge || product.discount) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-3 left-3 z-30 px-3 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-wider sm:text-xs"
            style={{
              background: product.badge
                ? badgeStyles[product.badge].bg
                : "rgba(198, 169, 98, 0.88)",
              color: product.badge
                ? badgeStyles[product.badge].text
                : "#110d07",
              backdropFilter: "blur(12px)",
            }}
          >
            {product.badge ? badgeStyles[product.badge].label : `${product.discount}% Off`}
          </motion.div>
        )}

        {/* ── Stock Indicator ── */}
        {isLowStock && !outOfStock && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute top-3 right-3 z-30 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-wider sm:text-xs"
            style={{
              background: "rgba(255, 179, 71, 0.85)",
              color: "#fff",
              backdropFilter: "blur(12px)",
            }}
          >
            <Zap size={12} />
            {product.stock} Left
          </motion.div>
        )}

        {/* ── Out of Stock ── */}
        {outOfStock && (
          <div className="absolute inset-0 z-40 bg-black/40 backdrop-blur-sm flex items-center justify-center">
            <div className="px-6 py-3 rounded-full font-semibold uppercase tracking-wider text-sm"
              style={{ background: "rgba(100, 100, 100, 0.9)", color: "#fff" }}>
              Out of Stock
            </div>
          </div>
        )}

        {/* ── Progress strips ── */}
        {count > 1 && (
          <div className="absolute bottom-0 inset-x-0 z-20 flex gap-[3px] px-4 pb-[14px]">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={e => { e.stopPropagation(); goTo(i, i > current ? 1 : -1); setPaused(true); setTimeout(() => setPaused(false), 4000); }}
                aria-label={`Show image ${i + 1} of ${count} for ${product.name}`}
                className="relative flex-1 overflow-hidden"
                style={{ height: 1.5, borderRadius: 9999, background: "rgba(255,255,255,0.15)" }}
              >
                {i === current && !paused ? (
                  <motion.div key={`p-${current}`} className="absolute inset-y-0 left-0 rounded-full"
                    style={{ background: "rgba(198,169,98,0.85)" }}
                    initial={{ width: "0%" }} animate={{ width: "100%" }}
                    transition={{ duration: AUTO_MS / 1000, ease: "linear" }} />
                ) : (
                  <div className="absolute inset-y-0 left-0 rounded-full"
                    style={{ width: i < current ? "100%" : "0%", background: i < current ? "rgba(255,255,255,0.45)" : "transparent" }} />
                )}
              </button>
            ))}
          </div>
        )}

        {/* ── Wishlist ── */}
        <motion.button
          type="button"
          onClick={toggleWishlist}
          className="absolute bottom-2.5 right-2.5 sm:bottom-4 sm:right-4 z-30 flex items-center justify-center rounded-full"
          style={{
            width: 44,
            height: 44,
            background: inWishlist ? "rgba(180,40,40,0.75)" : "rgba(0,0,0,0.42)",
            backdropFilter: "blur(20px)",
            border: inWishlist ? "1px solid rgba(255,80,80,0.35)" : "1px solid rgba(255,255,255,0.10)",
            boxShadow: inWishlist ? "0 0 18px rgba(255,60,60,0.20)" : "none",
          }}
          whileTap={{ scale: 0.8 }}
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className="w-4 h-4 transition-all duration-300"
            strokeWidth={inWishlist ? 0 : 1.5}
            style={{ color: "#fff", fill: inWishlist ? "#fff" : "none", opacity: inWishlist ? 1 : 0.65 }} />
        </motion.button>

       
      </div>

      {/* ══════════ LABEL ══════════ */}
      <div
        className="relative z-10 flex flex-col gap-4 px-4 pb-4 pt-4"
        style={{
          background: "linear-gradient(170deg, rgba(20,17,13,0.9) 0%, rgba(9,8,7,0.97) 100%)",
          backdropFilter: "blur(36px) saturate(140%)",
          WebkitBackdropFilter: "blur(36px) saturate(140%)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* Specular inset top edge */}
        <div className="absolute inset-x-0 top-0 h-px pointer-events-none"
          style={{ background: "linear-gradient(90deg, transparent 5%, rgba(255,255,255,0.10) 40%, rgba(255,255,255,0.10) 60%, transparent 95%)" }} />

        <div className="space-y-3">
          <h3 className="font-light leading-snug line-clamp-2"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(1.05rem, 4vw, 1.28rem)",
              letterSpacing: "0.045em",
              color: "rgba(255,255,255,0.92)",
            }}>
            {product.name}
          </h3>

          <div className="flex items-end justify-between gap-3">
            <div>
              <p
                className="mb-1 text-[8px] uppercase tracking-[0.32em] text-white/50"
                style={{ fontFamily: "'Jost', sans-serif" }}
              >
                Private Price
              </p>
              {originalPrice ? (
                <>
                  <p
                    className="text-[10px] line-through text-white/50"
                    style={{ fontFamily: "'Jost', sans-serif", letterSpacing: "0.08em" }}
                  >
                    EGP {originalPrice.toLocaleString()}
                  </p>
                  <p
                    className="mt-1 font-light text-[#C6A962]"
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "1.45rem",
                      letterSpacing: "0.04em",
                    }}
                  >
                    EGP {(product.price ?? 0).toLocaleString()}
                  </p>
                </>
              ) : (
                <p
                  className="font-light text-[#C6A962]"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "1.45rem",
                    letterSpacing: "0.04em",
                  }}
                >
                  EGP {(product.price ?? 0).toLocaleString()}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={toggleDetailsPanel}
              aria-expanded={detailsOpen}
              aria-label={detailsOpen ? "Collapse product details" : "Expand product details"}
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 rounded-full border border-white/10 px-4 py-3 text-[10px] uppercase tracking-[0.22em] text-white/84 transition-colors hover:text-white"
              style={{ fontFamily: "'Jost', sans-serif", background: "rgba(255,255,255,0.04)" }}
            >
              {detailsOpen ? "Less" : "More"}
              <span
                style={{
                  transform: `rotate(${detailsOpen ? 180 : 0}deg)`,
                  transition: "transform 0.25s ease-out",
                }}
              >
                <ChevronDown strokeWidth={1.2} className="h-3.5 w-3.5" />
              </span>
            </button>
          </div>
        </div>

        {detailsOpen ? (
          <div className="flex flex-col gap-4 pt-1">
                <div className="flex items-center justify-between gap-3">
                  {product.category ? (
                    <button
                      type="button"
                      onClick={openCategoryPage}
                      className="inline-flex min-h-[44px] min-w-[44px] items-center rounded-full px-3.5 py-2 text-[9px] uppercase tracking-[0.26em] text-white/76 transition-colors hover:text-white"
                      style={{
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        fontFamily: "'Jost', sans-serif",
                      }}
                    >
                      {categoryLabel}
                    </button>
                  ) : <span />}

                  <span
                    className="text-[9px] uppercase tracking-[0.3em] text-white/52"
                    style={{ fontFamily: "'Jost', sans-serif" }}
                  >
                    {imageCounterLabel}
                  </span>
                </div>

                <div className="space-y-2">
                  <p
                    className="line-clamp-2 text-[11px] leading-relaxed text-white/62 sm:text-[12px]"
                    style={{ fontFamily: "'Jost', sans-serif", letterSpacing: "0.05em" }}
                  >
                    {descriptionPreview}
                  </p>

                  {product.rating && (
                    <div className="flex items-center gap-1 mt-1">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={12} className="transition-colors"
                            style={{
                              fill: i < Math.floor(product.rating!) ? "#C6A962" : "transparent",
                              color: "#C6A962",
                              opacity: i < Math.floor(product.rating!) ? 1 : 0.3,
                            }} />
                        ))}
                      </div>
                      {product.reviews && (
                        <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.5)" }}>
                          ({product.reviews})
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "Sizing", value: sizeSummary },
                    { label: "Palette", value: colorSummary },
                    { label: "Status", value: availabilityLabel },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-2xl px-3 py-3"
                      style={{
                        background: "linear-gradient(145deg, rgba(255,255,255,0.055), rgba(255,255,255,0.02))",
                        border: "1px solid rgba(255,255,255,0.07)",
                      }}
                    >
                      <p
                        className="mb-1 text-[8px] uppercase tracking-[0.28em] text-white/48"
                        style={{ fontFamily: "'Jost', sans-serif" }}
                      >
                        {item.label}
                      </p>
                      <p
                        className="line-clamp-1 text-[10px] text-white/74 sm:text-[11px]"
                        style={{ fontFamily: "'Jost', sans-serif", letterSpacing: "0.06em" }}
                      >
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {sizes && sizes.length > 0 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowSizeSelector(!showSizeSelector);
                        setShowColorSelector(false);
                      }}
                      className="inline-flex min-h-[44px] min-w-[44px] items-center rounded-2xl px-3.5 py-2 text-[11px] transition-all"
                      style={{
                        background: resolvedSize ? "rgba(198,169,98,0.16)" : "rgba(255,255,255,0.06)",
                        color: resolvedSize ? "#F1D79A" : "rgba(255,255,255,0.62)",
                        border: resolvedSize ? "1px solid rgba(198,169,98,0.34)" : "1px solid rgba(255,255,255,0.08)",
                        fontFamily: "'Jost', sans-serif",
                        fontWeight: 400,
                        letterSpacing: "0.08em",
                      }}
                    >
                      {resolvedSize ? `Size ${resolvedSize}` : "Select Size"}
                    </button>
                  )}

                  {normalizedColors.length > 0 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowColorSelector(!showColorSelector);
                        setShowSizeSelector(false);
                      }}
                      className="inline-flex min-h-[44px] min-w-[44px] items-center gap-2 rounded-2xl px-3.5 py-2 transition-all"
                      style={{
                        background: displayColorOption ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.04)",
                        border: selectedColorOption ? "1px solid rgba(198,169,98,0.34)" : "1px solid rgba(255,255,255,0.08)",
                      }}
                      title={`Color: ${colorSummary}`}
                    >
                      {displayColorOption ? (
                        <>
                          <span
                            className="h-4 w-4 rounded-full border border-white/15"
                            style={{ background: displayColorOption.hex }}
                          />
                          <span
                            className="text-[11px] text-white/66"
                            style={{ fontFamily: "'Jost', sans-serif", letterSpacing: "0.08em" }}
                          >
                            {selectedColorOption ? selectedColorOption.name : "Choose Tone"}
                          </span>
                        </>
                      ) : (
                        <span
                          className="text-[11px] text-white/66"
                          style={{ fontFamily: "'Jost', sans-serif", letterSpacing: "0.08em" }}
                        >
                          No Palette
                        </span>
                      )}
                    </button>
                  )}
                </div>

                <AnimatePresence>
                  {showSizeSelector && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex flex-wrap gap-1.5 mt-1 rounded-2xl border border-white/8 bg-white/[0.03] p-2.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {sizes.map((size) => (
                        <button
                          type="button"
                          key={size}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedSize(size);
                            setShowSizeSelector(false);
                          }}
                          className="min-h-[44px] min-w-[44px] rounded-xl px-3 py-2 text-[10px] uppercase tracking-[0.18em] transition-all"
                          style={{
                            background: selectedSize === size ? "rgba(198,169,98,0.16)" : "rgba(255,255,255,0.05)",
                            color: selectedSize === size ? "#F3DEAB" : "rgba(255,255,255,0.62)",
                            border: selectedSize === size ? "1px solid rgba(198,169,98,0.36)" : "1px solid rgba(255,255,255,0.08)",
                            fontFamily: "'Jost', sans-serif",
                          }}
                        >
                          {size}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {showColorSelector && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex flex-wrap gap-2 mt-1 rounded-2xl border border-white/8 bg-white/[0.03] p-2.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {normalizedColors.map((color) => (
                        <button
                          type="button"
                          key={color.hex}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedColor(color.hex);
                            setShowColorSelector(false);
                          }}
                          className="flex h-10 min-w-[44px] items-center justify-center rounded-xl border-2 px-3 transition-all"
                          style={{
                            background: color.hex,
                            borderColor: selectedColor === color.hex ? "#C6A962" : "transparent",
                            opacity: 0.9,
                          }}
                          title={color.name}
                        >
                          <span className="sr-only">{color.name}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div
                  className="rounded-[1.35rem] p-3.5"
                  style={{
                    background: "linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
                    border: "1px solid rgba(255,255,255,0.08)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
                  }}
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                      <p
                        className="text-[8px] uppercase tracking-[0.3em] text-white/48"
                        style={{ fontFamily: "'Jost', sans-serif" }}
                      >
                        Selection
                      </p>
                      <p
                        className="mt-1 text-[10px] text-white/66"
                        style={{ fontFamily: "'Jost', sans-serif", letterSpacing: "0.06em" }}
                      >
                        {resolvedSize ?? (sizes.length ? "Choose size" : "One fit")}
                      </p>
                      <p
                        className="mt-1 text-[10px] text-white/48"
                        style={{ fontFamily: "'Jost', sans-serif", letterSpacing: "0.06em" }}
                      >
                        {selectedColorOption?.name ?? (displayColorOption ? `Tone ${displayColorOption.name}` : "Single tone")}
                      </p>
                    </div>

                    <div className="text-right">
                      <p
                        className="text-[8px] uppercase tracking-[0.3em] text-white/48"
                        style={{ fontFamily: "'Jost', sans-serif" }}
                      >
                        Availability
                      </p>
                      <p
                        className="mt-1 text-[10px] text-white/66"
                        style={{ fontFamily: "'Jost', sans-serif", letterSpacing: "0.06em" }}
                      >
                        {availabilityLabel}
                      </p>
                    </div>
                  </div>

                  <div className={`grid gap-2 ${isMobileViewport ? "grid-cols-1" : "grid-cols-2"}`}>
                    <button
                      type="button"
                      onClick={handleViewDetails}
                      className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 rounded-full border border-white/10 px-4 py-3 text-[10px] uppercase tracking-[0.22em] text-white/84 transition-colors hover:text-white"
                      style={{ fontFamily: "'Jost', sans-serif", background: "rgba(255,255,255,0.04)" }}
                    >
                      Details
                      <ArrowRight strokeWidth={1.2} className="h-3.5 w-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={handleAddToCart}
                      disabled={loading || outOfStock}
                      className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 rounded-full px-4 py-3 text-[10px] uppercase tracking-[0.22em] transition-all disabled:opacity-35"
                      style={{
                        fontFamily: "'Jost', sans-serif",
                        background: added
                          ? "linear-gradient(135deg, rgba(198,169,98,0.28), rgba(198,169,98,0.10))"
                          : "linear-gradient(135deg, rgba(198,169,98,0.88), rgba(167,134,66,0.92))",
                        color: added ? "#F5E7BD" : "#0f0b05",
                        border: added
                          ? "1px solid rgba(198,169,98,0.45)"
                          : "1px solid rgba(198,169,98,0.65)",
                        boxShadow: added ? "0 0 20px rgba(198,169,98,0.22)" : "0 14px 30px rgba(198,169,98,0.18)",
                      }}
                      aria-label={added ? "Added" : "Add to cart"}
                    >
                      <ShoppingBag strokeWidth={1.25} className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                      {added ? "Added" : "Add to Cart"}
                    </button>
                  </div>
                </div>
          </div>
        ) : null}
      </div>

      {/* Gold bottom accent line on hover */}
      <motion.div
        className="absolute inset-x-0 bottom-0 h-px pointer-events-none z-50"
        initial={{ scaleX: 0, opacity: 0 }}
        whileHover={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{ background: "linear-gradient(90deg, transparent, rgba(198,169,98,0.6), transparent)", transformOrigin: "center" }}
      />
    </motion.div>
  );
}
