"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, PackageCheck, Ruler, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo } from "react";
import type { Product } from "@/lib/types";

type ProductLike = Omit<Product, "colors"> & {
  stock?: number;
  colors?: Array<string | { name?: string; hex?: string }>;
};

function colorName(color: string | { name?: string; hex?: string }) {
  return typeof color === "string" ? color : String(color.name ?? "");
}

export default function ProductQuickView({
  product,
  onClose,
}: {
  product: ProductLike | null;
  onClose: () => void;
}) {
  const image = product?.images?.[0] || "/images/placeholder.svg";
  const stockLabel = useMemo(() => {
    if (!product || typeof product.stock !== "number") return "Available";
    if (product.stock === 0) return "Sold out";
    if (product.stock < 5) return "Low stock";
    return "In stock";
  }, [product]);

  useEffect(() => {
    if (!product) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, product]);

  return (
    <AnimatePresence>
      {product ? (
        <motion.div className="fixed inset-0 z-[85]" role="dialog" aria-modal="true" aria-label={`${product.name} quick view`}>
          <motion.button
            type="button"
            aria-label="Close quick view"
            className="absolute inset-0 cursor-default bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-x-3 bottom-3 max-h-[88vh] overflow-y-auto rounded-[28px] border border-white/10 bg-[#14110F] shadow-2xl sm:left-1/2 sm:top-1/2 sm:bottom-auto sm:w-[min(920px,calc(100vw-2rem))] sm:-translate-x-1/2 sm:-translate-y-1/2"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close quick view"
              className="absolute right-3 top-3 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-black/35 text-white/60 backdrop-blur-md transition-colors hover:text-white"
            >
              <X className="h-4 w-4" strokeWidth={1.5} />
            </button>
            <div className="grid sm:grid-cols-[0.95fr_1.05fr]">
              <div className="relative aspect-[4/5] min-h-[320px] overflow-hidden sm:aspect-auto">
                <Image src={image} alt={product.name} fill sizes="(max-width: 640px) 100vw, 430px" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              </div>
              <div className="p-5 sm:p-8">
                <p className="mb-3 text-[9px] uppercase tracking-[0.35em] text-white/30">{product.category}</p>
                <h2 className="font-serif text-3xl font-light leading-tight text-white sm:text-5xl">
                  {product.name}
                </h2>
                {product.description ? (
                  <p className="mt-5 text-sm font-light leading-7 text-white/48">
                    {product.description}
                  </p>
                ) : null}

                <div className="mt-7 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                    <p className="mb-2 text-[9px] uppercase tracking-[0.25em] text-white/25">Price</p>
                    <p className="font-serif text-xl font-light text-brass">EGP {product.price.toLocaleString()}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                    <p className="mb-2 text-[9px] uppercase tracking-[0.25em] text-white/25">Stock</p>
                    <p className="inline-flex items-center gap-2 text-sm text-white/68">
                      <PackageCheck className="h-4 w-4 text-brass" strokeWidth={1.4} />
                      {stockLabel}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                    <p className="mb-2 text-[9px] uppercase tracking-[0.25em] text-white/25">Sizes</p>
                    <p className="inline-flex items-center gap-2 text-sm text-white/68">
                      <Ruler className="h-4 w-4 text-brass" strokeWidth={1.4} />
                      {product.size?.length ? product.size.join(", ") : "Open"}
                    </p>
                  </div>
                </div>

                {product.colors?.length ? (
                  <div className="mt-6">
                    <p className="mb-3 text-[9px] uppercase tracking-[0.28em] text-white/30">Colors</p>
                    <div className="flex flex-wrap gap-2">
                      {product.colors.map((color, index) => (
                        <span key={`${colorName(color)}-${index}`} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-white/56">
                          {colorName(color)}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href={`/product/${encodeURIComponent(product._id)}`}
                    onClick={onClose}
                    className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-brass/35 bg-brass/12 px-6 text-[10px] uppercase tracking-[0.24em] text-brass"
                  >
                    View Product
                    <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.4} />
                  </Link>
                  <Link
                    href="/shop"
                    onClick={onClose}
                    className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-white/10 px-6 text-[10px] uppercase tracking-[0.24em] text-white/62"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
