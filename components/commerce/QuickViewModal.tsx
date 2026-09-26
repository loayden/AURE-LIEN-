"use client";

import { showToast } from "@/components/ToastProvider";
import {
  formatCategoryLabel,
  formatPrice,
  productImage,
  stockLabel,
  stockState,
} from "@/lib/commerce";
import { getProductColorHex } from "@/lib/productColors";
import type { Product } from "@/lib/types";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ShoppingBag, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function QuickViewModal({
  product,
  onClose,
}: {
  product: Product | null;
  onClose: () => void;
}) {
  const [size, setSize] = useState<string | null>(null);
  const [color, setColor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSize(null);
    setColor(null);
  }, [product?._id]);

  async function addToCart() {
    if (!product) return;
    if (stockState(product) === "sold-out") {
      showToast("This piece is sold out.", "error");
      return;
    }
    if (product.size?.length > 1 && !size) {
      showToast("Choose a size before adding.", "error");
      return;
    }
    if (product.colors?.length > 1 && !color) {
      showToast("Choose a color before adding.", "error");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product._id,
          quantity: 1,
          size: size ?? product.size?.[0] ?? null,
          color: color ?? product.colors?.[0] ?? null,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data?.error || "Unable to add item");
      window.dispatchEvent(new Event("cart:changed"));
      showToast("Added to cart.", "success");
      onClose();
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Unable to add item.", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      {product ? (
        <motion.div
          className="fixed inset-0 z-[95] flex items-end justify-center p-0 sm:items-center sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`Quick view ${product.name}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button type="button" aria-label="Close quick view" onClick={onClose} className="absolute inset-0 h-full w-full backdrop-blur-sm" style={{ background: "rgba(61,48,37,0.28)" }} />
          <motion.div
            initial={{ y: 40, scale: 0.98 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 30, scale: 0.98 }}
            className="relative grid max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-t-[28px] border border-[rgba(123,103,82,0.18)] bg-[#FFF9EF] shadow-[0_28px_80px_rgba(61,48,37,0.16)] sm:grid-cols-[0.9fr_1.1fr] sm:rounded-[28px]"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(123,103,82,0.18)] bg-white/70 text-[#6F6254] backdrop-blur-xl hover:text-[#3D3025]"
              aria-label="Close quick view"
            >
              <X className="h-4 w-4" strokeWidth={1.4} />
            </button>
            <div className="relative min-h-[22rem] bg-[#FFFFFF] sm:min-h-full">
              <Image src={productImage(product)} alt={product.name} fill sizes="(max-width: 640px) 100vw, 42vw" className="object-contain p-5" />
            </div>
            <div className="p-5 sm:p-7">
              <p className="mb-3 text-[10px] uppercase tracking-[0.24em] text-[#A87935]">
                {formatCategoryLabel(product.category)}
              </p>
              <h2 className="font-serif text-[clamp(2rem,5vw,3.6rem)] font-light leading-[0.95] tracking-[0.03em] text-[#3D3025]">
                {product.name}
              </h2>
              <p className="mt-4 text-sm leading-7 tracking-[0.04em] text-[#6F6254]">
                {product.description || "A polished BOUT wardrobe piece with clean styling paths and a direct route to checkout."}
              </p>
              <div className="mt-5 flex items-center justify-between gap-4 border-y border-[rgba(123,103,82,0.16)] py-4">
                <span className="font-serif text-2xl tracking-[0.04em] text-[#A87935]">
                  EGP {formatPrice(product.price)}
                </span>
                <span className="rounded-full border border-[rgba(123,103,82,0.16)] bg-white/60 px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-[#6F6254]">
                  {stockLabel(product)}
                </span>
              </div>

              {product.size?.length ? (
                <div className="mt-5">
                  <p className="mb-3 text-[9px] uppercase tracking-[0.26em] text-[#7B6E60]">Size</p>
                  <div className="flex flex-wrap gap-2">
                    {product.size.map((value) => (
                      <button
                        type="button"
                        key={value}
                        onClick={() => setSize(value)}
                        className={`flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border px-4 text-[11px] uppercase tracking-[0.16em] ${size === value ? "border-[#A87935] bg-[rgba(168,121,53,0.14)] text-[#A87935]" : "border-[rgba(123,103,82,0.16)] bg-white/60 text-[#6F6254]"}`}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              {product.colors?.length ? (
                <div className="mt-5">
                  <p className="mb-3 text-[9px] uppercase tracking-[0.26em] text-[#7B6E60]">Color</p>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((value) => (
                      <button
                        type="button"
                        key={value}
                        onClick={() => setColor(value)}
                        className={`flex min-h-[44px] items-center gap-2 rounded-full border px-3 text-[11px] tracking-[0.08em] ${color === value ? "border-[#A87935] bg-[rgba(168,121,53,0.14)] text-[#A87935]" : "border-[rgba(123,103,82,0.16)] bg-white/60 text-[#6F6254]"}`}
                      >
                        <span className="h-4 w-4 rounded-full border border-white/20" style={{ background: getProductColorHex(value) }} />
                        {value}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                <Link href={`/product/${encodeURIComponent(product._id)}`} className="btn-ghost justify-center">
                  View Product
                  <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.3} />
                </Link>
                <button
                  type="button"
                  onClick={addToCart}
                  disabled={loading || stockState(product) === "sold-out"}
                  className="btn-gold justify-center disabled:opacity-40"
                >
                  <ShoppingBag className="h-4 w-4" strokeWidth={1.3} />
                  {stockState(product) === "sold-out" ? "Sold Out" : loading ? "Adding" : "Add to Cart"}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
