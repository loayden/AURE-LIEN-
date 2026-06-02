"use client";

import NewsletterForm from "@/components/NewsletterForm";
import ProductCard from "@/components/ProductCard";
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
import { AnimatePresence, LayoutGroup, MotionConfig, motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Heart,
  PackageCheck,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, memo, useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";

const EDIT_PRODUCT_IDS = ["p-jc-017", "p-kn-004", "p-denim-002", "p-baggy-001", "p-su-001", "p-sh-005", "p-korean-003", "p-jc-018"];
const SPOTLIGHT_PRODUCT_IDS = ["p-jc-016", "p-kn-005", "p-denim-004"];

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

const STYLE_PATHS = [
  {
    title: "Morning sharp",
    copy: "Suits, shirts, loafers",
    href: "/suits",
    image: withPublicAssetVersion("/uploads/Suits.jpg"),
  },
  {
    title: "Soft weekend",
    copy: "Knits, denim, sneakers",
    href: "/knitwear",
    image: withPublicAssetVersion("/uploads/collections.jpg"),
  },
  {
    title: "Black layers",
    copy: "Outerwear, trousers, boots",
    href: "/jackets-coats",
    image: withPublicAssetVersion("/uploads/Jackets & Coats.jpg"),
  },
  {
    title: "Final detail",
    copy: "Bags, belts, sunglasses",
    href: "/accessories",
    image: withPublicAssetVersion("/uploads/accessories.jpg"),
  },
] as const;

const SERVICE_ITEMS = [
  { label: "Secure checkout", detail: "Card or cash on delivery", icon: ShieldCheck },
  { label: "Egypt delivery", detail: "Clear delivery before payment", icon: Truck },
  { label: "Order support", detail: "Help, returns, and updates", icon: PackageCheck },
] as const;

const REEL_AD_VIDEO_SRC = "/videos/boutique-reel-ad.mp4";
const REEL_AD_POSTER_SRC = withPublicAssetVersion("/uploads/look3.jpg");

const SUMMER_COLLECTION = {
  name: "Summer Essentials Luxury Set",
  image: withPublicAssetVersion("/uploads/image1.png"),
  offerPrice: 4999,
  originalTotal: 7500,
} as const;

const SUMMER_COLLECTION_PRODUCTS = [
  {
    id: "jacket",
    productId: "p-summer-jacket-001",
    name: "Premium Summer Jacket",
    category: "Jacket",
    price: 1500,
    href: "/product/p-summer-jacket-001",
    image: withPublicAssetVersion("/uploads/image4.png"),
    hotspot: { x: 58, y: 36 },
    defaultSize: "M",
    defaultColor: "black",
  },
  {
    id: "tshirt",
    productId: "p-summer-tshirt-001",
    name: "Essential Basic T-Shirt",
    category: "T-Shirt",
    price: 500,
    href: "/product/p-summer-tshirt-001",
    image: withPublicAssetVersion("/uploads/d76ef0f9-2b5c-4fc1-8aed-a80392d4c131.jpeg"),
    hotspot: { x: 51, y: 43 },
    defaultSize: "M",
    defaultColor: "black",
  },
  {
    id: "pants",
    productId: "p-summer-pants-001",
    name: "Premium Tailored Pants",
    category: "Pants",
    price: 1500,
    href: "/product/p-summer-pants-001",
    image: withPublicAssetVersion("/uploads/image3.png"),
    hotspot: { x: 50, y: 66 },
    defaultSize: "M",
    defaultColor: "cream",
  },
  {
    id: "shoes",
    productId: "p-summer-sneakers-001",
    name: "Premium Summer Sneakers",
    category: "Shoes",
    price: 1500,
    href: "/product/p-summer-sneakers-001",
    image: withPublicAssetVersion("/uploads/image2.png"),
    hotspot: { x: 42, y: 90 },
    defaultSize: "42",
    defaultColor: "black",
  },
] as const;

type MoodValue = (typeof SHOPPING_MOODS)[number]["value"];

const easeOut = [0.22, 1, 0.36, 1] as const;

const heroStagger = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.055,
      delayChildren: 0.02,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0.01, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.44, ease: easeOut },
  },
};

const imageReveal = {
  hidden: { opacity: 0.01, y: 18, scale: 0.992 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.58, ease: easeOut },
  },
};

const sectionReveal = {
  hidden: { opacity: 0.01, y: 26 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.56, ease: easeOut },
  },
};

const tileReveal = {
  hidden: { opacity: 0, y: 24, scale: 0.985 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.44, ease: easeOut },
  },
};

function AnimatedArrow({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <motion.span
      aria-hidden="true"
      className="inline-flex"
    >
      <ArrowRight className={className} strokeWidth={1.5} />
    </motion.span>
  );
}

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

function SectionIntro({
  title,
  copy,
  action,
  inverted = false,
}: {
  title: string;
  copy?: string;
  action?: { label: string; href: string };
  inverted?: boolean;
}) {
  return (
    <motion.div
      variants={fadeUp}
      className="mb-6 flex flex-col gap-4 sm:mb-8 lg:flex-row lg:items-end lg:justify-between"
    >
      <div className="max-w-2xl">
        <h2 className={`font-serif text-4xl font-light leading-none sm:text-5xl lg:text-6xl ${inverted ? "text-[#F8F7F2]" : "text-[#171513]"}`}>
          {title}
        </h2>
        {copy ? <p className={`mt-4 max-w-xl text-sm leading-7 sm:text-base ${inverted ? "text-[#C9C5B8]" : "text-[#5A5650]"}`}>{copy}</p> : null}
      </div>
      {action ? (
        <motion.div
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.97 }}
        >
          <Link
            href={action.href}
            className={`inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full px-5 py-3 text-sm transition ${
              inverted
                ? "bg-[#F8F7F2] text-[#171513] hover:bg-[#D8C08A]"
                : "border border-[#D5D1C8] bg-white text-[#171513] hover:border-[#171513]"
            }`}
          >
            {action.label}
            <AnimatedArrow />
          </Link>
        </motion.div>
      ) : null}
    </motion.div>
  );
}

function StorefrontOpeningOverlay() {
  return (
    <motion.div
      aria-hidden="true"
      data-testid="storefront-opening-overlay"
      className="fixed inset-0 z-[140] overflow-hidden bg-[#F6F2EA]"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.28, ease: easeOut } }}
    >
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(216,192,138,0.18),transparent_58%)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.28, ease: easeOut }}
      />
      <motion.div
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.62),rgba(255,255,255,0.12)_30%,transparent_62%,rgba(216,192,138,0.08))]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.32, ease: easeOut }}
      />
      <div className="absolute inset-0 flex items-center justify-center px-6">
        <motion.div
          layoutId="storefront-shared-shell"
          data-testid="intro-storefront-shared"
          className="relative aspect-[1.44/1] w-full max-w-[18rem] sm:max-w-[22rem] lg:max-w-[26rem]"
          initial={{ opacity: 0, scale: 0.9, y: 18, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.58, delay: 0.06, ease: easeOut, layout: { duration: 0.68, ease: easeOut } }}
        >
          <motion.div
            className="absolute inset-x-[10%] top-[12%] h-[72%] rounded-full bg-[radial-gradient(circle,rgba(216,192,138,0.24),rgba(216,192,138,0.1)_46%,transparent_76%)] blur-3xl"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.54, delay: 0.16, ease: easeOut }}
          />
          <motion.div
            className="absolute inset-y-[16%] left-1/2 w-[12%] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,248,230,0.88),rgba(255,248,230,0.24)_48%,transparent_80%)] blur-2xl"
            initial={{ opacity: 0, scaleX: 0.15 }}
            animate={{ opacity: [0, 0.82, 0], scaleX: [0.15, 1.35, 1.8] }}
            transition={{ duration: 0.72, delay: 0.48, ease: easeOut }}
          />
          <motion.div
            className="relative h-full w-full"
            initial={{ filter: "drop-shadow(0 0 0 rgba(168,121,53,0))" }}
            animate={{ filter: "drop-shadow(0 22px 40px rgba(168,121,53,0.12))" }}
            transition={{ duration: 0.58, delay: 0.14, ease: easeOut }}
          >
            <Image
              src={withPublicAssetVersion("/uploads/boutique-storefront-home.webp")}
              alt="BOUT boutique storefront illustration"
              fill
              priority
              sizes="(max-width: 640px) 70vw, (max-width: 1024px) 22rem, 26rem"
              className="object-contain object-center"
            />
          </motion.div>
          <motion.div
            className="pointer-events-none absolute inset-y-[10%] left-[-16%] w-[20%] skew-x-[-14deg] rounded-full bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.16),rgba(255,255,255,0.46),rgba(255,255,255,0.16),transparent)] mix-blend-screen blur-[1px]"
            initial={{ x: "0%", opacity: 0 }}
            animate={{ x: "385%", opacity: [0, 0.72, 0] }}
            transition={{ duration: 0.84, delay: 0.58, ease: easeOut }}
          />
        </motion.div>
      </div>
      <motion.div
        data-testid="storefront-left-door"
        className="absolute inset-y-0 left-0 w-1/2 border-r border-[#D7C7A2]/55 bg-[linear-gradient(90deg,rgba(246,242,234,0.98),rgba(241,234,221,0.98)_58%,rgba(236,226,208,0.9))] shadow-[inset_-18px_0_28px_rgba(216,192,138,0.14)]"
        initial={{ x: 0, opacity: 1 }}
        animate={{ x: "-101%", opacity: 0.84 }}
        transition={{ duration: 0.96, delay: 0.38, ease: [0.7, 0.02, 0.18, 1] }}
      >
        <div className="absolute right-5 top-1/2 h-12 w-px -translate-y-1/2 rounded-full bg-[#B89456]/50" />
      </motion.div>
      <motion.div
        data-testid="storefront-right-door"
        className="absolute inset-y-0 right-0 w-1/2 border-l border-[#D7C7A2]/55 bg-[linear-gradient(270deg,rgba(246,242,234,0.98),rgba(241,234,221,0.98)_58%,rgba(236,226,208,0.9))] shadow-[inset_18px_0_28px_rgba(216,192,138,0.14)]"
        initial={{ x: 0, opacity: 1 }}
        animate={{ x: "101%", opacity: 0.84 }}
        transition={{ duration: 0.96, delay: 0.38, ease: [0.7, 0.02, 0.18, 1] }}
      >
        <div className="absolute left-5 top-1/2 h-12 w-px -translate-y-1/2 rounded-full bg-[#B89456]/50" />
      </motion.div>
      <motion.div
        className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-[linear-gradient(180deg,transparent,rgba(214,186,132,0.92),transparent)]"
        initial={{ opacity: 0.9, scaleY: 1 }}
        animate={{ opacity: 0, scaleY: 1.16 }}
        transition={{ duration: 0.58, delay: 0.42, ease: easeOut }}
      />
    </motion.div>
  );
}

function SummerCollectionSection({
  addSetBusy,
  onShopFullSet,
}: {
  addSetBusy: boolean;
  onShopFullSet: () => void;
}) {
  return (
    <motion.section
      variants={sectionReveal}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.18 }}
      data-testid="summer-collection-section"
      className="border-y border-[#DDDAD2] bg-[#F7F7F4] px-4 pb-10 pt-24 [content-visibility:auto] [contain-intrinsic-size:1040px] sm:px-6 sm:pb-14 sm:pt-28 md:px-10"
    >
      <div className="mx-auto grid w-full max-w-[92rem] gap-7 lg:grid-cols-[1.08fr_0.92fr] lg:items-stretch">
        <motion.div variants={imageReveal} className="relative min-w-0">
          <div className="relative overflow-hidden rounded-lg border border-[#D5D1C8] bg-[#E9E7E1] shadow-[0_28px_74px_rgba(23,21,19,0.12)]">
            <div
              className="group relative block aspect-[2/3] min-h-[34rem] overflow-hidden sm:min-h-[44rem] lg:min-h-[52rem]"
            >
              <Image
                src={SUMMER_COLLECTION.image}
                alt="Complete Summer Essentials Luxury Set outfit with jacket, T-shirt, tailored pants, and black shoes"
                fill
                sizes="(max-width: 1024px) 100vw, 56vw"
                className="object-cover object-center transition duration-700 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(23,21,19,0.02)_0%,rgba(23,21,19,0.08)_48%,rgba(23,21,19,0.54)_100%)]" />
              <div className="absolute left-4 top-4 rounded-full border border-white/35 bg-white/20 px-3 py-2 text-[10px] uppercase tracking-[0.18em] text-white shadow-[0_12px_34px_rgba(0,0,0,0.18)] backdrop-blur-md sm:left-5 sm:top-5">
                Special offer
              </div>
              <div className="absolute inset-x-4 bottom-4 max-w-xl text-white sm:inset-x-6 sm:bottom-6">
                <p className="text-xs uppercase tracking-[0.2em] text-[#D8C08A]">Shop the look</p>
                <h2 className="mt-3 font-serif text-4xl font-light leading-none text-[#F8F7F2] drop-shadow-[0_3px_18px_rgba(0,0,0,0.36)] sm:text-5xl lg:text-6xl">
                  {SUMMER_COLLECTION.name}
                </h2>
                <div className="mt-5 flex flex-wrap items-end gap-3">
                  <span className="font-serif text-4xl font-light leading-none text-[#F8F7F2] sm:text-5xl">
                    EGP {formatPrice(SUMMER_COLLECTION.offerPrice)}
                  </span>
                  <span className="pb-1 text-sm text-white/74 line-through">
                    EGP {formatPrice(SUMMER_COLLECTION.originalTotal)}
                  </span>
                </div>
              </div>
            </div>

            {SUMMER_COLLECTION_PRODUCTS.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                aria-label={`Open ${item.name} product details`}
                data-testid={`summer-hotspot-${item.id}`}
                className="group/hotspot absolute z-20 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#171513]"
                style={{ left: `${item.hotspot.x}%`, top: `${item.hotspot.y}%` }}
              >
                <span className="absolute h-12 w-12 rounded-full border border-white/40 bg-white/10 shadow-[0_16px_34px_rgba(0,0,0,0.2)] backdrop-blur-md transition duration-300 group-hover/hotspot:scale-110 group-hover/hotspot:bg-white/24" />
                <span className="absolute h-9 w-9 animate-ping rounded-full border border-white/50 opacity-35" />
                <span className="relative h-3.5 w-3.5 rounded-full bg-white shadow-[0_0_0_6px_rgba(255,255,255,0.16),0_10px_24px_rgba(0,0,0,0.24)]" />
                <span className="pointer-events-none absolute left-1/2 top-[calc(100%+0.65rem)] hidden min-w-[15rem] -translate-x-1/2 rounded-lg border border-white/15 bg-[#171513]/90 px-4 py-3 text-left text-[#F8F7F2] shadow-[0_18px_42px_rgba(0,0,0,0.22)] backdrop-blur-xl transition duration-300 group-hover/hotspot:block sm:block sm:translate-y-2 sm:opacity-0 sm:group-hover/hotspot:translate-y-0 sm:group-hover/hotspot:opacity-100">
                  <span className="block text-[10px] uppercase tracking-[0.18em] text-[#D8C08A]">{item.category}</span>
                  <span className="mt-1 block text-sm font-medium">{item.name}</span>
                  <span className="mt-1 block text-sm text-[#E9E4D8]">EGP {formatPrice(item.price)}</span>
                </span>
              </Link>
            ))}
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="flex min-w-0 flex-col justify-between gap-7">
          <div>
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#171513] text-[#D8C08A]">
              <Sparkles className="h-5 w-5" strokeWidth={1.5} />
            </div>
            <p className="text-xs uppercase tracking-[0.18em] text-[#725D2C]">Luxury summer collection</p>
            <h2 className="mt-4 max-w-2xl font-serif text-5xl font-light leading-none text-[#171513] sm:text-6xl lg:text-7xl">
              Explore the full outfit by touch.
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-[#5A5650] sm:text-base">
              One editorial summer look, split into four direct product paths. Tap the white points on the outfit to open the exact jacket, pants, shoes, or T-shirt details.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-[#D5D1C8] bg-white p-5">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#725D2C]">Bundle price</p>
                <p className="mt-3 font-serif text-4xl font-light leading-none text-[#171513]">
                  EGP {formatPrice(SUMMER_COLLECTION.offerPrice)}
                </p>
                <p className="mt-2 text-sm text-[#69645E]">Special offer for the complete set.</p>
              </div>
              <div className="rounded-lg border border-[#D5D1C8] bg-[#171513] p-5 text-[#F8F7F2]">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#D8C08A]">Included pieces</p>
                <p className="mt-3 font-serif text-4xl font-light leading-none">
                  4 items
                </p>
                <p className="mt-2 text-sm text-[#C9C5B8]">Jacket, pants, shoes, and basic tee.</p>
              </div>
            </div>
          </div>

          <div className="grid gap-3">
            {SUMMER_COLLECTION_PRODUCTS.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="group grid min-h-[6rem] grid-cols-[5.5rem_1fr_auto] items-center gap-4 rounded-lg border border-[#D5D1C8] bg-white p-3 text-[#171513] shadow-[0_14px_34px_rgba(23,21,19,0.05)] transition hover:border-[#171513]"
              >
                <span className="relative block aspect-[4/5] overflow-hidden rounded-md bg-[#E9E7E1]">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="6rem"
                    className="object-contain p-1 transition duration-500 group-hover:scale-[1.04]"
                  />
                </span>
                <span className="min-w-0">
                  <span className="block text-[10px] uppercase tracking-[0.18em] text-[#725D2C]">{item.category}</span>
                  <span className="mt-1 block font-serif text-2xl font-light leading-none text-[#171513]">{item.name}</span>
                  <span className="mt-2 block text-sm text-[#69645E]">EGP {formatPrice(item.price)}</span>
                </span>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#D5D1C8] text-[#171513] transition group-hover:border-[#171513]">
                  <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
                </span>
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onShopFullSet}
              disabled={addSetBusy}
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-[#171513] px-6 py-3 text-sm text-[#F8F7F2] transition hover:bg-[#725D2C] disabled:cursor-not-allowed disabled:bg-[#D9D5CC] disabled:text-[#65605A]"
            >
              <ShoppingBag className="h-4 w-4" strokeWidth={1.5} />
              {addSetBusy ? "Adding set" : "Shop full set"}
            </button>
            <Link
              href="/shop"
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-[#D5D1C8] bg-white px-6 py-3 text-sm text-[#171513] transition hover:border-[#171513]"
            >
              <ShoppingBag className="h-4 w-4" strokeWidth={1.5} />
              View in shop
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}

function BoutiqueReelFeature() {
  return (
    <motion.section
      variants={sectionReveal}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.18 }}
      data-testid="boutique-reel-ad-section"
      className="bg-[#171513] px-4 py-10 text-[#F8F7F2] [content-visibility:auto] [contain-intrinsic-size:980px] sm:px-6 sm:py-14 md:px-10"
    >
      <div className="mx-auto grid w-full max-w-[92rem] gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-center">
        <motion.div variants={fadeUp}>
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-[#D8C08A]/35 bg-white/[0.06] text-[#D8C08A]">
            <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
          </div>
          <p className="text-xs uppercase tracking-[0.18em] text-[#D8C08A]">Reels campaign</p>
          <h2 className="mt-4 max-w-2xl font-serif text-4xl font-light leading-none text-[#F8F7F2] sm:text-5xl lg:text-6xl">
            Boutique, without the mall chaos.
          </h2>
          <p className="mt-5 max-w-xl text-sm leading-7 text-[#C9C5B8] sm:text-base">
            A vertical cinematic ad built for TikTok, Reels, and mobile-first landing pages.
          </p>
        </motion.div>

        <motion.div variants={imageReveal} className="relative mx-auto w-full max-w-[24rem] lg:max-w-[28rem]">
          <div
            aria-hidden="true"
            className="absolute inset-x-[8%] top-[10%] h-[82%] rounded-full bg-[radial-gradient(circle,rgba(216,192,138,0.24),rgba(216,192,138,0.08)_48%,transparent_72%)] blur-3xl"
          />
          <div className="relative overflow-hidden rounded-[2rem] border border-white/[0.16] bg-black p-2 shadow-[0_34px_90px_rgba(0,0,0,0.38)]">
            <video
              data-testid="boutique-reel-ad-video"
              className="aspect-[9/16] w-full rounded-[1.55rem] bg-[#090806] object-cover"
              src={REEL_AD_VIDEO_SRC}
              poster={REEL_AD_POSTER_SRC}
              autoPlay
              muted
              loop
              playsInline
              controls
              preload="metadata"
            />
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}

function ProductActionButton({
  product,
  busy,
  onAction,
}: {
  product: Product;
  busy: boolean;
  onAction: (product: Product) => void;
}) {
  const state = stockState(product);
  const requiresChoice = (product.size?.length ?? 0) > 1 || (product.colors?.length ?? 0) > 1;

  return (
    <motion.button
      type="button"
      disabled={state === "sold-out" || busy}
      onClick={() => onAction(product)}
      whileTap={state === "sold-out" || busy ? undefined : { scale: 0.94 }}
      animate={busy ? { scale: [1, 0.96, 1] } : { scale: 1 }}
      transition={{ duration: 0.26, ease: easeOut }}
      className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-[#171513] px-4 py-2.5 text-sm text-[#F8F7F2] transition hover:bg-[#725D2C] disabled:cursor-not-allowed disabled:bg-[#D9D5CC] disabled:text-[#65605A]"
      style={{
        backgroundColor: state === "sold-out" || busy ? "#D9D5CC" : "#171513",
        color: state === "sold-out" || busy ? "#65605A" : "#F8F7F2",
        borderColor: state === "sold-out" || busy ? "#D9D5CC" : "#171513",
      }}
    >
      <ShoppingBag className="h-4 w-4" strokeWidth={1.45} />
      <span>{busy ? "Adding" : requiresChoice ? "Choose" : "Add"}</span>
    </motion.button>
  );
}

const ProductTile = memo(function ProductTile({
  product,
  actionBusy,
  onAction,
  dark = false,
}: {
  product: Product;
  actionBusy: boolean;
  onAction: (product: Product) => void;
  dark?: boolean;
}) {
  return (
    <motion.article
      variants={tileReveal}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.24 }}
      whileHover={{ y: -7, scale: 1.01 }}
      transition={{ duration: 0.28, ease: easeOut }}
      className={`group min-w-[16rem] overflow-hidden rounded-lg border transition duration-300 lg:min-w-0 ${
      dark
        ? "border-white/10 bg-[#24211D] text-[#F8F7F2]"
        : "border-[#DEDAD2] bg-white text-[#171513] shadow-[0_18px_42px_rgba(23,21,19,0.08)]"
    }`}>
      <Link href={productHref(product)} className="relative block aspect-[4/5] overflow-hidden bg-[#E9E7E1]">
        <Image
          src={productImage(product)}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 74vw, 24vw"
          className="object-cover transition duration-700 group-hover:scale-[1.04]"
        />
        <span className={`absolute left-3 top-3 rounded-full px-3 py-1.5 text-xs ${
          dark ? "bg-[#171513]/80 text-[#F8F7F2]" : "bg-white/90 text-[#171513]"
        }`}>
          {formatCategoryLabel(product.category)}
        </span>
      </Link>
      <div className="p-4">
        <Link href={productHref(product)} className="block">
          <h3 className={`line-clamp-2 min-h-[2.7rem] font-serif text-2xl font-light leading-none ${dark ? "text-[#F8F7F2]" : "text-[#171513]"}`}>
            {product.name}
          </h3>
        </Link>
        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <p className={`text-xs ${dark ? "text-[#C9C5B8]" : "text-[#69645E]"}`}>{stockLabel(product)}</p>
            <p className={`mt-1 text-base font-medium ${dark ? "text-[#D8C08A]" : "text-[#725D2C]"}`}>EGP {formatPrice(product.price)}</p>
          </div>
          <ProductActionButton product={product} busy={actionBusy} onAction={onAction} />
        </div>
      </div>
    </motion.article>
  );
});

const HeroMoodProductCard = memo(function HeroMoodProductCard({ product, className = "" }: { product: Product; className?: string }) {
  return (
    <motion.article
      layout
      initial={false}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.24, ease: easeOut }}
      className={`min-w-0 ${className}`}
    >
      <Link
        href={productHref(product)}
        className="group block h-full overflow-hidden rounded-lg border border-[#DEDAD2] bg-white shadow-[0_14px_32px_rgba(23,21,19,0.06)] transition hover:border-[#171513]"
      >
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
            <p className="text-[11px] uppercase tracking-[0.12em] text-[#725D2C]">
              {formatCategoryLabel(product.category)}
            </p>
            <h3 className="mt-1 line-clamp-2 font-serif text-lg font-light leading-[1.02] text-[#171513] sm:text-xl">
              {product.name}
            </h3>
          </div>
          <div className="mt-3 flex items-end justify-between gap-2">
            <p className="text-xs font-medium text-[#725D2C] sm:text-sm">EGP {formatPrice(product.price)}</p>
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#D5D1C8] text-[#171513] transition group-hover:border-[#171513]">
              <ChevronRight className="h-3.5 w-3.5" strokeWidth={1.5} />
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
});

export default function HomePageClient({ initialProducts }: { initialProducts: Product[] }) {
  const router = useRouter();
  const mobileCarouselRef = useRef<HTMLDivElement | null>(null);
  const mobileCarouselCardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const mobileScrollFrameRef = useRef<number | null>(null);
  const [query, setQuery] = useState("");
  const [addingId, setAddingId] = useState<string | null>(null);
  const [addingSummerSet, setAddingSummerSet] = useState(false);
  const [selectedMood, setSelectedMood] = useState<MoodValue>("all");
  const [mobileActiveIndex, setMobileActiveIndex] = useState(0);
  const [showOpeningIntro, setShowOpeningIntro] = useState(true);
  const [, startTransition] = useTransition();
  const products = initialProducts;

  const editProducts = useMemo(() => pickProducts(products, EDIT_PRODUCT_IDS, 8), [products]);
  const spotlightProducts = useMemo(() => pickProducts(products, SPOTLIGHT_PRODUCT_IDS, 3), [products]);

  const activeMood = useMemo(
    () => SHOPPING_MOODS.find((mood) => mood.value === selectedMood) ?? SHOPPING_MOODS[0],
    [selectedMood]
  );

  const filteredMoodProducts = useMemo(
    () => (
      selectedMood === "all"
        ? products
        : products.filter((product) => categoryMatches(product, selectedMood))
    ),
    [products, selectedMood]
  );

  const moodProducts = useMemo(() => {
    const picked = pickProducts(filteredMoodProducts, EDIT_PRODUCT_IDS, 8);
    return picked.length ? picked : editProducts;
  }, [editProducts, filteredMoodProducts]);

  const heroRailProducts = useMemo(() => moodProducts.slice(0, 4), [moodProducts]);

  const categoryCounts = useMemo(() => {
    return new Map(
      QUICK_DEPARTMENTS.map((category) => [
        category.slug,
        products.filter((product) => categoryMatches(product, category.slug)).length,
      ])
    );
  }, [products]);

  const selectMood = useCallback((mood: MoodValue) => {
    startTransition(() => setSelectedMood(mood));
  }, [startTransition]);

  const syncMobileActiveCard = useCallback(() => {
    const container = mobileCarouselRef.current;
    if (!container || filteredMoodProducts.length === 0) {
      setMobileActiveIndex(0);
      return;
    }

    const viewportCenter = container.scrollLeft + container.clientWidth / 2;
    let nearestIndex = 0;
    let smallestDistance = Number.POSITIVE_INFINITY;

    for (let index = 0; index < filteredMoodProducts.length; index += 1) {
      const card = mobileCarouselCardRefs.current[index];
      if (!card) continue;
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const distance = Math.abs(cardCenter - viewportCenter);
      if (distance < smallestDistance) {
        smallestDistance = distance;
        nearestIndex = index;
      }
    }

    setMobileActiveIndex((current) => (current === nearestIndex ? current : nearestIndex));
  }, [filteredMoodProducts.length]);

  const scheduleMobileActiveSync = useCallback(() => {
    if (typeof window === "undefined") return;

    if (mobileScrollFrameRef.current !== null) {
      window.cancelAnimationFrame(mobileScrollFrameRef.current);
    }

    mobileScrollFrameRef.current = window.requestAnimationFrame(() => {
      mobileScrollFrameRef.current = null;
      syncMobileActiveCard();
    });
  }, [syncMobileActiveCard]);

  const handleMobileCarouselScroll = useCallback(() => {
    scheduleMobileActiveSync();
  }, [scheduleMobileActiveSync]);

  const scrollMobileCardIntoView = useCallback((index: number) => {
    const nextIndex = Math.max(0, Math.min(index, filteredMoodProducts.length - 1));
    const nextCard = mobileCarouselCardRefs.current[nextIndex];
    if (!nextCard) return;

    nextCard.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    setMobileActiveIndex(nextIndex);
  }, [filteredMoodProducts.length]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    return () => {
      if (mobileScrollFrameRef.current !== null) {
        window.cancelAnimationFrame(mobileScrollFrameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShowOpeningIntro(false);
      return undefined;
    }

    const introTimer = window.setTimeout(() => {
      setShowOpeningIntro(false);
    }, 1850);

    return () => window.clearTimeout(introTimer);
  }, []);

  useEffect(() => {
    setMobileActiveIndex(0);
    mobileCarouselRef.current?.scrollTo({ left: 0, behavior: "auto" });
    scheduleMobileActiveSync();
  }, [filteredMoodProducts.length, scheduleMobileActiveSync, selectedMood]);

  const handleSearch = useCallback((event: FormEvent<HTMLFormElement>) => {
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

  const handleShopSummerSet = useCallback(async () => {
    setAddingSummerSet(true);

    try {
      for (const item of SUMMER_COLLECTION_PRODUCTS) {
        const response = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: item.productId,
            quantity: 1,
            size: item.defaultSize,
            color: item.defaultColor,
          }),
        });

        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          throw new Error(data?.error || `Unable to add ${item.name}.`);
        }
      }

      window.dispatchEvent(new Event("cart:changed"));
      showToast("Full summer set added to cart.", "success");
      router.push("/cart");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Unable to add the full set right now.", "error");
    } finally {
      setAddingSummerSet(false);
    }
  }, [router]);

  return (
    <MotionConfig reducedMotion="user">
    <LayoutGroup id="storefront-handoff">
    <>
    <AnimatePresence>
      {showOpeningIntro ? <StorefrontOpeningOverlay /> : null}
    </AnimatePresence>
    <motion.main className="min-h-screen overflow-hidden bg-[#F7F7F4] pb-24 text-[#171513] md:pb-0">
      <section className="border-b border-[#DDDAD2] bg-[#F7F7F4] px-4 pt-[72px] sm:px-6 md:px-10">
        <div className="mx-auto grid w-full max-w-[92rem] gap-6 py-6 lg:grid-cols-[0.88fr_1.12fr] lg:items-stretch lg:py-8">
          <motion.div
            initial="hidden"
            animate="show"
            variants={heroStagger}
            className="flex min-w-0 flex-col justify-between gap-8 lg:min-h-[650px]"
          >
            <div>
              <motion.div
                variants={fadeUp}
                className="mx-auto w-full max-w-[20rem] sm:max-w-[24rem] lg:max-w-[30rem]"
              >
                <h1 className="sr-only">BOUT</h1>
                <p className="sr-only">
                  Quiet luxury layers, sharp daily pieces, and polished essentials ready to shop.
                </p>
                <motion.div
                  layoutId="storefront-shared-shell"
                  data-testid="hero-storefront-shared"
                  className="relative aspect-[1.44/1] w-full overflow-hidden"
                  transition={{ layout: { duration: 0.68, ease: easeOut } }}
                >
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-[10%] top-[12%] h-[72%] rounded-full bg-[radial-gradient(circle,rgba(216,192,138,0.34),rgba(216,192,138,0.16)_44%,transparent_76%)] blur-3xl"
                  />
                  <div
                    className="relative h-full w-full [filter:drop-shadow(0_22px_42px_rgba(168,121,53,0.16))]"
                  >
                    <Image
                      src={withPublicAssetVersion("/uploads/boutique-storefront-home.webp")}
                      alt="BOUT boutique storefront illustration"
                      fill
                      priority
                      sizes="(max-width: 640px) 76vw, (max-width: 1024px) 24rem, 30rem"
                      className="object-contain object-center"
                    />
                  </div>
                </motion.div>
              </motion.div>

              <motion.form
                variants={fadeUp}
                onSubmit={handleSearch}
                whileHover={{ y: -2 }}
                whileFocus={{ y: -2 }}
                className="relative mt-7 min-h-[58px] w-full max-w-[22rem] min-w-0 overflow-hidden rounded-lg border border-[#CECAC1] bg-white shadow-[0_18px_50px_rgba(23,21,19,0.08)] sm:max-w-2xl"
              >
                <Search className="pointer-events-none absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-[#725D2C]" strokeWidth={1.6} />
                <motion.span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-1 left-0 z-0 w-16 rounded-full bg-[linear-gradient(90deg,transparent,rgba(216,192,138,0.30),transparent)] opacity-80"
                  initial={{ x: "-160%" }}
                  whileInView={{ x: "920%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.4, ease: "easeInOut" }}
                />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  aria-label="Search products"
                  placeholder="Search jackets, denim, loafers..."
                  className="relative z-10 h-14 w-full min-w-0 border-0 bg-transparent pl-12 pr-24 text-base text-[#171513] shadow-none outline-none placeholder:text-[#77716A]"
                  style={{ minWidth: 0, background: "transparent", border: 0, boxShadow: "none" }}
                />
                <motion.button
                  type="submit"
                  whileTap={{ scale: 0.94 }}
                  className="absolute right-2 top-1.5 z-20 inline-flex h-11 min-h-[44px] min-w-[44px] shrink-0 items-center justify-center gap-1.5 rounded-full bg-[#171513] px-4 text-sm text-[#F8F7F2] transition hover:bg-[#725D2C]"
                  style={{ backgroundColor: "#171513", color: "#F8F7F2", borderColor: "#171513" }}
                >
                  <span>Find</span>
                  <AnimatedArrow className="h-3.5 w-3.5" />
                </motion.button>
              </motion.form>

              <motion.div variants={fadeUp} className="mt-5 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none]">
                {SHOPPING_MOODS.map((mood) => (
                  <motion.button
                    key={mood.value}
                    type="button"
                    onClick={() => selectMood(mood.value)}
                    whileTap={{ scale: 0.96 }}
                    className={`relative isolate min-h-[42px] shrink-0 overflow-hidden rounded-full border px-4 text-sm transition ${
                      selectedMood === mood.value
                        ? "border-[#171513] text-[#F8F7F2]"
                        : "border-[#D5D1C8] bg-white text-[#3F3B36] hover:border-[#171513]"
                    }`}
                    style={selectedMood === mood.value ? { color: "#F8F7F2" } : undefined}
                  >
                    {selectedMood === mood.value ? (
                      <motion.span
                        layoutId="hero-mood-active"
                        className="absolute inset-0 rounded-full bg-[#171513]"
                        transition={{ type: "spring", stiffness: 440, damping: 34 }}
                      />
                    ) : null}
                    <span className="relative z-10" style={selectedMood === mood.value ? { color: "#F8F7F2" } : undefined}>
                      {mood.label}
                    </span>
                  </motion.button>
                ))}
              </motion.div>

              <motion.div
                variants={fadeUp}
                className="mt-4 hidden rounded-lg border border-[#DEDAD2] bg-[#F7F7F4]/78 p-3 shadow-[0_18px_44px_rgba(23,21,19,0.06)] sm:block"
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#725D2C]">
                    {activeMood.label}
                  </p>
                  <Link
                    href={activeMood.href}
                    className="inline-flex min-h-[34px] items-center gap-1.5 rounded-full border border-[#D5D1C8] bg-white px-3 text-xs text-[#171513] transition hover:border-[#171513]"
                  >
                    View
                    <ChevronRight className="h-3.5 w-3.5" strokeWidth={1.5} />
                  </Link>
                </div>
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={`hero-${selectedMood}`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.28, ease: easeOut }}
                    className="-mx-1 flex snap-x gap-3 overflow-x-auto px-1 pb-1 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 xl:grid-cols-3 [&::-webkit-scrollbar]:hidden"
                  >
                    {moodProducts.slice(0, 6).map((product) => (
                      <HeroMoodProductCard key={product._id} product={product} className="w-[11.75rem] shrink-0 snap-start sm:w-auto sm:shrink" />
                    ))}
                  </motion.div>
                </AnimatePresence>
              </motion.div>

              <motion.section variants={imageReveal} className="sm:hidden">
                <div className="relative mt-5 overflow-hidden rounded-[28px] border border-[#D7D1C7] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.92),rgba(247,244,238,0.98)_48%,rgba(238,233,225,1)_100%)] p-4 shadow-[0_20px_56px_rgba(23,21,19,0.08)]">
                  <motion.div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-4 top-0 h-24 rounded-full bg-[radial-gradient(circle,rgba(216,192,138,0.28),transparent_72%)] blur-2xl"
                    initial={{ opacity: 0.45, scale: 0.94 }}
                    animate={{ opacity: 0.8, scale: 1.06 }}
                    transition={{ duration: 1.3, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
                  />

                  <div className="relative z-10 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-[#725D2C]">
                        {activeMood.label}
                      </p>
                      <h2 className="mt-2 font-serif text-[2rem] font-light leading-none text-[#171513]">
                        Swipe the edit.
                      </h2>
                      <p className="mt-3 max-w-[15rem] text-sm leading-6 text-[#5A5650]">
                        {selectedMood === "all"
                          ? `Browse all ${filteredMoodProducts.length} pieces in the same card style used on the Shop page.`
                          : `${filteredMoodProducts.length} ${activeMood.label.toLowerCase()} pieces, ready to swipe left and right.`}
                      </p>
                    </div>

                    <Link
                      href={activeMood.href}
                      className="inline-flex min-h-[42px] shrink-0 items-center gap-1.5 rounded-full border border-[#D5D1C8] bg-white/80 px-4 text-[10px] uppercase tracking-[0.18em] text-[#171513] shadow-[0_10px_30px_rgba(23,21,19,0.06)] transition hover:border-[#171513]"
                    >
                      Open
                      <ChevronRight className="h-3.5 w-3.5" strokeWidth={1.5} />
                    </Link>
                  </div>

                  {filteredMoodProducts.length ? (
                    <>
                      <div className="relative z-10 mt-5">
                        <div className="mb-4 flex items-center gap-3">
                          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#E4DED3]">
                            <motion.div
                              className="h-full rounded-full bg-[#171513]"
                              animate={{ width: `${((mobileActiveIndex + 1) / filteredMoodProducts.length) * 100}%` }}
                              transition={{ duration: 0.34, ease: easeOut }}
                            />
                          </div>
                          <span className="shrink-0 text-[10px] uppercase tracking-[0.18em] text-[#725D2C]">
                            {mobileActiveIndex + 1} / {filteredMoodProducts.length}
                          </span>
                        </div>

                        <div className="relative -mx-4">
                          <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-8 bg-[linear-gradient(90deg,rgba(247,244,238,1),rgba(247,244,238,0))]" />
                          <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-8 bg-[linear-gradient(270deg,rgba(247,244,238,1),rgba(247,244,238,0))]" />

                          <AnimatePresence mode="wait" initial={false}>
                            <motion.div
                              key={`mobile-carousel-${selectedMood}`}
                              initial={{ opacity: 0, x: 16 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -16 }}
                              transition={{ duration: 0.34, ease: easeOut }}
                            >
                              <div
                                ref={mobileCarouselRef}
                                onScroll={handleMobileCarouselScroll}
                                className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                              >
                                {filteredMoodProducts.map((product, index) => (
                                  <motion.div
                                    key={product._id}
                                    ref={(node) => {
                                      mobileCarouselCardRefs.current[index] = node;
                                    }}
                                    animate={
                                      mobileActiveIndex === index
                                        ? { opacity: 1, scale: 1, y: 0 }
                                        : { opacity: 0.82, scale: 0.965, y: 8 }
                                    }
                                    transition={{ duration: 0.28, ease: easeOut }}
                                    className="w-[82vw] max-w-[22rem] shrink-0 snap-center"
                                  >
                                    <ProductCard product={product} disableMediaCarousel className="h-full" />
                                  </motion.div>
                                ))}
                              </div>
                            </motion.div>
                          </AnimatePresence>
                        </div>
                      </div>

                      <div className="relative z-10 mt-3 flex items-center justify-between gap-3">
                        <p className="text-xs text-[#6B655E]">
                          Swipe left or right to move through products.
                        </p>

                        {filteredMoodProducts.length > 1 ? (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => scrollMobileCardIntoView(mobileActiveIndex - 1)}
                              disabled={mobileActiveIndex === 0}
                              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D5D1C8] bg-white/80 text-[#171513] transition disabled:cursor-not-allowed disabled:opacity-35"
                              aria-label="Show previous product"
                            >
                              <ChevronRight className="h-4 w-4 rotate-180" strokeWidth={1.5} />
                            </button>
                            <button
                              type="button"
                              onClick={() => scrollMobileCardIntoView(mobileActiveIndex + 1)}
                              disabled={mobileActiveIndex === filteredMoodProducts.length - 1}
                              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D5D1C8] bg-white/80 text-[#171513] transition disabled:cursor-not-allowed disabled:opacity-35"
                              aria-label="Show next product"
                            >
                              <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
                            </button>
                          </div>
                        ) : null}
                      </div>
                    </>
                  ) : (
                    <div className="relative z-10 mt-5 rounded-[24px] border border-[#D9D4CA] bg-white/80 p-5 text-sm leading-6 text-[#5A5650]">
                      No pieces are available in this category yet. Use the `Open` button to browse the full collection page.
                    </div>
                  )}
                </div>
              </motion.section>
            </div>

            <motion.div variants={fadeUp} className="grid grid-cols-2 overflow-hidden rounded-lg border border-[#D5D1C8] bg-white sm:grid-cols-4">
              {QUICK_DEPARTMENTS.slice(0, 4).map((category) => (
                <Link
                  key={category.slug}
                  href={category.href}
                  className="group border-b border-r border-[#E2DFD8] p-4 transition hover:bg-[#F0EFEA] sm:border-b-0"
                >
                  <p className="font-serif text-2xl font-light leading-none text-[#171513]">{category.short}</p>
                  <p className="mt-2 text-sm text-[#69645E]">{categoryCounts.get(category.slug) || "Shop"} pieces</p>
                  <motion.span
                    className="mt-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#D5D1C8] text-[#171513] transition group-hover:border-[#171513]"
                    whileHover={{ scale: 1.08 }}
                  >
                    <motion.span
                      className="inline-flex"
                    >
                      <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
                    </motion.span>
                  </motion.span>
                </Link>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="show"
            variants={imageReveal}
            className="hidden min-w-0 gap-3 sm:grid sm:grid-cols-[1fr_0.45fr]"
          >
            <Link href="/lookbook" className="group relative min-h-[31rem] overflow-hidden rounded-lg bg-[#171513] lg:min-h-[650px]">
              <motion.div
                className="absolute inset-0"
                initial={{ scale: 1.035, x: -10 }}
                animate={{ scale: 1, x: 0 }}
                transition={{ duration: 1.2, ease: easeOut }}
              >
                <Image
                  src={withPublicAssetVersion("/uploads/collections.jpg")}
                  alt="Black editorial outerwear look"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 56vw"
                  className="object-cover transition duration-700 group-hover:scale-[1.03]"
                />
              </motion.div>
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(23,21,19,0.03)_0%,rgba(23,21,19,0.12)_44%,rgba(23,21,19,0.78)_100%)]" />
              <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute -left-1/2 top-0 h-full w-1/3 -skew-x-12 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.22),transparent)] mix-blend-screen"
                initial={{ x: "0%" }}
                animate={{ x: "520%" }}
                transition={{ duration: 1.8, ease: "easeInOut" }}
              />
              <div className="absolute inset-x-5 bottom-5 text-[#F8F7F2] sm:inset-x-7 sm:bottom-7">
                <p className="max-w-md font-serif text-4xl font-light leading-none sm:text-5xl">
                  The refined daily edit.
                </p>
                <span className="mt-5 inline-flex min-h-[44px] items-center gap-2 rounded-full bg-[#F8F7F2] px-5 py-3 text-sm text-[#171513] transition group-hover:bg-[#D8C08A]">
                  Open lookbook
                  <AnimatedArrow />
                </span>
              </div>
            </Link>

            <motion.div
              initial="hidden"
              animate="show"
              variants={heroStagger}
              className="hidden min-w-0 sm:flex sm:flex-col"
            >
              <div className="mb-3 flex items-center justify-between gap-2 rounded-lg border border-[#D5D1C8] bg-white px-3 py-2">
                <p className="truncate text-[11px] uppercase tracking-[0.16em] text-[#725D2C]">
                  {activeMood.label}
                </p>
                <Link
                  href={activeMood.href}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#D5D1C8] text-[#171513] transition hover:border-[#171513]"
                  aria-label={`View ${activeMood.label}`}
                >
                  <ChevronRight className="h-3.5 w-3.5" strokeWidth={1.5} />
                </Link>
              </div>
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={`hero-rail-${selectedMood}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.28, ease: easeOut }}
                  className="grid gap-3"
                >
                  {heroRailProducts.map((product) => (
                    <HeroMoodProductCard key={product._id} product={product} />
                  ))}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <SummerCollectionSection addSetBusy={addingSummerSet} onShopFullSet={handleShopSummerSet} />

      <BoutiqueReelFeature />

      <motion.section
        variants={sectionReveal}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.18 }}
        className="bg-white px-4 py-10 [content-visibility:auto] [contain-intrinsic-size:760px] sm:px-6 sm:py-14 md:px-10"
      >
        <div className="mx-auto w-full max-w-[92rem]">
          <SectionIntro
            title="Departments"
            copy="A clear starting point for fast browsing on small screens and calm comparison on desktop."
            action={{ label: "View all", href: "/collection" }}
          />
          <motion.div variants={heroStagger} className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-[#D5D1C8] bg-[#D5D1C8] lg:grid-cols-6">
            {QUICK_DEPARTMENTS.map((category) => (
              <motion.div key={category.slug} variants={tileReveal} whileHover={{ y: -4 }}>
                <Link href={category.href} className="group block bg-white">
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#E9E7E1]">
                    <Image
                      src={category.image}
                      alt={category.title}
                      fill
                      sizes="(max-width: 768px) 50vw, 16vw"
                      className="object-cover transition duration-700 group-hover:scale-[1.05]"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-serif text-2xl font-light leading-none text-[#171513]">{category.short}</h3>
                    <p className="mt-2 text-sm text-[#69645E]">{categoryCounts.get(category.slug) || "Shop"} pieces</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        variants={sectionReveal}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.16 }}
        className="bg-[#171513] px-4 py-10 text-[#F8F7F2] [content-visibility:auto] [contain-intrinsic-size:900px] sm:px-6 sm:py-14 md:px-10"
      >
        <div className="mx-auto w-full max-w-[92rem]">
          <SectionIntro
            title="Fresh drop"
            copy="Select a mood, scan the pieces, and move directly to the product or cart."
            action={{ label: "Shop all", href: "/shop" }}
            inverted
          />

          <motion.div variants={fadeUp} className="mb-6 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none]">
            {SHOPPING_MOODS.map((mood) => (
              <motion.button
                key={mood.value}
                type="button"
                onClick={() => selectMood(mood.value)}
                whileTap={{ scale: 0.96 }}
                className={`relative isolate min-h-[42px] shrink-0 overflow-hidden rounded-full border px-4 text-sm transition ${
                  selectedMood === mood.value
                    ? "border-[#D8C08A] text-[#171513]"
                    : "border-white/[0.16] bg-white/5 text-[#E9E4D8] hover:border-[#D8C08A]"
                }`}
                style={selectedMood === mood.value ? { color: "#171513" } : undefined}
              >
                {selectedMood === mood.value ? (
                  <motion.span
                    layoutId="fresh-mood-active"
                    className="absolute inset-0 rounded-full bg-[#D8C08A]"
                    transition={{ type: "spring", stiffness: 440, damping: 34 }}
                  />
                ) : null}
                <span className="relative z-10" style={selectedMood === mood.value ? { color: "#171513" } : undefined}>
                  {mood.label}
                </span>
              </motion.button>
            ))}
          </motion.div>

          <AnimatePresence mode="popLayout">
            <motion.div
              key={selectedMood}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.34, ease: easeOut }}
              className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-4 [scrollbar-width:none] sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-4 xl:grid-cols-4 lg:overflow-visible lg:px-0"
            >
              {moodProducts.slice(0, 8).map((product) => (
                <ProductTile
                  key={product._id}
                  product={product}
                  actionBusy={addingId === product._id}
                  onAction={handleProductAction}
                  dark
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.section>

      <motion.section
        variants={sectionReveal}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.16 }}
        className="bg-[#F7F7F4] px-4 py-10 [content-visibility:auto] [contain-intrinsic-size:900px] sm:px-6 sm:py-14 md:px-10"
      >
        <div className="mx-auto w-full max-w-[92rem]">
          <SectionIntro
            title="Shop the day"
            copy="Four practical paths for getting dressed without opening a menu first."
          />
          <motion.div variants={heroStagger} className="grid gap-3 lg:grid-cols-4">
            {STYLE_PATHS.map((path) => (
              <motion.div key={path.title} variants={tileReveal} whileHover={{ y: -6 }}>
                <Link
                  href={path.href}
                  className="group relative block min-h-[24rem] overflow-hidden rounded-lg bg-[#171513] text-[#F8F7F2] lg:min-h-[34rem]"
                >
                  <Image
                    src={path.image}
                    alt={path.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 25vw"
                    className="object-cover transition duration-700 group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(23,21,19,0.05),rgba(23,21,19,0.78))]" />
                  <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                    <p className="text-sm text-[#D8C08A]">{path.copy}</p>
                    <div className="mt-3 flex items-end justify-between gap-4">
                      <h3 className="max-w-xs font-serif text-4xl font-light leading-none">
                        {path.title}
                      </h3>
                      <motion.span
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F8F7F2] text-[#171513]"
                        whileHover={{ scale: 1.08 }}
                      >
                        <motion.span
                          className="inline-flex"
                        >
                          <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
                        </motion.span>
                      </motion.span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        variants={sectionReveal}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.18 }}
        className="border-y border-[#DDDAD2] bg-white px-4 py-10 [content-visibility:auto] [contain-intrinsic-size:760px] sm:px-6 sm:py-14 md:px-10"
      >
        <div className="mx-auto grid w-full max-w-[92rem] gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
          <div>
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#171513] text-[#D8C08A]">
              <Sparkles className="h-5 w-5" strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-4xl font-light leading-none text-[#171513] sm:text-5xl lg:text-6xl">
              The pieces with presence.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-8 text-[#5A5650]">
              Balanced layers, clean textures, and prices visible before a shopper commits.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href="/discover" className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-[#171513] px-6 py-3 text-sm text-[#F8F7F2] transition hover:bg-[#725D2C]">
                Discover
                <AnimatedArrow />
              </Link>
              <Link href="/wishlist" className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-[#D5D1C8] bg-white px-6 py-3 text-sm text-[#171513] transition hover:border-[#171513]">
                <Heart className="h-4 w-4" strokeWidth={1.5} />
                Wishlist
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {(spotlightProducts.length ? spotlightProducts : editProducts).slice(0, 3).map((product) => (
              <ProductTile
                key={product._id}
                product={product}
                actionBusy={addingId === product._id}
                onAction={handleProductAction}
              />
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section
        variants={sectionReveal}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.18 }}
        className="bg-[#F7F7F4] px-4 py-10 [content-visibility:auto] [contain-intrinsic-size:720px] sm:px-6 sm:py-14 md:px-10"
      >
        <div className="mx-auto grid w-full max-w-[92rem] gap-6 lg:grid-cols-[1fr_0.92fr] lg:items-start">
          <div className="grid overflow-hidden rounded-lg border border-[#D5D1C8] bg-white sm:grid-cols-3">
            {SERVICE_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="border-b border-[#E2DFD8] p-5 sm:border-b-0 sm:border-r sm:last:border-r-0">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F0EFEA] text-[#725D2C]">
                    <Icon className="h-5 w-5" strokeWidth={1.5} />
                  </span>
                  <h3 className="mt-5 text-base font-medium text-[#171513]">{item.label}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#5A5650]">{item.detail}</p>
                </div>
              );
            })}
          </div>

          <div className="rounded-lg bg-[#171513] p-5 text-[#F8F7F2] sm:p-7">
            <div className="flex flex-wrap gap-2">
              {[
                { label: "Card or COD", icon: CreditCard },
                { label: "Order tracking", icon: CheckCircle2 },
                { label: "New drops", icon: Sparkles },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <span key={item.label} className="inline-flex min-h-[36px] items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.06] px-3 text-sm text-[#E9E4D8]">
                    <Icon className="h-3.5 w-3.5 text-[#D8C08A]" strokeWidth={1.5} />
                    {item.label}
                  </span>
                );
              })}
            </div>
            <h2 className="mt-7 font-serif text-4xl font-light leading-none sm:text-5xl">
              Get the next edit first.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-[#C9C5B8]">
              New pieces, restocks, and quiet outfit notes.
            </p>
            <div className="mt-6 rounded-lg bg-[#F8F7F2] p-3 text-[#171513] sm:p-4">
              <NewsletterForm />
            </div>
          </div>
        </div>
      </motion.section>
    </motion.main>
    </>
    </LayoutGroup>
    </MotionConfig>
  );
}
