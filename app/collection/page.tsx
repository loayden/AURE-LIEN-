import NewsletterForm from "@/components/NewsletterForm";
import { ALL_CATEGORY_META, CATEGORY_META, formatCategoryLabel } from "@/lib/commerce";
import { getAllProducts } from "@/lib/getAllProducts";
import { withPublicAssetVersion } from "@/lib/publicAsset";
import { ArrowRight, Briefcase, Gift, Layers, Moon, Plane, Sparkles, SunMedium } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const revalidate = 30;

export const metadata = {
  title: "BOUT Collections",
  description: "A category gateway for BOUT jackets, pants, footwear, accessories, and refined menswear edits.",
};

function matchesCategory(category: string, tokens: string[]) {
  const normalized = category.toLowerCase();
  return tokens.some((token) => normalized.includes(token.toLowerCase()));
}

const styleRoutes = [
  {
    label: "Work",
    href: "/suits",
    copy: "Tailoring, shirts, loafers",
    icon: Briefcase,
  },
  {
    label: "Weekend",
    href: "/knitwear",
    copy: "Knits, denim, sneakers",
    icon: SunMedium,
  },
  {
    label: "Night",
    href: "/jackets-coats",
    copy: "Dark layers and boots",
    icon: Moon,
  },
  {
    label: "Travel",
    href: "/pants-denim",
    copy: "Comfortable trousers",
    icon: Plane,
  },
  {
    label: "Gift",
    href: "/accessories",
    copy: "Belts, bags, eyewear",
    icon: Gift,
  },
] as const;

export default async function CollectionPage() {
  const products = await getAllProducts();
  const counts = new Map(
    ALL_CATEGORY_META.map((meta) => [
      meta.slug,
      products.filter((product) => matchesCategory(String(product.category ?? ""), meta.tokens)).length,
    ])
  );

  const featured = CATEGORY_META;
  const subcategories = ALL_CATEGORY_META.filter((meta) => !CATEGORY_META.some((item) => item.slug === meta.slug));

  return (
    <main className="liquid-page mobile-comfort pb-24 md:pb-28">
      <section className="relative isolate overflow-hidden border-b border-[#7B6752]/12 px-4 pb-10 pt-20 sm:px-6 sm:pb-16 sm:pt-32 md:px-10">
        <Image
          src={withPublicAssetVersion("/uploads/collections.jpg")}
          alt="BOUT collection gateway"
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover opacity-36"
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,#F5F1E8_0%,rgba(245,241,232,0.92)_38%,rgba(61,48,37,0.50)_100%)]" />
        <div className="page-wrap">
          <div className="max-w-3xl">
            <p className="eyebrow mb-4">Collections</p>
            <h1 className="title-display text-[clamp(3rem,9vw,7rem)] leading-[0.88]">
              Choose the <em className="gold-italic">route</em>
            </h1>
            <p className="body-copy mt-5 max-w-2xl">
              A clearer gateway into the catalog: start broad with the main departments, then move into focused edits when the silhouette is already decided.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/shop" className="btn-gold justify-center">
                Shop All
                <ArrowRight className="h-4 w-4" strokeWidth={1.3} />
              </Link>
              <Link href="/shop" className="btn-ghost justify-center">
                Browse Shop
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#7B6752]/12 bg-[#FFF9EF] px-4 py-5 sm:px-6 md:px-10">
        <div className="page-wrap">
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
            {styleRoutes.map((route) => {
              const Icon = route.icon;
              return (
                <Link
                  key={route.label}
                  href={route.href}
                  className="group grid grid-cols-[2.6rem_1fr_auto] items-center gap-3 rounded-[18px] border border-[#7B6752]/12 bg-white/70 p-3 shadow-[0_12px_34px_rgba(61,48,37,0.05)] transition hover:-translate-y-0.5 hover:border-[#A87935]/28 hover:bg-white"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-[14px] border border-[#A87935]/16 bg-[#A87935]/8 text-[#A87935]">
                    <Icon className="h-[1.125rem] w-[1.125rem]" strokeWidth={1.25} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[9px] uppercase tracking-[0.22em] text-[#7A581F]">{route.label}</span>
                    <span className="mt-0.5 block truncate text-xs text-[#6F6254]">{route.copy}</span>
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-[#A87935] transition group-hover:translate-x-0.5" strokeWidth={1.25} />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="page-wrap px-4 py-10 sm:px-6 sm:py-14 md:px-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow mb-3">Featured Categories</p>
            <h2 className="title-display text-[clamp(2.1rem,5vw,4rem)]">
              Shop by <em className="gold-italic">department</em>
            </h2>
          </div>
          <p className="body-copy max-w-xl">
            Large tiles use real category imagery, direct product counts, and mobile-friendly tap targets.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {featured.map((meta) => (
            <Link
              key={meta.slug}
              href={meta.href}
              className="group grid min-h-[24rem] overflow-hidden rounded-[24px] border border-[#7B6752]/12 bg-white/72 shadow-[0_22px_62px_rgba(61,48,37,0.08)] transition hover:-translate-y-1 hover:border-[#A87935]/24 md:grid-cols-[1.05fr_0.95fr]"
            >
              <div className="relative min-h-[18rem] overflow-hidden">
                <Image
                  src={meta.image}
                  alt={meta.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 32vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
              </div>
              <div className="flex flex-col justify-between p-5 sm:p-7">
                <div>
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(168,121,53,0.24)] bg-[rgba(168,121,53,0.08)] text-[#A87935]">
                      <Layers className="h-5 w-5" strokeWidth={1.35} />
                    </span>
                    <span className="rounded-full border border-[#A87935]/16 bg-[#A87935]/8 px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-[#7A581F]">
                      {counts.get(meta.slug) || 0} pieces
                    </span>
                  </div>
                  <p className="eyebrow mb-3">{formatCategoryLabel(meta.slug)}</p>
                  <h3 className="font-serif text-[clamp(2rem,5vw,3.5rem)] font-light leading-[0.92] tracking-[0.04em] text-[#3D3025]">
                    {meta.title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 tracking-[0.04em] text-[#6F6254]">{meta.copy}</p>
                </div>
                <span className="mt-7 inline-flex min-h-[44px] items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-[#A87935]">
                  Open Category
                  <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.3} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-[#7B6752]/12 bg-[#FFF9EF] px-4 py-10 sm:px-6 sm:py-14 md:px-10">
        <div className="page-wrap">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow mb-3">Focused Edits</p>
              <h2 className="title-display text-[clamp(2rem,5vw,3.6rem)]">
                Narrow the <em className="gold-italic">choice</em>
              </h2>
            </div>
            <Link href="/shop" className="btn-ghost justify-center">
              Full Shop
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
            {subcategories.map((meta) => (
              <Link
                key={meta.slug}
                href={meta.href}
                className="group overflow-hidden rounded-[20px] border border-[#7B6752]/12 bg-white/74 shadow-[0_16px_42px_rgba(61,48,37,0.06)] transition-transform duration-300 hover:-translate-y-1 hover:border-[#A87935]/24"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={meta.image}
                    alt={meta.title}
                    fill
                    sizes="(max-width: 768px) 50vw, 22vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                </div>
                <div className="p-4">
                  <p className="mb-2 text-[9px] uppercase tracking-[0.2em] text-[#A87935]">
                    {counts.get(meta.slug) || 0} items
                  </p>
                  <h3 className="font-serif text-[1.35rem] font-light leading-none tracking-[0.04em] text-[#3D3025]">
                    {meta.short}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="page-wrap px-4 py-12 text-center sm:px-6 sm:py-16 md:px-10">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(168,121,53,0.22)] bg-[rgba(168,121,53,0.08)] text-[#A87935]">
            <Sparkles className="h-5 w-5" strokeWidth={1.35} />
          </div>
          <h2 className="title-display text-[clamp(2rem,5vw,3.7rem)]">
            Private access to the <em className="gold-italic">next edit</em>
          </h2>
          <p className="body-copy mx-auto mt-4 max-w-xl text-center">
            Receive new arrivals and collection notes without adding noise to the shopping flow.
          </p>
          <div className="mt-7">
            <NewsletterForm />
          </div>
        </div>
      </section>
    </main>
  );
}
