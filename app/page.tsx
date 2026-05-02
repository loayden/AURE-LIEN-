import HomeNewsletter from "@/components/home/HomeNewsletter";
import HomeProductSections from "@/components/home/HomeProductSections";
import { withPublicAssetVersion } from "@/lib/publicAsset";
import { ArrowRight, BadgeCheck, PackageCheck, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const FEATURED_CATEGORIES = [
  {
    title: "Jackets",
    href: "/jackets-coats",
    image: withPublicAssetVersion("/uploads/Jackets & Coats.jpg"),
  },
  {
    title: "Pants / Denim",
    href: "/pants-denim",
    image: withPublicAssetVersion("/uploads/denim.jpg"),
  },
  {
    title: "Footwear",
    href: "/footwear",
    image: withPublicAssetVersion("/uploads/footwear.jpg"),
  },
  {
    title: "Accessories",
    href: "/accessories",
    image: withPublicAssetVersion("/uploads/Bags & Wallets.jpg"),
  },
];

const OCCASIONS = [
  { title: "Formal", href: "/suits", image: withPublicAssetVersion("/uploads/Suits.jpg") },
  { title: "Casual", href: "/shirts", image: withPublicAssetVersion("/uploads/main.jpg") },
  { title: "Business", href: "/jackets-coats", image: withPublicAssetVersion("/uploads/collections.jpg") },
  { title: "Evening", href: "/loafers", image: withPublicAssetVersion("/uploads/Loafers.jpg") },
];

const TRUST = [
  { title: "Protected checkout", icon: ShieldCheck },
  { title: "Delivery in Egypt", icon: Truck },
  { title: "Returns / exchanges", icon: RotateCcw },
  { title: "Authentic pieces", icon: BadgeCheck },
];

export default function HomePage() {
  return (
    <main className="liquid-page pb-24 md:pb-20">
      <section className="relative isolate min-h-[calc(100svh-54px)] overflow-hidden">
        <Image
          src={withPublicAssetVersion("/uploads/homepage.jpg")}
          alt="BOUT menswear"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,9,8,0.94)_0%,rgba(10,9,8,0.70)_45%,rgba(10,9,8,0.35)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#0A0908] to-transparent" />

        <div className="page-wrap relative z-10 flex min-h-[calc(100svh-54px)] items-center py-20">
          <div className="max-w-3xl">
            <h1 className="title-display text-[clamp(4rem,14vw,9rem)] leading-[0.82]">
              BOUT
            </h1>
            <p className="hero-body-copy mt-5 max-w-xl text-white/68">
              Refined menswear, footwear, and accessories edited for a cleaner daily wardrobe.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/shop" className="btn-gold justify-center">
                Shop New Arrivals
                <ArrowRight className="h-4 w-4" strokeWidth={1.4} />
              </Link>
              <Link href="/collection" className="btn-ghost justify-center">
                Explore Collections
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pt-12 sm:px-6 sm:pt-16 md:px-10">
        <div className="page-wrap">
          <div className="mb-7 flex flex-col gap-3 sm:mb-9 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow mb-4">Featured Categories</p>
              <h2 className="title-display text-[clamp(2rem,4vw,3.4rem)]">
                Start with the main <em className="gold-italic">edits</em>
              </h2>
            </div>
            <Link href="/collection" className="btn-ghost justify-center sm:justify-start">
              View Collection
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {FEATURED_CATEGORIES.map((category) => (
              <Link key={category.href} href={category.href} className="group relative min-h-[340px] overflow-hidden rounded-[28px] border border-white/10">
                <Image src={category.image} alt={category.title} fill sizes="(max-width: 640px) 100vw, 25vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/82 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="font-serif text-3xl font-light text-white">{category.title}</h3>
                  <span className="mt-3 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-brass">
                    Shop
                    <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.4} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <HomeProductSections />

      <section className="px-4 pt-16 sm:px-6 sm:pt-20 md:px-10">
        <div className="page-wrap">
          <Link href="/lookbook" className="group block overflow-hidden rounded-[32px] border border-white/10">
            <div className="relative min-h-[420px]">
              <Image
                src={withPublicAssetVersion("/uploads/collections.jpg")}
                alt="BOUT lookbook"
                fill
                sizes="100vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,9,8,0.88),rgba(10,9,8,0.42),rgba(10,9,8,0.14))]" />
              <div className="relative z-10 flex min-h-[420px] max-w-2xl flex-col justify-end p-6 sm:p-10">
                <p className="eyebrow mb-4">Editorial</p>
                <h2 className="title-display text-[clamp(2.2rem,5vw,4rem)]">
                  Styling references for the current <em className="gold-italic">edit</em>
                </h2>
                <p className="body-copy mt-4 max-w-lg text-white/58">
                  Browse real catalogue pieces in a more editorial context before moving into product detail.
                </p>
                <span className="mt-7 inline-flex min-h-[48px] w-fit items-center gap-2 rounded-full border border-brass/30 bg-brass/10 px-6 text-[10px] uppercase tracking-[0.24em] text-brass">
                  View Lookbook
                  <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.4} />
                </span>
              </div>
            </div>
          </Link>
        </div>
      </section>

      <section className="px-4 pt-16 sm:px-6 sm:pt-20 md:px-10">
        <div className="page-wrap">
          <div className="mb-8">
            <p className="eyebrow mb-4">Shop By Occasion</p>
            <h2 className="title-display text-[clamp(2rem,4vw,3.4rem)]">
              Faster paths for the way you <em className="gold-italic">dress</em>
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {OCCASIONS.map((occasion) => (
              <Link key={occasion.title} href={occasion.href} className="group relative aspect-[4/5] overflow-hidden rounded-[24px] border border-white/10">
                <Image src={occasion.image} alt={occasion.title} fill sizes="(max-width: 640px) 50vw, 25vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/18 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="font-serif text-2xl font-light text-white">{occasion.title}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pt-16 sm:px-6 sm:pt-20 md:px-10">
        <div className="page-wrap">
          <div className="grid gap-3 rounded-[28px] border border-white/10 bg-white/[0.035] p-4 sm:grid-cols-2 lg:grid-cols-4">
            {TRUST.map(({ title, icon: Icon }) => (
              <div key={title} className="flex min-h-[76px] items-center gap-3 rounded-2xl px-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brass/12 text-brass">
                  <Icon className="h-5 w-5" strokeWidth={1.4} />
                </span>
                <span className="text-[10px] uppercase tracking-[0.22em] text-white/65">{title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pt-16 sm:px-6 sm:pt-20 md:px-10">
        <div className="page-wrap grid gap-8 rounded-[32px] border border-white/10 bg-[#14110F] p-6 sm:p-8 lg:grid-cols-[0.9fr_1.1fr] lg:p-10">
          <div>
            <p className="eyebrow mb-4">Private Access</p>
            <h2 className="title-display text-[clamp(2rem,4vw,3.4rem)]">
              Receive new drops and store <em className="gold-italic">updates</em>
            </h2>
          </div>
          <div>
            <div className="mb-5 flex items-center gap-3 text-white/45">
              <PackageCheck className="h-5 w-5 text-brass" strokeWidth={1.4} />
              <p className="body-copy">No spam. Only catalogue releases and service updates.</p>
            </div>
            <HomeNewsletter />
          </div>
        </div>
      </section>
    </main>
  );
}
