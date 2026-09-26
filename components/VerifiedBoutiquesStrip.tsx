import { getBoutiqueApplications } from "@/lib/boutiqueApplications";
import { getPartnerProducts } from "@/lib/partnerProducts";
import Link from "next/link";

/**
 * Shopper-facing verified-boutiques carousel for the homepage (server-rendered).
 * Renders nothing when no verified boutiques exist.
 */
export async function VerifiedBoutiquesStrip() {
  const [applications, products] = await Promise.all([
    getBoutiqueApplications().catch(() => []),
    getPartnerProducts().catch(() => []),
  ]);
  const liveCount = new Map<string, number>();
  for (const p of products) {
    if (p.status !== "approved") continue;
    liveCount.set(p.applicationId, (liveCount.get(p.applicationId) ?? 0) + 1);
  }
  const boutiques = applications
    .filter((a) => a.status === "approved" && a.verification?.status === "verified")
    .map((a) => ({
      slug: a.storefrontSlug || a._id,
      id: a._id,
      name: a.boutiqueName,
      city: a.city,
      area: a.area,
      cover: a.shopPhotos?.[0] ?? "",
      pieces: liveCount.get(a._id) ?? 0,
    }))
    .sort((a, b) => b.pieces - a.pieces)
    .slice(0, 10);

  if (boutiques.length === 0) return null;

  return (
    <section
      aria-label="Verified boutiques"
      data-testid="verified-boutiques-strip"
      className="border-y border-[#DDDAD2] bg-[#FFFDF8] px-4 py-10 sm:px-6 sm:py-14 md:px-10"
    >
      <div className="mx-auto w-full max-w-[92rem]">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-[#725D2C]">Verified Boutiques</p>
            <h2 className="mt-2 font-serif text-3xl font-light text-[#171513] sm:text-5xl">
              Shop real stores.
            </h2>
          </div>
          <Link
            href="/boutiques"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[#D5D1C8] bg-white px-5 text-sm text-[#171513] transition hover:border-[#171513]"
          >
            All boutiques
          </Link>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2" style={{ scrollSnapType: "x proximity" }}>
          {boutiques.map((b) => (
            <Link
              key={b.id}
              href={`/boutiques/${encodeURIComponent(b.slug)}`}
              className="w-64 shrink-0 overflow-hidden rounded-lg border border-[#D5D1C8] bg-white transition hover:shadow-[0_18px_50px_rgba(23,21,19,0.12)] sm:w-72"
              style={{ scrollSnapAlign: "start" }}
            >
              {b.cover ? (
                <span className="relative block aspect-[16/10] w-full overflow-hidden bg-[#EAE1D3]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={b.cover} alt={`${b.name} storefront`} className="h-full w-full object-cover" loading="lazy" />
                </span>
              ) : null}
              <span className="block p-4">
                <span className="mb-2 inline-block rounded-full px-2.5 py-1 text-[9px] uppercase tracking-[0.18em]" style={{ background: "rgba(80,160,100,0.12)", color: "#3C7A4D" }}>
                  ✓ Verified store
                </span>
                <span className="block font-serif text-xl font-light text-[#171513]">{b.name}</span>
                <span className="mt-1 block text-[11px] uppercase tracking-[0.16em] text-[#6F6254]">
                  {b.city}{b.area ? ` · ${b.area}` : ""} · {b.pieces} {b.pieces === 1 ? "piece" : "pieces"}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
