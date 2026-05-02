"use client";

import ProductCard from "@/components/ProductCard";
import ProductQuickView from "@/components/ProductQuickView";
import ProductSkeleton from "@/components/ui/ProductSkeleton";
import { withPublicAssetVersion } from "@/lib/publicAsset";
import type { Product } from "@/lib/types";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Filter, PackageSearch, Search, SlidersHorizontal, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";

type CatalogProduct = Product & {
  sizes?: string[];
  stock?: number;
  createdAt?: string;
};

type Availability = "all" | "in-stock" | "low-stock" | "sold-out";
type SortValue = "featured" | "newest" | "price-low" | "price-high";

const SORT_OPTIONS: Array<{ value: SortValue; label: string }> = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-low", label: "Price low-high" },
  { value: "price-high", label: "Price high-low" },
];

const AVAILABILITY_OPTIONS: Array<{ value: Availability; label: string }> = [
  { value: "all", label: "All stock" },
  { value: "in-stock", label: "In stock" },
  { value: "low-stock", label: "Low stock" },
  { value: "sold-out", label: "Sold out" },
];

function normalizeColor(color: string | { name?: string }) {
  return typeof color === "string" ? color : String(color.name ?? "");
}

function productSizes(product: CatalogProduct) {
  return Array.from(new Set([...(product.size ?? []), ...(product.sizes ?? [])].filter(Boolean)));
}

function formatPrice(value: number) {
  return `EGP ${value.toLocaleString()}`;
}

function uniqueSorted(values: string[]) {
  return Array.from(new Set(values.filter(Boolean))).sort((a, b) => a.localeCompare(b));
}

export default function ShopPage() {
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [size, setSize] = useState("all");
  const [color, setColor] = useState("all");
  const [availability, setAvailability] = useState<Availability>("all");
  const [sort, setSort] = useState<SortValue>("featured");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<CatalogProduct | null>(null);

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

  const categories = useMemo(() => uniqueSorted(products.map((product) => product.category)), [products]);
  const sizes = useMemo(() => uniqueSorted(products.flatMap(productSizes)), [products]);
  const colors = useMemo(
    () => uniqueSorted(products.flatMap((product) => (product.colors ?? []).map(normalizeColor))),
    [products]
  );

  const filteredProducts = useMemo(() => {
    const min = minPrice.trim() === "" ? null : Number(minPrice);
    const max = maxPrice.trim() === "" ? null : Number(maxPrice);
    const query = search.trim().toLowerCase();

    return products
      .filter((product) => {
        if (query) {
          const haystack = `${product.name} ${product.category} ${product.description ?? ""}`.toLowerCase();
          if (!haystack.includes(query)) return false;
        }

        if (category !== "all" && product.category !== category) return false;
        if (size !== "all" && !productSizes(product).includes(size)) return false;
        if (color !== "all" && !(product.colors ?? []).map(normalizeColor).includes(color)) return false;
        if (min !== null && !Number.isNaN(min) && product.price < min) return false;
        if (max !== null && !Number.isNaN(max) && product.price > max) return false;

        const stock = typeof product.stock === "number" ? product.stock : null;
        if (availability === "in-stock" && stock === 0) return false;
        if (availability === "low-stock" && !(stock !== null && stock > 0 && stock < 5)) return false;
        if (availability === "sold-out" && stock !== 0) return false;

        return true;
      })
      .sort((a, b) => {
        if (sort === "price-low") return a.price - b.price;
        if (sort === "price-high") return b.price - a.price;
        if (sort === "newest") {
          const aTime = a.createdAt ? Date.parse(a.createdAt) : 0;
          const bTime = b.createdAt ? Date.parse(b.createdAt) : 0;
          return bTime - aTime || products.indexOf(b) - products.indexOf(a);
        }
        return products.indexOf(a) - products.indexOf(b);
      });
  }, [availability, category, color, maxPrice, minPrice, products, search, size, sort]);

  const resetFilters = useCallback(() => {
    setSearch("");
    setCategory("all");
    setSize("all");
    setColor("all");
    setAvailability("all");
    setMinPrice("");
    setMaxPrice("");
  }, []);

  const activeChips = [
    search.trim() ? { label: `Search: ${search.trim()}`, onRemove: () => setSearch("") } : null,
    category !== "all" ? { label: category, onRemove: () => setCategory("all") } : null,
    size !== "all" ? { label: `Size ${size}`, onRemove: () => setSize("all") } : null,
    color !== "all" ? { label: color, onRemove: () => setColor("all") } : null,
    availability !== "all"
      ? {
          label: AVAILABILITY_OPTIONS.find((option) => option.value === availability)?.label ?? "Availability",
          onRemove: () => setAvailability("all"),
        }
      : null,
    minPrice ? { label: `Min ${formatPrice(Number(minPrice) || 0)}`, onRemove: () => setMinPrice("") } : null,
    maxPrice ? { label: `Max ${formatPrice(Number(maxPrice) || 0)}`, onRemove: () => setMaxPrice("") } : null,
  ].filter(Boolean) as Array<{ label: string; onRemove: () => void }>;

  const filterPanel = (
    <div className="space-y-6">
      <div>
        <label htmlFor="shop-category" className="mb-3 block text-[10px] uppercase tracking-[0.24em] text-white/35">
          Category
        </label>
        <select id="shop-category" value={category} onChange={(event) => setCategory(event.target.value)} className="glass-input min-h-[48px] w-full">
          <option value="all">All categories</option>
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="shop-min-price" className="mb-3 block text-[10px] uppercase tracking-[0.24em] text-white/35">
            Min price
          </label>
          <input
            id="shop-min-price"
            type="number"
            min="0"
            value={minPrice}
            onChange={(event) => setMinPrice(event.target.value)}
            className="glass-input min-h-[48px] w-full"
            placeholder="0"
          />
        </div>
        <div>
          <label htmlFor="shop-max-price" className="mb-3 block text-[10px] uppercase tracking-[0.24em] text-white/35">
            Max price
          </label>
          <input
            id="shop-max-price"
            type="number"
            min="0"
            value={maxPrice}
            onChange={(event) => setMaxPrice(event.target.value)}
            className="glass-input min-h-[48px] w-full"
            placeholder="Any"
          />
        </div>
      </div>

      <div>
        <p className="mb-3 text-[10px] uppercase tracking-[0.24em] text-white/35">Size</p>
        <div className="flex flex-wrap gap-2">
          {["all", ...sizes].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setSize(item)}
              className={`luxury-filter-pill min-h-[44px] ${size === item ? "is-active" : ""}`}
            >
              {item === "all" ? "All" : item}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-3 text-[10px] uppercase tracking-[0.24em] text-white/35">Color</p>
        <div className="flex flex-wrap gap-2">
          {["all", ...colors].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setColor(item)}
              className={`luxury-filter-pill min-h-[44px] ${color === item ? "is-active" : ""}`}
            >
              {item === "all" ? "All" : item}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-3 text-[10px] uppercase tracking-[0.24em] text-white/35">Availability</p>
        <div className="flex flex-wrap gap-2">
          {AVAILABILITY_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setAvailability(option.value)}
              className={`luxury-filter-pill min-h-[44px] ${availability === option.value ? "is-active" : ""}`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <main className="liquid-page pb-28">
      <section className="relative isolate overflow-hidden px-4 py-16 sm:px-6 sm:py-20 md:px-10">
        <Image
          src={withPublicAssetVersion("/uploads/collections.jpg")}
          alt="BOUT shop"
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 -z-20 object-cover opacity-45"
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(10,9,8,0.62),#0A0908_82%)]" />
        <div className="page-wrap">
          <p className="eyebrow mb-4">Shop</p>
          <div className="grid gap-8 lg:grid-cols-[1fr_420px] lg:items-end">
            <div>
              <h1 className="title-display text-[clamp(3rem,9vw,7rem)] leading-[0.88]">
                The full <em className="gold-italic">edit</em>
              </h1>
              <p className="hero-body-copy mt-5 max-w-2xl text-white/58">
                Browse the live catalogue with real product filters, availability cues, and faster paths into product detail.
              </p>
            </div>
            <div className="rounded-[28px] border border-white/10 bg-[#14110F]/82 p-4 backdrop-blur-xl">
              <label htmlFor="shop-search" className="sr-only">
                Search products
              </label>
              <div className="flex min-h-[52px] items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.035] px-4">
                <Search className="h-4 w-4 text-white/35" strokeWidth={1.4} />
                <input
                  id="shop-search"
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search name, category, material"
                  className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/28"
                />
                {search ? (
                  <button type="button" onClick={() => setSearch("")} className="flex h-11 w-11 items-center justify-center rounded-full text-white/45 hover:text-white" aria-label="Clear search">
                    <X className="h-4 w-4" strokeWidth={1.4} />
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 md:px-10">
        <div className="page-wrap">
          <div className="mb-6 flex flex-col gap-4 border-b border-white/10 pb-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <span className="count-pill">
                {loading ? "Loading" : `${filteredProducts.length} of ${products.length}`} products
              </span>
              <button type="button" onClick={() => setFiltersOpen(true)} className="btn-ghost min-h-[48px] justify-center lg:hidden">
                <Filter className="h-4 w-4" strokeWidth={1.4} />
                Filters
              </button>
              {activeChips.length > 0 ? (
                <button type="button" onClick={resetFilters} className="min-h-[44px] rounded-full px-4 text-[10px] uppercase tracking-[0.22em] text-white/42 hover:text-white">
                  Reset all
                </button>
              ) : null}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <label htmlFor="shop-sort" className="text-[10px] uppercase tracking-[0.24em] text-white/35">
                Sort
              </label>
              <select id="shop-sort" value={sort} onChange={(event) => setSort(event.target.value as SortValue)} className="glass-input min-h-[48px] min-w-[220px]">
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {activeChips.length > 0 ? (
            <div className="mb-7 flex flex-wrap gap-2">
              {activeChips.map((chip) => (
                <button
                  key={chip.label}
                  type="button"
                  onClick={chip.onRemove}
                  className="inline-flex min-h-[40px] items-center gap-2 rounded-full border border-brass/25 bg-brass/10 px-4 text-[10px] uppercase tracking-[0.18em] text-brass"
                >
                  {chip.label}
                  <X className="h-3.5 w-3.5" strokeWidth={1.4} />
                </button>
              ))}
            </div>
          ) : null}

          <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
            <aside className="hidden lg:block">
              <div className="sticky top-24 rounded-[28px] border border-white/10 bg-white/[0.035] p-5">
                <div className="mb-5 flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-white/45">
                  <SlidersHorizontal className="h-4 w-4 text-brass" strokeWidth={1.4} />
                  Filters
                </div>
                {filterPanel}
              </div>
            </aside>

            <div>
              {loading ? (
                <ProductSkeleton count={8} />
              ) : error ? (
                <div className="rounded-[28px] border border-white/10 bg-white/[0.035] px-5 py-16 text-center">
                  <PackageSearch className="mx-auto mb-4 h-9 w-9 text-white/25" strokeWidth={1.3} />
                  <p className="body-copy body-copy-strong">{error}</p>
                </div>
              ) : filteredProducts.length > 0 ? (
                <div className="catalog-grid catalog-grid-mobile-full">
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
                <div className="rounded-[28px] border border-white/10 bg-white/[0.035] px-5 py-16 text-center">
                  <PackageSearch className="mx-auto mb-4 h-9 w-9 text-white/25" strokeWidth={1.3} />
                  <h2 className="font-serif text-3xl font-light text-white">No pieces found</h2>
                  <p className="body-copy mx-auto mt-3 max-w-xl">
                    Adjust the filters or clear them to return to the full catalogue.
                  </p>
                  <button type="button" onClick={resetFilters} className="btn-gold mx-auto mt-7 justify-center">
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {filtersOpen ? (
          <motion.div className="fixed inset-0 z-[80] lg:hidden" role="dialog" aria-modal="true" aria-label="Shop filters">
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
                  <p className="eyebrow mb-2">Filters</p>
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
