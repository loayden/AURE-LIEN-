import { BoutiqueDirectory } from "@/components/BoutiqueDirectory";
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
      {/* ── Hero ── */}
      <section className="px-4 pb-10 pt-24 sm:px-6 sm:pt-28 md:px-10">
        <div className="mx-auto max-w-7xl">
          <p className="text-[9px] uppercase tracking-[0.45em]" style={{ color: "var(--gold-text)" }}>
            Verified Boutiques
          </p>
          <h1
            className="mt-3 max-w-3xl font-light leading-[1.02]"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.4rem,6vw,4.5rem)" }}
          >
            Real stores. <em style={{ color: "var(--gold-text)" }}>Verified</em> pieces.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 sm:text-base" style={{ color: "rgba(61,48,37,0.75)" }}>
            Every boutique below proved its physical shop with real photos and a pinned
            location before selling a single piece. No anonymous sellers.            {verified.length > 0 ? (
              <> {verified.length} verified {verified.length === 1 ? "store" : "stores"} · {livePieces} live {livePieces === 1 ? "piece" : "pieces"}{areas.length > 0 ? ` · ${areas.join(" · ")}` : ""}.</>
            ) : (
              <> Be the first verified store on BOUT.</>
            )}
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
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
              Sell With Us
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-3 gap-3" role="list" aria-label="Marketplace stats">
            {[
              { value: String(verified.length), label: "Verified stores" },
              { value: String(livePieces), label: "Live pieces" },
              { value: "100%", label: "Photo verified" },
            ].map((s) => (
              <div
                key={s.label}
                role="listitem"
                className="rounded-2xl p-4 text-center sm:p-5"
                style={{ border: "1px solid rgba(123,103,82,0.16)", background: "rgba(255,255,255,0.55)" }}
              >
                <p className="font-light" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.5rem,4vw,2.2rem)", lineHeight: 1 }}>
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

      {/* ── Partner band ── */}
      <section aria-label="Become a partner" className="px-4 pb-20 pt-4 sm:px-6 md:px-10">
        <div
          className="mx-auto max-w-7xl rounded-[24px] p-6 sm:p-10"
          style={{ background: "linear-gradient(135deg, #2A2118, #4C3A26)", color: "#FFF9EF" }}
        >
          <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="text-[9px] uppercase tracking-[0.45em]" style={{ color: "#D9BC77" }}>
                For Boutique Owners
              </p>
              <h2
                className="mt-3 font-light leading-[1.05]"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.8rem,4.5vw,3rem)" }}
              >
                Your shop deserves more than foot traffic.
              </h2>
              <ol className="mt-6 space-y-3">
                {[
                  ["01", "Apply in 5 minutes", "Boutique details, map pin, and real shop photos."],
                  ["02", "Get verified", "We confirm your physical store — usually within 24 hours."],
                  ["03", "Sell & get paid", "Upload products, Starter trial 7 days free, monthly after."],
                ].map(([n, title, copy]) => (
                  <li key={n} className="flex gap-4">
                    <span className="font-light" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem", color: "#D9BC77" }}>
                      {n}
                    </span>
                    <span>
                      <span className="block text-sm font-medium">{title}</span>
                      <span className="block text-sm" style={{ color: "rgba(255,249,239,0.65)" }}>{copy}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
            <div
              className="rounded-[20px] p-6 text-center"
              style={{ background: "rgba(255,249,239,0.07)", border: "1px solid rgba(217,188,119,0.25)" }}
            >
              <p className="text-[9px] uppercase tracking-[0.3em]" style={{ color: "#D9BC77" }}>
                Starter Plan
              </p>
              <p className="mt-2 font-light" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2.4rem", lineHeight: 1 }}>
                7 days free
              </p>
              <p className="mt-2 text-sm" style={{ color: "rgba(255,249,239,0.7)" }}>
                Then EGP 1,500/month · 10% commission · cancel anytime
              </p>
              <Link
                href="/boutiques/apply"
                className="mt-5 inline-flex min-h-[52px] w-full items-center justify-center rounded-full px-8 text-[10px] uppercase tracking-[0.25em]"
                style={{ background: "#D9BC77", color: "#2A2118" }}
              >
                Apply Now
              </Link>
              <Link
                href="/partners/subscription"
                className="mt-3 inline-block text-xs underline underline-offset-4"
                style={{ color: "rgba(255,249,239,0.7)" }}
              >
                Compare all plans
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
