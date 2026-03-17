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
      <main className="pt-36 bg-[#111111] min-h-screen text-[#EFEFEF] tracking-wide flex items-center justify-center">
        <p className="text-lg">Loading products...</p>
      </main>
    );
  }

  return (
    <main className="pt-36 bg-[#111111] min-h-screen text-[#EFEFEF] tracking-wide px-6 pb-40">
      <section className="text-center mb-24">
        <h1 className="text-5xl font-serif font-light tracking-[0.25em] mb-4">
          Products
        </h1>
        <p className="text-[#EFEFEF]/60 max-w-xl mx-auto text-base tracking-wide leading-relaxed">
          All products from the catalog.
        </p>
      </section>
      {products.length > 0 ? (
        <section className="max-w-7xl mx-auto grid md:grid-cols-3 gap-16">
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
