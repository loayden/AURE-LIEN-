"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import type { Product } from "@/lib/types";
import ProductCard from "@/components/ProductCard";
import { withPublicAssetVersion } from "@/lib/publicAsset";
import { productHref } from "@/lib/commerce";

const easeOut = [0.22, 1, 0.36, 1] as const;

const sectionReveal = {
  hidden: { opacity: 0.01, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: easeOut },
  },
};

const imageReveal = {
  hidden: { opacity: 0.01, scale: 0.98 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1.2, ease: easeOut },
  },
};

const productsStagger = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
};

const productFadeUp = {
  hidden: { opacity: 0.01, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: easeOut },
  },
};

/* ── Compact horizontal product rail for mobile ── */
function ProductRail({ products, className = "" }: { products: Product[]; className?: string }) {
  return (
    <div
      className={`-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-3 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${className}`}
    >
      {products.map((p) => (
        <motion.div
          key={p._id}
          variants={productFadeUp}
          className="w-[44vw] min-w-[10rem] max-w-[12rem] shrink-0 snap-start sm:w-auto sm:min-w-0 sm:max-w-none"
        >
          <ProductCard product={p} compact />
        </motion.div>
      ))}
    </div>
  );
}

/* ── Section header ── */
function EditorialHeader({
  title,
  description,
  inverted = false,
}: {
  title: string;
  description: string;
  inverted?: boolean;
}) {
  return (
    <div className="mb-6 sm:mb-10">
      <h2
        className={`font-serif text-3xl font-light sm:text-4xl lg:text-5xl ${
          inverted ? "text-[#F8F7F2]" : "text-[#171513]"
        }`}
      >
        {title}
      </h2>
      <p
        className={`mt-3 max-w-lg text-[15px] leading-relaxed ${
          inverted ? "text-[#C9C5B8]" : "text-[#5A5650]"
        }`}
      >
        {description}
      </p>
    </div>
  );
}

export default function EditorialSections({ products }: { products: Product[] }) {
  const getProductsByNames = (names: string[]) => {
    return products.filter((p) => p.name && names.includes(p.name.toLowerCase()));
  };

  const look1Products = getProductsByNames(["black 1987 collar polo", "faded black denim jeans"]);
  const look2Products = getProductsByNames(["zara blue striped quarter-zip", "faded olive denim jeans"]);
  const look3Products = getProductsByNames(["olive and beige striped tee", "brown washed denim jeans"]);
  const look4Products = getProductsByNames([
    "black resilient conformity tee",
    "distressed jeans with rope belt",
    "black and white striped polo",
    "dark blue denim jeans",
  ]);
  const look5Products = getProductsByNames(["sumwon pink striped shirt", "blue dolce gabbana jeans"]);

  return (
    <div className="flex flex-col">
      {/* ═══ LOOK 1: The Street Edit ═══ */}
      {look1Products.length > 0 && (
        <motion.section
          variants={sectionReveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="relative bg-[#F7F7F4] px-5 py-12 sm:px-6 md:px-10 lg:py-24"
        >
          <div className="mx-auto flex w-full max-w-[92rem] flex-col gap-6 lg:flex-row lg:items-center lg:gap-16">
            <motion.div variants={imageReveal} className="relative w-full lg:w-1/2">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-[#E9E7E1] shadow-[0_20px_50px_rgba(23,21,19,0.08)] sm:aspect-[3/4]">
                <Image
                  src={withPublicAssetVersion("/uploads/editorial-look-1.jpg")}
                  alt="Model wearing Black 1987 Collar Polo"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </motion.div>
            <div className="w-full lg:w-1/2">
              <EditorialHeader
                title="The Street Edit"
                description="Elevate your daily rotation with relaxed fits and vintage-inspired details. Perfectly faded denim meets sharp graphic knits."
              />
              <motion.div variants={productsStagger}>
                <ProductRail products={look1Products} />
              </motion.div>
            </div>
          </div>
        </motion.section>
      )}

      {/* ═══ LOOK 2: Modern Leisure (Alternating) ═══ */}
      {look2Products.length > 0 && (
        <motion.section
          variants={sectionReveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="relative bg-[#EAE8E3] px-5 py-12 sm:px-6 md:px-10 lg:py-24"
        >
          <div className="mx-auto flex w-full max-w-[92rem] flex-col gap-6 lg:flex-row-reverse lg:items-center lg:gap-16">
            <motion.div variants={imageReveal} className="relative w-full lg:w-1/2">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-[#D5D1C8] shadow-[0_20px_50px_rgba(23,21,19,0.08)]">
                <Image
                  src={withPublicAssetVersion("/uploads/editorial-look-2.jpg")}
                  alt="Model wearing Striped Quarter-Zip"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </motion.div>
            <div className="w-full lg:w-1/2">
              <EditorialHeader
                title="Modern Leisure"
                description="Transitional pieces designed for movement. Subtle stripes and washed tones offer a refined take on weekend essentials."
              />
              <motion.div variants={productsStagger}>
                <ProductRail products={look2Products} />
              </motion.div>
            </div>
          </div>
        </motion.section>
      )}

      {/* ═══ LOOK 3: Earth & Indigo (Dark Section) ═══ */}
      {look3Products.length > 0 && (
        <motion.section
          variants={sectionReveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="relative overflow-hidden bg-[#171513] px-5 py-12 sm:px-6 md:px-10 lg:py-28"
        >
          <div className="relative z-10 mx-auto w-full max-w-[92rem]">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-16">
              <motion.div variants={imageReveal} className="relative w-full lg:w-[55%]">
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-[#2A2825] shadow-[0_30px_60px_rgba(0,0,0,0.3)] sm:aspect-[3/4]">
                  <Image
                    src={withPublicAssetVersion("/uploads/editorial-look-3.jpg")}
                    alt="Model in earth tones"
                    fill
                    className="object-cover object-[center_30%]"
                    sizes="(max-width: 1024px) 100vw, 55vw"
                  />
                </div>
              </motion.div>

              <div className="w-full lg:w-[45%]">
                <EditorialHeader
                  title="Earth & Indigo"
                  description="Grounded palettes and textured layers. Soft olive stripes paired with rich brown denim create a sophisticated, muted harmony."
                  inverted
                />
                <motion.div
                  variants={productsStagger}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl sm:p-6"
                >
                  <ProductRail products={look3Products} />
                </motion.div>
              </div>
            </div>
          </div>
        </motion.section>
      )}

      {/* ═══ LOOK 4: The Studio Series ═══ */}
      {look4Products.length > 0 && (
        <motion.section
          variants={sectionReveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.12 }}
          className="relative bg-[#F7F7F4] px-5 py-12 sm:px-6 md:px-10 lg:py-24"
        >
          <div className="mx-auto w-full max-w-[92rem]">
            <EditorialHeader
              title="The Studio Series"
              description="Contrasting aesthetics, unified by quality. From bold graphic statements to refined knitwear."
            />

            <div className="flex flex-col gap-6 lg:grid lg:grid-cols-12 lg:gap-12">
              <motion.div variants={imageReveal} className="lg:col-span-5">
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-[#E9E7E1] shadow-[0_20px_50px_rgba(23,21,19,0.08)] lg:sticky lg:top-24">
                  <Image
                    src={withPublicAssetVersion("/uploads/editorial-look-4.jpg")}
                    alt="Two models in studio"
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                </div>
              </motion.div>

              <motion.div variants={productsStagger} className="lg:col-span-7">
                {/* Mobile: horizontal rail. Desktop: 2-col grid */}
                <div className="-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-3 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {look4Products.map((p) => (
                    <motion.div
                      key={p._id}
                      variants={productFadeUp}
                      className="w-[44vw] min-w-[10rem] max-w-[12rem] shrink-0 snap-start sm:w-auto sm:min-w-0 sm:max-w-none"
                    >
                      <ProductCard product={p} compact className="sm:[&]:rounded-2xl" />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>
      )}

      {/* ═══ LOOK 5: Signature Details (Banner) ═══ */}
      {look5Products.length > 0 && (
        <motion.section
          variants={sectionReveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="relative px-5 pb-12 pt-12 sm:px-6 md:px-10 lg:pb-28 lg:pt-24"
        >
          <div className="mx-auto w-full max-w-[92rem]">
            <div className="relative overflow-hidden rounded-2xl bg-[#F0EBE6] sm:rounded-3xl">
              <div className="absolute inset-0">
                <Image
                  src={withPublicAssetVersion("/uploads/editorial-look-5.jpg")}
                  alt="Model wearing Pink Striped Shirt"
                  fill
                  className="object-cover object-[center_20%] opacity-30 mix-blend-multiply sm:opacity-40"
                  sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#F0EBE6] via-[#F0EBE6]/70 to-[#F0EBE6]/30" />
              </div>

              <div className="relative z-10 flex flex-col items-center px-5 py-12 sm:px-8 sm:py-20 lg:py-28">
                <h2 className="text-center font-serif text-3xl font-light text-[#171513] sm:text-5xl lg:text-7xl">
                  Signature Details
                </h2>
                <p className="mt-3 max-w-lg text-center text-[15px] text-[#5A5650] sm:mt-4 sm:text-lg">
                  It&apos;s all in the back. Statement embroidery and crisp stripes make a lasting impression.
                </p>

                <motion.div
                  variants={productsStagger}
                  className="mt-8 w-full max-w-2xl sm:mt-12 lg:mt-16"
                >
                  <div className="grid grid-cols-2 gap-3 sm:gap-5">
                    {look5Products.map((p) => (
                      <motion.div
                        key={p._id}
                        variants={productFadeUp}
                        className="rounded-xl bg-white/70 p-1.5 shadow-lg backdrop-blur-md sm:rounded-2xl sm:p-2.5"
                      >
                        <ProductCard product={p} compact />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.section>
      )}
    </div>
  );
}
