"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { Product } from "@/lib/types";
import ProductCard from "@/components/ProductCard";
import { withPublicAssetVersion } from "@/lib/publicAsset";

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
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const productFadeUp = {
  hidden: { opacity: 0.01, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOut },
  },
};

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
    <div className="flex flex-col bg-[#F7F7F4]">
      {/* LOOK 1: The '1987' Street Look */}
      {look1Products.length > 0 && (
        <motion.section
          variants={sectionReveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="relative px-4 py-16 sm:px-6 md:px-10 lg:py-24"
        >
          <div className="mx-auto flex w-full max-w-[92rem] flex-col items-center gap-10 lg:flex-row lg:gap-16">
            <motion.div variants={imageReveal} className="relative w-full lg:w-1/2">
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-[#E9E7E1] shadow-[0_30px_60px_rgba(23,21,19,0.1)]">
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
              <div className="mb-10 max-w-lg">
                <h2 className="font-serif text-4xl font-light text-[#171513] sm:text-5xl lg:text-6xl">
                  The Street Edit
                </h2>
                <p className="mt-4 text-base leading-relaxed text-[#5A5650]">
                  Elevate your daily rotation with relaxed fits and vintage-inspired details. Perfectly faded denim meets sharp graphic knits for an effortless off-duty uniform.
                </p>
              </div>
              <motion.div variants={productsStagger} className="grid grid-cols-2 gap-4 sm:gap-6">
                {look1Products.map((p) => (
                  <motion.div key={p._id} variants={productFadeUp}>
                    <ProductCard product={p} />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.section>
      )}

      {/* LOOK 2: The Casual Striped Zip Look (Alternating Right Image) */}
      {look2Products.length > 0 && (
        <motion.section
          variants={sectionReveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="relative bg-[#EAE8E3] px-4 py-16 sm:px-6 md:px-10 lg:py-24"
        >
          <div className="mx-auto flex w-full max-w-[92rem] flex-col-reverse items-center gap-10 lg:flex-row lg:gap-16">
            <div className="w-full lg:w-1/2">
              <div className="mb-10 max-w-lg">
                <h2 className="font-serif text-4xl font-light text-[#171513] sm:text-5xl lg:text-6xl">
                  Modern Leisure
                </h2>
                <p className="mt-4 text-base leading-relaxed text-[#5A5650]">
                  Transitional pieces designed for movement. Subtle stripes and washed tones offer a refined take on weekend essentials.
                </p>
              </div>
              <motion.div variants={productsStagger} className="grid grid-cols-2 gap-4 sm:gap-6">
                {look2Products.map((p) => (
                  <motion.div key={p._id} variants={productFadeUp}>
                    <ProductCard product={p} />
                  </motion.div>
                ))}
              </motion.div>
            </div>
            <motion.div variants={imageReveal} className="relative w-full lg:w-1/2">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-[#D5D1C8] shadow-[0_20px_50px_rgba(23,21,19,0.08)]">
                <Image
                  src={withPublicAssetVersion("/uploads/editorial-look-2.jpg")}
                  alt="Model wearing Striped Quarter-Zip"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </motion.div>
          </div>
        </motion.section>
      )}

      {/* LOOK 3: The Earth Tone Look (Overlapping Composition) */}
      {look3Products.length > 0 && (
        <motion.section
          variants={sectionReveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="relative overflow-hidden px-4 py-20 sm:px-6 md:px-10 lg:py-32"
        >
          <div className="absolute inset-0 z-0 bg-[#171513]" />
          <div className="relative z-10 mx-auto w-full max-w-[92rem]">
            <div className="mb-12 text-center lg:mb-20">
              <h2 className="font-serif text-4xl font-light text-[#F8F7F2] sm:text-5xl lg:text-6xl">
                Earth & Indigo
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-[#C9C5B8]">
                Grounded palettes and textured layers. Soft olive stripes paired with rich brown denim create a sophisticated, muted harmony.
              </p>
            </div>
            
            <div className="relative flex flex-col items-center lg:flex-row lg:items-end lg:justify-center">
              <motion.div variants={imageReveal} className="relative z-0 w-full max-w-2xl lg:absolute lg:left-0 lg:top-0 lg:w-[55%]">
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-[#2A2825] shadow-[0_40px_80px_rgba(0,0,0,0.4)] lg:aspect-[4/5]">
                  <Image
                    src={withPublicAssetVersion("/uploads/editorial-look-3.jpg")}
                    alt="Model in earth tones"
                    fill
                    className="object-cover object-[center_30%]"
                    sizes="(max-width: 1024px) 100vw, 60vw"
                  />
                </div>
              </motion.div>
              
              <motion.div 
                variants={productsStagger} 
                className="relative z-10 -mt-16 w-full max-w-3xl rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl sm:p-8 lg:ml-auto lg:mt-32 lg:w-[50%]"
              >
                <div className="grid grid-cols-2 gap-4 sm:gap-6">
                  {look3Products.map((p) => (
                    <motion.div key={p._id} variants={productFadeUp}>
                      <ProductCard product={p} />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>
      )}

      {/* LOOK 4: The Studio Dual Look (Grid Layout) */}
      {look4Products.length > 0 && (
        <motion.section
          variants={sectionReveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="relative bg-[#F7F7F4] px-4 py-16 sm:px-6 md:px-10 lg:py-24"
        >
          <div className="mx-auto w-full max-w-[92rem]">
            <div className="mb-10 text-center">
              <h2 className="font-serif text-4xl font-light text-[#171513] sm:text-5xl">
                The Studio Series
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base text-[#5A5650]">
                Contrasting aesthetics, unified by quality. From bold graphic statements to refined knitwear.
              </p>
            </div>
            
            <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
              <motion.div variants={imageReveal} className="lg:col-span-5">
                <div className="sticky top-24 relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-[#E9E7E1] shadow-[0_20px_50px_rgba(23,21,19,0.08)]">
                  <Image
                    src={withPublicAssetVersion("/uploads/editorial-look-4.jpg")}
                    alt="Two models in studio"
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                </div>
              </motion.div>
              
              <motion.div variants={productsStagger} className="grid grid-cols-2 gap-4 sm:gap-6 lg:col-span-7">
                {look4Products.map((p) => (
                  <motion.div key={p._id} variants={productFadeUp}>
                    <ProductCard product={p} />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.section>
      )}

      {/* LOOK 5: The Dolce & Gabbana Pink Look (Full Width Banner Style) */}
      {look5Products.length > 0 && (
        <motion.section
          variants={sectionReveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="relative px-4 pb-20 pt-16 sm:px-6 md:px-10 lg:pb-32 lg:pt-24"
        >
          <div className="mx-auto w-full max-w-[92rem]">
            <div className="relative overflow-hidden rounded-3xl bg-[#F0EBE6]">
              <div className="absolute inset-0">
                <Image
                  src={withPublicAssetVersion("/uploads/editorial-look-5.jpg")}
                  alt="Model wearing Pink Striped Shirt"
                  fill
                  className="object-cover object-[center_20%] opacity-40 mix-blend-multiply"
                  sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#F0EBE6] via-[#F0EBE6]/60 to-transparent" />
              </div>
              
              <div className="relative z-10 flex flex-col items-center px-6 py-16 sm:py-24 lg:py-32">
                <h2 className="text-center font-serif text-4xl font-light text-[#171513] sm:text-5xl lg:text-7xl">
                  Signature Details
                </h2>
                <p className="mt-4 max-w-lg text-center text-lg text-[#5A5650]">
                  It's all in the back. Statement embroidery and crisp stripes make a lasting impression.
                </p>
                
                <motion.div 
                  variants={productsStagger} 
                  className="mt-12 grid w-full max-w-3xl grid-cols-2 gap-4 sm:gap-6 lg:mt-20"
                >
                  {look5Products.map((p) => (
                    <motion.div key={p._id} variants={productFadeUp} className="rounded-xl bg-white/60 p-2 shadow-xl backdrop-blur-md">
                      <ProductCard product={p} />
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          </div>
        </motion.section>
      )}
    </div>
  );
}
