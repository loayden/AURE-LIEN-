"use client";

import ProductCard from "@/components/ProductCard";
import type { Product } from "@/lib/types";
import { motion } from "framer-motion";
import { Search, Sparkles } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function SearchContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const words = q.trim().split(/\s+/).filter(Boolean);
  const accent = words.length > 1 ? words.pop() : q ? "Results" : "Search";

  useEffect(() => {
    const query = q.trim();
    if (!query) {
      setProducts([]);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    setLoading(true);

    fetch(`/api/search?q=${encodeURIComponent(query)}`, {
      cache: "no-store",
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error("Search failed");
        return res.json();
      })
      .then((data) => {
        if (!controller.signal.aborted) {
          setProducts(Array.isArray(data.products) ? data.products : []);
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) setProducts([]);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [q]);

  return (
    <main className="liquid-page px-4 pb-16 pt-16 sm:px-6 sm:pb-20 sm:pt-20 md:px-10">
      <div className="page-wrap max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 sm:mb-10"
        >
          <p className="eyebrow mb-4">Search</p>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h1 className="title-display" style={{ fontSize: "clamp(2.2rem, 6vw, 4.6rem)" }}>
              {q ? (
                <>
                  {words.join(" ") || "Search"} <em className="gold-italic">{accent}</em>
                </>
              ) : (
                <>
                  Search <em className="gold-italic">Archive</em>
                </>
              )}
            </h1>
            {q ? <span className="count-pill">{loading ? "Searching" : `${products.length} Matches`}</span> : null}
          </div>
          <div className="page-header-divider mt-6" />
        </motion.div>

        {!q ? (
          <div className="glass-panel flex flex-col items-center px-6 py-16 text-center">
            <div className="empty-icon-panel mb-6">
              <Search strokeWidth={1} className="h-7 w-7 text-white/20" />
            </div>
            <h2 className="title-display text-[1.8rem]">
              Begin Your <em className="gold-italic">Search</em>
            </h2>
            <p className="body-copy mt-3 max-w-md text-center">
              Enter a search term above or open the header search overlay to browse the collection with the same glass-driven layout.
            </p>
          </div>
        ) : loading ? (
          <div className="glass-panel flex flex-col items-center px-6 py-16 text-center">
            <div className="empty-icon-panel mb-6">
              <Search strokeWidth={1} className="h-7 w-7 text-white/20" />
            </div>
            <h2 className="title-display text-[1.8rem]">
              Searching <em className="gold-italic">Archive</em>
            </h2>
          </div>
        ) : products.length === 0 ? (
          <div className="glass-panel flex flex-col items-center px-6 py-16 text-center">
            <div className="empty-icon-panel mb-6">
              <Sparkles strokeWidth={1} className="h-7 w-7 text-white/20" />
            </div>
            <h2 className="title-display text-[1.8rem]">
              Nothing <em className="gold-italic">Found</em>
            </h2>
            <p className="body-copy mt-3 max-w-md text-center">
              No pieces matched your search. Try a broader term, a category name, or a material keyword.
            </p>
          </div>
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
    <Suspense fallback={<div className="liquid-page flex min-h-screen items-center justify-center px-4 pt-12 text-white/35 sm:px-6 sm:pt-16 md:px-10"><p className="eyebrow">Loading Search</p></div>}>
      <SearchContent />
    </Suspense>
  );
}
