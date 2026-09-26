"use client";

import {
  formatCategoryLabel,
  formatPrice,
  productHref,
  productImage,
  stockLabel,
} from "@/lib/commerce";
import type { Product } from "@/lib/types";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { easeOut, sectionReveal, tileReveal } from "@/components/home/sectionMotion";
import { SectionIntro } from "@/components/home/SectionIntro";
import ProductActionButton from "@/components/home/ProductActionButton";

// ─── Trending Now Section ───
export default function TrendingNowSection({
  products,
  onAction,
  addingId,
}: {
  products: Product[];
  onAction: (p: Product) => void;
  addingId: string | null;
}) {
  const trendingProducts = useMemo(() => products.slice(0, 8), [products]);

  if (trendingProducts.length === 0) return null;

  return (
    <motion.section
      variants={sectionReveal}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.14 }}
      data-testid="trending-now-section"
      className="bg-white px-4 py-8 [content-visibility:auto] [contain-intrinsic-size:680px] sm:px-6 sm:py-10 md:px-10"
    >
      <div className="mx-auto w-full max-w-[92rem]">
        <SectionIntro
          title="Trending now"
          copy="What everyone&rsquo;s looking at this week."
          action={{ label: "See all", href: "/shop" }}
        />
        <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-3 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:px-0 sm:pb-0 md:grid-cols-3 lg:grid-cols-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {trendingProducts.map((product, i) => (
            <motion.div
              key={product._id}
              variants={tileReveal}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              className="w-[70vw] min-w-[15rem] max-w-[17rem] shrink-0 snap-start sm:w-auto sm:min-w-0 sm:max-w-none"
            >
              <div className="group relative overflow-hidden rounded-xl border border-[#DEDAD2] bg-white shadow-sm transition hover:shadow-lg">
                <div className={`absolute left-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                  i === 0 ? "bg-[#D8C08A] text-[#171513] shadow-[0_0_12px_rgba(216,192,138,0.5)]" :
                  i === 1 ? "bg-[#C0C0C0] text-[#171513]" :
                  i === 2 ? "bg-[#CD7F32] text-white" :
                  "bg-[#171513]/80 text-[#F8F7F2]"
                }`}>
                  #{i + 1}
                </div>
                <Link href={productHref(product)} className="relative block aspect-[4/5] overflow-hidden bg-[#F3F1ED]">
                  <Image
                    src={productImage(product)}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 70vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover transition duration-700 group-hover:scale-[1.04]"
                  />
                </Link>
                <div className="p-4">
                  <p className="text-[11px] uppercase tracking-wider text-[#725D2C]">{formatCategoryLabel(product.category)}</p>
                  <h3 className="mt-1 line-clamp-2 min-h-[2.5rem] font-serif text-xl font-light leading-tight text-[#171513]">{product.name}</h3>
                  <div className="mt-3 flex items-end justify-between gap-3">
                    <div>
                      <p className="text-xs text-[#69645E]">{stockLabel(product)}</p>
                      <p className="mt-1 text-base font-medium text-[#725D2C]">EGP {formatPrice(product.price)}</p>
                    </div>
                    <ProductActionButton product={product} busy={addingId === product._id} onAction={onAction} />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

// ─── Brand Promise Bar ───
