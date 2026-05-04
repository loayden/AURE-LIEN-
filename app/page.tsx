"use client";

import NewsletterForm from "@/components/NewsletterForm";
import ProductCard from "@/components/ProductCard";
import { ProductCardSkeleton } from "@/components/Skeleton";
import {
  CATEGORY_META,
  formatPrice,
  productHref,
  productImage,
} from "@/lib/commerce";
import { withPublicAssetVersion } from "@/lib/publicAsset";
import type { Product } from "@/lib/types";
import {
  ArrowRight,
  BadgeCheck,
  Briefcase,
  CalendarHeart,
  ChevronRight,
  Clock3,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  Truck,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const HERO_PRODUCT_IDS = ["p-jc-016", "p-jc-017", "p-sh-003", "p-kn-004"];
const NEW_IDS = [
  "p-jc-016",
  "p-jc-017",
  "p-sh-003",
  "p-kn-004",
  "p-denim-002",
  "p-korean-002",
  "p-baggy-001",
  "p-su-001",
];

const OCCASIONS = [
  {
    title: "Formal",
    href: "/suits",
    image: withPublicAssetVersion("/uploads/Suits.jpg"),
    icon: CalendarHeart,
    copy: "Tailoring, shirts, and lace-ups for sharper commitments.",
  },
  {
    title: "Casual",
    href: "/denim",
    image: withPublicAssetVersion("/uploads/denim.jpg"),
    icon: User,
    copy: "Denim, sneakers, and easy layers for daily rotation.",
  },
  {
    title: "Business",
    href: "/loafers",
    image: withPublicAssetVersion("/uploads/Loafers.jpg"),
    icon: Briefcase,
    copy: "Quiet pieces for workdays that still need polish.",
  },
  {
    title: "Evening",
    href: "/lookbook",
    image: withPublicAssetVersion("/uploads/collections.jpg"),
    icon: Clock3,
    copy: "Darker textures, cleaner footwear, and statement outerwear.",
  },
] as const;

const LOOKS = [
  {
    title: "Black coat, washed denim, loafer",
    href: "/lookbook",
    image: withPublicAssetVersion("/uploads/Jackets & Coats.jpg"),
  },
  {
    title: "Knit layer, relaxed trouser, sneaker",
    href: "/outfit-generator",
    image: withPublicAssetVersion("/uploads/collections.jpg"),
  },
  {
    title: "Suiting, crisp shirt, lace-up",
    href: "/lookbook",
    image: withPublicAssetVersion("/uploads/Suits.jpg"),
  },
] as const;

const TRUST_ITEMS = [
  { label: "Secure checkout", detail: "Protected cart and order flow", icon: ShieldCheck },
  { label: "Delivery in Egypt", detail: "Local delivery options surfaced clearly", icon: Truck },
  { label: "Returns & exchanges", detail: "Clear support path after purchase", icon: PackageCheck },
  { label: "Authentic pieces", detail: "A verified catalog with real products", icon: BadgeCheck },
] as const;

function pickProducts(products: Product[], ids: string[], count: number) {
  const byId = new Map(products.map((product) => [String(product._id), product]));
  const selected = ids
    .map((id) => byId.get(id))
    .filter((product): product is Product => Boolean(product));
  const selectedIds = new Set(selected.map((product) => product._id));
  return [...selected, ...products.filter((product) => !selectedIds.has(product._id))].slice(0, count);
}

function SectionHeading({
  kicker,
  title,
  copy,
  href,
  linkLabel = "View all",
}: {
  kicker: string;
  title: string;
  copy?: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-7 flex flex-col gap-4 sm:mb-9 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="eyebrow mb-3">{kicker}</p>
        <h2 className="title-display text-[clamp(2rem,5vw,4rem)] leading-[0.95]">
          {title}
        </h2>
        {copy ? <p className="body-copy mt-4 max-w-2xl">{copy}</p> : null}
      </div>
      {href ? (
        <Link href={href} className="btn-ghost justify-center sm:justify-start">
          {linkLabel}
          <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.3} />
        </Link>
      ) : null}
    </div>
  );
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

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
  const newArrivals = useMemo(() => pickProducts(products, NEW_IDS, 8), [products]);

  return (
    <main className="liquid-page pb-24 md:pb-28">
      <section className="relative isolate min-h-[calc(100svh-54px)] overflow-hidden border-b border-[rgba(123,103,82,0.16)] px-4 pt-[54px] sm:px-6 sm:pt-[58px] md:px-10">
        <Image
          src={withPublicAssetVersion("/uploads/homepage.jpg")}
          alt="BOUT luxury menswear hero"
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(255,249,239,0.96)_0%,rgba(245,241,232,0.86)_45%,rgba(245,241,232,0.42)_100%)]" />
        <div className="page-wrap grid min-h-[calc(100svh-54px)] gap-8 py-12 sm:min-h-[calc(100svh-58px)] sm:py-16 lg:grid-cols-[0.86fr_1.14fr] lg:items-center">
          <div className="max-w-3xl">
            <h1 className="font-serif text-[clamp(5rem,18vw,12rem)] font-light leading-[0.75] tracking-[0.02em] text-[#3D3025]">
              BOUT
            </h1>
            <p className="hero-body-copy mt-6 max-w-2xl text-[#5B4E42]">
              Luxury menswear edited for faster decisions: refined categories, live products, clear stock, and a quieter path to checkout.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/shop" className="btn-gold justify-center">
                Shop New Arrivals
                <ArrowRight className="h-4 w-4" strokeWidth={1.3} />
              </Link>
              <Link href="/collection" className="btn-ghost justify-center">
                Browse Collection
              </Link>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-[1fr_0.72fr]">
            <div className="relative min-h-[24rem] overflow-hidden rounded-[28px] border border-[rgba(123,103,82,0.16)] bg-white/50 shadow-[0_30px_80px_rgba(61,48,37,0.14)] sm:min-h-[38rem]">
              <Image
                src={withPublicAssetVersion("/uploads/main.jpg")}
                alt="BOUT product focus"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover"
              />
            </div>
            <div className="grid gap-3">
              {(heroProducts.length ? heroProducts : newArrivals).slice(0, 2).map((product) => (
                <Link key={product._id} href={productHref(product)} className="group grid min-h-[13rem] overflow-hidden rounded-[24px] border border-[rgba(123,103,82,0.16)] bg-white/60">
                  <div className="relative">
                    <Image src={productImage(product)} alt={product.name} fill sizes="(max-width: 640px) 100vw, 24vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                  </div>
                  <div className="flex items-end justify-between gap-3 p-4">
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.18em] text-[#A87935]">EGP {formatPrice(product.price)}</p>
                      <h2 className="mt-1 line-clamp-2 font-serif text-[1.25rem] font-light leading-[1.05] tracking-[0.04em] text-[#3D3025]">
                        {product.name}
                      </h2>
                    </div>
                    <ChevronRight className="h-5 w-5 text-[#6F6254]" strokeWidth={1.4} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="page-wrap px-4 py-10 sm:px-6 sm:py-14 md:px-10">
        <SectionHeading
          kicker="Featured Categories"
          title="Shop the way you think"
          copy="Four clean routes into the assortment, with real imagery and direct category pages."
          href="/collection"
          linkLabel="All Categories"
        />
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {CATEGORY_META.map((item) => (
            <Link key={item.slug} href={item.href} className="group overflow-hidden rounded-[24px] border border-[rgba(123,103,82,0.16)] bg-white/60 transition-transform duration-300 hover:-translate-y-1">
              <div className="relative aspect-[4/5]">
                <Image src={item.image} alt={item.title} fill sizes="(max-width: 768px) 50vw, 24vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
              </div>
              <div className="flex items-end justify-between gap-3 p-4">
                <div>
                  <p className="mb-2 text-[9px] uppercase tracking-[0.2em] text-[#A87935]">Category</p>
                  <h3 className="font-serif text-[1.4rem] font-light leading-none tracking-[0.04em] text-[#3D3025]">
                    {item.short}
                  </h3>
                </div>
                <ArrowRight className="h-4 w-4 text-[#7B6E60]" strokeWidth={1.35} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-[rgba(123,103,82,0.16)] bg-[#EFE5D8] px-4 py-10 sm:px-6 sm:py-14 md:px-10">
        <div className="page-wrap">
          <SectionHeading
            kicker="New Arrivals"
            title="Fresh pieces, live catalog"
            copy="This shelf is loaded from /api/products, so admin-added products can appear beside the built-in catalog."
            href="/shop"
          />
          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </div>
          ) : (
            <div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-4 [scrollbar-width:none] sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-4 lg:overflow-visible lg:px-0">
              {newArrivals.map((product) => (
                <div key={product._id} className="min-w-[16rem] snap-start lg:min-w-0">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="grid overflow-hidden border-b border-[rgba(123,103,82,0.16)] bg-[#F5F1E8] lg:grid-cols-[1.08fr_0.92fr]">
        <Link href="/lookbook" className="group relative min-h-[30rem] overflow-hidden bg-white/50 lg:min-h-[38rem]">
          <Image src={withPublicAssetVersion("/uploads/collections.jpg")} alt="BOUT editorial lookbook" fill sizes="(max-width: 1024px) 100vw, 58vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.035]" />
        </Link>
        <div className="flex flex-col justify-center px-4 py-10 sm:px-6 sm:py-14 md:px-10">
          <p className="eyebrow mb-4">Editorial Strip</p>
          <h2 className="title-display text-[clamp(2.3rem,6vw,5rem)] leading-[0.92]">
            Looks first, products second.
          </h2>
          <p className="body-copy mt-5 max-w-xl">
            Editorial browsing for shoppers who want proportion, texture, and outfit context before choosing a single item.
          </p>
          <Link href="/lookbook" className="btn-gold mt-7 w-fit">
            Open Lookbook
            <ArrowRight className="h-4 w-4" strokeWidth={1.3} />
          </Link>
        </div>
      </section>

      <section className="page-wrap px-4 py-10 sm:px-6 sm:py-14 md:px-10">
        <SectionHeading
          kicker="Shop By Occasion"
          title="Start with the moment"
          copy="Formal, casual, business, and evening paths keep the buying journey practical."
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {OCCASIONS.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.title} href={item.href} className="group overflow-hidden rounded-[24px] border border-[rgba(123,103,82,0.16)] bg-white/60 transition-transform duration-300 hover:-translate-y-1">
                <div className="relative aspect-[4/5]">
                  <Image src={item.image} alt={item.title} fill sizes="(max-width: 768px) 50vw, 24vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                </div>
                <div className="p-4">
                  <Icon className="mb-4 h-5 w-5 text-[#A87935]" strokeWidth={1.35} />
                  <h3 className="font-serif text-[1.65rem] font-light leading-none tracking-[0.04em] text-[#3D3025]">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 tracking-[0.04em] text-[#6F6254]">{item.copy}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="border-y border-[rgba(123,103,82,0.16)] bg-[#EFE5D8] px-4 py-10 sm:px-6 sm:py-14 md:px-10">
        <div className="page-wrap">
          <SectionHeading
            kicker="Complete The Look"
            title="Curated outfit blocks"
            copy="Styling stays honest: these are curated routes into the lookbook and outfit generator, not fake AI claims."
            href="/outfit-generator"
            linkLabel="Build A Look"
          />
          <div className="grid gap-4 lg:grid-cols-3">
            {LOOKS.map((look) => (
              <Link
                key={look.title}
                href={look.href}
                className="group relative flex min-h-[21rem] overflow-hidden rounded-[28px] border border-[rgba(123,103,82,0.16)] bg-[#3D3025] shadow-[0_22px_58px_rgba(61,48,37,0.14)] transition-transform duration-300 hover:-translate-y-1 sm:min-h-[24rem]"
              >
                <Image
                  src={look.image}
                  alt={look.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(61,48,37,0.08)_0%,rgba(61,48,37,0.20)_42%,rgba(61,48,37,0.82)_100%)]" />
                <div className="relative z-10 mt-auto flex w-full items-end justify-between gap-4 p-5 sm:p-6">
                  <h3 className="max-w-xs font-serif text-[1.55rem] font-light leading-[1.02] tracking-[0.04em] text-[#FFF9EF] sm:text-[1.9rem]">{look.title}</h3>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[rgba(255,249,239,0.28)] bg-[rgba(255,249,239,0.16)] text-[#E5C17A] backdrop-blur-md">
                    <ArrowRight className="h-4 w-4" strokeWidth={1.35} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#F5F1E8] px-4 py-10 sm:px-6 sm:py-14 md:px-10">
        <div className="page-wrap grid border-y border-[rgba(123,103,82,0.16)] sm:grid-cols-2 lg:grid-cols-4">
          {TRUST_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex min-h-[7rem] items-center gap-4 border-b border-[rgba(123,103,82,0.16)] py-5 sm:border-r sm:px-5 lg:border-b-0 last:border-b-0 sm:last:border-r-0">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[rgba(168,121,53,0.24)] bg-[rgba(168,121,53,0.08)] text-[#A87935]">
                  <Icon className="h-5 w-5" strokeWidth={1.45} />
                </span>
                <span>
                  <span className="block text-[11px] uppercase tracking-[0.2em] text-[#3D3025]">{item.label}</span>
                  <span className="mt-1 block text-sm leading-6 tracking-[0.03em] text-[#6F6254]">{item.detail}</span>
                </span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="page-wrap px-4 py-12 text-center sm:px-6 sm:py-16 md:px-10">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(168,121,53,0.22)] bg-[rgba(168,121,53,0.08)] text-[#A87935]">
            <Sparkles className="h-5 w-5" strokeWidth={1.35} />
          </div>
          <h2 className="title-display text-[clamp(2rem,5vw,3.7rem)]">
            Join the <em className="gold-italic">private list</em>
          </h2>
          <p className="body-copy mx-auto mt-4 max-w-xl text-center">
            New arrivals, collection notes, and restrained styling direction through the existing newsletter endpoint.
          </p>
          <div className="mt-7">
            <NewsletterForm />
          </div>
        </div>
      </section>
    </main>
  );
}
