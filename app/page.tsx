"use client";

import NewsletterForm from "@/components/NewsletterForm";
import { ProductCardSkeleton } from "@/components/Skeleton";
import { showToast } from "@/components/ToastProvider";
import {
  CATEGORY_META,
  SUBCATEGORY_META,
  categoryMatches,
  formatCategoryLabel,
  formatPrice,
  productHref,
  productImage,
  stockLabel,
  stockState,
} from "@/lib/commerce";
import { withPublicAssetVersion } from "@/lib/publicAsset";
import type { Product } from "@/lib/types";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Clock3,
  CreditCard,
  Heart,
  PackageCheck,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Truck,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";

const HERO_PRODUCT_IDS = ["p-jc-016", "p-jc-017", "p-sh-003", "p-kn-004"];
const DEAL_PRODUCT_IDS = ["p-sh-003", "p-kn-004", "p-denim-002", "p-baggy-001", "p-su-001", "p-jc-018"];
const SPOTLIGHT_IDS = ["p-jc-016", "p-kn-005", "p-sh-005"];

const QUICK_CATEGORIES = [
  CATEGORY_META[0],
  CATEGORY_META[1],
  CATEGORY_META[2],
  SUBCATEGORY_META.find((category) => category.slug === "knitwear"),
  SUBCATEGORY_META.find((category) => category.slug === "loafers"),
  CATEGORY_META[3],
].filter(Boolean) as typeof CATEGORY_META;

const SHOPPING_MODES = [
  {
    title: "Office ready",
    copy: "Tailoring, loafers, shirts",
    href: "/suits",
    image: withPublicAssetVersion("/uploads/Suits.jpg"),
  },
  {
    title: "Daily layers",
    copy: "Knits, denim, sneakers",
    href: "/knitwear",
    image: withPublicAssetVersion("/uploads/Knitwear.jpg"),
  },
  {
    title: "Evening clean",
    copy: "Outerwear, dark tones, lace-ups",
    href: "/lookbook",
    image: withPublicAssetVersion("/uploads/collections.jpg"),
  },
] as const;

const TRUST_ITEMS = [
  { label: "Secure checkout", detail: "Protected card and cash-on-delivery flow", icon: ShieldCheck },
  { label: "Delivery in Egypt", detail: "Clear local delivery before payment", icon: Truck },
  { label: "Easy support", detail: "Orders, returns, and help in one place", icon: PackageCheck },
  { label: "Live catalog", detail: "Admin products appear without redesign work", icon: CheckCircle2 },
] as const;

function pickProducts(products: Product[], ids: string[], count: number) {
  const byId = new Map(products.map((product) => [String(product._id), product]));
  const selected = ids
    .map((id) => byId.get(id))
    .filter((product): product is Product => Boolean(product));
  const selectedIds = new Set(selected.map((product) => product._id));
  return [...selected, ...products.filter((product) => !selectedIds.has(product._id))].slice(0, count);
}

function firstAvailableValue(values?: string[]) {
  return values?.find(Boolean) ?? null;
}

function SectionTitle({
  title,
  copy,
  action,
}: {
  title: string;
  copy?: string;
  action?: { label: string; href: string };
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        <h2 className="font-serif text-[clamp(2rem,5vw,4rem)] font-light leading-[0.95] tracking-[0.02em] text-[#241F1A]">
          {title}
        </h2>
        {copy ? <p className="mt-4 max-w-xl text-sm leading-7 tracking-[0.04em] text-[#625A50]">{copy}</p> : null}
      </div>
      {action ? (
        <Link
          href={action.href}
          className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-[#D6CAB8] bg-white px-5 py-3 text-[10px] uppercase tracking-[0.24em] text-[#2D2620] shadow-[0_12px_30px_rgba(41,34,27,0.08)] transition hover:border-[#9F7B3D]"
        >
          {action.label}
          <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.35} />
        </Link>
      ) : null}
    </div>
  );
}

function ProductTile({
  product,
  onAction,
  actionBusy,
}: {
  product: Product;
  onAction: (product: Product) => void;
  actionBusy: boolean;
}) {
  const state = stockState(product);
  const requiresChoice = (product.size?.length ?? 0) > 1 || (product.colors?.length ?? 0) > 1;

  return (
    <article className="group min-w-[17rem] overflow-hidden rounded-[22px] border border-[#DDD2C2] bg-white shadow-[0_18px_42px_rgba(45,38,32,0.08)] transition duration-300 hover:-translate-y-1 hover:border-[#B99962] lg:min-w-0">
      <Link href={productHref(product)} className="relative block aspect-[4/5] overflow-hidden bg-[#EAE1D3]">
        <Image
          src={productImage(product)}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 74vw, 25vw"
          className="object-cover transition duration-700 group-hover:scale-[1.04]"
        />
        <div className="absolute left-3 top-3 rounded-full bg-[#1F1A16]/88 px-3 py-1.5 text-[9px] uppercase tracking-[0.2em] text-[#FFF9EF] backdrop-blur">
          {formatCategoryLabel(product.category)}
        </div>
        {product.discount ? (
          <div className="absolute right-3 top-3 rounded-full bg-[#D8B45F] px-3 py-1.5 text-[9px] uppercase tracking-[0.18em] text-[#1F1A16]">
            {product.discount}% off
          </div>
        ) : null}
      </Link>

      <div className="p-4">
        <Link href={productHref(product)} className="block">
          <h3 className="line-clamp-2 min-h-[2.3rem] font-serif text-[1.3rem] font-light leading-[1.05] tracking-[0.03em] text-[#241F1A]">
            {product.name}
          </h3>
        </Link>
        <div className="mt-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-[9px] uppercase tracking-[0.2em] text-[#7C6F62]">{stockLabel(product)}</p>
            <p className="mt-1 font-serif text-[1.35rem] font-light tracking-[0.02em] text-[#8A6429]">
              EGP {formatPrice(product.price)}
            </p>
          </div>
          <button
            type="button"
            disabled={state === "sold-out" || actionBusy}
            onClick={() => onAction(product)}
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-[#1F1A16] px-4 py-3 text-[10px] uppercase tracking-[0.2em] text-[#FFF9EF] transition hover:bg-[#8A6429] disabled:cursor-not-allowed disabled:bg-[#D8D0C3] disabled:text-[#5D554C]"
            style={{
              backgroundColor: state === "sold-out" || actionBusy ? "#D8D0C3" : "#1F1A16",
              borderColor: state === "sold-out" || actionBusy ? "#D8D0C3" : "#1F1A16",
              color: state === "sold-out" || actionBusy ? "#5D554C" : "#FFF9EF",
            }}
          >
            {actionBusy ? "Adding" : requiresChoice ? "Choose" : "Add"}
          </button>
        </div>
      </div>
    </article>
  );
}

export default function HomePage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [addingId, setAddingId] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/products", { cache: "no-store", signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Unable to load products");
        return response.json();
      })
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setProducts([]))
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, []);

  const heroProducts = useMemo(() => pickProducts(products, HERO_PRODUCT_IDS, 3), [products]);
  const dealProducts = useMemo(() => pickProducts(products, DEAL_PRODUCT_IDS, 6), [products]);
  const spotlightProducts = useMemo(() => pickProducts(products, SPOTLIGHT_IDS, 3), [products]);
  const categoryCounts = useMemo(() => {
    return new Map(QUICK_CATEGORIES.map((category) => [
      category.slug,
      products.filter((product) => categoryMatches(product, category.slug)).length,
    ]));
  }, [products]);

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleaned = query.trim();
    router.push(cleaned ? `/search?q=${encodeURIComponent(cleaned)}` : "/shop");
  }

  async function handleProductAction(product: Product) {
    const requiresChoice = (product.size?.length ?? 0) > 1 || (product.colors?.length ?? 0) > 1;
    if (requiresChoice) {
      router.push(productHref(product));
      return;
    }

    setAddingId(product._id);
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product._id,
          quantity: 1,
          size: firstAvailableValue(product.size),
          color: firstAvailableValue(product.colors),
        }),
      });

      if (!response.ok) throw new Error("Cart request failed");
      window.dispatchEvent(new Event("cart:changed"));
      showToast("Added to cart.", "success");
    } catch {
      showToast("Unable to add this piece right now.", "error");
    } finally {
      setAddingId(null);
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#F7F4EE] pb-24 text-[#241F1A] md:pb-28">
      <section className="relative isolate overflow-hidden px-4 pt-[72px] sm:px-6 md:px-10">
        <div className="absolute inset-x-0 top-0 -z-10 h-[48rem] bg-[radial-gradient(circle_at_18%_12%,rgba(216,180,95,0.18),transparent_32%),linear-gradient(135deg,#FBFAF6_0%,#F0E7DA_46%,#D9CDBA_100%)]" />
        <div className="mx-auto grid w-full max-w-[88rem] gap-6 py-7 sm:py-8 lg:min-h-[760px] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start lg:pb-8 lg:pt-12">
          <div className="max-w-3xl">
            <h1 className="font-serif text-[clamp(2.45rem,10vw,8.6rem)] font-light leading-[0.92] tracking-[0.01em] text-[#1F1A16] sm:leading-[0.82]">
              <span className="block sm:inline">Luxury shopping,</span>{" "}
              <span className="block sm:inline">made fast.</span>
            </h1>
            <p className="mt-5 max-w-[21rem] text-sm leading-7 tracking-[0.01em] text-[#5D554C] sm:max-w-2xl sm:text-base sm:leading-8 sm:tracking-[0.05em]">
              A cleaner BOUT homepage for mobile and desktop shoppers: search first, category paths upfront, products visible immediately, checkout confidence always nearby.
            </p>

            <form
              onSubmit={handleSearch}
              className="relative mt-7 flex min-h-[58px] w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] items-center gap-3 overflow-hidden rounded-[18px] border border-[#D6CAB8] bg-white px-4 pr-2 shadow-[0_22px_60px_rgba(45,38,32,0.10)] sm:w-full sm:max-w-2xl"
            >
              <Search className="h-5 w-5 shrink-0 text-[#8A6429]" strokeWidth={1.6} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                aria-label="Search products"
                placeholder="Search jackets, loafers, denim..."
                className="h-12 min-w-0 flex-1 border-0 bg-transparent px-0 pr-12 text-sm tracking-[0.03em] text-[#241F1A] shadow-none outline-none placeholder:text-[#7C6F62] sm:pr-28"
                style={{ width: 1, minWidth: 0, flex: "1 1 0", background: "transparent", border: 0, boxShadow: "none" }}
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 inline-flex h-11 min-h-[44px] w-11 -translate-y-1/2 items-center justify-center rounded-full bg-[#1F1A16] px-0 py-3 text-[10px] uppercase tracking-[0.1em] text-[#FFF9EF] transition hover:bg-[#8A6429] sm:w-auto sm:px-5 sm:tracking-[0.22em]"
                style={{ backgroundColor: "#1F1A16", color: "#FFF9EF", borderColor: "#1F1A16" }}
              >
                <span className="sm:hidden">Go</span>
                <span className="hidden sm:inline">Find</span>
              </button>
            </form>

            <div className="mt-5 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none]">
              {QUICK_CATEGORIES.slice(0, 5).map((category) => (
                <Link
                  key={category.slug}
                  href={category.href}
                  className="whitespace-nowrap rounded-full border border-[#D6CAB8] bg-white/72 px-4 py-2.5 text-[10px] uppercase tracking-[0.2em] text-[#403830] transition hover:border-[#9F7B3D] hover:bg-white"
                >
                  {category.short}
                </Link>
              ))}
            </div>

            <div className="mt-7 grid grid-cols-3 divide-x divide-[#D6CAB8] overflow-hidden rounded-[22px] border border-[#D6CAB8] bg-[#FFFDF9]/78 p-4 shadow-[0_18px_48px_rgba(45,38,32,0.08)]">
              {[
                { value: "Search", mobile: "Search", label: "visible" },
                { value: "Products", mobile: "Items", label: "live" },
                { value: "Checkout", mobile: "Pay", label: "clear" },
              ].map((item) => (
                <div key={item.value} className="min-w-0 px-2 text-center first:pl-0 last:pr-0">
                  <p className="font-serif text-[1rem] font-light leading-none text-[#8A6429] sm:text-[1.55rem]">
                    <span className="sm:hidden">{item.mobile}</span>
                    <span className="hidden sm:inline">{item.value}</span>
                  </p>
                  <p className="mt-2 text-[8px] uppercase tracking-[0.16em] text-[#655A4E] sm:text-[9px] sm:tracking-[0.2em]">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-[1fr_0.58fr] lg:min-h-[42rem]">
            <div className="relative min-h-[28rem] overflow-hidden rounded-[32px] bg-[#1F1A16] shadow-[0_34px_80px_rgba(31,26,22,0.22)] sm:min-h-[42rem]">
              <Image
                src={withPublicAssetVersion("/uploads/homepage.jpg")}
                alt="BOUT luxury menswear storefront"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 52vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(31,26,22,0.03)_0%,rgba(31,26,22,0.12)_44%,rgba(31,26,22,0.72)_100%)]" />
              <div className="absolute inset-x-4 bottom-4 rounded-[24px] border border-white/18 bg-[#1F1A16]/76 p-4 text-[#FFF9EF] backdrop-blur-xl sm:inset-x-5 sm:bottom-5 sm:p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.28em] text-[#D8B45F]">Weekend capsule</p>
                    <h2 className="mt-2 font-serif text-[2rem] font-light leading-none tracking-[0.02em]">
                      Coats, knits, loafers.
                    </h2>
                  </div>
                  <Link href="/lookbook" aria-label="Open lookbook" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#FFF9EF] text-[#1F1A16]">
                    <ArrowRight className="h-4 w-4" strokeWidth={1.45} />
                  </Link>
                </div>
              </div>
            </div>

            <div className="grid gap-3">
              {(heroProducts.length ? heroProducts : dealProducts).slice(0, 3).map((product) => (
                <Link
                  key={product._id}
                  href={productHref(product)}
                  className="group grid grid-cols-[5.5rem_1fr] overflow-hidden rounded-[24px] border border-[#DED4C6] bg-white p-2 shadow-[0_18px_42px_rgba(45,38,32,0.08)] transition hover:-translate-y-1 hover:border-[#B99962] sm:block"
                >
                  <div className="relative min-h-[7.4rem] overflow-hidden rounded-[18px] bg-[#EAE1D3] sm:aspect-[4/5] sm:min-h-0">
                    <Image
                      src={productImage(product)}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 96px, 22vw"
                      className="object-cover transition duration-700 group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="flex min-w-0 flex-col justify-between p-3">
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.18em] text-[#8A6429]">EGP {formatPrice(product.price)}</p>
                      <h3 className="mt-1 line-clamp-2 font-serif text-[1.15rem] font-light leading-[1.05] tracking-[0.03em] text-[#241F1A]">
                        {product.name}
                      </h3>
                    </div>
                    <p className="mt-3 flex items-center gap-1.5 text-[9px] uppercase tracking-[0.2em] text-[#655A4E]">
                      <Zap className="h-3 w-3 text-[#8A6429]" strokeWidth={1.5} />
                      {stockLabel(product)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-9 sm:px-6 md:px-10">
        <div className="mx-auto max-w-[88rem]">
          <SectionTitle
            title="Shop by shortcut"
            copy="Marketplace speed with a luxury edit: the most useful paths are visible before the shopper has to open a menu."
            action={{ label: "All categories", href: "/collection" }}
          />
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-6">
            {QUICK_CATEGORIES.map((category) => (
              <Link
                key={category.slug}
                href={category.href}
                className="group overflow-hidden rounded-[22px] border border-[#DDD2C2] bg-white shadow-[0_18px_42px_rgba(45,38,32,0.07)] transition duration-300 hover:-translate-y-1 hover:border-[#B99962]"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-[#EAE1D3]">
                  <Image
                    src={category.image}
                    alt={category.title}
                    fill
                    sizes="(max-width: 768px) 50vw, 16vw"
                    className="object-cover transition duration-700 group-hover:scale-[1.05]"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-serif text-[1.45rem] font-light leading-none tracking-[0.03em] text-[#241F1A]">{category.short}</h3>
                  <p className="mt-3 text-[9px] uppercase tracking-[0.2em] text-[#6D6257]">
                    {categoryCounts.get(category.slug) || "Shop"} pieces
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#1F1A16] px-4 py-10 text-[#FFF9EF] sm:px-6 sm:py-14 md:px-10">
        <div className="mx-auto max-w-[88rem]">
          <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-serif text-[clamp(2.1rem,5vw,4.4rem)] font-light leading-[0.95] tracking-[0.02em]">
                New arrivals without the noise.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 tracking-[0.04em] text-[#D9D0C4]">
                A compact product rail for fast scanning on mobile and a clean grid on desktop.
              </p>
            </div>
            <Link href="/shop" className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-[#FFF9EF] px-5 py-3 text-[10px] uppercase tracking-[0.24em] text-[#1F1A16] transition hover:bg-[#D8B45F]">
              Shop all
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.35} />
            </Link>
          </div>

          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </div>
          ) : (
            <div className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-4 [scrollbar-width:none] sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-3 xl:grid-cols-6 lg:overflow-visible lg:px-0">
              {dealProducts.map((product) => (
                <ProductTile
                  key={product._id}
                  product={product}
                  actionBusy={addingId === product._id}
                  onAction={handleProductAction}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 sm:py-14 md:px-10">
        <div className="mx-auto max-w-[88rem]">
          <SectionTitle
            title="Shop by moment"
            copy="Like the best commerce apps, the homepage gives a shopper a practical reason to tap without making them decode the brand."
          />
          <div className="grid gap-4 lg:grid-cols-3">
            {SHOPPING_MODES.map((mode) => (
              <Link
                key={mode.title}
                href={mode.href}
                className="group relative min-h-[25rem] overflow-hidden rounded-[30px] bg-[#1F1A16] shadow-[0_24px_60px_rgba(45,38,32,0.13)] transition duration-300 hover:-translate-y-1"
              >
                <Image
                  src={mode.image}
                  alt={mode.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover transition duration-700 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(31,26,22,0.02),rgba(31,26,22,0.76))]" />
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                  <p className="text-[10px] uppercase tracking-[0.24em] text-[#D8B45F]">{mode.copy}</p>
                  <div className="mt-3 flex items-end justify-between gap-4">
                    <h3 className="max-w-xs font-serif text-[2.2rem] font-light leading-none tracking-[0.02em] text-[#FFF9EF]">
                      {mode.title}
                    </h3>
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#FFF9EF] text-[#1F1A16]">
                      <ChevronRight className="h-4 w-4" strokeWidth={1.45} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[#DDD2C2] bg-[#FFFFFF] px-4 py-10 sm:px-6 sm:py-14 md:px-10">
        <div className="mx-auto grid max-w-[88rem] gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <div>
            <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#1F1A16] text-[#D8B45F]">
              <Sparkles className="h-5 w-5" strokeWidth={1.45} />
            </div>
            <h2 className="font-serif text-[clamp(2.2rem,6vw,5rem)] font-light leading-[0.92] tracking-[0.02em] text-[#241F1A]">
              Polished like Apple, useful like a marketplace.
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-7 tracking-[0.04em] text-[#625A50]">
              The new homepage keeps luxury whitespace, but the shopping decisions are concrete: search, categories, product price, stock, payment confidence, and delivery.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href="/discover" className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-[#1F1A16] px-6 py-3 text-[10px] uppercase tracking-[0.24em] text-[#FFF9EF] transition hover:bg-[#8A6429]">
                Discover
                <ArrowRight className="h-4 w-4" strokeWidth={1.35} />
              </Link>
              <Link href="/orders" className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-[#D6CAB8] bg-white px-6 py-3 text-[10px] uppercase tracking-[0.24em] text-[#2D2620] transition hover:border-[#9F7B3D]">
                My orders
              </Link>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {(spotlightProducts.length ? spotlightProducts : dealProducts).slice(0, 3).map((product, index) => (
              <Link
                key={product._id}
                href={productHref(product)}
                className={`group overflow-hidden rounded-[26px] border border-[#DDD2C2] bg-[#F7F4EE] shadow-[0_18px_42px_rgba(45,38,32,0.08)] transition hover:-translate-y-1 ${index === 0 ? "sm:translate-y-8" : index === 2 ? "sm:translate-y-14" : ""}`}
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-[#EAE1D3]">
                  <Image
                    src={productImage(product)}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 90vw, 22vw"
                    className="object-cover transition duration-700 group-hover:scale-[1.04]"
                  />
                </div>
                <div className="p-4">
                  <p className="text-[9px] uppercase tracking-[0.2em] text-[#8A6429]">Spotlight</p>
                  <h3 className="mt-2 line-clamp-2 font-serif text-[1.25rem] font-light leading-[1.05] tracking-[0.03em] text-[#241F1A]">
                    {product.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 sm:py-14 md:px-10">
        <div className="mx-auto grid max-w-[88rem] overflow-hidden rounded-[30px] border border-[#D6CAB8] bg-white shadow-[0_24px_70px_rgba(45,38,32,0.08)] sm:grid-cols-2 lg:grid-cols-4">
          {TRUST_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex min-h-[8.5rem] gap-4 border-b border-[#E4DACB] p-5 sm:border-r lg:border-b-0 sm:[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(2n)]:border-r lg:last:border-r-0">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F0E7DA] text-[#8A6429]">
                  <Icon className="h-5 w-5" strokeWidth={1.45} />
                </span>
                <span>
                  <span className="block text-[11px] uppercase tracking-[0.2em] text-[#241F1A]">{item.label}</span>
                  <span className="mt-2 block text-sm leading-6 tracking-[0.03em] text-[#625A50]">{item.detail}</span>
                </span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="px-4 pb-12 sm:px-6 sm:pb-16 md:px-10">
        <div className="mx-auto grid max-w-[88rem] gap-6 rounded-[32px] bg-[#1F1A16] p-5 text-[#FFF9EF] shadow-[0_30px_80px_rgba(31,26,22,0.20)] sm:p-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
          <div>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "Fast filters", icon: SlidersHorizontal },
                { label: "Wishlists", icon: Heart },
                { label: "Card or COD", icon: CreditCard },
                { label: "Drop alerts", icon: Clock3 },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <span key={item.label} className="inline-flex min-h-[36px] items-center gap-2 rounded-full border border-white/14 bg-white/8 px-3 text-[9px] uppercase tracking-[0.18em] text-[#EDE1CF]">
                    <Icon className="h-3.5 w-3.5 text-[#D8B45F]" strokeWidth={1.45} />
                    {item.label}
                  </span>
                );
              })}
            </div>
            <h2 className="mt-7 font-serif text-[clamp(2.2rem,6vw,4.6rem)] font-light leading-[0.92] tracking-[0.02em]">
              Get the next edit first.
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-7 tracking-[0.04em] text-[#D9D0C4]">
              Keep the homepage simple and let shoppers subscribe only when the value is clear: new pieces, restocks, and curated menswear drops.
            </p>
          </div>
          <div className="rounded-[26px] border border-white/12 bg-[#FFF9EF] p-4 text-[#241F1A] sm:p-6">
            <NewsletterForm />
          </div>
        </div>
      </section>
    </main>
  );
}
