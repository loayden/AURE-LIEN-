"use client";

import NewsletterForm from "@/components/NewsletterForm";
import EditorialSections from "@/components/EditorialSections";
import { AnimatedArrow } from "@/components/home/AnimatedArrow";
import BrandPromiseBar from "@/components/home/BrandPromiseBar";
import { SectionIntro } from "@/components/home/SectionIntro";
import { fadeUp, sectionReveal } from "@/components/home/sectionMotion";
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
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronRight, Search, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { memo, useCallback, useMemo, useState } from "react";

const QUICK_DEPARTMENTS = [
  CATEGORY_META[0],
  SUBCATEGORY_META.find((category) => category.slug === "suits"),
  SUBCATEGORY_META.find((category) => category.slug === "knitwear"),
  CATEGORY_META[1],
  CATEGORY_META[2],
  CATEGORY_META[3],
].filter(Boolean) as typeof CATEGORY_META;

const SHOPPING_MOODS = [
  { label: "All clothes", value: "all", href: "/shop" },
  { label: "Suits", value: "suits", href: "/suits" },
  { label: "Knitwear", value: "knitwear", href: "/knitwear" },
  { label: "Denim", value: "denim", href: "/denim" },
  { label: "Footwear", value: "footwear", href: "/footwear" },
] as const;

const EDIT_PRODUCT_IDS = [
  "p-jc-017",
  "p-kn-004",
  "p-denim-002",
  "p-baggy-001",
  "p-su-001",
  "p-sh-005",
  "p-korean-003",
  "p-jc-018",
];

function pickProducts(products: Product[], ids: string[], count: number) {
  const byId = new Map(products.map((product) => [String(product._id), product]));
  const selected = ids.map((id) => byId.get(id)).filter((product): product is Product => Boolean(product));
  const selectedIds = new Set(selected.map((product) => product._id));
  return [...selected, ...products.filter((product) => !selectedIds.has(product._id))].slice(0, count);
}

function firstAvailableValue(values?: string[]) {
  return values?.find(Boolean) ?? null;
}

const ProductTile = memo(function ProductTile({
  product,
  actionBusy,
  onAction,
}: {
  product: Product;
  actionBusy: boolean;
  onAction: (product: Product) => void;
}) {
  return (
    <motion.article
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="group min-w-[16rem] overflow-hidden rounded-lg border border-[#DEDAD2] bg-white text-[#171513] shadow-[0_18px_42px_rgba(23,21,19,0.08)] transition hover:border-[#171513]"
    >
      <Link href={productHref(product)} className="relative block aspect-[4/5] overflow-hidden bg-[#E9E7E1]">
        <Image
          src={productImage(product)}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 74vw, 24vw"
          className="object-cover transition duration-700 group-hover:scale-[1.04]"
        />
        <span className="absolute left-3 top-3 rounded-full px-3 py-1.5 bg-white/90 text-[#171513] text-xs">
          {formatCategoryLabel(product.category)}
        </span>
      </Link>
      <div className="p-4">
        <Link href={productHref(product)} className="block">
          <h3 className="line-clamp-2 min-h-[2.7rem] font-serif text-2xl font-light leading-none text-[#171513]">
            {product.name}
          </h3>
        </Link>
        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-xs text-[#69645E]">{stockLabel(product)}</p>
            <p className="mt-1 text-base font-medium text-[#725D2C]">
              EGP {formatPrice(product.price)}
            </p>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAction(product);
            }}
            disabled={actionBusy}
            className="inline-flex min-w-[44px] items-center justify-center gap-2 rounded-full uppercase tracking-[0.16em] transition-all disabled:cursor-not-allowed disabled:opacity-35 min-h-[40px] px-4 py-2.5 text-[9px]"
            style={{
              fontFamily: "'Jost', sans-serif",
              background: "#4C3A26",
              color: "#FFF9EF",
              border: "1px solid rgba(76,58,38,0.70)",
            }}
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingBag strokeWidth={1.25} className="h-4 w-4" />
            {actionBusy ? "Adding" : "Add"}
          </button>
        </div>
      </div>
      <motion.div
        className="absolute inset-x-0 bottom-0 h-px pointer-events-none z-50"
        initial={{ scaleX: 0, opacity: 0 }}
        whileHover={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background: "linear-gradient(90deg, transparent, rgba(168,121,53,0.6), transparent)",
          transformOrigin: "center",
        }}
      />
    </motion.article>
  );
});

const HeroMoodProductCard = memo(function HeroMoodProductCard({ product, className = "" }: { product: Product; className?: string }) {
  return (
    <motion.article layout initial={false} animate={{ opacity: 1, y: 0, scale: 1 }} whileHover={{ y: -4 }} transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }} className={`min-w-0 ${className}`}>
      <Link href={productHref(product)} className="group block h-full overflow-hidden rounded-lg border border-[#DEDAD2] bg-white shadow-[0_14px_32px_rgba(23,21,19,0.06)] transition hover:border-[#171513]">
        <div className="relative aspect-[4/5] overflow-hidden bg-[#E9E7E1]">
          <Image
            src={productImage(product)}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 44vw, (max-width: 1280px) 18vw, 11vw"
            className="object-cover transition duration-700 group-hover:scale-[1.04]"
          />
        </div>
        <div className="flex min-h-[6.75rem] min-w-0 flex-col justify-between p-3">
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-[0.12em] text-[#725D2C]">{formatCategoryLabel(product.category)}</p>
            <h3 className="mt-1 line-clamp-2 font-serif text-lg font-light leading-[1.02] text-[#171513] sm:text-xl">{product.name}</h3>
          </div>
          <div className="mt-3 flex items-end justify-between gap-2">
            <p className="text-xs font-medium text-[#725D2C] sm:text-sm">EGP {formatPrice(product.price)}</p>
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#D5D1C8] text-[#171513] transition group-hover:border-[#171513]">
              <ChevronRight className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
});

export default function HomePageClient({ initialProducts, boutiquesStrip }: { initialProducts: Product[]; boutiquesStrip?: React.ReactNode }) {
  const router = useRouter();
  const products = initialProducts;
  const [query, setQuery] = useState("");
  const [addingId, setAddingId] = useState<string | null>(null);
  const [selectedMood, setSelectedMood] = useState<"all" | "suits" | "knitwear" | "denim" | "footwear">("all");

  const editProducts = useMemo(() => pickProducts(products, EDIT_PRODUCT_IDS, 8), [products]);
  const newArrivals = useMemo(() => pickProducts(products, [], 8), [products]);

  const activeMood = useMemo(
    () => SHOPPING_MOODS.find((mood) => mood.value === selectedMood) ?? SHOPPING_MOODS[0],
    [selectedMood]
  );

  const filteredMoodProducts = useMemo(
    () => (selectedMood === "all" ? products : products.filter((product) => categoryMatches(product, selectedMood))),
    [products, selectedMood]
  );

  const moodProducts = useMemo(() => {
    const picked = pickProducts(filteredMoodProducts, EDIT_PRODUCT_IDS, 8);
    return picked.length ? picked : editProducts;
  }, [editProducts, filteredMoodProducts]);

  const handleSearch = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleaned = query.trim();
    router.push(cleaned ? `/search?q=${encodeURIComponent(cleaned)}` : "/shop");
  }, [query, router]);

  const handleProductAction = useCallback(async (product: Product) => {
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
  }, [router]);

  const selectMood = useCallback((mood: "all" | "suits" | "knitwear" | "denim" | "footwear") => {
    setSelectedMood(mood);
  }, []);

  return (
    <motion.main id="main-content" className="min-h-screen overflow-hidden bg-[#F7F7F4] pb-24 text-[#171513] md:pb-0">
      {/* ══════════ 1. HERO — VALUE PROPOSITION FIRST ══════════ */}
      <section className="border-b border-[#DDDAD2] bg-[#F7F7F4] px-5 pt-[72px] sm:px-6 md:px-10 py-12 lg:py-16">
        <div className="mx-auto grid w-full max-w-[92rem] gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:py-20">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <span className="inline-block mb-4 text-[11px] font-medium uppercase tracking-[0.24em] text-[#725D2C]">
              Curated boutiques. Authentic Egyptian fashion.
            </span>
            <h1 className="mt-3 font-serif text-4xl font-light leading-none text-[#171513] sm:text-5xl lg:text-6xl tracking-tight">
              Discover real boutiques. Shop curated pieces.
            </h1>
            <p className="mt-6 max-w-lg text-sm leading-7 text-[#5A5650] sm:text-base sm:leading-8">
              BOUT is a curated marketplace connecting you with verified local boutiques across Egypt. Every piece is
              hand-selected and approved before it reaches your door.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-3">
              <Link
                href="/shop"
                className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-[#4C3A26] px-7 py-3 text-sm font-medium text-[#FFF9EF] transition hover:bg-[#7D592B]"
              >
                Shop the edit
                <AnimatedArrow className="h-4 w-4" />
              </Link>
              <Link
                href="/boutiques"
                className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full border border-[#D5D1C8] bg-white px-7 py-3 text-sm text-[#171513] transition hover:border-[#171513]"
              >
                Explore boutiques
                <ChevronRight className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
              </Link>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="relative min-h-[520px]">
            <Image
              src={withPublicAssetVersion("/uploads/boutique-storefront-home.webp")}
              alt="BOUT boutique storefront"
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover rounded-xl shadow-[0_30px_70px_rgba(23,21,19,0.12)]"
              priority
            />
            <div className="absolute -inset-px rounded-xl border border-[#171513]/10 pointer-events-none" />
          </motion.div>
        </div>
      </section>

      {/* ══════════ 2. SEARCH + MOOD DISCOVERY ══════════ */}
      <section className="bg-[#F7F7F4] px-5 py-10 sm:px-6 md:px-10">
        <div className="mx-auto w-full max-w-[92rem]">
          <motion.form variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} onSubmit={handleSearch} className="relative min-h-[52px] w-full min-w-0 overflow-hidden rounded-xl border border-[#CECAC1] bg-white shadow-[0_14px_40px_rgba(23,21,19,0.07)] sm:min-h-[58px] sm:rounded-lg">
            <Search className="pointer-events-none absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-[#725D2C]" strokeWidth={1.6} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label="Search products"
              placeholder="Search jackets, denim, loafers..."
              className="relative z-10 h-12 w-full min-w-0 border-0 bg-transparent pl-12 pr-20 text-[15px] text-[#171513] shadow-none outline-none placeholder:text-[#77716A] sm:h-14 sm:pr-24 sm:text-base"
              style={{ minWidth: 0, background: "transparent", border: 0, boxShadow: "none" }}
            />
            <motion.button type="submit" whileTap={{ scale: 0.94 }} className="btn-primary !absolute right-2 top-1.5 z-20 inline-flex h-11 min-h-[44px] min-w-[44px] shrink-0 items-center justify-center gap-1.5 rounded-full !px-4 text-[11px]">
              <span>Search</span>
              <AnimatedArrow className="h-3.5 w-3.5" />
            </motion.button>
          </motion.form>

          <div className="mt-6 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {SHOPPING_MOODS.map((mood) => (
              <motion.button
                key={mood.value}
                type="button"
                onClick={() => selectMood(mood.value)}
                whileTap={{ scale: 0.96 }}
                className={`relative isolate min-h-[44px] shrink-0 overflow-hidden rounded-full border px-4 text-[13px] transition sm:text-sm ${
                  selectedMood === mood.value
                    ? "border-[#171513] text-[#F8F7F2]"
                    : "border-[#D5D1C8] bg-white text-[#3F3B36] hover:border-[#171513]"
                }`}
                style={selectedMood === mood.value ? { color: "#F8F7F2" } : undefined}
              >
                {selectedMood === mood.value ? (
                  <motion.span layoutId="hero-mood-active" className="absolute inset-0 rounded-full bg-[#171513]" transition={{ type: "spring", stiffness: 440, damping: 34 }} />
                ) : null}
                <span className="relative z-10" style={selectedMood === mood.value ? { color: "#F8F7F2" } : undefined}>
                  {mood.label}
                </span>
              </motion.button>
            ))}
          </div>

          <div className="mt-6 -mx-1 flex snap-x gap-3 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 xl:grid-cols-3">
            {moodProducts.slice(0, 6).map((product) => (
              <HeroMoodProductCard key={product._id} product={product} className="w-[11.75rem] shrink-0 snap-start sm:w-auto sm:shrink" />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ 3. VERIFIED BOUTIQUES ══════════ */}
      {boutiquesStrip && (
        <section className="border-b border-[#DDDAD2] bg-white px-5 py-10 sm:px-6 md:px-10">{boutiquesStrip}</section>
      )}

      {/* ══════════ 4. NEW ARRIVALS ══════════ */}
      <motion.section variants={sectionReveal} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.18 }} className="bg-[#F7F7F4] px-5 py-10 sm:px-6 sm:py-12 md:px-10 [content-visibility:auto] [contain-intrinsic-size:700px]">
        <div className="mx-auto w-full max-w-[92rem]">
          <SectionIntro
            title="New arrivals"
            copy="The latest pieces from our partner boutiques."
            action={{ label: "View all", href: "/shop" }}
          />
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {newArrivals.map((product) => (
              <ProductTile key={product._id} product={product} actionBusy={addingId === product._id} onAction={handleProductAction} />
            ))}
          </div>
        </div>
      </motion.section>

      {/* ══════════ 5. SHOP BY CATEGORY ══════════ */}
      <motion.section variants={sectionReveal} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.18 }} className="bg-white px-5 py-10 sm:px-6 sm:py-12 md:px-10 [content-visibility:auto] [contain-intrinsic-size:700px]">
        <div className="mx-auto w-full max-w-[92rem]">
          <SectionIntro
            title="Departments"
            copy="A clear starting point for fast browsing."
            action={{ label: "View all", href: "/collection" }}
          />
          <div className="gap-px overflow-hidden rounded-lg border border-[#D5D1C8] bg-[#D5D1C8] sm:grid sm:grid-cols-3 lg:grid-cols-6">
            {QUICK_DEPARTMENTS.map((category) => {
              const count = products.filter((product) => categoryMatches(product, category.slug)).length;
              return (
                <Link key={category.slug} href={category.href} className="group block bg-white">
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#E9E7E1]">
                    <Image
                      src={category.image}
                      alt={category.title}
                      fill
                      sizes="(max-width: 768px) 33vw, 16vw"
                      className="object-cover transition duration-700 group-hover:scale-[1.05]"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-serif text-2xl font-light leading-none text-[#171513]">{category.short}</h3>
                    <p className="mt-2 text-sm text-[#69645E]">{count} pieces</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* ══════════ 6. EDITORIAL INSPIRATION ══════════ */}
      <EditorialSections products={products} />

      {/* ══════════ 7. TRUST PROMISES ══════════ */}
      <BrandPromiseBar />

      {/* ══════════ 8. NEWSLETTER — REAL FORM, NO FAKE STATE ══════════ */}
      <motion.section variants={sectionReveal} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} className="border-y border-[#DDDAD2] bg-[#F3F1ED] px-4 py-12 sm:px-6 sm:py-16 [content-visibility:auto] [contain-intrinsic-size:400px] relative overflow-hidden">
        <div className="absolute inset-0 grain-overlay opacity-[0.03] pointer-events-none" />
        <div className="mx-auto max-w-2xl text-center relative z-10">
          <div className="w-12 h-12 bg-[#171513] rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-xl rotate-3">
            <ShoppingBag className="w-6 h-6 text-[#D8C08A]" />
          </div>
          <h2 className="font-serif text-3xl font-light text-[#171513] sm:text-5xl leading-tight">
            Join the BOUT Club
          </h2>
          <p className="mt-4 text-sm text-[#5A5650] max-w-md mx-auto">
            Sign up to receive early access to sales and exclusive editorial content.
          </p>
          <NewsletterForm />
        </div>
      </motion.section>
    </motion.main>
  );
}


