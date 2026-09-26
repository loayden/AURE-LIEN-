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

  if (boutiques.length === 0) {
    // No verified boutiques yet: honest acquisition banner, never fake listings.
    return (
      <section
        aria-label="بوتيكات موثّقة — قريبًا"
        data-testid="verified-boutiques-strip"
        className="border-y border-[#DDDAD2] bg-[#FFFDF8] px-4 py-10 sm:px-6 sm:py-12 md:px-10"
      >
        <div dir="rtl" lang="ar" className="mx-auto flex w-full max-w-[92rem] flex-col items-start justify-between gap-4 sm:flex-row sm:items-center" style={{ fontFamily: "Tahoma, Arial, sans-serif" }}>
          <div>
            <p className="text-[10px] tracking-[0.22em] text-[#725D2C]">بوتيكات موثّقة</p>
            <h2 className="mt-2 font-serif text-2xl font-light text-[#171513] sm:text-4xl">
              أفضل محلات القاهرة — بتنضم دلوقتي.
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[#5A5650]">
              بنوثّق كل محل حقيقي قبل ما يبيع. عندك بوتيك؟ خد الشارة والقسم والعملاء.
            </p>
          </div>
          <Link
            href="/boutiques/apply"
            className="inline-flex min-h-[52px] shrink-0 items-center gap-2 rounded-full px-7 text-[11px] tracking-[0.2em] text-white"
            style={{ background: "linear-gradient(135deg, #4C3A26, #7D592B)" }}
          >
            وثّق بوتيكك — مجانا
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section
      aria-label="بوتيكات موثّقة"
      data-testid="verified-boutiques-strip"
      className="border-y border-[#DDDAD2] bg-[#FFFDF8] px-4 py-10 sm:px-6 sm:py-14 md:px-10"
    >
      <div dir="rtl" lang="ar" className="mx-auto w-full max-w-[92rem]" style={{ fontFamily: "Tahoma, Arial, sans-serif" }}>
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[10px] tracking-[0.22em] text-[#725D2C]">بوتيكات موثّقة</p>
            <h2 className="mt-2 font-serif text-3xl font-light text-[#171513] sm:text-5xl">
              تسوّق من محلات حقيقية.
            </h2>
          </div>
          <Link
            href="/boutiques"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[#D5D1C8] bg-white px-5 text-sm text-[#171513] transition hover:border-[#171513]"
          >
            كل البوتيكات
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
                  <img src={b.cover} alt={`واجهة ${b.name}`} className="h-full w-full object-cover" loading="lazy" />
                </span>
              ) : null}
              <span className="block p-4">
                <span className="mb-2 inline-block rounded-full px-2.5 py-1 text-[9px] tracking-[0.18em]" style={{ background: "rgba(80,160,100,0.12)", color: "#3C7A4D" }}>
                  ✓ محل موثّق
                </span>
                <span className="block font-serif text-xl font-light text-[#171513]">{b.name}</span>
                <span className="mt-1 block text-[11px] tracking-[0.16em] text-[#6F6254]">
                  {b.city}{b.area ? ` · ${b.area}` : ""} · {b.pieces} {b.pieces === 1 ? "قطعة" : "قطعة"}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
