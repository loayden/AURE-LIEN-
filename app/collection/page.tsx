"use client";

import AdaptiveHeroMedia from "@/components/AdaptiveHeroMedia";
import ProductCard from "@/components/ProductCard";
import { withPublicAssetVersion } from "@/lib/publicAsset";
import products from "@/lib/productsData";
import type { Product } from "@/lib/types";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";

const organizeProductsByCategory = (allProducts: Product[]) => {
  const organized: Record<string, Product[]> = {
    "Jackets & Coats": [],
    "Suits": [],
    "Shirts": [],
    "Knitwear": [],
    "Denim": [],
    "Korean Pants": [],
    "Baggy Pants": [],
    "Sneakers": [],
    "Loafers": [],
    "Lace-Ups": [],
    "Sunglasses": [],
    "Bags & Wallets": [],
    "Belts": [],
  };

  allProducts.forEach((product) => {
    const category = product.category || "";
    
    if (category.toLowerCase().includes("jacket") || category.toLowerCase().includes("coat")) {
      organized["Jackets & Coats"].push(product);
    } else if (category.toLowerCase().includes("suit")) {
      organized["Suits"].push(product);
    } else if (category.toLowerCase().includes("shirt")) {
      organized["Shirts"].push(product);
    } else if (category.toLowerCase().includes("knit") || category.toLowerCase().includes("sweater")) {
      organized["Knitwear"].push(product);
    } else if (category.toLowerCase().includes("denim") || category.toLowerCase().includes("jean")) {
      organized["Denim"].push(product);
    } else if (category.toLowerCase().includes("korean")) {
      organized["Korean Pants"].push(product);
    } else if (category.toLowerCase().includes("baggy")) {
      organized["Baggy Pants"].push(product);
    } else if (category.toLowerCase().includes("sneaker")) {
      organized["Sneakers"].push(product);
    } else if (category.toLowerCase().includes("loafer")) {
      organized["Loafers"].push(product);
    } else if (
      category.toLowerCase().includes("lace") ||
      category.toLowerCase().includes("oxford") ||
      category.toLowerCase().includes("derby")
    ) {
      organized["Lace-Ups"].push(product);
    } else if (category.toLowerCase().includes("sunglass")) {
      organized["Sunglasses"].push(product);
    } else if (category.toLowerCase().includes("bag") || category.toLowerCase().includes("wallet")) {
      organized["Bags & Wallets"].push(product);
    } else if (category.toLowerCase().includes("belt")) {
      organized["Belts"].push(product);
    }
  });

  return organized;
};

const SECTIONS = [
  {
    id: "menswear",
    label: "Menswear",
    items: ["Jackets & Coats", "Suits", "Shirts", "Knitwear", "Denim"],
  },
  {
    id: "pants",
    label: "Pants",
    items: ["Denim", "Korean Pants", "Baggy Pants"],
  },
  {
    id: "footwear",
    label: "Footwear",
    items: ["Sneakers", "Loafers", "Lace-Ups"],
  },
  {
    id: "accessories",
    label: "Accessories",
    items: ["Sunglasses", "Bags & Wallets", "Belts"],
  },
];

function SubcategorySection({ 
  title, 
  productsInCategory 
}: { 
  title: string
  productsInCategory: Product[] 
}) {
  return (
    <motion.div
      initial={false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="mb-6 sm:mb-8 md:mb-10"
    >
      {/* Subcategory header with product count */}
      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
        <h3
          className="text-xl sm:text-2xl font-light text-slate-50"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            letterSpacing: "0.08em",
          }}
        >
          {title}
        </h3>
        <div className="hidden sm:flex flex-1 h-px bg-gradient-to-r from-slate-700/50 to-transparent" />
        <span className="text-xs text-slate-400 uppercase tracking-widest">
          {productsInCategory.length} items
        </span>
      </div>

      {/* MOBILE: Grid optimized for small screens */}
      {productsInCategory.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
          {productsInCategory.map((product, idx) => (
            <motion.div
              key={product._id}
              initial={false}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05, duration: 0.5 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={false}
          animate={{ opacity: 1 }}
          className="py-8 sm:py-12 text-center text-slate-400"
        >
          <p className="text-sm">No products in this category yet</p>
          <p className="text-xs text-slate-500 mt-2">
            Products will appear here once added.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}

function GlassNav({ active, onChange }: { active: string; onChange: (id: string) => void }) {
  return (
    <div
      className="flex flex-wrap items-center justify-center gap-1 p-1.5 rounded-full max-w-full overflow-x-auto"
      style={{
        background: "linear-gradient(135deg, rgba(255,248,236,0.10) 0%, rgba(255,248,236,0.04) 100%)",
        backdropFilter: "blur(20px) saturate(160%)",
        border: "1px solid rgba(255,248,236,0.12)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,248,236,0.15)",
      }}
    >
      {SECTIONS.map((s) => (
        <button
          key={s.id}
          onClick={() => {
            onChange(s.id);
            document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
          className="relative px-3 sm:px-5 py-2 rounded-full text-[9px] sm:text-[10px] tracking-[0.25em] uppercase font-light transition-all duration-400 whitespace-nowrap flex-shrink-0"
          style={{
            color: active === s.id ? "#0A0908" : "rgba(255,248,236,0.5)",
            background:
              active === s.id
                ? "linear-gradient(135deg, rgba(201,168,106,0.95) 0%, rgba(178,149,78,0.95) 100%)"
                : "transparent",
            boxShadow: active === s.id ? "0 2px 12px rgba(201,168,106,0.4)" : "none",
            fontFamily: "'Jost', sans-serif",
          }}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}

export default function CollectionPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState("menswear");

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const PRODUCTS_ORGANIZED = useMemo(
    () => organizeProductsByCategory(products),
    []
  );

  return (
    <>
      <style>{`
        body { background: #0A0908; }
        .glass-pill {
          background: linear-gradient(135deg, rgba(255,248,236,0.15) 0%, rgba(255,248,236,0.06) 100%);
          box-shadow: 0 8px 32px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,248,236,0.22);
          backdrop-filter: blur(20px) saturate(180%);
          border: 1px solid rgba(255,248,236,0.14);
          transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1);
          min-height: 44px;
        }
        .glass-pill:hover {
          background: linear-gradient(135deg, rgba(255,248,236,0.22) 0%, rgba(255,248,236,0.09) 100%);
          box-shadow: 0 12px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,248,236,0.28), 0 0 20px rgba(201,168,106,0.12);
        }
        .glass-pill:active {
          transform: scale(0.98);
        }
        @keyframes heroIn {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hero-line-1 { animation: heroIn 1.2s cubic-bezier(0.22,1,0.36,1) 0.3s both; }
        .hero-line-2 { animation: heroIn 1.2s cubic-bezier(0.22,1,0.36,1) 0.55s both; }
        .hero-line-3 { animation: heroIn 1s cubic-bezier(0.22,1,0.36,1) 0.8s both; }
        .hero-line-4 { animation: heroIn 1s cubic-bezier(0.22,1,0.36,1) 1.05s both; }
        .sticky-nav {
          background: linear-gradient(135deg, rgba(8,8,8,0.7) 0%, rgba(8,8,8,0.5) 100%);
          backdrop-filter: blur(28px) saturate(180%);
          border-bottom: 1px solid rgba(255,248,236,0.07);
        }
        
        /* Mobile optimization */
        @media (max-width: 640px) {
          .sticky-nav {
            padding: 0.75rem 0.5rem;
          }
        }
      `}</style>

      <motion.main
        initial={false}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9 }}
        className="relative bg-[#0A0908] text-white min-h-screen"
        style={{ fontFamily: "'Jost', sans-serif" }}
      >
        {/* ── HERO (Mobile optimized) ── */}
        <section
          ref={heroRef}
          className="relative h-[60vh] sm:h-[75vh] md:h-[85vh] w-full overflow-hidden flex items-end justify-center pb-10 sm:pb-20"
        >
          <motion.div style={{ y: heroY }} className="absolute inset-0 scale-110">
            <AdaptiveHeroMedia
              alt="Collection campaign"
              className="absolute inset-0 h-full w-full object-cover"
              imagePriority
              posterSrc={withPublicAssetVersion("/uploads/collections.jpg")}
              style={{ filter: "brightness(0.5) saturate(0.85)" }}
              videoSrc={withPublicAssetVersion("/uploads/Goldmaa.mp4")}
            />
          </motion.div>

          <div
            className="absolute inset-0"
            style={{
              background: "radial-gradient(ellipse at 50% 70%, transparent 20%, rgba(0,0,0,0.6) 100%)",
            }}
          />
          <div
            className="absolute inset-x-0 bottom-0 h-40 sm:h-60"
            style={{ background: "linear-gradient(to top, #0A0908, transparent)" }}
          />
          <div
            className="absolute inset-x-0 top-0 h-16 sm:h-24"
            style={{ background: "linear-gradient(to bottom, rgba(8,8,8,0.6), transparent)" }}
          />

          <motion.div style={{ opacity: heroOpacity }} className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6 md:px-10">
            <p className="hero-line-1 text-white/30 text-[8px] sm:text-[10px] tracking-[0.45em] uppercase font-light mb-3 sm:mb-5">
              2025 Season
            </p>
            <h1
              className="hero-line-2 font-light text-white mb-3 sm:mb-5 leading-none"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(1.8rem, 7vw, 5.5rem)",
                letterSpacing: "0.04em",
                textShadow: "0 4px 40px rgba(0,0,0,0.5)",
              }}
            >
              The <em style={{ color: "#C9A86A", fontStyle: "italic" }}>Collection</em>
            </h1>
            <p
              className="hero-line-3 text-white/45 font-light tracking-widest max-w-md mx-auto text-xs sm:text-sm"
              style={{ letterSpacing: "0.14em" }}
            >
              Crafted in silence. Designed for presence.
            </p>
            <div className="hero-line-4 mt-6 sm:mt-8 flex items-center justify-center">
              <Link
                href="/shop"
                className="glass-pill inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-3.5 rounded-full text-white text-[10px] sm:text-[11px] font-light tracking-[0.25em] uppercase"
              >
                Shop All
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M2 7h10M8 3l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </div>
          </motion.div>
        </section>

        {/* ── STICKY NAV (Mobile optimized) ── */}
        <div className="sticky top-14 z-40 flex justify-center overflow-x-auto px-4 py-4 sticky-nav sm:top-16 sm:px-6 md:px-10">
          <GlassNav active={activeSection} onChange={setActiveSection} />
        </div>

        {/* ── MAIN SECTIONS ── */}
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-20 md:px-10">
          {SECTIONS.map((section, sectionIdx) => (
            <motion.section
              key={section.id}
              id={section.id}
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-16 sm:mb-24 scroll-mt-32"
            >
              {/* Section header */}
              <motion.div
                initial={false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="mb-8 sm:mb-12 border-b border-slate-700/50 pb-6 sm:pb-8"
              >
                <p
                  className="text-white/25 text-[9px] sm:text-[10px] tracking-[0.4em] uppercase font-light mb-2 sm:mb-3"
                  style={{ fontFamily: "'Jost', sans-serif" }}
                >
                  Collection
                </p>
                <h2
                  className="text-white font-light leading-none"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "clamp(1.5rem, 5vw, 3.2rem)",
                    letterSpacing: "0.06em",
                    color: "#C9A86A",
                  }}
                >
                  {section.label}
                </h2>
              </motion.div>

              {/* Subcategories with products */}
              <div className="space-y-16 sm:space-y-20">
                {section.items.map((categoryName) => {
                  const productsInCategory = PRODUCTS_ORGANIZED[categoryName] || [];
                  return (
                    <SubcategorySection
                      key={categoryName}
                      title={categoryName}
                      productsInCategory={productsInCategory}
                    />
                  );
                })}
              </div>

              {/* Section divider */}
              {sectionIdx < SECTIONS.length - 1 && (
                <div
                  className="mt-16 sm:mt-24 h-px"
                  style={{
                    background: "linear-gradient(90deg, transparent, rgba(255,248,236,0.06), transparent)",
                  }}
                />
              )}
            </motion.section>
          ))}
        </div>

        {/* ── FOOTER CTA ── */}
        <section
          className="relative mt-8 flex flex-col items-center justify-center overflow-hidden px-4 py-16 text-center sm:px-6 sm:py-24 md:px-10"
          style={{ background: "#14110F" }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at 50% 100%, rgba(201,168,106,0.06) 0%, transparent 65%)",
            }}
          />
          <div
            className="absolute inset-x-0 top-0 h-px"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(201,168,106,0.25), transparent)",
            }}
          />

          <motion.div
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="relative z-10 px-2 sm:px-0"
          >
            <p className="text-white/25 text-[8px] sm:text-[10px] tracking-[0.45em] uppercase font-light mb-4 sm:mb-5">
              Curated for You
            </p>
            <h2
              className="font-light text-white mb-6 sm:mb-8 leading-tight"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(1.5rem, 6vw, 3.8rem)",
                letterSpacing: "0.05em",
              }}
            >
              Every Piece.
              <br />
              <em style={{ color: "#C9A86A" }}>One Vision.</em>
            </h2>
            <Link
              href="/shop"
              className="glass-pill inline-flex items-center gap-2 sm:gap-3 px-8 sm:px-10 py-3 sm:py-4 rounded-full text-white text-[10px] sm:text-[11px] font-light tracking-[0.3em] uppercase"
            >
              Shop the Full Edit
            </Link>
          </motion.div>
        </section>
      </motion.main>
    </>
  );
}
