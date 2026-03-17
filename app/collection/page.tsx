"use client";

import ProductCard from "@/components/ProductCard";
import products from "@/lib/productsData";
import type { Product } from "@/lib/types";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";

/**
 * STEP 1: Organize products by category
 * 
 * This function takes your imported `products` array and organizes it
 * into categories based on the product's category field.
 */
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

  /**
   * STEP 2: Loop through each product from your import
   * and place it in the correct category
   */
  allProducts.forEach((product) => {
    const category = product.category || "";
    
    // Match product categories to our display categories
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

/**
 * STEP 3: SubcategorySection Component
 * 
 * This component receives a category name and the products in that category
 * It then displays each product using your ProductCard component
 */
function SubcategorySection({ 
  title, 
  productsInCategory 
}: { 
  title: string
  productsInCategory: Product[] 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="mb-16"
    >
      {/* Subcategory header with product count */}
      <div className="mb-6 flex items-center gap-4">
        <h3
          className="text-2xl font-light text-slate-50"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            letterSpacing: "0.08em",
          }}
        >
          {title}
        </h3>
        <div className="flex-1 h-px bg-gradient-to-r from-slate-700/50 to-transparent" />
        <span className="text-xs text-slate-400 uppercase tracking-widest">
          {productsInCategory.length} items
        </span>
      </div>

      {/* STEP 4: Display products or empty state */}
      {productsInCategory.length > 0 ? (
        // ✅ PRODUCTS FOUND: Show grid of ProductCards
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {productsInCategory.map((product, idx) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05, duration: 0.5 }}
            >
              {/* YOUR PRODUCTCARD COMPONENT - Used here! */}
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      ) : (
        // ❌ NO PRODUCTS: Show empty state
        // This happens when no products match this category from your imports
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-12 text-center text-slate-400"
        >
          <p>No products in this category yet</p>
          <p className="text-sm text-slate-500 mt-2">
            Products will appear here once they are added to your collection.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}

// ── FLOATING ORBS ──
function FloatingOrbs() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute rounded-full"
        style={{
          width: 700,
          height: 700,
          top: "-20%",
          right: "-15%",
          background: "radial-gradient(circle, rgba(198,169,98,0.08) 0%, transparent 70%)",
          filter: "blur(80px)",
          animation: "orbA 22s ease-in-out infinite",
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: 500,
          height: 500,
          bottom: "5%",
          left: "-10%",
          background: "radial-gradient(circle, rgba(160,160,210,0.07) 0%, transparent 70%)",
          filter: "blur(70px)",
          animation: "orbB 28s ease-in-out infinite",
        }}
      />
      <style>{`
        @keyframes orbA { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-40px,30px) scale(1.07)} }
        @keyframes orbB { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(50px,-30px) scale(1.05)} }
      `}</style>
    </div>
  );
}

// ── GLASS NAV ──
function GlassNav({ active, onChange }: { active: string; onChange: (id: string) => void }) {
  return (
    <div
      className="flex items-center gap-1 p-1.5 rounded-full"
      style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.04) 100%)",
        backdropFilter: "blur(20px) saturate(160%)",
        border: "1px solid rgba(255,255,255,0.12)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.15)",
      }}
    >
      {SECTIONS.map((s) => (
        <button
          key={s.id}
          onClick={() => {
            onChange(s.id);
            document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
          className="relative px-5 py-2 rounded-full text-[10px] tracking-[0.25em] uppercase font-light transition-all duration-400"
          style={{
            color: active === s.id ? "#080808" : "rgba(255,255,255,0.5)",
            background:
              active === s.id
                ? "linear-gradient(135deg, rgba(198,169,98,0.95) 0%, rgba(178,149,78,0.95) 100%)"
                : "transparent",
            boxShadow: active === s.id ? "0 2px 12px rgba(198,169,98,0.4)" : "none",
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

  /**
   * STEP 0: Memoize the organization of products
   * This only runs when the `products` import changes
   * Prevents unnecessary re-organization on every render
   */
  const PRODUCTS_ORGANIZED = useMemo(
    () => organizeProductsByCategory(products),
    [products]
  );

  // DEBUG: Log what products were found (can remove later)
  console.log("✅ Products imported:", products.length, "items");
  console.log("📦 Products organized by category:", PRODUCTS_ORGANIZED);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@200;300;400&display=swap');
        body { background: #080808; }
        .glass-pill {
          background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.06) 100%);
          box-shadow: 0 8px 32px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.22);
          backdrop-filter: blur(20px) saturate(180%);
          border: 1px solid rgba(255,255,255,0.14);
          transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .glass-pill:hover {
          background: linear-gradient(135deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.09) 100%);
          box-shadow: 0 12px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.28), 0 0 20px rgba(198,169,98,0.12);
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
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }
      `}</style>

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9 }}
        className="relative bg-[#080808] text-white min-h-screen"
        style={{ fontFamily: "'Jost', sans-serif" }}
      >
        {/* ── HERO ── */}
        <section
          ref={heroRef}
          className="relative h-[85vh] w-full overflow-hidden flex items-end justify-center pb-20"
        >
          <motion.div style={{ y: heroY }} className="absolute inset-0 scale-110">
            <video
              src="/uploads/Goldmaa.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
              style={{ filter: "brightness(0.5) saturate(0.85)" }}
            />
          </motion.div>

          <div
            className="absolute inset-0"
            style={{
              background: "radial-gradient(ellipse at 50% 70%, transparent 20%, rgba(0,0,0,0.6) 100%)",
            }}
          />
          <div
            className="absolute inset-x-0 bottom-0 h-60"
            style={{ background: "linear-gradient(to top, #080808, transparent)" }}
          />
          <div
            className="absolute inset-x-0 top-0 h-24"
            style={{ background: "linear-gradient(to bottom, rgba(8,8,8,0.6), transparent)" }}
          />

          <motion.div style={{ opacity: heroOpacity }} className="relative z-10 text-center px-6 max-w-3xl mx-auto">
            <p className="hero-line-1 text-white/30 text-[10px] tracking-[0.45em] uppercase font-light mb-5">
              2025 Season
            </p>
            <h1
              className="hero-line-2 font-light text-white mb-5 leading-none"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(3.5rem, 9vw, 7.5rem)",
                letterSpacing: "0.04em",
                textShadow: "0 4px 40px rgba(0,0,0,0.5)",
              }}
            >
              The <em style={{ color: "#C6A962", fontStyle: "italic" }}>Collection</em>
            </h1>
            <p
              className="hero-line-3 text-white/45 font-light tracking-widest max-w-md mx-auto"
              style={{ fontSize: "0.85rem", letterSpacing: "0.14em" }}
            >
              Crafted in silence. Designed for presence.
            </p>
            <div className="hero-line-4 mt-8 flex items-center justify-center gap-4">
              <Link
                href="/shop"
                className="glass-pill inline-flex items-center gap-3 px-8 py-3.5 rounded-full text-white text-[11px] font-light tracking-[0.25em] uppercase"
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

        {/* ── STICKY NAV ── */}
        <div className="sticky top-0 z-40 sticky-nav py-4 px-6 flex justify-center">
          <GlassNav active={activeSection} onChange={setActiveSection} />
        </div>

        {/* ── MAIN SECTIONS ── */}
        <div className="relative px-6 max-w-7xl mx-auto py-20">
          {SECTIONS.map((section, sectionIdx) => (
            <motion.section
              key={section.id}
              id={section.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-24 scroll-mt-32"
            >
              {/* Section header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="mb-12 border-b border-slate-700/50 pb-8"
              >
                <p
                  className="text-white/25 text-[10px] tracking-[0.4em] uppercase font-light mb-3"
                  style={{ fontFamily: "'Jost', sans-serif" }}
                >
                  Collection
                </p>
                <h2
                  className="text-white font-light leading-none"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "clamp(2rem, 4vw, 3.2rem)",
                    letterSpacing: "0.06em",
                    color: "#C6A962",
                  }}
                >
                  {section.label}
                </h2>
              </motion.div>

              {/* Subcategories with products */}
              <div className="space-y-20">
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
                  className="mt-24 h-px"
                  style={{
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)",
                  }}
                />
              )}
            </motion.section>
          ))}
        </div>

        {/* ── FOOTER CTA ── */}
        <section
          className="relative py-24 px-6 flex flex-col items-center justify-center text-center overflow-hidden mt-8"
          style={{ background: "#060606" }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at 50% 100%, rgba(198,169,98,0.06) 0%, transparent 65%)",
            }}
          />
          <div
            className="absolute inset-x-0 top-0 h-px"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(198,169,98,0.25), transparent)",
            }}
          />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="relative z-10"
          >
            <p className="text-white/25 text-[10px] tracking-[0.45em] uppercase font-light mb-5">
              Curated for You
            </p>
            <h2
              className="font-light text-white mb-8 leading-tight"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(2rem, 5vw, 3.8rem)",
                letterSpacing: "0.05em",
              }}
            >
              Every Piece.
              <br />
              <em style={{ color: "#C6A962" }}>One Vision.</em>
            </h2>
            <Link
              href="/shop"
              className="glass-pill inline-flex items-center gap-3 px-10 py-4 rounded-full text-white text-[11px] font-light tracking-[0.3em] uppercase"
            >
              Shop the Full Edit
            </Link>
          </motion.div>
        </section>
      </motion.main>
    </>
  );
}
