"use client";

import ProductCard from "@/components/ProductCard";
import productsData from "@/lib/productsData";
import { useEffect, useState } from "react";

export default function ProductsFromAPIPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setProducts(productsData);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <main className="liquid-page pt-24">
        <div className="page-wrap flex min-h-[55vh] items-center justify-center">
          <p className="eyebrow">Loading Products</p>
        </div>
      </main>
    );
  }

  return (
    <main className="liquid-page px-4 pb-24 pt-16 sm:px-6 sm:pb-32 sm:pt-24 md:px-10 md:pb-40">
      <section className="page-wrap pt-2">
        <div className="mb-10 text-center sm:mb-16 md:mb-24">
          <p className="eyebrow mb-4">Catalogue Mirror</p>
          <h1 className="title-display mb-5">
            Product <em className="gold-italic">Index</em>
          </h1>
          <p className="body-copy mx-auto max-w-xl">
            A full catalogue view rendered inside the same liquid glass shell as the rest of the storefront.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <span className="h-px w-10" style={{ background: "linear-gradient(90deg, transparent, rgba(168,121,53,0.7), transparent)" }} />
            <span className="count-pill">{products.length} Pieces</span>
            <span className="h-px w-10" style={{ background: "linear-gradient(90deg, transparent, rgba(168,121,53,0.7), transparent)" }} />
          </div>
        </div>

      {products.length > 0 ? (
        <section className="catalog-grid mx-auto max-w-7xl">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </section>
      ) : (
        <div className="glass-panel mx-auto max-w-2xl px-5 py-10 text-center">
          <p className="body-copy body-copy-strong">No products found.</p>
        </div>
      )}
      </section>
    </main>
  );
}
