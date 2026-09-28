"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Heart, Zap } from "lucide-react";
import Image from "next/image";
import {
  MouseEvent as ReactMouseEvent,
  TouchEvent as ReactTouchEvent,
  memo,
} from "react";
import type { ExtendedProduct } from "../ProductCard";

export const AUTO_MS = 3000;
export const DRAG_SUPPRESS_MS = 220;

export const badgeStyles = {
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
          initial={images.length > 1 ? "enter" : false}
          animate="center"
          exit={images.length > 1 ? "exit" : undefined}
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

export default ProductCardMedia;
