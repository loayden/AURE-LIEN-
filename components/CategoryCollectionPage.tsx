"use client";

import ProductCard from "@/components/ProductCard";
import ProductQuickView from "@/components/ProductQuickView";
import ProductSkeleton from "@/components/ui/ProductSkeleton";
import { withPublicAssetVersion } from "@/lib/publicAsset";
import type { Product } from "@/lib/types";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Filter, PackageSearch, Search, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

interface CategoryCollectionPageProps {
  title: string;
  category: string;
  eyebrow?: string;
  description?: string;
  emptyMessage?: string;
  fullMobileCards?: boolean;
}

type CatalogProduct = Product & {
  sizes?: string[];
  stock?: number;
  createdAt?: string;
};

const HERO_IMAGES: Record<string, string> = {
  "jackets-coats": "/uploads/Jackets & Coats.jpg",
  suits: "/uploads/Suits.jpg",
  shirts: "/uploads/main.jpg",
  knitwear: "/uploads/Textured Waffle-Knit Zip Jacket.jpg",
  denim: "/uploads/denim.jpg",
  jeans: "/uploads/baggy.jpg",
  korean: "/uploads/korean_black_jacket.jpg",
  boots: "/uploads/footwear.jpg",
  loafers: "/uploads/Loafers.jpg",
  "lace-ups": "/uploads/footwear.jpg",
  sneakers: "/uploads/Sneakers.jpg",
  sunglasses: "/uploads/accessories.jpg",
  belts: "/uploads/accessories.jpg",
  "bags-wallets": "/uploads/Bags & Wallets.jpg",
};

function normalizeColor(color: string | { name?: string }) {
  return typeof color === "string" ? color : String(color.name ?? "");
}

function productSizes(product: CatalogProduct) {
  return Array.from(new Set([...(product.size ?? []), ...(product.sizes ?? [])].filter(Boolean)));
}

function uniqueSorted(values: string[]) {
  return Array.from(new Set(values.filter(Boolean))).sort((a, b) => a.localeCompare(b));
}

export default function CategoryCollectionPage({
  title,
  category,
  eyebrow = "Curated Category",
  description = "A focused edit sized for comfortable browsing across phones, tablets, and desktop.",
  emptyMessage = "No products found in this category.",
  fullMobileCards = false,
}: CategoryCollectionPageProps) {
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [size, setSize] = useState("all");
  const [color, setColor] = useState("all");
  const [availability, setAvailability] = useState<"all" | "in-stock" | "low-stock" | "sold-out">("all");
  const [sort, setSort] = useState<"featured" | "price-low" | "price-high">("featured");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<CatalogProduct | null>(null);

  const words = title.trim().split(/\s+/).filter(Boolean);
  const accent = words.length > 1 ? words.pop() : null;
  const heroImage = withPublicAssetVersion(HERO_IMAGES[category] ?? "/uploads/collections.jpg");

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        const res = await fetch(`/api/products?category=${encodeURIComponent(category)}`, {
          cache: "no-store",
          signal: controller.signal,
        });
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
  }, [category]);

  const sizes = useMemo(() => uniqueSorted(products.flatMap(productSizes)), [products]);
  const colors = useMemo(
    () => uniqueSorted(products.flatMap((product) => (product.colors ?? []).map(normalizeColor))),
    [products]
  );

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products
      .filter((product) => {
        if (query) {
          const haystack = `${product.name} ${product.category} ${product.description ?? ""}`.toLowerCase();
          if (!haystack.includes(query)) return false;
        }
        if (size !== "all" && !productSizes(product).includes(size)) return false;
        if (color !== "all" && !(product.colors ?? []).map(normalizeColor).includes(color)) return false;

        const stock = typeof product.stock === "number" ? product.stock : null;
        if (availability === "in-stock" && stock === 0) return false;
        if (availability === "low-stock" && !(stock !== null && stock > 0 && stock < 5)) return false;
        if (availability === "sold-out" && stock !== 0) return false;

        return true;
      })
      .sort((a, b) => {
        if (sort === "price-low") return a.price - b.price;
        if (sort === "price-high") return b.price - a.price;
        return products.indexOf(a) - products.indexOf(b);
      });
  }, [availability, color, products, search, size, sort]);

  const resetFilters = () => {
    setSearch("");
    setSize("all");
    setColor("all");
    setAvailability("all");
  };

  const activeFilterCount = [
    search.trim(),
    size !== "all" ? size : "",
    color !== "all" ? color : "",
    availability !== "all" ? availability : "",
  ].filter(Boolean).length;

  const filterPanel = (
    <div className="space-y-5">
      <div>
        <label htmlFor={`${category}-search`} className="mb-3 block text-[10px] uppercase tracking-[0.24em] text-white/35">
          Search
        </label>
        <div className="flex min-h-[48px] items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.035] px-4">
          <Search className="h-4 w-4 text-white/35" strokeWidth={1.4} />
          <input
            id={`${category}-search`}
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/28"
            placeholder="Search this category"
          />
        </div>
      </div>

      <div>
        <label htmlFor={`${category}-sort`} className="mb-3 block text-[10px] uppercase tracking-[0.24em] text-white/35">
          Sort
        </label>
        <select id={`${category}-sort`} value={sort} onChange={(event) => setSort(event.target.value as typeof sort)} className="glass-input min-h-[48px] w-full">
          <option value="featured">Featured</option>
          <option value="price-low">Price low-high</option>
          <option value="price-high">Price high-low</option>
        </select>
      </div>

      {sizes.length > 0 ? (
        <div>
          <p className="mb-3 text-[10px] uppercase tracking-[0.24em] text-white/35">Size</p>
          <div className="flex flex-wrap gap-2">
            {["all", ...sizes].map((item) => (
              <button key={item} type="button" onClick={() => setSize(item)} className={`luxury-filter-pill min-h-[44px] ${size === item ? "is-active" : ""}`}>
                {item === "all" ? "All" : item}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {colors.length > 0 ? (
        <div>
          <p className="mb-3 text-[10px] uppercase tracking-[0.24em] text-white/35">Color</p>
          <div className="flex flex-wrap gap-2">
            {["all", ...colors].map((item) => (
              <button key={item} type="button" onClick={() => setColor(item)} className={`luxury-filter-pill min-h-[44px] ${color === item ? "is-active" : ""}`}>
                {item === "all" ? "All" : item}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div>
        <p className="mb-3 text-[10px] uppercase tracking-[0.24em] text-white/35">Availability</p>
        <div className="flex flex-wrap gap-2">
          {[
            ["all", "All"],
            ["in-stock", "In stock"],
            ["low-stock", "Low stock"],
            ["sold-out", "Sold out"],
          ].map(([value, label]) => (
            <button key={value} type="button" onClick={() => setAvailability(value as typeof availability)} className={`luxury-filter-pill min-h-[44px] ${availability === value ? "is-active" : ""}`}>
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const pieceLabel = products.length === 1 ? "Piece" : "Pieces";

  return (
    <main className="liquid-page pb-28">
      <section className="relative isolate overflow-hidden px-4 pb-14 pt-24 sm:px-6 sm:pb-16 sm:pt-28 md:px-10">
        <Image
          src={heroImage}
          alt={title}
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 -z-20 object-cover opacity-48"
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(10,9,8,0.56),#0A0908_82%)]" />
        <div className="page-wrap">
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow mb-4">{eyebrow}</p>
            <h1 className="luxury-title mb-5 text-white">
              {words.join(" ")}
              {accent ? (
                <>
                  {" "}
                  <em className="gold-italic">{accent}</em>
                </>
              ) : null}
            </h1>
            <p className="body-copy mx-auto max-w-2xl">{description}</p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <span className="count-pill">
                {loading ? "Loading" : `${products.length} ${pieceLabel}`}
              </span>
              <Link href="/shop" className="btn-ghost min-h-[44px] justify-center">
                Full Shop
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 md:px-10">
        <div className="page-wrap">
          <div className="mb-7 flex flex-col gap-4 border-b border-white/10 pb-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <span className="count-pill">
                {loading ? "Loading" : `${filteredProducts.length} shown`}
              </span>
              <button type="button" onClick={() => setFiltersOpen(true)} className="btn-ghost min-h-[48px] justify-center lg:hidden">
                <Filter className="h-4 w-4" strokeWidth={1.4} />
                Filters
                {activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
              </button>
              {activeFilterCount > 0 ? (
                <button type="button" onClick={resetFilters} className="min-h-[44px] rounded-full px-4 text-[10px] uppercase tracking-[0.22em] text-white/42 hover:text-white">
                  Reset
                </button>
              ) : null}
            </div>
            <div className="hidden max-w-md flex-1 lg:block">{filterPanel}</div>
          </div>

          {loading ? (
            <ProductSkeleton count={8} />
          ) : error ? (
            <div className="glass-panel mx-auto max-w-2xl px-4 py-10 text-center sm:px-6">
              <PackageSearch className="mx-auto mb-4 h-9 w-9 text-white/25" strokeWidth={1.3} />
              <p className="body-copy body-copy-strong">{error}</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className={fullMobileCards ? "catalog-grid catalog-grid-mobile-full" : "catalog-grid"}>
              {filteredProducts.map((product) => (
                <div key={product._id} className="group relative">
                  <ProductCard product={product} />
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      setQuickViewProduct(product);
                    }}
                    className="absolute left-4 top-4 z-30 inline-flex min-h-[44px] items-center gap-2 rounded-full border border-white/10 bg-black/38 px-4 text-[10px] uppercase tracking-[0.18em] text-white/72 opacity-100 backdrop-blur-xl transition-colors hover:text-white md:opacity-0 md:group-hover:opacity-100"
                  >
                    Quick View
                    <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.4} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-panel mx-auto max-w-2xl px-4 py-10 text-center sm:px-6">
              <PackageSearch className="mx-auto mb-4 h-9 w-9 text-white/25" strokeWidth={1.3} />
              <p className="body-copy mx-auto max-w-xl text-center body-copy-strong">{emptyMessage}</p>
              <button type="button" onClick={resetFilters} className="btn-gold mx-auto mt-7 justify-center">
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {filtersOpen ? (
          <motion.div className="fixed inset-0 z-[80] lg:hidden" role="dialog" aria-modal="true" aria-label={`${title} filters`}>
            <motion.button
              type="button"
              className="absolute inset-0 cursor-default bg-black/62 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setFiltersOpen(false)}
              aria-label="Close filters"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-x-0 bottom-0 max-h-[86vh] overflow-y-auto rounded-t-[30px] border border-white/10 bg-[#14110F] p-5 pb-[max(env(safe-area-inset-bottom),1.25rem)]"
            >
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="eyebrow mb-2">{title}</p>
                  <p className="text-sm text-white/45">{filteredProducts.length} products visible</p>
                </div>
                <button type="button" onClick={() => setFiltersOpen(false)} className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-white/55" aria-label="Close filters">
                  <X className="h-4 w-4" strokeWidth={1.4} />
                </button>
              </div>
              {filterPanel}
              <div className="mt-8 grid grid-cols-2 gap-3">
                <button type="button" onClick={resetFilters} className="btn-ghost justify-center">
                  Reset
                </button>
                <button type="button" onClick={() => setFiltersOpen(false)} className="btn-gold justify-center">
                  Apply
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <ProductQuickView product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </main>
  );
}
