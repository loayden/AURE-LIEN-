import { withPublicAssetVersion } from "@/lib/publicAsset";
import products from "@/lib/productsData";
import type { Product } from "@/lib/types";
import {
  ArrowRight,
  BadgeCheck,
  CreditCard,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const HERO_SHORTCUTS = [
  { label: "New Arrivals", href: "/shop" },
  { label: "Jackets & Coats", href: "/jackets-coats" },
  { label: "Denim", href: "/denim" },
  { label: "Footwear", href: "/footwear" },
];

const HOME_MODULES = [
  {
    eyebrow: "New Arrival Focus",
    title: "Start with the pieces people open first.",
    description: "Fresh product, quick category access, and a calmer path into the collection.",
    href: "/shop",
    image: withPublicAssetVersion("/uploads/main.jpg"),
  },
  {
    eyebrow: "Outerwear",
    title: "Jackets and coats with stronger visual presence.",
    description: "A cleaner way to move into the most visual part of the store.",
    href: "/jackets-coats",
    image: withPublicAssetVersion("/uploads/Jackets & Coats.jpg"),
  },
  {
    eyebrow: "Denim & Pants",
    title: "Baggy, korean, and denim fits sorted fast.",
    description: "The most scanned silhouettes are easier to reach from the first scroll.",
    href: "/pants-denim",
    image: withPublicAssetVersion("/uploads/denim.jpg"),
  },
  {
    eyebrow: "Discover BOUT",
    title: "Move the brand story out of the buying path.",
    description: "The company, standards, and platform story now live in a separate discover page.",
    href: "/discover",
    image: withPublicAssetVersion("/uploads/collections.jpg"),
  },
];

const CATEGORY_SHOWCASE = [
  {
    title: "Jackets & Coats",
    description: "Layering pieces with stronger visual impact and easier first-click access.",
    href: "/jackets-coats",
    image: withPublicAssetVersion("/uploads/Jackets & Coats.jpg"),
  },
  {
    title: "Suits",
    description: "Tailored sets and sharper silhouettes for occasion and evening dressing.",
    href: "/suits",
    image: withPublicAssetVersion("/uploads/Suits.jpg"),
  },
  {
    title: "Shirts",
    description: "Everyday tops and polos that fit the store’s cleaner wardrobe mix.",
    href: "/shirts",
    image: withPublicAssetVersion("/uploads/main.jpg"),
  },
  {
    title: "Pants & Denim",
    description: "Baggy, korean, and denim edits grouped for easier browsing and faster choice.",
    href: "/pants-denim",
    image: withPublicAssetVersion("/uploads/denim.jpg"),
  },
  {
    title: "Footwear",
    description: "Sneakers, loafers, and lace-ups kept close to the main discovery path.",
    href: "/footwear",
    image: withPublicAssetVersion("/uploads/Sneakers.jpg"),
  },
  {
    title: "Accessories",
    description: "Belts, bags, sunglasses, and finishing details without extra navigation noise.",
    href: "/accessories",
    image: withPublicAssetVersion("/uploads/Bags & Wallets.jpg"),
  },
];

const SHOPPING_EDITS = [
  {
    eyebrow: "Easy Start",
    title: "If you want the fast answer, begin with the full collection.",
    description: "A direct path into the live assortment for people who already know they want to shop.",
    href: "/collection",
    image: withPublicAssetVersion("/uploads/homepage.jpg"),
  },
  {
    eyebrow: "Daily Rotation",
    title: "Knits, trousers, and shirts that feel easy every day.",
    description: "A softer entry for users who want wearable, repeatable pieces without overthinking.",
    href: "/knitwear",
    image: withPublicAssetVersion("/uploads/collections.jpg"),
  },
  {
    eyebrow: "Finish the Look",
    title: "Footwear and accessories kept close to the top of the journey.",
    description: "The supporting categories are visible earlier, so the homepage feels complete.",
    href: "/accessories",
    image: withPublicAssetVersion("/uploads/footwear.jpg"),
  },
];

const TRUST_POINTS = [
  {
    title: "Secure checkout",
    description: "Protected checkout flow with clear totals, saved progress, and less friction on return visits.",
    icon: ShieldCheck,
  },
  {
    title: "Order review",
    description: "Orders stay pending until payment or fulfillment is confirmed by the store.",
    icon: CreditCard,
  },
  {
    title: "Faster mobile shopping",
    description: "The first screen is now structured for category discovery, quick scanning, and easier tapping.",
    icon: Sparkles,
  },
  {
    title: "Order confidence",
    description: "Delivery, support, and post-purchase expectations are surfaced earlier to build trust.",
    icon: Truck,
  },
];

const FEATURED_PRODUCT_IDS = [
  "p-jc-016",
  "p-jc-017",
  "p-sh-003",
  "p-kn-004",
  "p-denim-002",
  "p-korean-002",
  "p-baggy-001",
  "p-su-001",
];

const SECONDARY_PRODUCT_IDS = [
  "p-jc-018",
  "p-sh-005",
  "p-kn-005",
  "p-denim-001",
];

const allProducts = products as Product[];
const productsById = new Map<string, Product>(
  allProducts.map((product) => [product._id, product])
);

function pickProducts(ids: string[]) {
  return ids
    .map((id) => productsById.get(id))
    .filter((product): product is Product => product !== undefined);
}

function formatCategoryLabel(category: string) {
  return category
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" / ");
}

function formatSizeRange(sizes: string[]) {
  if (!sizes.length) return "Open";
  if (sizes.length === 1) return sizes[0];
  return `${sizes[0]} - ${sizes[sizes.length - 1]}`;
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-EG").format(price);
}

function HomeProductTile({ product }: { product: Product }) {
  const image = product.images[0] || withPublicAssetVersion("/uploads/main.jpg");

  return (
    <Link
      href={`/product/${encodeURIComponent(product._id)}`}
      className="glass-panel group flex h-full flex-col rounded-[24px] transition-transform duration-300 hover:-translate-y-1"
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <Image
          src={image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-transparent" />
        <div className="absolute left-3 top-3 rounded-full border border-white/10 bg-black/30 px-3 py-1.5 backdrop-blur-md">
          <span className="text-[9px] uppercase tracking-[0.24em] text-white/70">
            {formatCategoryLabel(product.category)}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between gap-5 p-4 sm:p-5">
        <div className="space-y-2">
          <h3
            className="font-light text-white"
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(1.05rem, 2vw, 1.4rem)",
              lineHeight: 1.08,
            }}
          >
            {product.name}
          </h3>
          <p className="body-copy max-w-[28ch]">
            {product.description || "Refined wardrobe staple with a cleaner silhouette and easier styling range."}
          </p>
        </div>

        <div className="flex items-end justify-between gap-3 border-t border-white/[0.06] pt-4">
          <div>
            <p className="eyebrow mb-2">Price</p>
            <p className="text-[1.05rem] font-light tracking-[0.06em] text-white sm:text-[1.15rem]">
              EGP <span className="text-gold">{formatPrice(product.price)}</span>
            </p>
          </div>
          <div className="text-right">
            <p className="eyebrow mb-2">Sizes</p>
            <p className="body-copy body-copy-strong whitespace-nowrap">
              {formatSizeRange(product.size)}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

function CategoryCard({
  title,
  description,
  href,
  image,
}: (typeof CATEGORY_SHOWCASE)[number]) {
  return (
    <Link
      href={href}
      className="dark-panel group block overflow-hidden rounded-[26px] transition-transform duration-300 hover:-translate-y-1"
    >
      <div className="relative aspect-[5/6] overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
          <p className="eyebrow mb-3">Shop Faster</p>
          <h3
            className="mb-3 font-light text-white"
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(1.15rem, 2.6vw, 1.65rem)",
              lineHeight: 1.05,
            }}
          >
            {title}
          </h3>
          <p className="body-copy max-w-[26ch] text-white/50">{description}</p>
        </div>
      </div>
    </Link>
  );
}

function HomeModule({
  eyebrow,
  title,
  description,
  href,
  image,
}: (typeof HOME_MODULES)[number]) {
  return (
    <Link
      href={href}
      className="dark-panel group block overflow-hidden rounded-[24px] transition-transform duration-300 hover:-translate-y-1"
    >
      <div className="relative min-h-[220px] overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 25vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />
        <div className="relative z-10 flex h-full flex-col justify-end p-5 sm:p-6">
          <p className="eyebrow mb-3">{eyebrow}</p>
          <h3
            className="mb-3 font-light text-white"
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(1.1rem, 2.4vw, 1.55rem)",
              lineHeight: 1.06,
            }}
          >
            {title}
          </h3>
          <p className="body-copy max-w-[28ch] text-white/50">{description}</p>
        </div>
      </div>
    </Link>
  );
}

function ShoppingEdit({
  eyebrow,
  title,
  description,
  href,
  image,
}: (typeof SHOPPING_EDITS)[number]) {
  return (
    <Link
      href={href}
      className="warm-panel group block overflow-hidden rounded-[28px] transition-transform duration-300 hover:-translate-y-1"
    >
      <div className="relative min-h-[320px] overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 1024px) 100vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0908] via-[#0A0908]/55 to-black/10" />
        <div className="relative z-10 flex h-full flex-col justify-between p-6 sm:p-7">
          <p className="eyebrow">{eyebrow}</p>
          <div>
            <h3
              className="mb-3 font-light text-white"
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(1.35rem, 3vw, 2rem)",
                lineHeight: 1.02,
              }}
            >
              {title}
            </h3>
            <p className="body-copy max-w-[28ch] text-white/52">{description}</p>
            <span className="mt-5 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-gold">
              Open Edit
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function TrustCard({
  title,
  description,
  icon: Icon,
}: (typeof TRUST_POINTS)[number]) {
  return (
    <div className="glass-panel rounded-[22px] p-5 sm:p-6">
      <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-[rgba(201,168,106,0.14)] text-gold">
        <Icon className="h-5 w-5" strokeWidth={1.4} />
      </div>
      <h3
        className="mb-3 font-light text-white"
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: "clamp(1.15rem, 2.4vw, 1.55rem)",
          lineHeight: 1.06,
        }}
      >
        {title}
      </h3>
      <p className="body-copy">{description}</p>
    </div>
  );
}

export default function HomePage() {
  const featuredProducts = pickProducts(FEATURED_PRODUCT_IDS);
  const secondaryProducts = pickProducts(SECONDARY_PRODUCT_IDS);

  return (
    <main className="liquid-page pb-20">
      <section className="border-b border-white/[0.06] bg-[#110d0b]">
        <div className="page-wrap flex flex-wrap items-center justify-between gap-3 py-3">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {[
              "Protected checkout",
              "Refined menswear",
              "Faster category discovery",
            ].map((item) => (
              <span
                key={item}
                className="inline-flex min-h-[36px] items-center rounded-full border border-white/10 bg-white/[0.03] px-3 text-[9px] uppercase tracking-[0.24em] text-white/58"
              >
                {item}
              </span>
            ))}
          </div>
          <Link href="/discover" className="text-[10px] uppercase tracking-[0.24em] text-gold">
            Discover BOUT
          </Link>
        </div>
      </section>

      <section className="relative isolate overflow-hidden">
        <Image
          src={withPublicAssetVersion("/uploads/homepage.jpg")}
          alt="BOUT homepage hero"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,9,8,0.94)_0%,rgba(10,9,8,0.72)_42%,rgba(10,9,8,0.48)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(201,168,106,0.18),transparent_38%)]" />

        <div className="page-wrap relative z-10 flex min-h-[calc(100svh-58px)] items-center py-16 sm:py-20 lg:py-24">
          <div className="max-w-3xl">
            <p className="eyebrow mb-5">Homepage Refresh</p>
            <h1
              className="title-display max-w-4xl text-[clamp(2.7rem,8vw,6rem)] leading-[0.92]"
            >
              Shop menswear with less noise and more <em className="gold-italic">clarity</em>
            </h1>
            <p className="hero-body-copy mt-5 max-w-2xl text-white/62">
              The homepage now starts like a real shopping surface: clearer category access, faster product discovery, stronger checkout trust, and a separate discover page for the brand and platform story.
            </p>

            <form
              action="/search"
              className="mt-8 flex flex-col gap-3 rounded-[24px] border border-white/10 bg-[rgba(20,17,15,0.72)] p-3 backdrop-blur-xl sm:flex-row sm:items-center"
            >
              <input
                type="search"
                name="q"
                placeholder="Search jackets, denim, knitwear, loafers..."
                className="glass-input border-0 bg-transparent px-4 py-4 shadow-none focus:shadow-none"
              />
              <button type="submit" className="btn-gold w-full justify-center sm:w-auto">
                Search Store
              </button>
            </form>

            <div className="mt-5 flex flex-wrap gap-2.5">
              {HERO_SHORTCUTS.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="glass-sm inline-flex min-h-[44px] min-w-[44px] items-center rounded-full px-4 text-[10px] uppercase tracking-[0.22em] text-white/72 transition-colors hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-5 text-[10px] uppercase tracking-[0.24em] text-white/50">
              <span className="inline-flex items-center gap-2">
                <BadgeCheck className="h-3.5 w-3.5 text-gold" strokeWidth={1.5} />
                Curated assortment
              </span>
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5 text-gold" strokeWidth={1.5} />
                Trusted checkout
              </span>
              <span className="inline-flex items-center gap-2">
                <Truck className="h-3.5 w-3.5 text-gold" strokeWidth={1.5} />
                Mobile-ready browsing
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 -mt-10 px-4 sm:-mt-12 sm:px-6 md:px-10">
        <div className="page-wrap grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {HOME_MODULES.map((item) => (
            <HomeModule key={item.title} {...item} />
          ))}
        </div>
      </section>

      <section
        className="px-4 pt-16 sm:px-6 sm:pt-20 md:px-10"
        style={{ contentVisibility: "auto", containIntrinsicSize: "1px 1200px" }}
      >
        <div className="page-wrap">
          <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow mb-4">Shop By Department</p>
              <h2 className="title-display text-[clamp(2rem,4vw,3.5rem)]">
                Find what you need <em className="gold-italic">faster</em>
              </h2>
            </div>
            <p className="body-copy max-w-xl">
              The first shopping layer is now built around the categories users usually look for first, not around company explanation.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {CATEGORY_SHOWCASE.map((item) => (
              <CategoryCard key={item.title} {...item} />
            ))}
          </div>
        </div>
      </section>

      <section
        className="px-4 pt-16 sm:px-6 sm:pt-20 md:px-10"
        style={{ contentVisibility: "auto", containIntrinsicSize: "1px 1400px" }}
      >
        <div className="page-wrap">
          <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow mb-4">Popular Right Now</p>
              <h2 className="title-display text-[clamp(2rem,4vw,3.5rem)]">
                The pieces most likely to convert on the first <em className="gold-italic">visit</em>
              </h2>
            </div>
            <Link href="/shop" className="btn-ghost justify-center sm:justify-start">
              View Full Shop
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {featuredProducts.map((product) => (
              <HomeProductTile key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section
        className="px-4 pt-16 sm:px-6 sm:pt-20 md:px-10"
        style={{ contentVisibility: "auto", containIntrinsicSize: "1px 1000px" }}
      >
        <div className="page-wrap">
          <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow mb-4">Shopping Paths</p>
              <h2 className="title-display text-[clamp(2rem,4vw,3.4rem)]">
                Familiar homepage structure, but still distinctly <em className="gold-italic">BOUT</em>
              </h2>
            </div>
            <p className="body-copy max-w-xl">
              These entry points make the first scroll feel more like Amazon, Zara, or Alibaba in structure, while keeping the BOUT luxury tone intact.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {SHOPPING_EDITS.map((item) => (
              <ShoppingEdit key={item.title} {...item} />
            ))}
          </div>
        </div>
      </section>

      <section
        className="px-4 pt-16 sm:px-6 sm:pt-20 md:px-10"
        style={{ contentVisibility: "auto", containIntrinsicSize: "1px 900px" }}
      >
        <div className="page-wrap">
          <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow mb-4">Confidence Layer</p>
              <h2 className="title-display text-[clamp(2rem,4vw,3.4rem)]">
                Build trust before the cart, not after <em className="gold-italic">checkout</em>
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {["Protected flow", "Clear totals", "Faster mobile taps"].map((item) => (
                <span
                  key={item}
                  className="count-pill"
                  style={{ minHeight: 36, minWidth: 0, paddingInline: "0.85rem", paddingBlock: "0.45rem" }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {TRUST_POINTS.map((item) => (
              <TrustCard key={item.title} {...item} />
            ))}
          </div>
        </div>
      </section>

      <section
        className="px-4 pt-16 sm:px-6 sm:pt-20 md:px-10"
        style={{ contentVisibility: "auto", containIntrinsicSize: "1px 1000px" }}
      >
        <div className="page-wrap grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="warm-panel overflow-hidden rounded-[30px]">
            <div className="relative min-h-[360px]">
              <Image
                src={withPublicAssetVersion("/uploads/collections.jpg")}
                alt="Discover BOUT"
                fill
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,9,8,0.18),rgba(10,9,8,0.84))]" />
              <div className="relative z-10 flex h-full flex-col justify-end p-6 sm:p-8 md:p-10">
                <p className="eyebrow mb-4">Discover Page</p>
                <h2 className="title-display max-w-2xl text-[clamp(2rem,4vw,3.5rem)]">
                  The story now has its own place, so the homepage can focus on <em className="gold-italic">shopping</em>
                </h2>
                <p className="body-copy mt-4 max-w-xl text-white/58">
                  If someone wants to understand the company, standards, boutique platform angle, or the thinking behind the site, they can now do that in Discover without interrupting the buying journey.
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Link href="/discover" className="btn-gold justify-center">
                    Open Discover
                  </Link>
                  <Link href="/about" className="btn-ghost justify-center">
                    Brand About
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {secondaryProducts.map((product) => (
              <HomeProductTile key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
