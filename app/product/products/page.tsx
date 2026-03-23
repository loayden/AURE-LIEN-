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
      <main className="flex min-h-screen items-center justify-center bg-[#111111] px-4 pt-16 text-[#EFEFEF] tracking-wide sm:px-6 sm:pt-24 md:px-10">
        <p className="text-lg">Loading products...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#111111] px-4 pb-24 pt-16 text-[#EFEFEF] tracking-wide sm:px-6 sm:pb-32 sm:pt-24 md:px-10 md:pb-40">
      <section className="mb-10 text-center sm:mb-16 md:mb-24">
        <h1 className="mb-4 text-3xl font-serif font-light tracking-[0.25em] sm:text-4xl md:text-5xl">
          Products
        </h1>
        <p className="mx-auto max-w-xl text-[11px] leading-relaxed tracking-wide text-[#EFEFEF]/60 sm:text-sm md:text-base">
          All products from the catalog.
        </p>
      </section>
      {products.length > 0 ? (
        <section className="product-grid-shell mx-auto max-w-7xl lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </section>
      ) : (
        <p className="text-center text-[#EFEFEF]/60 text-lg">
          No products found.
        </p>
      )}
    </main>
  );
}
