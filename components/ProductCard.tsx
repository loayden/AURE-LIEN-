"use client";

import { usePerformanceProfile } from "@/hooks/usePerformanceProfile";
import { getProductColorHex as getColorHex } from "@/lib/productColors";
import { getProductConfidence, resolveProductDisplayImage, stockLabel, stockState } from "@/lib/commerce";
import { showToast } from "@/components/ToastProvider";
import { useTimeoutRegistry } from "@/hooks/useTimeoutRegistry";
import type { Product } from "@/lib/types";
import {
  AnimatePresence,
  motion,
} from "framer-motion";
import { ChevronDown, Heart, ShieldCheck, ShoppingBag, Zap } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  MouseEvent as ReactMouseEvent,
  KeyboardEvent as ReactKeyboardEvent,
  TouchEvent as ReactTouchEvent,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
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
  disableMediaCarousel?: boolean;
  compact?: boolean;
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
  new: { bg: "rgba(102, 153, 255, 0.85)", text: "#1D1815", label: "New" },
  sale: { bg: "rgba(255, 102, 102, 0.85)", text: "#1D1815", label: "Sale" },
  bestseller: { bg: "rgba(168, 121, 53, 0.85)", text: "#1D1815", label: "Best Seller" },
  trending: { bg: "rgba(255, 179, 71, 0.85)", text: "#1D1815", label: "Trending" },
};

const slideVariants = {
  enter: (direction: number) => ({ x: direction * 24, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction * -24, opacity: 0 }),
};

function getMediaZoom(productName: string, productCategory?: string, image?: string) {
  const subject = `${productName} ${productCategory ?? ""} ${image ?? ""}`
    .replace(/[_-]+/g, " ")
    .toLowerCase();

  if (/\b(pants|denim|jeans|trouser|trousers|chino|cargo|baggy|korean)\b/.test(subject)) {
    return 1.18;
  }

  if (/\b(sneaker|sneakers|shoe|shoes|loafer|loafers|boot|boots|lace ups)\b/.test(subject)) {
    return 1.1;
  }

  return 1.02;
}

interface ProductCardMediaProps {
  galleryEnabled: boolean;
  compact: boolean;
  images: string[];
  current: number;
  direction: number;
  count: number;
  productName: string;
  productCategory?: string;
  badge?: ExtendedProduct["badge"];
  discount?: number;
  stock?: number;
  isLowStock: boolean;
  outOfStock: boolean;
  inWishlist: boolean;
  autoplayEnabled: boolean;
  onGoTo: (index: number, direction?: number) => void;
  onScheduleResumeAutoplay: () => void;
  onTouchStart: (event: ReactTouchEvent<HTMLDivElement>) => void;
  onTouchMove: (event: ReactTouchEvent<HTMLDivElement>) => void;
  onTouchEnd: (event: ReactTouchEvent<HTMLDivElement>) => void;
  onMouseDown: (event: ReactMouseEvent<HTMLDivElement>) => void;
  onMouseUp: (event: ReactMouseEvent<HTMLDivElement>) => void;
  onMouseEnter: () => void;
  onToggleWishlist: (event: ReactMouseEvent<HTMLButtonElement>) => void;
}

const ProductCardMedia = memo(function ProductCardMedia({
  galleryEnabled,
  compact,
  images,
  current,
  direction,
  count,
  productName,
  productCategory,
  badge,
  discount,
  stock,
  isLowStock,
  outOfStock,
  inWishlist,
  autoplayEnabled,
  onGoTo,
  onScheduleResumeAutoplay,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  onMouseDown,
  onMouseUp,
  onMouseEnter,
  onToggleWishlist,
}: ProductCardMediaProps) {
  const mediaZoom = getMediaZoom(productName, productCategory, images[current]);

  return (
    <div
      className="relative z-10 overflow-hidden"
      style={{ aspectRatio: "4 / 5", background: "#FFFFFF", touchAction: galleryEnabled ? "pan-y" : "auto" }}
      onTouchStart={galleryEnabled ? onTouchStart : undefined}
      onTouchMove={galleryEnabled ? onTouchMove : undefined}
      onTouchEnd={galleryEnabled ? onTouchEnd : undefined}
      onMouseDown={galleryEnabled ? onMouseDown : undefined}
      onMouseUp={galleryEnabled ? onMouseUp : undefined}
      onMouseEnter={galleryEnabled ? onMouseEnter : undefined}
    >
      <AnimatePresence initial={false} custom={direction} mode="sync">
        <motion.div
          key={current}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          {images[current] ? (
            <Image
              src={images[current]}
              alt={`${productName} — ${current + 1}`}
              fill
              sizes="(max-width:640px) 92vw, (max-width:1024px) 46vw, 25vw"
              className="object-contain p-3 transition-transform duration-500 ease-out"
              style={{ transform: `scale(${mediaZoom})` }}
              draggable={false}
            />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center"
              style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.48), rgba(245,241,232,0.72))" }}
            >
              <span className="text-[#7B6E60]/45 text-[9px] tracking-[0.4em] uppercase" style={{ fontFamily: "'Jost',sans-serif" }}>
                No Image
              </span>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {(badge || discount) && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`pointer-events-none absolute z-30 rounded-full font-light uppercase ${
            compact
              ? "left-[4.25rem] top-3 px-2.5 py-1 text-[8px] tracking-[0.18em]"
              : "left-3 top-3 px-3 py-1.5 text-[10px] tracking-[0.22em]"
          }`}
          style={{
            background: badge
              ? badgeStyles[badge].bg
              : compact
                ? "rgba(255,249,239,0.84)"
                : "rgba(168, 121, 53, 0.88)",
            color: badge ? badgeStyles[badge].text : compact ? "#7A581F" : "#110d07",
            backdropFilter: "blur(12px)",
            border: compact ? "1px solid rgba(168,121,53,0.22)" : undefined,
            boxShadow: compact ? "0 10px 24px rgba(61,48,37,0.10)" : undefined,
          }}
        >
          {badge ? badgeStyles[badge].label : `${discount}% Off`}
        </motion.div>
      )}

      {isLowStock && !outOfStock && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute bottom-3 left-3 z-30 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-light uppercase tracking-[0.22em]"
          style={{
            background: "rgba(255,249,239,0.86)",
            color: "#F1D79A",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(168,121,53,0.24)",
          }}
        >
          <Zap size={12} />
          {stock} Left
        </motion.div>
      )}

      {outOfStock && (
        <div
          className="absolute inset-0 z-40 flex items-center justify-center"
          style={{ background: "linear-gradient(180deg, rgba(61,48,37,0.18), rgba(61,48,37,0.42))", backdropFilter: "blur(12px)" }}
        >
          <div
            className="rounded-full px-6 py-3 text-[10px] font-light uppercase tracking-[0.3em]"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.72), rgba(245,241,232,0.56))",
              border: "1px solid rgba(123,103,82,0.18)",
              color: "rgba(61,48,37,0.82)",
            }}
          >
            Out of Stock
          </div>
        </div>
      )}

      {galleryEnabled && count > 1 && (
        <div className={`absolute bottom-0 inset-x-0 z-20 flex gap-[3px] ${compact ? "px-3 pb-2.5" : "px-4 pb-[14px]"}`}>
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onGoTo(i, i > current ? 1 : -1);
                onScheduleResumeAutoplay();
              }}
              aria-label={`Show image ${i + 1} of ${count} for ${productName}`}
              className="relative flex-1 overflow-hidden"
              style={{ height: 1.5, borderRadius: 9999, background: "rgba(61,48,37,0.18)" }}
            >
              {i === current && autoplayEnabled ? (
                <motion.div
                  key={`p-${current}`}
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{ background: "rgba(168,121,53,0.85)" }}
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: AUTO_MS / 1000, ease: "linear" }}
                />
              ) : (
                <div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{
                    width: i < current ? "100%" : "0%",
                    background: i < current ? "rgba(61,48,37,0.42)" : "transparent",
                  }}
                />
              )}
            </button>
          ))}
        </div>
      )}

      <motion.button
        type="button"
        onClick={onToggleWishlist}
        className="absolute right-3 top-3 z-30 flex items-center justify-center rounded-full"
        style={{
          width: compact ? 38 : 44,
          height: compact ? 38 : 44,
          background: inWishlist
            ? "rgba(168,121,53,0.22)"
            : "rgba(255,249,239,0.66)",
          backdropFilter: "blur(16px)",
          border: inWishlist ? "1px solid rgba(168,121,53,0.34)" : "1px solid rgba(123,103,82,0.16)",
        }}
        whileTap={{ scale: 0.8 }}
        aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart
          className="w-4 h-4 transition-all duration-300"
          strokeWidth={inWishlist ? 0 : 1.5}
          style={{ color: inWishlist ? "#A87935" : "#3D3025", fill: inWishlist ? "#A87935" : "none", opacity: inWishlist ? 1 : 0.72 }}
        />
      </motion.button>
    </div>
  );
});

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

function ProductCardComponent({
  product,
  className = "",
  onWishlistUpdate,
  showRemoveFromWishlist,
  disableMediaCarousel = false,
  compact = false,
}: ProductCardProps) {
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);
  const resumeTimeoutRef = useRef<number | null>(null);
  const mountedRef = useRef(true);
  const { finePointer, lowEndDevice, prefersReducedMotion } = usePerformanceProfile();
  const { registerTimeout } = useTimeoutRegistry();

  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inWishlist, setInWishlist] = useState(Boolean(showRemoveFromWishlist));
  const [added, setAdded] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [isInViewport, setIsInViewport] = useState(false);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);
  const productHref = product._id
    ? `/product/${encodeURIComponent(String(product._id))}`
    : null;

  const images = useMemo(
    () =>
      (product.images || []).filter(
        (img): img is string => typeof img === "string" && img.trim() !== ""
      ).map((image) => resolveProductDisplayImage(image, product)),
    [product]
  );
  const count = images.length;
  const sizes = useMemo(() => product.sizes || product.size || [], [product.size, product.sizes]);
  const normalizedColors = useMemo<ColorOption[]>(() => {
    const colorData = product.colors;
    if (!colorData || !Array.isArray(colorData)) return [];

    return colorData.map((color) => {
      if (typeof color === "string") {
        return { name: color, hex: getColorHex(color) };
      }
      return color as ColorOption;
    });
  }, [product.colors]);

  const productStockState = stockState(product);
  const confidence = getProductConfidence(product);
  const isLowStock = productStockState === "low-stock";
  const outOfStock = productStockState === "sold-out";
  const originalPrice = getOriginalPrice(product.price ?? 0, product.discount);
  const selectedColorOption = normalizedColors.find((color) => color.name === selectedColor) ?? null;
  const displayColorOption = selectedColorOption ?? normalizedColors[0] ?? null;
  const resolvedSize = selectedSize ?? (sizes.length === 1 ? sizes[0] : null);
  const resolvedColor = selectedColor ?? (normalizedColors.length === 1 ? normalizedColors[0].name : null);
  const categoryLabel = formatCategoryLabel(product.category ?? "");
  const colorSummary = selectedColorOption?.name ?? (displayColorOption ? displayColorOption.name : "Choose Tone");
  const availabilityLabel = stockLabel(product);
  const mediaGalleryEnabled = !disableMediaCarousel && count > 1;
  const tiltEnabled = finePointer && !isMobileViewport && !lowEndDevice && !prefersReducedMotion;
  const autoplayEnabled =
    mediaGalleryEnabled &&
    isInViewport &&
    !paused &&
    !isMobileViewport &&
    !lowEndDevice &&
    !prefersReducedMotion;

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

  const clearResumeTimeout = useCallback(() => {
    if (resumeTimeoutRef.current !== null) {
      window.clearTimeout(resumeTimeoutRef.current);
      resumeTimeoutRef.current = null;
    }
  }, []);

  const scheduleResumeAutoplay = useCallback(() => {
    clearResumeTimeout();
    resumeTimeoutRef.current = registerTimeout(() => {
      resumeTimeoutRef.current = null;
      setPaused(false);
    }, 4000);
  }, [clearResumeTimeout, registerTimeout]);

  const showTransientError = useCallback(
    (message: string) => {
      setFeedbackError(message);
      registerTimeout(() => setFeedbackError(null), 2800);
    },
    [registerTimeout]
  );

  const handleViewDetails = useCallback((e: ReactMouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    openProductPage();
  }, [openProductPage]);

  const toggleDetailsPanel = useCallback((e: ReactMouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDetailsOpen((currentOpen) => !currentOpen);
  }, []);

  const onCardKeyDown = useCallback((e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (dragging || isInteractiveTarget(e.target)) return;
    if (e.key !== "Enter" && e.key !== " ") return;

    e.preventDefault();
    openProductPage();
  }, [dragging, isInteractiveTarget, openProductPage]);

  /* ── Auto-advance ── */
  const goTo = useCallback((idx: number, dir?: number) => {
    if (count === 0) return;
    const next = (idx + count) % count;
    setCurrent((previous) => {
      setDirection(dir ?? (next > previous ? 1 : -1));
      return next;
    });
  }, [count]);

  useEffect(() => {
    if (!autoplayEnabled) return;
    const t = setTimeout(() => goTo(current + 1, 1), AUTO_MS);
    return () => clearTimeout(t);
  }, [autoplayEnabled, current, goTo]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(max-width: 639px)");
    const syncViewport = (matches: boolean) => {
      setIsMobileViewport(matches);
    };

    syncViewport(mediaQuery.matches);

    const handleViewportChange = (event: MediaQueryListEvent) => {
      syncViewport(event.matches);
    };

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleViewportChange);
      return () => mediaQuery.removeEventListener("change", handleViewportChange);
    }

    mediaQuery.addListener(handleViewportChange);
    return () => mediaQuery.removeListener(handleViewportChange);
  }, []);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      clearResumeTimeout();
    };
  }, [clearResumeTimeout]);

  useEffect(() => {
    if (count === 0) {
      setCurrent(0);
      return;
    }

    setCurrent((previous) => (previous >= count ? 0 : previous));
  }, [count]);

  useEffect(() => {
    const node = cardRef.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setIsInViewport(true);
      return;
    }

    // Pause carousels and progress animations while cards are offscreen.
    const observer = new IntersectionObserver(
      ([entry]) => setIsInViewport(entry.isIntersecting),
      { threshold: 0.2 }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  /* ── Touch ── */
  const tx = useRef(0), ty = useRef(0), sg = useRef<boolean | null>(null);
  const onTouchStart = useCallback((e: ReactTouchEvent<HTMLDivElement>) => {
    tx.current = e.touches[0].clientX;
    ty.current = e.touches[0].clientY;
    sg.current = null;
    setPaused(true);
  }, []);

  const onTouchMove = useCallback((e: ReactTouchEvent<HTMLDivElement>) => {
    const dx = e.touches[0].clientX - tx.current;
    const dy = e.touches[0].clientY - ty.current;
    if (sg.current === null) sg.current = Math.abs(dy) > Math.abs(dx);
    if (!sg.current) e.preventDefault();
  }, []);

  const onTouchEnd = useCallback((e: ReactTouchEvent<HTMLDivElement>) => {
    if (sg.current) { setPaused(false); return; }
    const dx = e.changedTouches[0].clientX - tx.current;
    if (Math.abs(dx) > 36) {
      goTo(current + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
    } else if (!isInteractiveTarget(e.target)) {
      openProductPage();
    }
    scheduleResumeAutoplay();
  }, [current, goTo, isInteractiveTarget, openProductPage, scheduleResumeAutoplay]);

  /* ── Mouse drag ── */
  const dx0 = useRef(0);
  const onMouseDown = useCallback((e: ReactMouseEvent<HTMLDivElement>) => {
    dx0.current = e.clientX;
    setDragging(false);
    setPaused(true);
  }, []);

  const onMouseUp = useCallback((e: ReactMouseEvent<HTMLDivElement>) => {
    const d = e.clientX - dx0.current;
    if (Math.abs(d) > 36) {
      goTo(current + (d < 0 ? 1 : -1), d < 0 ? 1 : -1);
      setDragging(true);
      registerTimeout(() => setDragging(false), DRAG_SUPPRESS_MS);
    }
    scheduleResumeAutoplay();
  }, [current, goTo, registerTimeout, scheduleResumeAutoplay]);

  const handleMediaMouseEnter = useCallback(() => {
    if (!autoplayEnabled) return;
    clearResumeTimeout();
    setPaused(true);
  }, [autoplayEnabled, clearResumeTimeout]);

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

  const toggleWishlist = useCallback(async (e: ReactMouseEvent<HTMLButtonElement>) => {
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
      showToast(nextInWishlist ? "Saved to wishlist." : "Removed from wishlist.", "success");
    } catch {
      setInWishlist(inWishlist);
      updateWishlistIds(product._id, inWishlist);
      showToast("Please sign in to manage your wishlist.", "error");
      router.push("/login");
    }
  }, [inWishlist, onWishlistUpdate, product._id, router]);

  const selectSize = useCallback((e: ReactMouseEvent<HTMLButtonElement>, size: string) => {
    e.stopPropagation();
    setSelectedSize(size);
  }, []);

  const selectColor = useCallback((e: ReactMouseEvent<HTMLButtonElement>, colorName: string) => {
    e.stopPropagation();
    setSelectedColor(colorName);
  }, []);

  const handleCardClick = useCallback((e: ReactMouseEvent<HTMLDivElement>) => {
    if (dragging || isInteractiveTarget(e.target)) return;
    openProductPage();
  }, [dragging, isInteractiveTarget, openProductPage]);

  const handleCardMouseLeave = useCallback(() => {
    clearResumeTimeout();
    setPaused(false);
  }, [clearResumeTimeout]);

  async function handleAddToCart(e: ReactMouseEvent) {
    e.stopPropagation();
    if (!product._id || outOfStock) return;
    if (sizes.length > 1 && !selectedSize) {
      setDetailsOpen(true);
      return;
    }
    if (normalizedColors.length > 1 && !selectedColor) {
      setDetailsOpen(true);
      return;
    }
    try {
      setLoading(true);
      setFeedbackError(null);
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
      if (!mountedRef.current) return;
      setAdded(true);
      window.dispatchEvent(new Event("cart:changed"));
      showToast("Added to cart.", "success");
      registerTimeout(() => setAdded(false), 2200);
    } catch {
      if (!mountedRef.current) return;
      showTransientError("Unable to add this piece right now.");
      showToast("Unable to add this piece right now.", "error");
    }
    finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }

  return (
    <motion.div
      ref={cardRef}
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      onClick={handleCardClick}
      onKeyDown={onCardKeyDown}
      onMouseLeave={handleCardMouseLeave}
      role={productHref ? "link" : undefined}
      tabIndex={productHref ? 0 : -1}
      aria-label={productHref ? `Open ${product.name}` : undefined}
      style={{
        borderRadius: compact ? 16 : 18,
        background: compact ? "#FFFDF8" : "linear-gradient(145deg, rgba(255,255,255,0.78), rgba(245,241,232,0.70))",
        boxShadow: compact ? "0 10px 26px rgba(61,48,37,0.08)" : "0 16px 40px rgba(61,48,37,0.10)",
        border: "1px solid rgba(123,103,82,0.14)",
      }}
      whileHover={
        tiltEnabled
          ? {
              y: -3,
              boxShadow: "0 18px 44px rgba(61,48,37,0.13), 0 0 0 1px rgba(168,121,53,0.12)",
              transition: { type: "spring", stiffness: 260, damping: 26 },
            }
          : undefined
      }
      className={`group relative w-full flex flex-col overflow-hidden cursor-pointer select-none ${className}`}
    >
      <ProductCardMedia
        galleryEnabled={mediaGalleryEnabled}
        compact={compact}
        images={images}
        current={current}
        direction={direction}
        count={count}
        productName={product.name}
        productCategory={product.category}
        badge={product.badge}
        discount={product.discount}
        stock={product.stock}
        isLowStock={isLowStock}
        outOfStock={outOfStock}
        inWishlist={inWishlist}
        autoplayEnabled={autoplayEnabled}
        onGoTo={goTo}
        onScheduleResumeAutoplay={scheduleResumeAutoplay}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseEnter={handleMediaMouseEnter}
        onToggleWishlist={toggleWishlist}
      />

      {/* ══════════ LABEL ══════════ */}
      <div
        className={`relative z-10 flex flex-col ${compact ? "gap-1 px-3 pb-3 pt-2.5" : "gap-2 px-4 pb-4 pt-3.5"}`}
        style={{
          background: compact ? "#FFFFFF" : "linear-gradient(180deg, rgba(255,249,239,0.96), rgba(245,241,232,0.94))",
          borderTop: "1px solid rgba(123,103,82,0.14)",
        }}
      >
        <div className={compact ? "space-y-1.5" : "space-y-2"}>
          <AnimatePresence>
            {feedbackError ? (
              <motion.div
                initial={{ opacity: 0, y: -6, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -6, height: 0 }}
                className="overflow-hidden rounded-2xl px-3 py-2"
                style={{
                  background: "rgba(154,34,34,0.08)",
                  border: "1px solid rgba(154,34,34,0.22)",
                }}
              >
                <p
                  className="text-[9px] uppercase tracking-[0.22em]"
                  style={{ color: "#9A2222", fontFamily: "'Jost', sans-serif" }}
                >
                  {feedbackError}
                </p>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <div className={`flex items-center justify-between gap-3 uppercase ${compact ? "text-[7px] tracking-[0.14em]" : "text-[8px] tracking-[0.18em]"}`}>
            <span className="truncate text-[#A87935]" style={{ fontFamily: "'Jost', sans-serif" }}>
              {categoryLabel || "Catalog"}
            </span>
            <span
              className={`shrink-0 ${
                outOfStock ? "text-red-700/70" : isLowStock ? "text-[#A87935]" : "text-[#7B6E60]/62"
              }`}
              style={{ fontFamily: "'Jost', sans-serif" }}
            >
              {availabilityLabel}
            </span>
          </div>

          <h3
            className="font-light leading-[1.05] line-clamp-2"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: compact ? "0.96rem" : "clamp(1.08rem, 4vw, 1.24rem)",
              minHeight: compact ? "1.95rem" : "2.45rem",
              letterSpacing: "0.03em",
              color: "rgba(61,48,37,0.92)",
            }}>
            {product.name}
          </h3>

          <div className={`flex items-end justify-between gap-3 border-t border-[rgba(123,103,82,0.12)] ${compact ? "pt-2" : "pt-2.5"}`}>
            <div>
              {originalPrice ? (
                <>
                  <p
                    className={`${compact ? "text-[8px]" : "text-[10px]"} line-through text-[#7B6E60]/62`}
                    style={{ fontFamily: "'Jost', sans-serif", letterSpacing: "0.08em" }}
                  >
                    EGP {originalPrice.toLocaleString()}
                  </p>
                  <p
                    className="font-light text-[#A87935]"
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: compact ? "1rem" : "1.26rem",
                      letterSpacing: "0.04em",
                    }}
                  >
                    EGP {(product.price ?? 0).toLocaleString()}
                  </p>
                </>
              ) : (
                <p
                  className="font-light text-[#A87935]"
                  style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: compact ? "1rem" : "1.26rem",
                  letterSpacing: "0.04em",
                }}
                >
                  EGP {(product.price ?? 0).toLocaleString()}
                </p>
              )}
            </div>

            <span className={`${compact ? "text-[7px] tracking-[0.13em]" : "text-[8px] tracking-[0.16em]"} inline-flex shrink-0 items-center gap-1 rounded-full border border-[rgba(168,121,53,0.14)] px-2 py-1 uppercase text-[#7A581F]`}>
              <ShieldCheck className={compact ? "h-2.5 w-2.5" : "h-3 w-3"} strokeWidth={1.2} />
              {confidence.score}/5
            </span>
          </div>

          <div className={`grid ${compact ? "grid-cols-1 gap-1.5" : "grid-cols-[1fr_auto] gap-2"}`}>
            {!compact ? (
              <button
                type="button"
                onClick={handleViewDetails}
                className="inline-flex min-h-[40px] min-w-[44px] items-center justify-center rounded-full border border-[rgba(123,103,82,0.16)] bg-[rgba(255,255,255,0.46)] px-4 text-[9px] uppercase tracking-[0.16em] text-[#5B4E42] transition-colors hover:border-[rgba(168,121,53,0.30)] hover:text-[#3D3025]"
                style={{ fontFamily: "'Jost', sans-serif" }}
                aria-label={`View ${product.name}`}
              >
                View
              </button>
            ) : null}
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={loading || outOfStock}
              className={`inline-flex min-w-[44px] items-center justify-center gap-2 rounded-full uppercase tracking-[0.16em] transition-all disabled:cursor-not-allowed disabled:opacity-35 ${compact ? "min-h-[34px] px-3 py-2 text-[8px]" : "min-h-[40px] px-4 py-2.5 text-[9px]"}`}
              style={{
                fontFamily: "'Jost', sans-serif",
                background: added
                  ? "rgba(168,121,53,0.18)"
                  : "#4C3A26",
                color: added ? "#7A581F" : "#FFF9EF",
                border: added
                  ? "1px solid rgba(168,121,53,0.35)"
                  : "1px solid rgba(76,58,38,0.70)",
              }}
              aria-label={added ? "Added" : `Add ${product.name} to cart`}
            >
              <ShoppingBag strokeWidth={1.25} className={`${compact ? "h-3.5 w-3.5" : "h-4 w-4"} ${loading ? "animate-spin" : ""}`} />
              {outOfStock ? "Sold Out" : added ? "Added" : "Add"}
            </button>
          </div>

          {!compact && (sizes.length > 1 || normalizedColors.length > 1) ? (
            <button
              type="button"
              onClick={toggleDetailsPanel}
              aria-expanded={detailsOpen}
              aria-label={detailsOpen ? "Collapse product options" : "Show product options"}
              className={`inline-flex items-center justify-center gap-2 rounded-full border border-[rgba(123,103,82,0.16)] bg-[rgba(255,255,255,0.34)] uppercase tracking-[0.16em] text-[#6F6254] transition-colors hover:border-[rgba(168,121,53,0.28)] hover:text-[#3D3025] ${compact ? "min-h-[34px] px-3 text-[8px]" : "min-h-[44px] px-4 text-[10px]"}`}
              style={{ fontFamily: "'Jost', sans-serif" }}
            >
              Options
              <ChevronDown
                strokeWidth={1.2}
                className={`${compact ? "h-3 w-3" : "h-3.5 w-3.5"} transition-transform duration-300`}
                style={{ transform: `rotate(${detailsOpen ? 180 : 0}deg)` }}
              />
            </button>
          ) : null}

        </div>

        {detailsOpen ? (
          <div
            className="flex flex-col gap-3 rounded-2xl border border-[rgba(123,103,82,0.16)] bg-[rgba(255,255,255,0.44)] p-3"
            onClick={(e) => e.stopPropagation()}
          >
            {sizes.length > 1 ? (
              <div className="space-y-2">
                <p
                  className="text-[9px] uppercase tracking-[0.22em] text-[#6F6254]"
                  style={{ fontFamily: "'Jost', sans-serif" }}
                >
                  Size
                </p>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <button
                      type="button"
                      key={size}
                      onClick={(e) => selectSize(e, size)}
                      className="min-h-[44px] min-w-[44px] rounded-full px-3 py-2 text-[10px] uppercase tracking-[0.16em] transition-all"
                      style={{
                        background: selectedSize === size ? "rgba(168,121,53,0.18)" : "rgba(255,255,255,0.56)",
                        color: selectedSize === size ? "#7A581F" : "rgba(61,48,37,0.78)",
                        border: selectedSize === size ? "1px solid rgba(168,121,53,0.42)" : "1px solid rgba(123,103,82,0.16)",
                        fontFamily: "'Jost', sans-serif",
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {normalizedColors.length > 1 ? (
              <div className="space-y-2">
                <p
                  className="text-[9px] uppercase tracking-[0.22em] text-[#6F6254]"
                  style={{ fontFamily: "'Jost', sans-serif" }}
                >
                  Color{selectedColorOption ? ` / ${selectedColorOption.name}` : ""}
                </p>
                <div className="flex flex-wrap gap-2">
                  {normalizedColors.map((color) => (
                    <button
                      type="button"
                      key={color.name}
                      onClick={(e) => selectColor(e, color.name)}
                      className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border px-2 transition-all"
                      style={{
                        background: "rgba(255,255,255,0.56)",
                        borderColor: selectedColor === color.name ? "rgba(168,121,53,0.72)" : "rgba(123,103,82,0.18)",
                      }}
                      title={color.name}
                    >
                      <span
                        className="h-5 w-5 rounded-full border border-[rgba(61,48,37,0.18)]"
                        style={{ background: color.hex }}
                      />
                      <span className="sr-only">{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {(sizes.length === 1 || normalizedColors.length === 1) ? (
              <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.16em] text-[#6F6254]">
                {sizes.length === 1 ? <span>Size {resolvedSize}</span> : null}
                {normalizedColors.length === 1 ? <span>{colorSummary}</span> : null}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      {/* Gold bottom accent line on hover */}
      <motion.div
        className="absolute inset-x-0 bottom-0 h-px pointer-events-none z-50"
        initial={{ scaleX: 0, opacity: 0 }}
        whileHover={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{ background: "linear-gradient(90deg, transparent, rgba(168,121,53,0.6), transparent)", transformOrigin: "center" }}
      />
    </motion.div>
  );
}

const ProductCard = memo(
  ProductCardComponent,
  (previousProps, nextProps) =>
    previousProps.product === nextProps.product &&
    previousProps.className === nextProps.className &&
    previousProps.compact === nextProps.compact &&
    previousProps.showRemoveFromWishlist === nextProps.showRemoveFromWishlist &&
    previousProps.onWishlistUpdate === nextProps.onWishlistUpdate
);

export default ProductCard;
