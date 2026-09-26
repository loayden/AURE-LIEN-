import { BoutiqueDirectory } from "@/components/BoutiqueDirectory";
import { SubscribeCtaBar } from "@/components/SubscribeCtaBar";
import { getBoutiqueApplications } from "@/lib/boutiqueApplications";
import { getPartnerProducts } from "@/lib/partnerProducts";
import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Verified Boutiques | BOUT",
  description:
    "Shop verified physical boutiques on BOUT — real stores, reviewed products. Own a boutique? Apply and get verified.",
};

export default async function BoutiquesPage() {
  const [applications, products] = await Promise.all([
    getBoutiqueApplications().catch(() => []),
    getPartnerProducts().catch(() => []),
  ]);
  const verified = applications.filter(
    (a) => a.status === "approved" && a.verification?.status === "verified"
  );
  const livePieces = products.filter((p) => p.status === "approved").length;
  const areas = [...new Set(verified.map((a) => String(a.area || a.city || "").trim()).filter(Boolean))].slice(0, 6);

  return (
    <main className="min-h-screen bg-[#F5F1E8] text-[#3D3025]" style={{ fontFamily: "'Jost', sans-serif" }}>
      {/* ── Hero (boutiques first) ── */}
      <section id="boutiques-hero" className="px-4 pb-8 pt-20 sm:px-6 sm:pt-24 md:px-10">
        <div className="mx-auto max-w-7xl">
          <p className="text-[9px] uppercase tracking-[0.45em]" style={{ color: "var(--gold-text)" }}>
            Verified Boutiques
          </p>
          <h1
            className="mt-2 max-w-3xl font-light leading-[1.02]"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.2rem,5.5vw,4rem)" }}
          >
            Real stores. <em style={{ color: "var(--gold-text)" }}>Verified</em> pieces.
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 sm:text-base" style={{ color: "rgba(61,48,37,0.75)" }}>
            Every boutique proved its physical shop with real photos and a pinned location
            before selling a single piece.
            {verified.length > 0 ? (
              <> {verified.length} verified {verified.length === 1 ? "store" : "stores"} · {livePieces} live {livePieces === 1 ? "piece" : "pieces"}{areas.length > 0 ? ` · ${areas.join(" · ")}` : ""}.</>
            ) : (
              <> Be the first verified store on BOUT.</>
            )}
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/shop"
              className="inline-flex min-h-[52px] items-center justify-center rounded-full px-8 text-[10px] uppercase tracking-[0.25em] text-white"
              style={{ background: "linear-gradient(135deg, #4C3A26, #7D592B)" }}
            >
              Shop All Pieces
            </Link>
            <Link
              href="/boutiques/apply"
              className="inline-flex min-h-[52px] items-center justify-center rounded-full border px-8 text-[10px] uppercase tracking-[0.25em]"
              style={{ borderColor: "rgba(168,121,53,0.4)", color: "var(--gold-text)" }}
            >
              Sell With Us — Free 7 Days
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-3" role="list" aria-label="Marketplace stats">
            {[
              { value: String(verified.length), label: "Verified stores" },
              { value: String(livePieces), label: "Live pieces" },
              { value: "100%", label: "Photo verified" },
            ].map((s) => (
              <div
                key={s.label}
                role="listitem"
                className="rounded-2xl p-3 text-center sm:p-4"
                style={{ border: "1px solid rgba(123,103,82,0.16)", background: "rgba(255,255,255,0.55)" }}
              >
                <p className="font-light" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.4rem,4vw,2rem)", lineHeight: 1 }}>
                  {s.value}
                </p>
                <p className="mt-1 text-[9px] uppercase tracking-[0.2em]" style={{ color: "rgba(61,48,37,0.6)" }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Directory ── */}
      <BoutiqueDirectory />

      {/* ── Subscription pitch (marketing that converts) ── */}
      <section id="partner-band" aria-label="Become a partner" className="scroll-mt-24 px-4 pb-6 pt-8 sm:px-6 md:px-10">
        <div
          className="mx-auto max-w-7xl rounded-[24px] p-6 sm:p-10"
          style={{ background: "linear-gradient(135deg, #2A2118, #4C3A26)", color: "#FFF9EF" }}
        >
          <div className="grid items-start gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <p className="text-[9px] uppercase tracking-[0.45em]" style={{ color: "#D9BC77" }}>
                For Boutique Owners
              </p>
              <h2
                className="mt-2 font-light leading-[1.05]"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.7rem,4.5vw,2.8rem)" }}
              >
                Your shop deserves more than foot traffic.
              </h2>
              <ul className="mt-5 space-y-3">
                {[
                  ["Verified badge", "Shoppers trust verified stores — your badge shows on every product and page."],
                  ["Zero upfront cost", "7 free days. If you earn nothing, you pay nothing."],
                  ["You keep 90%", "10% commission only on what you actually sell. No listing fees."],
                  ["Approval in ~24h", "Photos reviewed same-day in most cases. Sell this week."],
                ].map(([title, copy]) => (
                  <li key={title} className="flex gap-3">
                    <span aria-hidden className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px]" style={{ background: "rgba(217,188,119,0.2)", color: "#D9BC77" }}>
                      ✓
                    </span>
                    <span>
                      <span className="block text-sm font-medium">{title}</span>
                      <span className="block text-sm" style={{ color: "rgba(255,249,239,0.65)" }}>{copy}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/boutiques/apply"
                  className="inline-flex min-h-[52px] items-center justify-center rounded-full px-8 text-[10px] uppercase tracking-[0.25em]"
                  style={{ background: "#D9BC77", color: "#2A2118" }}
                >
                  Start Free Trial
                </Link>
                <Link
                  href="/partners/subscription"
                  className="inline-flex min-h-[52px] items-center justify-center rounded-full border px-8 text-[10px] uppercase tracking-[0.25em]"
                  style={{ borderColor: "rgba(217,188,119,0.4)", color: "#FFF9EF" }}
                >
                  Compare Plans
                </Link>
              </div>
            </div>
            <div
              className="rounded-[20px] p-6 text-center lg:sticky lg:top-24"
              style={{ background: "rgba(255,249,239,0.07)", border: "1px solid rgba(217,188,119,0.25)" }}
            >
              <p className="text-[9px] uppercase tracking-[0.3em]" style={{ color: "#D9BC77" }}>
                Starter Plan
              </p>
              <p className="mt-2 font-light" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2.2rem", lineHeight: 1 }}>
                7 days free
              </p>
              <p className="mt-1 text-sm" style={{ color: "rgba(255,249,239,0.7)" }}>
                Then EGP 1,500/month · 10% commission
              </p>
              <p className="mt-1 text-xs" style={{ color: "rgba(255,249,239,0.5)" }}>
                Cancel anytime · keep 90% of every sale
              </p>
              <Link
                href="/boutiques/apply"
                className="mt-4 inline-flex min-h-[52px] w-full items-center justify-center rounded-full px-8 text-[10px] uppercase tracking-[0.25em]"
                style={{ background: "#D9BC77", color: "#2A2118" }}
              >
                Claim Free Week
              </Link>
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-8 grid gap-3 border-t pt-6 md:grid-cols-2" style={{ borderColor: "rgba(217,188,119,0.2)" }}>
            {FAQS.map((f) => (
              <details
                key={f.q}
                className="group rounded-2xl p-4"
                style={{ background: "rgba(255,249,239,0.05)", border: "1px solid rgba(217,188,119,0.15)" }}
              >
                <summary className="cursor-pointer list-none text-sm font-medium [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span aria-hidden className="ml-2" style={{ color: "#D9BC77" }}>+</span>
                </summary>
                <p className="mt-2 text-sm leading-6" style={{ color: "rgba(255,249,239,0.7)" }}>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <div className="h-10" />
      <SubscribeCtaBar />
    </main>
  );
}

const FAQS = [
  {
    q: "How fast is approval?",
    a: "Applications are reviewed within 24 hours. Photo verification usually completes the same day you submit clear shop photos.",
  },
  {
    q: "What does verification need?",
    a: "Three real photos of your shop (storefront signage + interior), a map pin on your location, and matching boutique details.",
  },
  {
    q: "What happens after the 7 free days?",
    a: "Starter continues at EGP 1,500/month with 10% commission. If you don't renew, product management pauses — your section stays visible but marked as not accepting orders.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Cancelling stops billing at the end of the current 30-day period. Your products unpublish on request.",
  },
];
