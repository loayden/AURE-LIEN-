"use client";

import ProductCard from "@/components/ProductCard";
import { ProductCardSkeleton } from "@/components/Skeleton";
import { showToast } from "@/components/ToastProvider";
import {
  ALL_CATEGORY_META,
  CATEGORY_META,
  STYLE_INTENT_META,
  filterProducts,
  formatCategoryLabel,
  formatPrice,
  getProductConfidence,
  productHref,
  productImage,
  sortProducts,
  stockLabel,
  stockState,
  uniqueProductColors,
  uniqueProductSizes,
} from "@/lib/commerce";
import type { AvailabilityFilter, SortValue, StyleIntent } from "@/lib/commerce";
import { getProductColorHex } from "@/lib/productColors";
import type { Product } from "@/lib/types";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Eye,
  Filter,
  LayoutGrid,
  List,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  Scale,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useDeferredValue, useEffect, useMemo, useState } from "react";

const SORT_OPTIONS: { value: SortValue; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-low", label: "Price Low-High" },
  { value: "price-high", label: "Price High-Low" },
];

const AVAILABILITY_OPTIONS: { value: AvailabilityFilter; label: string }[] = [
  { value: "all", label: "All Stock" },
  { value: "in-stock", label: "In Stock" },
  { value: "low-stock", label: "Low Stock" },
  { value: "sold-out", label: "Sold Out" },
];

const RECENTLY_VIEWED_KEY = "bout:recently-viewed";
type CardView = "grid" | "list";

type Filters = {
  query: string;
  category: string;
  minPrice: string;
  maxPrice: string;
  size: string;
  color: string;
  availability: AvailabilityFilter;
  styleIntent: StyleIntent;
};

function SelectControl({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="grid gap-2">
      <span className="text-[9px] uppercase tracking-[0.26em] text-[#7B6E60]">{label}</span>
      <span className="relative">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="luxury-select min-h-[48px] rounded-2xl border border-[rgba(123,103,82,0.18)] bg-[#FFF9EF] px-4 py-3 pr-10 text-sm text-[#3D3025]"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </span>
    </label>
  );
}

function formatPreview(values?: string[]) {
  const cleanValues = (values ?? []).filter(Boolean);
  if (!cleanValues.length) return "not listed";
  const preview = cleanValues.slice(0, 3).join(", ");
  return cleanValues.length > 3 ? `${preview} +${cleanValues.length - 3}` : preview;
}

function ProductListCard({ product }: { product: Product }) {
  const colors = formatPreview(product.colors);
  const sizes = formatPreview(product.size);

  return (
    <Link
      href={productHref(product)}
      className="group grid min-h-[10.5rem] grid-cols-[6.45rem_minmax(0,1fr)_2.5rem] items-center gap-3 rounded-[14px] border border-[rgba(123,103,82,0.18)] bg-[#FFF9EF] p-3 text-[#3D3025] shadow-[0_10px_28px_rgba(61,48,37,0.05)] transition hover:border-[rgba(168,121,53,0.34)] hover:bg-white sm:grid-cols-[7.25rem_minmax(0,1fr)_3rem] sm:gap-4 sm:p-4"
    >
      <div className="relative aspect-square overflow-hidden rounded-[10px] border border-[rgba(123,103,82,0.10)] bg-[#FFFFFF] p-2">
        <Image
          src={productImage(product)}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 104px, 116px"
          className="object-contain p-1.5 transition duration-500 group-hover:scale-[1.04]"
        />
      </div>
      <div className="min-w-0 self-center">
        <p className="text-[9px] uppercase tracking-[0.26em] text-[#A87935]">
          {formatCategoryLabel(product.category)}
        </p>
        <h3 className="mt-2 line-clamp-3 font-serif text-[1.45rem] font-light leading-[0.95] tracking-[0.02em] text-[#3D3025] sm:text-[1.6rem]">
          {product.name}
        </h3>
        <p className="mt-3 text-sm font-light tracking-[0.02em] text-[#7A581F]">EGP {formatPrice(product.price)}</p>
        <p className="mt-1 line-clamp-1 text-xs leading-5 text-[#8A7B6D]">
          {colors}, {sizes}
        </p>
      </div>
      <span
        className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(123,103,82,0.20)] bg-white/58 text-[#3D3025] transition group-hover:border-[rgba(168,121,53,0.42)] group-hover:text-[#A87935] sm:h-11 sm:w-11"
        aria-hidden="true"
      >
        <ChevronRight className="h-4 w-4" strokeWidth={1.35} />
      </span>
    </Link>
  );
}

function ActiveChip({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onRemove}
      className="inline-flex min-h-[38px] items-center gap-2 rounded-full border border-[rgba(168,121,53,0.22)] bg-[rgba(168,121,53,0.08)] px-3 text-[10px] uppercase tracking-[0.18em] text-[#A87935]"
    >
      {label}
      <X className="h-3 w-3" strokeWidth={1.4} />
    </button>
  );
}

function QuickViewModal({
  product,
  onClose,
}: {
  product: Product | null;
  onClose: () => void;
}) {
  const [size, setSize] = useState<string | null>(null);
  const [color, setColor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSize(null);
    setColor(null);
  }, [product?._id]);

  async function addToCart() {
    if (!product) return;
    if (stockState(product) === "sold-out") {
      showToast("This piece is sold out.", "error");
      return;
    }
    if (product.size?.length > 1 && !size) {
      showToast("Choose a size before adding.", "error");
      return;
    }
    if (product.colors?.length > 1 && !color) {
      showToast("Choose a color before adding.", "error");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product._id,
          quantity: 1,
          size: size ?? product.size?.[0] ?? null,
          color: color ?? product.colors?.[0] ?? null,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data?.error || "Unable to add item");
      window.dispatchEvent(new Event("cart:changed"));
      showToast("Added to cart.", "success");
      onClose();
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Unable to add item.", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      {product ? (
        <motion.div
          className="fixed inset-0 z-[95] flex items-end justify-center p-0 sm:items-center sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`Quick view ${product.name}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button type="button" aria-label="Close quick view" onClick={onClose} className="absolute inset-0 h-full w-full backdrop-blur-sm" style={{ background: "rgba(61,48,37,0.28)" }} />
          <motion.div
            initial={{ y: 40, scale: 0.98 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 30, scale: 0.98 }}
            className="relative grid max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-t-[28px] border border-[rgba(123,103,82,0.18)] bg-[#FFF9EF] shadow-[0_28px_80px_rgba(61,48,37,0.16)] sm:grid-cols-[0.9fr_1.1fr] sm:rounded-[28px]"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(123,103,82,0.18)] bg-white/70 text-[#6F6254] backdrop-blur-xl hover:text-[#3D3025]"
              aria-label="Close quick view"
            >
              <X className="h-4 w-4" strokeWidth={1.4} />
            </button>
            <div className="relative min-h-[22rem] bg-[#FFFFFF] sm:min-h-full">
              <Image src={productImage(product)} alt={product.name} fill sizes="(max-width: 640px) 100vw, 42vw" className="object-contain p-5" />
            </div>
            <div className="p-5 sm:p-7">
              <p className="mb-3 text-[10px] uppercase tracking-[0.24em] text-[#A87935]">
                {formatCategoryLabel(product.category)}
              </p>
              <h2 className="font-serif text-[clamp(2rem,5vw,3.6rem)] font-light leading-[0.95] tracking-[0.03em] text-[#3D3025]">
                {product.name}
              </h2>
              <p className="mt-4 text-sm leading-7 tracking-[0.04em] text-[#6F6254]">
                {product.description || "A polished BOUT wardrobe piece with clean styling paths and a direct route to checkout."}
              </p>
              <div className="mt-5 flex items-center justify-between gap-4 border-y border-[rgba(123,103,82,0.16)] py-4">
                <span className="font-serif text-2xl tracking-[0.04em] text-[#A87935]">
                  EGP {formatPrice(product.price)}
                </span>
                <span className="rounded-full border border-[rgba(123,103,82,0.16)] bg-white/60 px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-[#6F6254]">
                  {stockLabel(product)}
                </span>
              </div>

              {product.size?.length ? (
                <div className="mt-5">
                  <p className="mb-3 text-[9px] uppercase tracking-[0.26em] text-[#7B6E60]">Size</p>
                  <div className="flex flex-wrap gap-2">
                    {product.size.map((value) => (
                      <button
                        type="button"
                        key={value}
                        onClick={() => setSize(value)}
                        className={`flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border px-4 text-[11px] uppercase tracking-[0.16em] ${size === value ? "border-[#A87935] bg-[rgba(168,121,53,0.14)] text-[#A87935]" : "border-[rgba(123,103,82,0.16)] bg-white/60 text-[#6F6254]"}`}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              {product.colors?.length ? (
                <div className="mt-5">
                  <p className="mb-3 text-[9px] uppercase tracking-[0.26em] text-[#7B6E60]">Color</p>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((value) => (
                      <button
                        type="button"
                        key={value}
                        onClick={() => setColor(value)}
                        className={`flex min-h-[44px] items-center gap-2 rounded-full border px-3 text-[11px] tracking-[0.08em] ${color === value ? "border-[#A87935] bg-[rgba(168,121,53,0.14)] text-[#A87935]" : "border-[rgba(123,103,82,0.16)] bg-white/60 text-[#6F6254]"}`}
                      >
                        <span className="h-4 w-4 rounded-full border border-white/20" style={{ background: getProductColorHex(value) }} />
                        {value}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                <Link href={`/product/${encodeURIComponent(product._id)}`} className="btn-ghost justify-center">
                  View Product
                  <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.3} />
                </Link>
                <button
                  type="button"
                  onClick={addToCart}
                  disabled={loading || stockState(product) === "sold-out"}
                  className="btn-gold justify-center disabled:opacity-40"
                >
                  <ShoppingBag className="h-4 w-4" strokeWidth={1.3} />
                  {stockState(product) === "sold-out" ? "Sold Out" : loading ? "Adding" : "Add"}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function readRecentlyViewedIds() {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(RECENTLY_VIEWED_KEY) || "[]");
    return Array.isArray(parsed) ? parsed.map((item) => String(item)).filter(Boolean) : [];
  } catch {
    return [];
  }
}

function CompareDrawer({
  products,
  onRemove,
  onClear,
}: {
  products: Product[];
  onRemove: (productId: string) => void;
  onClear: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  if (!products.length) return null;

  return (
    <motion.div
      initial={{ y: 24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 24, opacity: 0 }}
      className="fixed inset-x-3 bottom-[calc(5.25rem+env(safe-area-inset-bottom))] z-[86] mx-auto flex max-h-[min(74vh,42rem)] max-w-6xl flex-col rounded-[24px] border border-[rgba(123,103,82,0.18)] bg-[#FFF9EF]/96 p-3 shadow-[0_24px_70px_rgba(61,48,37,0.18)] backdrop-blur-2xl sm:bottom-5 sm:max-h-[82vh] sm:p-4"
      role="region"
      aria-label="Product comparison"
    >
      <div className="sticky top-0 z-10 flex flex-col gap-3 border-b border-[rgba(123,103,82,0.12)] bg-[#FFF9EF]/96 pb-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#4C3A26] text-[#FFF9EF]">
            <Scale className="h-4 w-4" strokeWidth={1.35} />
          </span>
          <div>
            <p className="eyebrow mb-1">Compare Products</p>
            <p className="text-sm text-[#6F6254]">{products.length}/3 selected for quick decision support.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setExpanded((current) => !current)}
            className="inline-flex min-h-[40px] flex-1 items-center justify-center rounded-full border border-[rgba(123,103,82,0.16)] bg-white/72 px-4 text-[10px] uppercase tracking-[0.18em] text-[#5B4E42] sm:flex-none"
          >
            {expanded ? "Collapse" : "Compare"}
          </button>
          <button
            type="button"
            onMouseDown={(event) => {
              event.preventDefault();
              onClear();
            }}
            onPointerDown={(event) => {
              event.preventDefault();
              onClear();
            }}
            onTouchStart={(event) => {
              event.preventDefault();
              onClear();
            }}
            onClick={onClear}
            className="inline-flex min-h-[40px] flex-1 items-center justify-center rounded-full border border-[rgba(123,103,82,0.16)] bg-white/72 px-4 text-[10px] uppercase tracking-[0.18em] text-[#5B4E42] sm:flex-none"
          >
            Clear
          </button>
          <button
            type="button"
            onMouseDown={(event) => {
              event.preventDefault();
              onClear();
            }}
            onPointerDown={(event) => {
              event.preventDefault();
              onClear();
            }}
            onTouchStart={(event) => {
              event.preventDefault();
              onClear();
            }}
            onClick={onClear}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[rgba(123,103,82,0.16)] bg-white/72 text-[#5B4E42]"
            aria-label="Close comparison"
          >
            <X className="h-4 w-4" strokeWidth={1.35} />
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1">
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {products.map((product) => (
            <div key={product._id} className="flex min-w-[13rem] items-center gap-3 rounded-[18px] border border-[rgba(123,103,82,0.14)] bg-white/64 p-2">
              <div className="relative h-14 w-12 shrink-0 overflow-hidden rounded-[12px] bg-[#FFFFFF]">
                <Image src={productImage(product)} alt="" fill sizes="48px" className="object-contain p-1" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-[#3D3025]">{product.name}</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-[#A87935]">EGP {formatPrice(product.price)}</p>
              </div>
              <button
                type="button"
                onClick={() => onRemove(product._id)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#6F6254]"
                aria-label={`Remove ${product.name} from comparison`}
              >
                <X className="h-3.5 w-3.5" strokeWidth={1.4} />
              </button>
            </div>
          ))}
        </div>

        <AnimatePresence>
          {expanded ? (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-3 grid gap-3 md:grid-cols-3">
                {products.map((product) => {
                  const confidence = getProductConfidence(product);
                  return (
                    <div key={product._id} className="rounded-[18px] border border-[rgba(123,103,82,0.14)] bg-white/64 p-4">
                      <p className="text-[10px] uppercase tracking-[0.18em] text-[#A87935]">{formatCategoryLabel(product.category)}</p>
                      <h3 className="mt-2 line-clamp-2 font-serif text-2xl font-light leading-none text-[#3D3025]">{product.name}</h3>
                      <div className="mt-4 grid gap-2 text-sm text-[#6F6254]">
                        <span>Price: EGP {formatPrice(product.price)}</span>
                        <span>Stock: {stockLabel(product)}</span>
                        <span>Sizes: {product.size?.length ? product.size.join(", ") : "Not listed"}</span>
                        <span>Colors: {product.colors?.length ? product.colors.join(", ") : "Not listed"}</span>
                        <span>Material: {product.material || "Not listed"}</span>
                        <span>Confidence: {confidence.score}/5</span>
                      </div>
                      <Link href={`/product/${encodeURIComponent(product._id)}`} className="mt-4 inline-flex min-h-[40px] items-center justify-center gap-2 rounded-full bg-[#4C3A26] px-4 text-[10px] uppercase tracking-[0.16em] text-[#FFF9EF]">
                        View Product
                        <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.3} />
                      </Link>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function ProductBrowser({
  initialProducts,
  title = "Shop",
  description = "Browse the live BOUT catalog with clearer filters, stock labels, and faster product decisions.",
  category,
  lockCategory = false,
  heroImage,
  showIntro = true,
  compactCards = false,
}: {
  initialProducts?: Product[];
  title?: string;
  description?: string;
  category?: string;
  lockCategory?: boolean;
  heroImage?: string;
  showIntro?: boolean;
  compactCards?: boolean;
}) {
  const hasInitialProducts = Array.isArray(initialProducts);
  const [products, setProducts] = useState<Product[]>(initialProducts ?? []);
  const [loading, setLoading] = useState(!hasInitialProducts);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [quickView, setQuickView] = useState<Product | null>(null);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>([]);
  const [cardView, setCardView] = useState<CardView>("grid");
  const [sort, setSort] = useState<SortValue>("featured");
  const [filters, setFilters] = useState<Filters>({
    query: "",
    category: category ?? "",
    minPrice: "",
    maxPrice: "",
    size: "",
    color: "",
    availability: "all",
    styleIntent: "all",
  });
  const deferredQuery = useDeferredValue(filters.query);

  useEffect(() => {
    const controller = new AbortController();
    const url = category ? `/api/products?category=${encodeURIComponent(category)}` : "/api/products";
    if (hasInitialProducts) {
      setProducts(initialProducts ?? []);
      setLoading(false);
    } else {
      setLoading(true);
    }

    fetch(url, { cache: "no-store", signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Unable to load products");
        return response.json();
      })
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch((error) => {
        if (controller.signal.aborted) return;
        showToast(error instanceof Error ? error.message : "Unable to load products.", "error");
        if (!hasInitialProducts) {
          setProducts([]);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [category, hasInitialProducts, initialProducts]);

  useEffect(() => {
    if (category) {
      setFilters((current) => ({ ...current, category }));
    }
  }, [category]);

  useEffect(() => {
    setRecentlyViewedIds(readRecentlyViewedIds());
  }, [products]);

  const sizes = useMemo(() => uniqueProductSizes(products), [products]);
  const colors = useMemo(() => uniqueProductColors(products), [products]);
  const visibleProducts = useMemo(() => {
    const filtered = filterProducts(products, {
      ...filters,
      query: deferredQuery,
      category: lockCategory ? category : filters.category,
      minPrice: filters.minPrice ? Number(filters.minPrice) : null,
      maxPrice: filters.maxPrice ? Number(filters.maxPrice) : null,
    });
    return sortProducts(filtered, sort);
  }, [category, deferredQuery, filters, lockCategory, products, sort]);
  const compareProducts = useMemo(
    () =>
      compareIds
        .map((id) => products.find((product) => product._id === id))
        .filter((product): product is Product => Boolean(product)),
    [compareIds, products]
  );
  const recentlyViewedProducts = useMemo(
    () =>
      recentlyViewedIds
        .map((id) => products.find((product) => product._id === id))
        .filter((product): product is Product => Boolean(product))
        .slice(0, 6),
    [products, recentlyViewedIds]
  );

  const activeChips = [
    filters.query ? { key: "query", label: `Search: ${filters.query}` } : null,
    !lockCategory && filters.category ? { key: "category", label: ALL_CATEGORY_META.find((item) => item.slug === filters.category)?.title ?? filters.category } : null,
    filters.minPrice ? { key: "minPrice", label: `From EGP ${formatPrice(Number(filters.minPrice))}` } : null,
    filters.maxPrice ? { key: "maxPrice", label: `To EGP ${formatPrice(Number(filters.maxPrice))}` } : null,
    filters.size ? { key: "size", label: `Size ${filters.size}` } : null,
    filters.color ? { key: "color", label: filters.color } : null,
    filters.availability !== "all"
      ? { key: "availability", label: AVAILABILITY_OPTIONS.find((item) => item.value === filters.availability)?.label ?? filters.availability }
      : null,
    filters.styleIntent !== "all"
      ? { key: "styleIntent", label: STYLE_INTENT_META.find((item) => item.value === filters.styleIntent)?.label ?? filters.styleIntent }
      : null,
  ].filter(Boolean) as { key: keyof Filters; label: string }[];

  function clearFilter(key: keyof Filters) {
    setFilters((current) => ({ ...current, [key]: key === "availability" || key === "styleIntent" ? "all" : "" }));
  }

  function resetFilters() {
    setFilters({
      query: "",
      category: category ?? "",
      minPrice: "",
      maxPrice: "",
      size: "",
      color: "",
      availability: "all",
      styleIntent: "all",
    });
  }

  function toggleCompare(product: Product) {
    setCompareIds((current) => {
      if (current.includes(product._id)) {
        return current.filter((id) => id !== product._id);
      }
      if (current.length >= 3) {
        showToast("Compare up to 3 products at a time.", "error");
        return current;
      }
      showToast("Added to comparison.", "success");
      return [...current, product._id];
    });
  }

  const filterPanel = (
    <div className="grid gap-4">
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7B6E60]" strokeWidth={1.4} />
        <input
          value={filters.query}
          onChange={(event) => setFilters((current) => ({ ...current, query: event.target.value }))}
          placeholder="Search pieces"
          className="min-h-[48px] rounded-2xl border border-[rgba(123,103,82,0.18)] bg-[#FFF9EF] px-11 text-sm text-[#3D3025] placeholder:text-[#7B6E60]/60"
        />
        {filters.query ? (
          <button
            type="button"
            onClick={() => clearFilter("query")}
            className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-[#7B6E60]"
            aria-label="Clear search"
          >
            <X className="h-3.5 w-3.5" strokeWidth={1.4} />
          </button>
        ) : null}
      </div>

      {!lockCategory ? (
        <SelectControl
          label="Category"
          value={filters.category}
          onChange={(value) => setFilters((current) => ({ ...current, category: value }))}
          options={[
            { value: "", label: "All Categories" },
            ...CATEGORY_META.map((item) => ({ value: item.slug, label: item.title })),
          ]}
        />
      ) : null}

      <div>
        <div className="mb-3 flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-[#A87935]" strokeWidth={1.3} />
          <p className="text-[9px] uppercase tracking-[0.26em] text-[#7B6E60]">Outfit Intent</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {STYLE_INTENT_META.map((intent) => (
            <button
              type="button"
              key={intent.value}
              onClick={() => setFilters((current) => ({ ...current, styleIntent: intent.value }))}
              className={`min-h-[40px] rounded-full border px-3 text-[10px] uppercase tracking-[0.16em] transition ${
                filters.styleIntent === intent.value
                  ? "border-[#A87935] bg-[rgba(168,121,53,0.12)] text-[#A87935]"
                  : "border-[rgba(123,103,82,0.16)] bg-white/60 text-[#6F6254] hover:border-[rgba(168,121,53,0.28)]"
              }`}
            >
              {intent.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className="grid gap-2">
          <span className="text-[9px] uppercase tracking-[0.26em] text-[#7B6E60]">Min Price</span>
          <input
            type="number"
            min="0"
            inputMode="numeric"
            value={filters.minPrice}
            onChange={(event) => setFilters((current) => ({ ...current, minPrice: event.target.value }))}
            placeholder="0"
            className="min-h-[48px] rounded-2xl border border-[rgba(123,103,82,0.18)] bg-[#FFF9EF] px-4 text-sm text-[#3D3025]"
          />
        </label>
        <label className="grid gap-2">
          <span className="text-[9px] uppercase tracking-[0.26em] text-[#7B6E60]">Max Price</span>
          <input
            type="number"
            min="0"
            inputMode="numeric"
            value={filters.maxPrice}
            onChange={(event) => setFilters((current) => ({ ...current, maxPrice: event.target.value }))}
            placeholder="Any"
            className="min-h-[48px] rounded-2xl border border-[rgba(123,103,82,0.18)] bg-[#FFF9EF] px-4 text-sm text-[#3D3025]"
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <SelectControl
          label="Size"
          value={filters.size}
          onChange={(value) => setFilters((current) => ({ ...current, size: value }))}
          options={[{ value: "", label: "All Sizes" }, ...sizes.map((value) => ({ value, label: value }))]}
        />
        <SelectControl
          label="Availability"
          value={filters.availability}
          onChange={(value) => setFilters((current) => ({ ...current, availability: value as AvailabilityFilter }))}
          options={AVAILABILITY_OPTIONS}
        />
      </div>

      {colors.length ? (
        <div>
          <p className="mb-3 text-[9px] uppercase tracking-[0.26em] text-[#7B6E60]">Color</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => clearFilter("color")}
              className={`min-h-[44px] rounded-full border px-4 text-[10px] uppercase tracking-[0.18em] ${!filters.color ? "border-[#A87935] bg-[rgba(168,121,53,0.12)] text-[#A87935]" : "border-[rgba(123,103,82,0.16)] bg-white/60 text-[#6F6254]"}`}
            >
              All
            </button>
            {colors.slice(0, 12).map((value) => (
              <button
                type="button"
                key={value}
                onClick={() => setFilters((current) => ({ ...current, color: value }))}
                className={`flex min-h-[44px] items-center gap-2 rounded-full border px-3 text-[10px] tracking-[0.08em] ${filters.color === value ? "border-[#A87935] bg-[rgba(168,121,53,0.12)] text-[#A87935]" : "border-[rgba(123,103,82,0.16)] bg-white/60 text-[#6F6254]"}`}
              >
                <span className="h-4 w-4 rounded-full border border-white/20" style={{ background: getProductColorHex(value) }} />
                {value}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <button type="button" onClick={resetFilters} className="btn-ghost justify-center">
        Reset Filters
      </button>
    </div>
  );

  return (
    <main className="liquid-page pb-24 md:pb-28">
      {showIntro ? (
        <section className="relative isolate overflow-hidden border-b border-[rgba(123,103,82,0.16)] bg-[#F5F1E8] px-4 pb-10 pt-20 sm:px-6 sm:pb-14 sm:pt-28 md:px-10">
          {heroImage ? (
            <Image src={heroImage} alt="" fill priority sizes="100vw" className="pointer-events-none -z-10 object-cover opacity-34" />
          ) : null}
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(255,249,239,0.96)_0%,rgba(245,241,232,0.86)_54%,rgba(245,241,232,0.68)_100%)]" />
          <div className="page-wrap">
            <div className="max-w-3xl">
              <p className="eyebrow mb-4">BOUT Catalog</p>
              <h1 className="title-display text-[clamp(2.7rem,8vw,6.4rem)] leading-[0.9]">
                {title}
              </h1>
              <p className="hero-body-copy mt-5 max-w-2xl text-[#6F6254]">{description}</p>
            </div>
          </div>
        </section>
      ) : null}

      <section className={`sticky top-[3.75rem] z-[88] px-3 py-1 sm:top-[4.2rem] sm:px-6 md:px-10 lg:static lg:z-auto lg:border-b lg:border-[rgba(123,103,82,0.13)] lg:bg-[#F7F2E8]/88 lg:py-3 lg:backdrop-blur-2xl ${showIntro ? "" : "mt-[4.75rem] sm:mt-[5.25rem]"}`}>
        <div className="page-wrap">
          <div className="flex items-center justify-between gap-1.5 lg:hidden">
            <div className="flex min-w-0 items-center gap-1.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[rgba(123,103,82,0.14)] bg-white/78 text-[#7B6E60] shadow-[0_6px_14px_rgba(61,48,37,0.04)]">
                <SlidersHorizontal className="h-3.5 w-3.5" strokeWidth={1.4} />
              </span>
              <span className="truncate text-[8px] uppercase tracking-[0.16em] text-[#6F6254]">
                {loading ? "Loading" : `${visibleProducts.length} / ${products.length}`}
              </span>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                onClick={() => setCardView((current) => (current === "grid" ? "list" : "grid"))}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[rgba(123,103,82,0.16)] bg-[#FFFDF8] text-[#4D4035] shadow-[0_6px_14px_rgba(61,48,37,0.05)] transition hover:border-[rgba(168,121,53,0.30)] hover:text-[#3D3025]"
                aria-label={cardView === "list" ? "Show grid cards" : "Show list cards"}
                aria-pressed={cardView === "list"}
              >
                {cardView === "list" ? <LayoutGrid className="h-3.5 w-3.5" strokeWidth={1.35} /> : <List className="h-3.5 w-3.5" strokeWidth={1.35} />}
              </button>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(true)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[rgba(123,103,82,0.16)] bg-white/78 text-[#4D4035] shadow-[0_6px_14px_rgba(61,48,37,0.045)]"
                aria-label="Open filters"
              >
                <Filter className="h-3.5 w-3.5" strokeWidth={1.4} />
              </button>
              <label className="relative flex h-8 w-8 items-center justify-center rounded-full border border-[rgba(123,103,82,0.16)] bg-white/78 text-[#4D4035] shadow-[0_6px_14px_rgba(61,48,37,0.045)]">
                <span className="sr-only">Sort products</span>
                <ChevronDown className="h-3.5 w-3.5" strokeWidth={1.35} />
                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value as SortValue)}
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  aria-label="Sort products"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div className="hidden rounded-[24px] border border-[rgba(123,103,82,0.13)] bg-[rgba(255,249,239,0.78)] p-3 shadow-[0_14px_36px_rgba(61,48,37,0.06)] sm:p-4 lg:flex lg:items-center lg:justify-between lg:gap-4 lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[rgba(123,103,82,0.14)] bg-white/70 text-[#7B6E60]">
              <SlidersHorizontal className="h-4 w-4" strokeWidth={1.4} />
            </span>
            <span className="text-[10px] uppercase tracking-[0.24em] text-[#6F6254]">
              {loading ? "Loading" : `${visibleProducts.length} of ${products.length} pieces`}
            </span>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 lg:mt-0 lg:flex lg:flex-wrap lg:items-center lg:justify-end">
            <button
              type="button"
              onClick={() => setCardView((current) => (current === "grid" ? "list" : "grid"))}
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-[rgba(123,103,82,0.16)] bg-[#FFFDF8] px-3 text-[9px] uppercase tracking-[0.16em] text-[#4D4035] shadow-[0_8px_22px_rgba(61,48,37,0.045)] transition hover:border-[rgba(168,121,53,0.30)] hover:text-[#3D3025] sm:px-4 sm:text-[10px]"
              aria-pressed={cardView === "list"}
            >
              {cardView === "list" ? "Grid Cards" : "List Cards"}
              <ChevronRight className={`h-3.5 w-3.5 transition ${cardView === "list" ? "rotate-90" : ""}`} strokeWidth={1.35} />
            </button>
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(true)}
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-[rgba(123,103,82,0.16)] bg-white/70 px-3 text-[9px] uppercase tracking-[0.16em] text-[#4D4035] shadow-[0_8px_22px_rgba(61,48,37,0.04)] lg:hidden"
            >
              <Filter className="h-3.5 w-3.5" strokeWidth={1.4} />
              Filters
            </button>
            <label className="relative col-span-2 lg:col-span-1">
              <span className="sr-only">Sort products</span>
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value as SortValue)}
                className="luxury-select min-h-[44px] w-full rounded-[18px] border border-[rgba(123,103,82,0.16)] bg-[#FFFDF8] px-4 py-2 pr-10 text-[10px] uppercase tracking-[0.18em] text-[#5B4E42] shadow-[0_8px_22px_rgba(61,48,37,0.045)] lg:min-w-[12rem] lg:rounded-full"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          </div>
        </div>
      </section>

      <section
        className="page-wrap grid gap-6 px-4 py-8 sm:px-6 sm:py-10 md:px-10 lg:grid-cols-[18rem_1fr] lg:items-start"
        style={compactCards ? { background: "#FFFFFF" } : undefined}
      >
        <aside className="sticky top-32 hidden rounded-[24px] border border-[rgba(123,103,82,0.16)] bg-white/60 p-4 lg:block">
          <div className="mb-4 flex items-center justify-between">
            <p className="eyebrow">Refine</p>
            <ChevronDown className="h-4 w-4 text-[#7B6E60]" strokeWidth={1.4} />
          </div>
          {filterPanel}
        </aside>

        <div className="min-w-0">
          {activeChips.length ? (
            <div className="mb-5 flex flex-wrap gap-2">
              {activeChips.map((chip) => (
                <ActiveChip key={chip.key} label={chip.label} onRemove={() => clearFilter(chip.key)} />
              ))}
              <button type="button" onClick={resetFilters} className="min-h-[38px] rounded-full px-3 text-[10px] uppercase tracking-[0.18em] text-[#7B6E60] underline-offset-4 hover:text-[#3D3025] hover:underline">
                Clear all
              </button>
            </div>
          ) : null}

          {recentlyViewedProducts.length ? (
            <div className="mb-6 rounded-[24px] border border-[rgba(123,103,82,0.16)] bg-white/54 p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <p className="eyebrow mb-1">Recently Viewed</p>
                  <p className="text-sm text-[#6F6254]">Return to products you inspected before comparing.</p>
                </div>
                <CheckCircle2 className="h-4 w-4 shrink-0 text-[#A87935]" strokeWidth={1.35} />
              </div>
              <div className="flex gap-3 overflow-x-auto pb-1">
                {recentlyViewedProducts.map((product) => (
                  <Link
                    key={product._id}
                    href={`/product/${encodeURIComponent(product._id)}`}
                    className="group flex min-w-[14rem] items-center gap-3 rounded-[18px] border border-[rgba(123,103,82,0.14)] bg-[#FFF9EF]/76 p-2 transition hover:border-[rgba(168,121,53,0.28)]"
                  >
                    <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-[12px] bg-[#FFFFFF]">
                      <Image src={productImage(product)} alt="" fill sizes="48px" className="object-contain p-1 transition duration-500 group-hover:scale-[1.04]" />
                    </div>
                    <div className="min-w-0">
                      <p className="line-clamp-2 text-sm leading-5 text-[#3D3025]">{product.name}</p>
                      <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-[#A87935]">EGP {formatPrice(product.price)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : null}

          {loading ? (
            <div className={`grid ${cardView === "list" ? "gap-3" : compactCards ? "gap-3 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5" : "gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"}`}>
              {Array.from({ length: 8 }).map((_, index) => (
                <ProductCardSkeleton key={index} compact={compactCards} />
              ))}
            </div>
          ) : visibleProducts.length ? (
            <div className={cardView === "list" ? "grid gap-3" : `grid ${compactCards ? "gap-3 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5" : "gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"}`}>
              {visibleProducts.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (index % 4) * 0.04, duration: 0.45 }}
                  className="group relative"
                >
                  {cardView === "list" ? (
                    <ProductListCard product={product} />
                  ) : (
                    <>
                      <ProductCard product={product} compact={compactCards} />
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          toggleCompare(product);
                        }}
                        className={`absolute left-3 top-3 z-20 flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border shadow-[0_16px_34px_rgba(61,48,37,0.14)] backdrop-blur-xl transition-colors ${
                          compareIds.includes(product._id)
                            ? "border-[rgba(168,121,53,0.32)] bg-[rgba(168,121,53,0.18)] text-[#7A581F]"
                            : "border-[rgba(123,103,82,0.16)] bg-white/80 text-[#5B4E42] hover:text-[#3D3025]"
                        }`}
                        aria-label={compareIds.includes(product._id) ? `Remove ${product.name} from comparison` : `Compare ${product.name}`}
                      >
                        <Scale className="h-4 w-4" strokeWidth={1.4} />
                      </button>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          setQuickView(product);
                        }}
                        className="absolute right-3 top-3 z-20 flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-[rgba(123,103,82,0.16)] bg-white/80 text-[#5B4E42] opacity-100 shadow-[0_16px_34px_rgba(61,48,37,0.14)] backdrop-blur-xl transition-colors hover:text-[#3D3025] sm:opacity-0 sm:group-hover:opacity-100"
                        aria-label={`Quick view ${product.name}`}
                      >
                        <Eye className="h-4 w-4" strokeWidth={1.4} />
                      </button>
                    </>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex min-h-[30rem] flex-col items-center justify-center rounded-[28px] border border-[rgba(123,103,82,0.16)] bg-white/60 px-6 py-16 text-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-3xl border border-[rgba(123,103,82,0.16)] bg-white/60">
                <Search className="h-7 w-7 text-[#7B6E60]" strokeWidth={1.1} />
              </div>
              <h2 className="font-serif text-3xl font-light tracking-[0.04em]">
                No pieces <em className="gold-italic">found</em>
              </h2>
              <p className="mt-3 max-w-md text-sm leading-7 tracking-[0.05em] text-[#6F6254]">
                Adjust the filters or reset the catalog view to continue browsing.
              </p>
              <button type="button" onClick={resetFilters} className="btn-gold mt-7">
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {mobileFiltersOpen ? (
          <motion.div className="fixed inset-0 z-[92] lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button type="button" aria-label="Close filters" onClick={() => setMobileFiltersOpen(false)} className="absolute inset-0 h-full w-full backdrop-blur-sm" style={{ background: "rgba(61,48,37,0.26)" }} />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-x-0 bottom-0 max-h-[86vh] overflow-y-auto rounded-t-[28px] border border-[rgba(123,103,82,0.18)] bg-[#FFF9EF] p-4 pb-[max(env(safe-area-inset-bottom),1rem)]"
            >
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="eyebrow mb-1">Mobile Filters</p>
                  <p className="text-[11px] tracking-[0.08em] text-[#6F6254]">{visibleProducts.length} matching pieces</p>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(123,103,82,0.16)] bg-white/60 text-[#6F6254]"
                  aria-label="Close filters"
                >
                  <X className="h-4 w-4" strokeWidth={1.4} />
                </button>
              </div>
              {filterPanel}
              <button type="button" onClick={() => setMobileFiltersOpen(false)} className="btn-gold mt-4 w-full justify-center">
                Show Results
              </button>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <QuickViewModal product={quickView} onClose={() => setQuickView(null)} />
      <AnimatePresence>
        {compareProducts.length ? (
          <CompareDrawer
            products={compareProducts}
            onRemove={(productId) => setCompareIds((current) => current.filter((id) => id !== productId))}
            onClear={() => setCompareIds([])}
          />
        ) : null}
      </AnimatePresence>
    </main>
  );
}
