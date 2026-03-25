"use client";

import ProductCard from "@/components/ProductCard";
import { searchCatalogProducts } from "@/lib/searchProducts";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";

function SearchContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";
  const products = useMemo(() => (q ? searchCatalogProducts(q) : []), [q]);

  return (
    <main className="min-h-screen bg-black px-4 pb-16 pt-12 text-ivory sm:px-6 sm:pb-20 sm:pt-16 md:px-10">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-serif text-display-md tracking-luxury-wide border-b border-brass/30 pb-4 sm:pb-6 mb-6 sm:mb-8 md:mb-10"
        >
          Search {q ? `"${q}"` : ""}
        </motion.h1>

        {!q ? (
          <p className="text-silver">Enter a search term above or use the search icon in the header.</p>
        ) : products.length === 0 ? (
          <p className="text-silver">No products found. Try different keywords.</p>
        ) : (
          <div className="product-grid-shell lg:grid-cols-4">
            {products.map((product, i) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black px-4 pt-12 text-silver sm:px-6 sm:pt-16 md:px-10 flex justify-center">Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}
