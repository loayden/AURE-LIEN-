"use client";

import {
  formatCategoryLabel,
  formatPrice,
  getProductConfidence,
  productImage,
  stockLabel,
} from "@/lib/commerce";
import type { Product } from "@/lib/types";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Scale, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function CompareDrawer({
  products,
  onRemove,
  onClear,
}: {
  products: Product[];
  onRemove: (productId: string) => void;
  onClear: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  if (!products.length) return null;

  return (
    <motion.div
      initial={{ y: 24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 24, opacity: 0 }}
      className="fixed inset-x-3 bottom-[calc(5.25rem+env(safe-area-inset-bottom))] z-[86] mx-auto flex max-h-[min(74vh,42rem)] max-w-6xl flex-col rounded-[24px] border border-[rgba(123,103,82,0.18)] bg-[#FFF9EF]/96 p-3 shadow-[0_24px_70px_rgba(61,48,37,0.18)] backdrop-blur-2xl sm:bottom-5 sm:max-h-[82vh] sm:p-4"
      role="region"
      aria-label="Product comparison"
    >
      <div className="sticky top-0 z-10 flex flex-col gap-3 border-b border-[rgba(123,103,82,0.12)] bg-[#FFF9EF]/96 pb-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#4C3A26] text-[#FFF9EF]">
            <Scale className="h-4 w-4" strokeWidth={1.35} />
          </span>
          <div>
            <p className="eyebrow mb-1">Compare Products</p>
            <p className="text-sm text-[#6F6254]">{products.length}/3 selected for quick decision support.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setExpanded((current) => !current)}
            className="inline-flex min-h-[40px] flex-1 items-center justify-center rounded-full border border-[rgba(123,103,82,0.16)] bg-white/72 px-4 text-[10px] uppercase tracking-[0.18em] text-[#5B4E42] sm:flex-none"
          >
            {expanded ? "Collapse" : "Compare"}
          </button>
          <button
            type="button"
            onMouseDown={(event) => {
              event.preventDefault();
              onClear();
            }}
            onPointerDown={(event) => {
              event.preventDefault();
              onClear();
            }}
            onTouchStart={(event) => {
              event.preventDefault();
              onClear();
            }}
            onClick={onClear}
            className="inline-flex min-h-[40px] flex-1 items-center justify-center rounded-full border border-[rgba(123,103,82,0.16)] bg-white/72 px-4 text-[10px] uppercase tracking-[0.18em] text-[#5B4E42] sm:flex-none"
          >
            Clear
          </button>
          <button
            type="button"
            onMouseDown={(event) => {
              event.preventDefault();
              onClear();
            }}
            onPointerDown={(event) => {
              event.preventDefault();
              onClear();
            }}
            onTouchStart={(event) => {
              event.preventDefault();
              onClear();
            }}
            onClick={onClear}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[rgba(123,103,82,0.16)] bg-white/72 text-[#5B4E42]"
            aria-label="Close comparison"
          >
            <X className="h-4 w-4" strokeWidth={1.35} />
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1">
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] snap-x snap-mandatory">
          {products.map((product) => (
            <div key={product._id} className="flex min-w-[13rem] items-center gap-3 rounded-[18px] border border-[rgba(123,103,82,0.14)] bg-white/64 p-2 snap-start">
              <div className="relative h-14 w-12 shrink-0 overflow-hidden rounded-[12px] bg-[#FFFFFF]">
                <Image src={productImage(product)} alt="" fill sizes="48px" className="object-contain p-1" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-[#3D3025]">{product.name}</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-[#A87935]">EGP {formatPrice(product.price)}</p>
              </div>
              <button
                type="button"
                onClick={() => onRemove(product._id)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#6F6254]"
                aria-label={`Remove ${product.name} from comparison`}
              >
                <X className="h-3.5 w-3.5" strokeWidth={1.4} />
              </button>
            </div>
          ))}
        </div>

        <AnimatePresence>
          {expanded ? (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-3 grid gap-3 md:grid-cols-3">
                {products.map((product) => {
                  const confidence = getProductConfidence(product);
                  return (
                    <div key={product._id} className="rounded-[18px] border border-[rgba(123,103,82,0.14)] bg-white/64 p-4">
                      <p className="text-[10px] uppercase tracking-[0.18em] text-[#A87935]">{formatCategoryLabel(product.category)}</p>
                      <h3 className="mt-2 line-clamp-2 font-serif text-2xl font-light leading-none text-[#3D3025]">{product.name}</h3>
                      <div className="mt-4 grid gap-2 text-sm text-[#6F6254]">
                        <span>Price: EGP {formatPrice(product.price)}</span>
                        <span>Stock: {stockLabel(product)}</span>
                        <span>Sizes: {product.size?.length ? product.size.join(", ") : "Not listed"}</span>
                        <span>Colors: {product.colors?.length ? product.colors.join(", ") : "Not listed"}</span>
                        <span>Material: {product.material || "Not listed"}</span>
                        <span>Confidence: {confidence.score}/5</span>
                      </div>
                      <Link href={`/product/${encodeURIComponent(product._id)}`} className="mt-4 inline-flex min-h-[40px] items-center justify-center gap-2 rounded-full bg-[#4C3A26] px-4 text-[10px] uppercase tracking-[0.16em] text-[#FFF9EF]">
                        View Product
                        <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.3} />
                      </Link>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
