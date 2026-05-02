import { getAllProducts } from "@/lib/getAllProducts";
import { withPublicAssetVersion } from "@/lib/publicAsset";
import type { Product } from "@/lib/types";
import {
  ArrowRight,
  BadgeCheck,
  ChevronRight,
  Clock3,
  Heart,
  Layers3,
  PackageCheck,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
  User,
  Zap,
} from "lucide-react";
import type { ComponentType } from "react";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

type IconType = ComponentType<{ className?: string; strokeWidth?: number }>;

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
const EDIT_IDS = [
  "p-jc-018",
  "p-sh-005",
  "p-kn-005",
  "p-denim-001",
  "p-jc-003",
  "p-jc-007",
  "p-jc-011",
  "p-jc-012",
];

const CATEGORY_LANES = [
  {
    title: "New arrivals",
    short: "New",
    href: "/shop",
    image: withPublicAssetVersion("/uploads/collections.jpg"),
    tokens: [],
    icon: Sparkles,
  },
  {
    title: "Jackets and coats",
    short: "Jackets",
    href: "/jackets-coats",
    image: withPublicAssetVersion("/uploads/Jackets & Coats.jpg"),
    tokens: ["jackets", "coats"],
    icon: Layers3,
  },
  {
    title: "Shirts and knits",
    short: "Shirts",
    href: "/shirts",
    image: withPublicAssetVersion("/uploads/shirts.jpg"),
    tokens: ["shirts", "knitwear"],
    icon: Star,
  },
  {
    title: "Pants and denim",
    short: "Pants",
    href: "/pants-denim",
    image: withPublicAssetVersion("/uploads/denim.jpg"),
    tokens: ["pants", "denim", "jeans", "korean"],
    icon: Zap,
  },
  {
    title: "Footwear",
    short: "Shoes",
    href: "/footwear",
    image: withPublicAssetVersion("/uploads/footwear.jpg"),
    tokens: ["sneakers", "boots", "loafers", "lace"],
    icon: ShoppingBag,
  },
  {
    title: "Accessories",
    short: "Finish",
    href: "/accessories",
    image: withPublicAssetVersion("/uploads/accessories.jpg"),
    tokens: ["accessories", "belts", "bags", "wallets", "sunglasses"],
    icon: Heart,
  },
] as const;

const SHOP_SHORTCUTS = [
  { label: "Cart", href: "/cart", icon: ShoppingBag },
  { label: "Wishlist", href: "/wishlist", icon: Heart },
  { label: "Orders", href: "/orders", icon: Clock3 },
  { label: "Account", href: "/account", icon: User },
] as const;

const SERVICE_ITEMS = [
  { label: "Protected checkout", detail: "Secure account and order flow", icon: ShieldCheck },
  { label: "Delivery in Egypt", detail: "Built for local shopping habits", icon: Truck },
  { label: "Easy returns", detail: "Clear exchanges and support", icon: PackageCheck },
  { label: "Verified catalog", detail: "Real products, direct paths", icon: BadgeCheck },
] as const;

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-EG", { maximumFractionDigits: 0 }).format(price);
}

function productImage(product: Product) {
  return product.images?.[0] || withPublicAssetVersion("/images/placeholder.svg");
}

function productLabel(product: Product) {
  return String(product.category ?? "")
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function productHref(product: Product) {
  return `/product/${encodeURIComponent(product._id)}`;
}

function pickProducts(products: Product[], ids: string[], count: number) {
  const byId = new Map(products.map((product) => [String(product._id), product]));
  const selected = ids
    .map((id) => byId.get(id))
    .filter((product): product is Product => Boolean(product));
  const selectedIds = new Set(selected.map((product) => product._id));
  const fallback = products.filter((product) => !selectedIds.has(product._id));
  return [...selected, ...fallback].slice(0, count);
}

function countByTokens(products: Product[], tokens: readonly string[]) {
  if (tokens.length === 0) return products.length;

  return products.filter((product) => {
    const category = String(product.category ?? "").toLowerCase();
    return tokens.some((token) => category.includes(token));
  }).length;
}

function stockText(product: Product) {
  if (typeof product.stock !== "number") return "Available";
  if (product.stock <= 0) return "Sold out";
  if (product.stock <= 3) return "Low stock";
  return "In stock";
}

function CommerceSearch() {
  return (
    <form
      action="/search"
      method="GET"
      className="flex min-h-[52px] w-full min-w-0 max-w-[calc(100vw-2rem)] items-center gap-3 overflow-hidden rounded-full border border-[#d8d0c3] bg-white px-4 shadow-[0_12px_34px_rgba(25,20,14,0.08)] lg:max-w-none"
      style={{ maxWidth: "calc(100vw - 2rem)" }}
    >
      <Search className="h-5 w-5 flex-shrink-0 text-[#8A7B68]" strokeWidth={1.65} />
      <input
        type="search"
        name="q"
        placeholder="Search jackets, denim, shoes..."
        aria-label="Search products"
        className="min-h-0 w-0 flex-1 border-0 bg-transparent px-0 py-0 text-base font-light tracking-[0.03em] text-[#16130f] shadow-none outline-none placeholder:text-[#77706a] focus:shadow-none"
        style={{
          background: "transparent",
          border: 0,
          boxShadow: "none",
          flex: "1 1 0%",
          minHeight: 0,
          width: 0,
        }}
      />
      <button
        type="submit"
        className="flex h-11 min-h-[44px] min-w-[44px] flex-shrink-0 items-center justify-center rounded-full border border-[#16130f] bg-[#16130f] text-[#FFF8EC] transition-colors hover:bg-[#3A332B]"
        style={{ backgroundColor: "#16130f", borderColor: "#16130f", color: "#FFF8EC" }}
        aria-label="Search"
      >
        <ArrowRight className="h-4 w-4" />
      </button>
    </form>
  );
}

function SectionHeading({
  title,
  copy,
  href,
  linkLabel = "View all",
}: {
  title: string;
  copy?: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-5 flex items-end justify-between gap-5 sm:mb-7">
      <div className="max-w-2xl">
        <h2 className="font-serif text-[clamp(2rem,5vw,4rem)] font-light leading-[0.95] tracking-[0.02em] text-[#24170F]">
          {title}
        </h2>
        {copy && (
          <p className="mt-3 max-w-xl text-sm leading-7 tracking-[0.035em] text-[#77685A] sm:text-[0.95rem]">
            {copy}
          </p>
        )}
      </div>

      {href && (
        <Link
          href={href}
          className="hidden min-h-[44px] items-center gap-2 rounded-full border border-[#cbbfadde] bg-white px-4 text-[10px] uppercase tracking-[0.2em] text-[#6F5D4B] transition-colors hover:border-[#8A7B68] hover:text-[#16130f] sm:inline-flex"
        >
          {linkLabel}
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      )}
    </div>
  );
}

function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const href = productHref(product);

  return (
    <article className="group flex min-w-[15.5rem] snap-start flex-col overflow-hidden rounded-lg border border-[#DED0BE] bg-white shadow-[0_18px_42px_rgba(49,33,22,0.09)] transition-transform duration-300 hover:-translate-y-1 sm:min-w-0">
      <Link href={href} className="block" aria-label={`View ${product.name}`}>
        <div className="relative aspect-[4/5] bg-[#ece6db]">
          <Image
            src={productImage(product)}
            alt={product.name}
            fill
            priority={priority}
            sizes="(max-width: 640px) 248px, (max-width: 1024px) 30vw, 20vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.035]"
          />
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-3 flex items-center justify-between gap-3 text-[10px] uppercase tracking-[0.16em]">
          <span className="text-[#8A7B68]">{productLabel(product) || "Catalog"}</span>
          <span className="text-[#7f776f]">{stockText(product)}</span>
        </div>

        <Link href={href} className="block">
          <h3 className="line-clamp-2 min-h-[3.2rem] font-serif text-[1.45rem] font-light leading-[1.08] tracking-[0.01em] text-[#24170F]">
            {product.name}
          </h3>
        </Link>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-[#ede7dc] pt-4">
          <p className="text-sm tracking-[0.04em] text-[#5a5148]">
            EGP <span className="font-normal text-[#24170F]">{formatPrice(product.price)}</span>
          </p>
          <Link
            href={href}
            className="flex h-10 min-h-[40px] min-w-[40px] items-center justify-center rounded-full bg-[#24170F] text-[#FFF8EC] transition-colors hover:bg-[#8A7B68]"
            aria-label={`Open ${product.name}`}
          >
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}

function ProductRail({
  title,
  copy,
  href,
  products,
}: {
  title: string;
  copy: string;
  href: string;
  products: Product[];
}) {
  return (
    <section className="bg-[#F4E9D8] py-10 sm:py-14">
      <div className="page-wrap">
        <SectionHeading title={title} copy={copy} href={href} />
        <div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-4 [scrollbar-width:none] sm:-mx-6 sm:px-6 md:grid md:grid-cols-3 md:overflow-visible lg:mx-0 lg:grid-cols-4 lg:px-0 xl:grid-cols-5">
          {products.map((product, index) => (
            <ProductCard key={product._id} product={product} priority={index < 2} />
          ))}
        </div>
        <Link
          href={href}
          className="mt-2 inline-flex min-h-[44px] w-full items-center justify-center rounded-full border border-[#cbbfad] bg-white px-5 text-[10px] uppercase tracking-[0.22em] text-[#6F5D4B] sm:hidden"
        >
          View all
        </Link>
      </div>
    </section>
  );
}

function CategoryCard({
  item,
  count,
}: {
  item: (typeof CATEGORY_LANES)[number];
  count: number;
}) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className="group flex flex-col overflow-hidden rounded-lg border border-[#DED0BE] bg-white shadow-[0_16px_38px_rgba(49,33,22,0.08)] transition-transform duration-300 hover:-translate-y-1"
    >
      <div className="relative h-28 flex-shrink-0 bg-[#ece6db] sm:h-36">
        <Image
          src={item.image}
          alt={item.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
      </div>
      <div className="flex min-h-[6rem] flex-1 items-end justify-between gap-3 border-t border-[#ede7dc] p-4">
        <div>
          <p className="mb-1 text-[10px] uppercase tracking-[0.18em] text-[#8A7B68]">
            {count ? `${count} items` : "Explore"}
          </p>
          <h3 className="font-serif text-[1.35rem] font-light leading-none tracking-[0.01em] text-[#24170F] sm:text-[1.55rem]">
            {item.short}
          </h3>
        </div>
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f0ebe2] text-[#24170F]">
          <Icon className="h-4.5 w-4.5" strokeWidth={1.55} />
        </span>
      </div>
    </Link>
  );
}

function ShortcutCard({ label, href, icon: Icon }: { label: string; href: string; icon: IconType }) {
  return (
    <Link
      href={href}
      className="group flex min-h-[5rem] flex-col justify-between rounded-lg border border-[#DED0BE] bg-white p-4 text-[#24170F] shadow-[0_14px_34px_rgba(49,33,22,0.07)] transition-transform duration-300 hover:-translate-y-1"
    >
      <Icon className="h-5 w-5 text-[#8A7B68]" strokeWidth={1.55} />
      <span className="text-[10px] uppercase tracking-[0.2em] text-[#77685A] group-hover:text-[#24170F]">
        {label}
      </span>
    </Link>
  );
}

function ServiceItem({ label, detail, icon: Icon }: { label: string; detail: string; icon: IconType }) {
  return (
    <div className="flex min-h-[6.5rem] items-center gap-4 border-b border-[#2e2924] py-5 last:border-b-0 sm:border-b-0 sm:border-r sm:px-5 sm:last:border-r-0">
      <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border border-[#8A7B68]/30 bg-[#8A7B68]/10 text-[#8A7B68]">
        <Icon className="h-5 w-5" strokeWidth={1.55} />
      </span>
      <span>
        <span className="block text-[11px] uppercase tracking-[0.2em] text-[#FFF8EC]">
          {label}
        </span>
        <span className="mt-1 block text-sm leading-6 tracking-[0.03em] text-[#FFF8EC]/48">
          {detail}
        </span>
      </span>
    </div>
  );
}

export default async function HomePage() {
  const products = await getAllProducts();
  const heroProducts = pickProducts(products, HERO_PRODUCT_IDS, 4);
  const newProducts = pickProducts(products, NEW_IDS, 8);
  const editProducts = pickProducts(products, EDIT_IDS, 8);
  const heroProduct = heroProducts[0] ?? products[0];
  const focusProduct = editProducts[1] ?? products[1] ?? heroProduct;

  return (
    <main className="min-h-screen bg-[#F4E9D8] pt-[54px] text-[#24170F] sm:pt-[58px]">
      <section className="sticky top-[54px] z-30 border-b border-[#ded6cb] bg-[#FBFCFA]/94 backdrop-blur-2xl sm:top-[58px]">
        <div className="page-wrap py-3">
          <div className="grid min-w-0 gap-3 lg:grid-cols-[minmax(20rem,35rem)_1fr] lg:items-center">
            <CommerceSearch />

            <nav
              aria-label="Shop categories"
              className="-mx-4 flex max-w-[100vw] min-w-0 snap-x gap-2 overflow-x-auto px-4 [scrollbar-width:none] lg:mx-0 lg:max-w-none lg:justify-end lg:overflow-visible lg:px-0"
            >
              {CATEGORY_LANES.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="inline-flex min-h-[44px] min-w-max snap-start items-center justify-center rounded-full border border-[#d8d0c3] bg-white px-4 text-[10px] uppercase tracking-[0.18em] text-[#5a5148] transition-colors hover:border-[#8A7B68] hover:text-[#24170F]"
                >
                  {item.short}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </section>

      <section className="overflow-hidden bg-[linear-gradient(180deg,#FBFCFA_0%,#f1ece2_100%)] py-8 sm:py-12">
        <div className="page-wrap grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <div className="max-w-[21.5rem] sm:max-w-3xl">
            <h1 className="font-serif text-[clamp(4.9rem,17vw,12rem)] font-light leading-[0.76] tracking-[0.015em] text-[#24170F]">
              BOUT
            </h1>
            <p className="mt-6 max-w-[19.5rem] text-base font-light leading-8 tracking-[0.025em] text-[#4f473f] sm:max-w-2xl sm:text-xl sm:leading-9 sm:tracking-[0.035em]">
              Luxury menswear you can find fast. Search by product, browse by category, and move from first look to checkout without noise.
            </p>

            <div className="mt-7 grid max-w-[21.5rem] gap-3 sm:max-w-none sm:flex">
              <Link
                href="/shop"
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-[#24170F] px-6 text-[11px] uppercase tracking-[0.22em] text-[#FFF8EC] shadow-[0_18px_42px_rgba(36,23,15,0.18)] transition-colors hover:bg-[#8A7B68]"
              >
                Shop new arrivals
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/collection"
                className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-[#cbbfad] bg-white px-6 text-[11px] uppercase tracking-[0.22em] text-[#6F5D4B] transition-colors hover:border-[#8A7B68] hover:text-[#24170F]"
              >
                Browse categories
              </Link>
            </div>

            <div className="mt-8 grid max-w-[21.5rem] grid-cols-3 gap-2 text-center sm:max-w-xl">
              {[
                ["Fast", "search"],
                ["Real", "catalog"],
                ["Easy", "checkout"],
              ].map(([top, bottom]) => (
                <div key={top} className="rounded-lg border border-[#DED0BE] bg-white/78 p-3">
                  <p className="font-serif text-[1.5rem] font-light leading-none text-[#24170F]">
                    {top}
                  </p>
                  <p className="mt-1 text-[9px] uppercase tracking-[0.18em] text-[#756d64]">
                    {bottom}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-[1fr_0.78fr] sm:items-stretch">
            <div className="relative min-h-[29rem] overflow-hidden rounded-lg bg-[#d8d0c3] shadow-[0_30px_70px_rgba(49,33,22,0.18)] sm:min-h-[38rem]">
              <Image
                src={withPublicAssetVersion("/uploads/homepage.jpg")}
                alt="BOUT luxury menswear editorial"
                fill
                priority
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 58vw, 42vw"
                className="object-cover"
              />
            </div>

            <div className="grid gap-3">
              {heroProducts.slice(0, 2).map((product, index) => (
                <Link
                  key={product._id}
                  href={productHref(product)}
                  className="group grid min-h-[13.5rem] overflow-hidden rounded-lg border border-[#DED0BE] bg-white shadow-[0_18px_42px_rgba(49,33,22,0.08)] sm:min-h-0"
                >
                  <div className="relative">
                    <Image
                      src={productImage(product)}
                      alt={product.name}
                      fill
                      priority={index === 0}
                      sizes="(max-width: 640px) 100vw, 24vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="flex items-end justify-between gap-3 p-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.17em] text-[#8A7B68]">
                        EGP {formatPrice(product.price)}
                      </p>
                      <h2 className="mt-1 line-clamp-2 font-serif text-[1.35rem] font-light leading-[1.03] tracking-[0.01em]">
                        {product.name}
                      </h2>
                    </div>
                    <ChevronRight className="h-5 w-5 flex-shrink-0 text-[#24170F]" strokeWidth={1.55} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#F4E9D8] py-8 sm:py-12">
        <div className="page-wrap">
          <SectionHeading
            title="Shop the way you think"
            copy="Clear buying paths on mobile and desktop: broad categories, strong thumbnails, and labels that say exactly where each tap goes."
            href="/collection"
            linkLabel="Open collection"
          />
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
            {CATEGORY_LANES.map((item) => (
              <CategoryCard
                key={item.href}
                item={item}
                count={countByTokens(products, item.tokens)}
              />
            ))}
          </div>
        </div>
      </section>

      <ProductRail
        title="New arrivals"
        copy="A marketplace-fast product shelf with luxury spacing, real prices, and quick routes into product pages."
        href="/shop"
        products={newProducts}
      />

      <section className="bg-white py-10 sm:py-14">
        <div className="page-wrap grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
          <div>
            <h2 className="font-serif text-[clamp(2.4rem,6vw,5rem)] font-light leading-[0.92] tracking-[0.02em] text-[#24170F]">
              Comfortable shopping, fewer decisions.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-8 tracking-[0.035em] text-[#77685A]">
              Search when you know the item. Browse when you only know the mood. Save pieces, open orders, or return to the cart from one calm place.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {SHOP_SHORTCUTS.map((item) => (
              <ShortcutCard key={item.href} {...item} />
            ))}
          </div>
        </div>
      </section>

      <section className="overflow-hidden bg-[#24170F] py-10 text-[#FFF8EC] sm:py-14">
        <div className="page-wrap grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
          <Link
            href="/lookbook"
            className="group relative min-h-[28rem] overflow-hidden rounded-lg bg-[#28221c] shadow-[0_30px_78px_rgba(0,0,0,0.34)] sm:min-h-[35rem]"
          >
            <Image
              src={withPublicAssetVersion("/uploads/collections.jpg")}
              alt="BOUT lookbook styling"
              fill
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.035]"
            />
          </Link>

          <div>
            <h2 className="font-serif text-[clamp(2.4rem,6vw,5rem)] font-light leading-[0.92] tracking-[0.02em] text-[#FFF8EC]">
              Looks first, products second.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-8 tracking-[0.035em] text-[#FFF8EC]/58">
              Editorial browsing for shoppers who want proportion, texture, and outfit context before choosing a single item.
            </p>
            <Link
              href="/lookbook"
              className="mt-7 inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-[#8A7B68]/42 bg-[#8A7B68]/12 px-6 text-[11px] uppercase tracking-[0.22em] text-[#FFF8EC] transition-colors hover:bg-[#8A7B68]/20"
            >
              Open lookbook
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {focusProduct && (
        <section className="bg-[#F4E9D8] py-10 sm:py-14">
          <div className="page-wrap grid gap-4 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
            <Link
              href={productHref(focusProduct)}
              className="group grid overflow-hidden rounded-lg border border-[#DED0BE] bg-white shadow-[0_22px_52px_rgba(49,33,22,0.1)] lg:grid-cols-[0.92fr_1.08fr]"
            >
              <div className="relative aspect-[4/5] bg-[#ece6db] lg:aspect-auto">
                <Image
                  src={productImage(focusProduct)}
                  alt={focusProduct.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.035]"
                />
              </div>
              <div className="flex flex-col justify-center p-5 sm:p-7">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#8A7B68]">
                  Product focus
                </p>
                <h2 className="mt-4 font-serif text-[clamp(2rem,5vw,4rem)] font-light leading-[0.95] tracking-[0.01em] text-[#24170F]">
                  {focusProduct.name}
                </h2>
                <p className="mt-5 max-w-md text-sm leading-7 tracking-[0.035em] text-[#77685A]">
                  A clean product path for shoppers who want one piece, clear pricing, and a direct decision.
                </p>
                <span className="mt-7 inline-flex min-h-[44px] items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-[#24170F]">
                  View product
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>

            <div className="grid gap-3 sm:grid-cols-2">
              {editProducts.slice(0, 4).map((product) => (
                <article
                  key={product._id}
                  className="grid grid-cols-[6.5rem_1fr] overflow-hidden rounded-lg border border-[#DED0BE] bg-white shadow-[0_14px_34px_rgba(49,33,22,0.07)]"
                >
                  <Link href={productHref(product)} className="relative min-h-[9.5rem] bg-[#ece6db]">
                    <Image
                      src={productImage(product)}
                      alt={product.name}
                      fill
                      sizes="120px"
                      className="object-cover"
                    />
                  </Link>
                  <div className="flex flex-col justify-between p-4">
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.18em] text-[#8A7B68]">
                        {productLabel(product) || "Catalog"}
                      </p>
                      <Link href={productHref(product)}>
                        <h3 className="mt-2 line-clamp-2 font-serif text-[1.22rem] font-light leading-[1.08] tracking-[0.01em] text-[#24170F]">
                          {product.name}
                        </h3>
                      </Link>
                    </div>
                    <p className="mt-4 text-sm tracking-[0.04em] text-[#77685A]">
                      EGP <span className="text-[#24170F]">{formatPrice(product.price)}</span>
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <ProductRail
        title="Quiet best picks"
        copy="Edited staples for shoppers who want the page to feel simple, polished, and quick."
        href="/collection"
        products={editProducts}
      />

      <section className="bg-[#24170F] py-10 sm:py-14">
        <div className="page-wrap">
          <div className="grid border-y border-[#2e2924] sm:grid-cols-2 lg:grid-cols-4">
            {SERVICE_ITEMS.map((item) => (
              <ServiceItem key={item.label} {...item} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
