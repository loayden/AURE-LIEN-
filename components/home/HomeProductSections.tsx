"use client";

import ProductCard from "@/components/ProductCard";
import ProductSkeleton from "@/components/ui/ProductSkeleton";
import type { Product } from "@/lib/types";
import { ArrowRight, PackageSearch } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const LOOKS = [
  {
    title: "Formal",
    categories: ["suits", "shirts", "loafers", "lace-ups"],
  },
  {
    title: "Casual",
    categories: ["jackets-coats", "shirts", "denim", "sneakers", "jeans"],
  },
  {
    title: "Evening",
    categories: ["jackets-coats", "shirts", "belts", "boots", "sunglasses"],
  },
];

function belongsTo(product: Product, categories: string[]) {
  const category = String(product.category ?? "").toLowerCase();
  return categories.some((candidate) => category.includes(candidate) || candidate.includes(category));
}

export default function HomeProductSections() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        const res = await fetch("/api/products", { cache: "no-store", signal: controller.signal });
        const data = await res.json();
        if (!res.ok || !Array.isArray(data)) {
          throw new Error(data?.error || "Unable to load products");
        }
        setProducts(data);
      } catch (requestError) {
        if (controller.signal.aborted) return;
        setError(requestError instanceof Error ? requestError.message : "Unable to load products");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    })();

    return () => controller.abort();
  }, []);

  const newArrivals = useMemo(() => products.slice(0, 8), [products]);
  const completeLooks = useMemo(
    () =>
      LOOKS.map((look) => ({
        ...look,
        products: products.filter((product) => belongsTo(product, look.categories)).slice(0, 4),
      })).filter((look) => look.products.length >= 2),
    [products]
  );

  return (
    <>
      <section className="px-4 pt-16 sm:px-6 sm:pt-20 md:px-10">
        <div className="page-wrap">
          <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow mb-4">New Arrivals</p>
              <h2 className="title-display text-[clamp(2rem,4vw,3.5rem)]">
                Fresh pieces from the <em className="gold-italic">catalogue</em>
              </h2>
            </div>
            <Link href="/shop" className="btn-ghost justify-center sm:justify-start">
              View All
            </Link>
          </div>

          {loading ? (
            <ProductSkeleton count={8} />
          ) : error ? (
            <div className="glass-panel mx-auto max-w-2xl px-5 py-10 text-center">
              <PackageSearch className="mx-auto mb-4 h-8 w-8 text-white/25" strokeWidth={1.3} />
              <p className="body-copy body-copy-strong">{error}</p>
            </div>
          ) : newArrivals.length > 0 ? (
            <div className="catalog-grid catalog-grid-mobile-full">
              {newArrivals.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="glass-panel mx-auto max-w-2xl px-5 py-10 text-center">
              <p className="body-copy body-copy-strong">No products are available right now.</p>
            </div>
          )}
        </div>
      </section>

      {completeLooks.length > 0 && (
        <section className="px-4 pt-16 sm:px-6 sm:pt-20 md:px-10">
          <div className="page-wrap">
            <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="eyebrow mb-4">Complete The Look</p>
                <h2 className="title-display text-[clamp(2rem,4vw,3.4rem)]">
                  Build outfits from real <em className="gold-italic">pieces</em>
                </h2>
              </div>
              <Link href="/outfit-generator" className="btn-gold justify-center">
                Open Outfit Generator
              </Link>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              {completeLooks.map((look) => (
                <div key={look.title} className="warm-panel overflow-hidden rounded-[28px]">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={look.products[0]?.images?.[0] || "/images/placeholder.svg"}
                      alt={look.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0908] via-[#0A0908]/45 to-transparent" />
                    <div className="absolute bottom-5 left-5 right-5">
                      <p className="eyebrow mb-2">{look.title}</p>
                      <h3 className="font-serif text-3xl font-light text-white">
                        {look.products.length} pieces
                      </h3>
                    </div>
                  </div>
                  <div className="divide-y divide-white/[0.06]">
                    {look.products.map((product) => (
                      <Link
                        key={product._id}
                        href={`/product/${encodeURIComponent(product._id)}`}
                        className="flex min-h-[72px] items-center justify-between gap-3 px-5 py-3 transition-colors hover:bg-white/[0.035]"
                      >
                        <span className="min-w-0">
                          <span className="block truncate font-serif text-lg font-light text-white/80">
                            {product.name}
                          </span>
                          <span className="text-[9px] uppercase tracking-[0.22em] text-white/28">
                            {product.category}
                          </span>
                        </span>
                        <span className="whitespace-nowrap text-sm text-brass">
                          EGP {product.price.toLocaleString()}
                        </span>
                      </Link>
                    ))}
                  </div>
                  <Link
                    href="/lookbook"
                    className="flex min-h-[52px] items-center justify-center gap-2 border-t border-white/[0.06] text-[10px] uppercase tracking-[0.24em] text-brass"
                  >
                    View Lookbook
                    <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.4} />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
