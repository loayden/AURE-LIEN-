import { withPublicAssetVersion } from "@/lib/publicAsset";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const BENEFITS = [
  {
    title: "Luxury presence, preserved",
    description:
      "The site is built to let products feel composed, premium, and easier to trust without the noise of a crowded marketplace.",
  },
  {
    title: "Growth with restraint",
    description:
      "Discovery is widened without diluting tone, selectivity, or the visual discipline that gives the brand value.",
  },
  {
    title: "Operational calm",
    description:
      "The browsing, ordering, and follow-up flow are structured to reduce friction for both customers and the business.",
  },
];

const PLATFORM_EXPERIENCE = [
  {
    label: "Refined Discovery",
    title: "A calmer environment for premium product.",
    description:
      "Products appear in a more controlled setting where material, silhouette, and finish carry the weight.",
  },
  {
    label: "Selective Context",
    title: "Positioning should support value, not weaken it.",
    description:
      "Collections are framed with cleaner hierarchy, stronger image use, and less visual competition.",
  },
  {
    label: "Mobile Comfort",
    title: "Luxury browsing should still feel easy in the hand.",
    description:
      "Spacing, touch targets, and scroll rhythm are tuned for users shopping on mobile first.",
  },
];

const JOURNEY = [
  {
    number: "01",
    title: "Discover",
    subtitle: "The homepage now works like a store, not a manifesto.",
    description:
      "Users land on a commerce-first surface with clearer categories, visible trust signals, and faster product entry points.",
  },
  {
    number: "02",
    title: "Evaluate",
    subtitle: "Product pages stay focused on choice and confidence.",
    description:
      "The product flow is designed to keep size, tone, pricing, gallery, and checkout intent easy to understand.",
  },
  {
    number: "03",
    title: "Convert",
    subtitle: "Trust is built before the payment step.",
    description:
      "Checkout, cart, saved progress, and order support are surfaced in a way that reduces hesitation.",
  },
];

const STANDARDS = [
  {
    title: "Editorial positioning",
    description:
      "Imagery, layout, and type are used to make the collection feel premium rather than overly promotional.",
  },
  {
    title: "Commercial clarity",
    description:
      "The homepage is now organized more like familiar high-performing commerce sites, so users immediately understand how to shop.",
  },
  {
    title: "Mobile-first comfort",
    description:
      "The experience is designed to feel lighter, calmer, and easier to move through on smaller screens.",
  },
  {
    title: "Trust before friction",
    description:
      "Delivery, checkout, and support confidence are brought earlier in the journey to improve intent and reduce drop-off.",
  },
];

function DiscoverCard({
  label,
  title,
  description,
}: {
  label: string;
  title: string;
  description: string;
}) {
  return (
    <div className="gold-panel rounded-[24px] p-5 sm:p-6">
      <p className="eyebrow mb-4 text-gold">{label}</p>
      <h3
        className="mb-3 font-light text-[#3D3025]"
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: "clamp(1.15rem, 2.5vw, 1.6rem)",
          lineHeight: 1.06,
        }}
      >
        {title}
      </h3>
      <p className="body-copy">{description}</p>
    </div>
  );
}

export default function DiscoverPage() {
  return (
    <main className="liquid-page pb-20">
      <section className="relative isolate overflow-hidden">
        <Image
          src={withPublicAssetVersion("/uploads/collections.jpg")}
          alt="Discover BOUT"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(61,48,37,0.94)_0%,rgba(61,48,37,0.74)_45%,rgba(61,48,37,0.48)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,121,53,0.16),transparent_40%)]" />

        <div className="page-wrap relative z-10 flex min-h-[72svh] items-center py-16 sm:py-20 lg:py-24">
          <div className="max-w-3xl">
            <p className="eyebrow mb-5">Discover BOUT</p>
            <h1 className="title-display text-[clamp(2.7rem,8vw,5.8rem)] leading-[0.92]" style={{ color: "#FFF9EF" }}>
              The brand, platform, and thinking behind the <em className="gold-italic">experience</em>
            </h1>
            <p className="hero-body-copy mt-5 max-w-2xl" style={{ color: "rgba(255,249,239,0.74)" }}>
              This page now holds the company and platform context that used to sit on the homepage, so the homepage can stay focused on shopping, clarity, and trust.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href="/shop" className="btn-gold justify-center">
                Shop The Store
              </Link>
              <Link href="/collection" className="btn-ghost justify-center">
                View Collection
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section
        className="px-4 pt-16 sm:px-6 sm:pt-20 md:px-10"
        style={{ contentVisibility: "auto", containIntrinsicSize: "1px 1000px" }}
      >
        <div className="page-wrap grid gap-5 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="warm-panel overflow-hidden rounded-[30px]">
            <div className="relative min-h-[520px]">
              <Image
                src={withPublicAssetVersion("/uploads/main.jpg")}
                alt="BOUT brand perspective"
                fill
                sizes="(max-width: 1024px) 100vw, 56vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(61,48,37,0.08)_0%,rgba(61,48,37,0.34)_45%,rgba(61,48,37,0.86)_100%)]" />
              <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col justify-end p-6 sm:p-8 md:p-10">
                <p className="eyebrow mb-4" style={{ color: "rgba(255,249,239,0.70)" }}>Platform Perspective</p>
                <h2 className="title-display max-w-2xl text-[clamp(2rem,4vw,3.4rem)]" style={{ color: "#FFF9EF" }}>
                  Designed to feel easier to trust, easier to scan, and easier to <em className="gold-italic">buy</em>
                </h2>
                <p className="body-copy mt-4 max-w-xl" style={{ color: "rgba(255,249,239,0.72)" }}>
                  The redesign direction is simple: the homepage should feel more like the first screen of a strong commerce site, while the brand and platform explanation live in a calmer place for users who want to read deeper.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {PLATFORM_EXPERIENCE.map((item) => (
              <DiscoverCard key={item.title} {...item} />
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
              <p className="eyebrow mb-4">What The Site Delivers</p>
              <h2 className="title-display text-[clamp(2rem,4vw,3.4rem)]">
                A stronger first impression without losing the brand <em className="gold-italic">tone</em>
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {["Cleaner homepage", "Better trust", "Faster product entry"].map((item) => (
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

          <div className="grid gap-4 lg:grid-cols-3">
            {BENEFITS.map((item) => (
              <div key={item.title} className="glass-panel rounded-[24px] p-6 sm:p-7">
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-[rgba(168,121,53,0.14)] text-gold">
                  <Sparkles className="h-5 w-5" strokeWidth={1.4} />
                </div>
                <h3
                  className="mb-3 font-light text-[#3D3025]"
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "clamp(1.2rem, 2.5vw, 1.7rem)",
                    lineHeight: 1.06,
                  }}
                >
                  {item.title}
                </h3>
                <p className="body-copy">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="px-4 pt-16 sm:px-6 sm:pt-20 md:px-10"
        style={{ contentVisibility: "auto", containIntrinsicSize: "1px 900px" }}
      >
        <div className="page-wrap">
          <div className="mb-8">
            <p className="eyebrow mb-4">How It Works</p>
            <h2 className="title-display text-[clamp(2rem,4vw,3.4rem)]">
              Discovery, evaluation, and checkout in a clearer <em className="gold-italic">sequence</em>
            </h2>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {JOURNEY.map((item) => (
              <div key={item.number} className="gold-panel rounded-[24px] p-6 sm:p-7">
                <p
                  className="mb-5 font-light text-[rgba(168,121,53,0.34)]"
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "3rem",
                    lineHeight: 0.9,
                  }}
                >
                  {item.number}
                </p>
                <h3
                  className="mb-2 font-light text-[#3D3025]"
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "clamp(1.25rem, 2.6vw, 1.8rem)",
                    lineHeight: 1.04,
                  }}
                >
                  {item.title}
                </h3>
                <p className="mb-4 text-[10px] uppercase tracking-[0.22em] text-gold">
                  {item.subtitle}
                </p>
                <p className="body-copy">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="px-4 pt-16 sm:px-6 sm:pt-20 md:px-10"
        style={{ contentVisibility: "auto", containIntrinsicSize: "1px 900px" }}
      >
        <div className="page-wrap">
          <div className="mb-8">
            <p className="eyebrow mb-4">Standards</p>
            <h2 className="title-display text-[clamp(2rem,4vw,3.4rem)]">
              What this shopping experience is trying to do <em className="gold-italic">better</em>
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {STANDARDS.map((item) => (
              <div key={item.title} className="glass-panel rounded-[24px] p-6 sm:p-7">
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-[rgba(168,121,53,0.14)] text-gold">
                  <Check className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <h3
                  className="mb-3 font-light text-[#3D3025]"
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "clamp(1.2rem, 2.5vw, 1.65rem)",
                    lineHeight: 1.06,
                  }}
                >
                  {item.title}
                </h3>
                <p className="body-copy">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="px-4 pt-16 sm:px-6 sm:pt-20 md:px-10"
        style={{ contentVisibility: "auto", containIntrinsicSize: "1px 700px" }}
      >
        <div className="page-wrap">
          <div className="warm-panel overflow-hidden rounded-[30px]">
            <div className="relative min-h-[320px]">
              <Image
                src={withPublicAssetVersion("/uploads/homepage.jpg")}
                alt="BOUT final discover call to action"
                fill
                sizes="100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(61,48,37,0.12)_0%,rgba(61,48,37,0.36)_45%,rgba(61,48,37,0.86)_100%)]" />
              <div className="relative z-10 flex h-full flex-col items-start justify-end p-6 sm:p-8 md:p-10">
                <p className="eyebrow mb-4" style={{ color: "rgba(255,249,239,0.70)" }}>Next Step</p>
                <h2 className="title-display max-w-3xl text-[clamp(2rem,4vw,3.6rem)]" style={{ color: "#FFF9EF" }}>
                  If the homepage is for shopping first, this page is for understanding the wider <em className="gold-italic">intent</em>
                </h2>
                <p className="body-copy mt-4 max-w-2xl" style={{ color: "rgba(255,249,239,0.72)" }}>
                  The split is deliberate: less resistance for people who came to buy, and a calmer place for anyone who wants to understand the company, the structure, and the platform thinking behind the site.
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Link href="/" className="btn-gold justify-center">
                    Back To Homepage
                  </Link>
                  <Link href="/shop" className="btn-ghost justify-center">
                    Continue Shopping
                  </Link>
                  <Link href="/login" className="btn-ghost justify-center">
                    Partner Access
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
