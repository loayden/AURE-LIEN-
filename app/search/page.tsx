"use client";

import ProductCard from "@/components/ProductCard";
import type { Product } from "@/lib/types";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function SearchContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!q) {
      setProducts([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(q)}`)
      .then((r) => r.json())
      .then((d) => setProducts(d.products || []))
      .finally(() => setLoading(false));
  }, [q]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-ivory flex items-center justify-center pt-24">
        <p className="tracking-widest text-silver">Loading...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black text-ivory pt-16 pb-16 px-4 sm:pt-24 sm:pb-20 sm:px-6 md:px-10">
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
    <Suspense fallback={<div className="min-h-screen bg-black pt-16 sm:pt-24 flex justify-center px-4 text-silver sm:px-6 md:px-10">Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}
