"use client";

import type { Product } from "@/lib/types";
import {
  AnimatePresence,
  motion,
  useMotionValue, useSpring, useTransform,
} from "framer-motion";
import { Heart, ShoppingBag, Star, Zap } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  MouseEvent as ReactMouseEvent,
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

const AUTO_MS = 3000;

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
  const [inWishlist, setInWishlist] = useState(false);
  const [added, setAdded] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [showSizeSelector, setShowSizeSelector] = useState(false);
  const [showColorSelector, setShowColorSelector] = useState(false);


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

  /* ── Touch ── */
  const tx = useRef(0), ty = useRef(0), sg = useRef<boolean | null>(null);
  function onTouchStart(e: ReactTouchEvent) { tx.current = e.touches[0].clientX; ty.current = e.touches[0].clientY; sg.current = null; setPaused(true); }
  function onTouchMove(e: ReactTouchEvent) { const dx = e.touches[0].clientX - tx.current, dy = e.touches[0].clientY - ty.current; if (sg.current === null) sg.current = Math.abs(dy) > Math.abs(dx); if (!sg.current) e.preventDefault(); }
  function onTouchEnd(e: ReactTouchEvent) { if (sg.current) { setPaused(false); return; } const dx = e.changedTouches[0].clientX - tx.current; if (Math.abs(dx) > 36) goTo(current + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1); setTimeout(() => setPaused(false), 4000); }

  /* ── Mouse drag ── */
  const dx0 = useRef(0);
  function onMouseDown(e: ReactMouseEvent) { dx0.current = e.clientX; setDragging(false); setPaused(true); }
  function onMouseUp(e: ReactMouseEvent) { const d = e.clientX - dx0.current; if (Math.abs(d) > 36) { goTo(current + (d < 0 ? 1 : -1), d < 0 ? 1 : -1); setDragging(true); } setTimeout(() => { setDragging(false); setPaused(false); }, 4000); }

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
    fetch("/api/wishlist/list").then(r => r.json())
      .then(d => setInWishlist((d.items || []).some((p: Product) => p._id === product._id)))
      .catch(() => {});
  }, [product._id]);

  async function toggleWishlist(e: ReactMouseEvent) {
    e.preventDefault(); e.stopPropagation();
    try {
      await fetch(inWishlist ? "/api/wishlist/remove" : "/api/wishlist/add", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ productId: product._id }) });
      setInWishlist(v => !v);
      if (inWishlist) onWishlistUpdate?.(product._id);
    } catch { router.push("/login"); }
  }

  async function handleAddToCart(e: ReactMouseEvent) {
    e.stopPropagation();
    if (!product._id || outOfStock) return;
    try {
      setLoading(true);
      const res = await fetch("/api/cart", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ productId: product._id, quantity: 1, size: selectedSize, color: selectedColor }) });
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
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => { if (!dragging) router.push(`/product/${product._id}`); }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
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
                sizes="(max-width:640px) 46vw, (max-width:1024px) 33vw, 25vw"
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
        {product.badge && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-3 left-3 z-30 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider"
            style={{
              background: badgeStyles[product.badge].bg,
              color: badgeStyles[product.badge].text,
              backdropFilter: "blur(12px)",
            }}
          >
            {badgeStyles[product.badge].label}
          </motion.div>
        )}

        {/* ── Stock Indicator ── */}
        {isLowStock && !outOfStock && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute top-3 right-3 z-30 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider"
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
            width: 42,
            height: 42,
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
        className="relative z-10 px-4 pt-4 pb-4 flex flex-col gap-2.5"
        style={{
          background: "linear-gradient(170deg, rgba(18,16,12,0.82) 0%, rgba(10,9,8,0.94) 100%)",
          backdropFilter: "blur(36px) saturate(140%)",
          WebkitBackdropFilter: "blur(36px) saturate(140%)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* Specular inset top edge */}
        <div className="absolute inset-x-0 top-0 h-px pointer-events-none"
          style={{ background: "linear-gradient(90deg, transparent 5%, rgba(255,255,255,0.10) 40%, rgba(255,255,255,0.10) 60%, transparent 95%)" }} />

        {/* Name + Rating */}
        <div>
          <h3 className="font-light leading-snug line-clamp-1"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(1rem, 4vw, 1.08rem)",
              letterSpacing: "0.055em",
              color: "rgba(255,255,255,0.88)",
            }}>
            {product.name}
          </h3>

          {/* Rating */}
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

        {/* Category */}
        {product.category && (
          <p className="text-[8px] tracking-[0.28em] uppercase"
            style={{ fontFamily: "'Jost', sans-serif", color: "rgba(255,255,255,0.22)" }}>
            {product.category}
          </p>
        )}

        {/* Size & Color Selector - Compact */}
        <div className="flex gap-2 flex-wrap">
          {sizes && sizes.length > 0 && (
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                setShowSizeSelector(!showSizeSelector);
              }}
              className="text-[11px] px-2.5 py-1.5 rounded-lg transition-all"
              style={{
                background: selectedSize ? "rgba(198,169,98,0.3)" : "rgba(255,255,255,0.08)",
                color: selectedSize ? "#C6A962" : "rgba(255,255,255,0.6)",
                border: selectedSize ? "1px solid rgba(198,169,98,0.5)" : "1px solid rgba(255,255,255,0.1)",
                fontFamily: "'Jost', sans-serif",
                fontWeight: 600,
                letterSpacing: "0.05em",
              }}
              whileHover={{ scale: 1.05 }}
            >
              {selectedSize || "Size"}
            </motion.button>
          )}

          {normalizedColors.length > 0 && (
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                setShowColorSelector(!showColorSelector);
              }}
              className="w-8 h-8 rounded-lg transition-all border"
              style={{
                background: selectedColor || normalizedColors[0].hex,
                border: selectedColor ? "2px solid #C6A962" : "1px solid rgba(255,255,255,0.2)",
                opacity: 0.8,
              }}
              whileHover={{ scale: 1.1 }}
              title={`Color: ${selectedColor || normalizedColors[0].name}`}
            />
          )}
        </div>

        {/* Size Selector Modal */}
        <AnimatePresence>
          {showSizeSelector && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-wrap gap-1.5 mt-1 pt-2 border-t border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedSize(size);
                    setShowSizeSelector(false);
                  }}
                  className="text-[10px] px-2.5 py-1.5 rounded-md transition-all font-semibold uppercase tracking-wider"
                  style={{
                    background: selectedSize === size ? "rgba(198,169,98,0.6)" : "rgba(255,255,255,0.08)",
                    color: selectedSize === size ? "#fff" : "rgba(255,255,255,0.6)",
                    border: selectedSize === size ? "1px solid #C6A962" : "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  {size}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Color Selector Modal */}
        <AnimatePresence>
          {showColorSelector && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-wrap gap-2 mt-1 pt-2 border-t border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              {normalizedColors.map((color) => (
                <motion.button
                  key={color.hex}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedColor(color.hex);
                    setShowColorSelector(false);
                  }}
                  className="w-7 h-7 rounded-md transition-all border-2"
                  style={{
                    background: color.hex,
                    borderColor: selectedColor === color.hex ? "#C6A962" : "transparent",
                    opacity: 0.8,
                  }}
                  whileHover={{ scale: 1.15 }}
                  title={color.name}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Price + Cart - Bottom Row */}
        <div className="flex items-center justify-between gap-3.5 pt-2.5 border-t border-white/10">
          {/* Price */}
          <div>
            {product.discount ? (
              <>
                <p className="font-light text-[10px] line-through"
                  style={{
                    fontFamily: "'Jost', sans-serif",
                    color: "rgba(255,255,255,0.4)",
                    letterSpacing: "0.07em",
                  }}>
                  EGP {((product.price ?? 0) * (1 + (product.discount ?? 0) / 100)).toLocaleString()}
                </p>
                <p className="font-semibold leading-none mt-0.5"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "1rem",
                    color: "#C6A962",
                    letterSpacing: "0.04em",
                  }}>
                  EGP {(product.price ?? 0).toLocaleString()}
                </p>
              </>
            ) : (
              <>
                <p className="font-light leading-none text-[10px]"
                  style={{
                    fontFamily: "'Jost', sans-serif",
                    color: "#C6A962",
                    letterSpacing: "0.07em",
                  }}>
                  EGP
                </p>
                <p className="font-light leading-none mt-0.5"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "1.1rem",
                    color: "#C6A962",
                    letterSpacing: "0.04em",
                  }}>
                  {(product.price ?? 0).toLocaleString()}
                </p>
              </>
            )}
          </div>

          {/* Divider */}
          <div className="h-8 w-px" style={{ background: "rgba(255,255,255,0.08)" }} />

          {/* Add to cart */}
          <motion.button
            onClick={handleAddToCart}
            disabled={loading || outOfStock}
            whileTap={{ scale: 0.82 }}
            className="flex items-center justify-center rounded-full transition-all duration-500 disabled:opacity-35"
            style={{
              width: 42, height: 42,
              background: added
                ? "linear-gradient(135deg, rgba(198,169,98,0.28), rgba(198,169,98,0.10))"
                : "rgba(255,255,255,0.07)",
              border: added
                ? "1px solid rgba(198,169,98,0.45)"
                : "1px solid rgba(255,255,255,0.10)",
              backdropFilter: "blur(12px)",
              boxShadow: added ? "0 0 20px rgba(198,169,98,0.22)" : "none",
            }}
            aria-label={added ? "Added" : "Add to cart"}
          >
            <motion.div
              animate={{ rotate: loading ? 360 : 0 }}
              transition={{ repeat: loading ? Infinity : 0, duration: 0.9, ease: "linear" }}
            >
              <ShoppingBag
                strokeWidth={1.25}
                className="w-4 h-4 transition-colors duration-400"
                style={{ color: added ? "#C6A962" : "rgba(255,255,255,0.45)" }}
              />
            </motion.div>
          </motion.button>
        </div>
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
