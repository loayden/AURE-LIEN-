import ProductCard from "@/components/ProductCard";
import { getBoutiqueApplications } from "@/lib/boutiqueApplications";
import { getAllProducts } from "@/lib/getAllProducts";
import { getPartnerProducts } from "@/lib/partnerProducts";
import connectDB, { hasConfiguredMongoUri } from "@/lib/connectDB";
import Review from "@/models/Review";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const wanted = decodeURIComponent(id);
  const applications = await getBoutiqueApplications().catch(() => []);
  const boutique = applications.find(
    (a) => (a._id === wanted || a.storefrontSlug === wanted) && a.status === "approved" && a.verification?.status === "verified"
  );
  return {
    title: boutique ? `${boutique.boutiqueName} — BOUT` : "بوتيك — BOUT",
    description: boutique
      ? `تسوّق ${boutique.boutiqueName} (${boutique.city}) — محل حقيقي موثّق على BOUT.`
      : "واجهة بوتيك على BOUT.",
  };
}

export default async function BoutiquePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const wanted = decodeURIComponent(id);
  const [applications, partnerProducts, catalog] = await Promise.all([
    getBoutiqueApplications().catch(() => []),
    getPartnerProducts().catch(() => []),
    getAllProducts().catch(() => []),
  ]);
  const boutique = applications.find(
    (a) => (a._id === wanted || a.storefrontSlug === wanted) && a.status === "approved" && a.verification?.status === "verified"
  );
  if (!boutique) notFound();

  const liveIds = new Set(
    partnerProducts
      .filter((p) => p.applicationId === boutique._id && p.status === "approved")
      .map((p) => String(p.productId))
  );
  const products = catalog.filter((p) => liveIds.has(String(p._id)));

  let rating: { average: number; count: number } = { average: 0, count: 0 };
  if (hasConfiguredMongoUri() && liveIds.size > 0) {
    try {
      await connectDB();
      const agg = await Review.aggregate([
        { $match: { productId: { $in: [...liveIds] } } },
        { $group: { _id: null, avg: { $avg: "$rating" }, count: { $sum: 1 } } },
      ]);
      if (agg[0]) {
        rating = {
          average: Math.round(Number(agg[0].avg ?? 0) * 10) / 10,
          count: Number(agg[0].count ?? 0),
        };
      }
    } catch {
      // ratings are best-effort
    }
  }

  const cover = boutique.shopPhotos?.[0] ?? "";
  const gallery = (boutique.shopPhotos ?? []).slice(1);
  const meta = [
    boutique.area || boutique.city ? `${boutique.area || ""}${boutique.area && boutique.city ? " · " : ""}${boutique.area ? "" : boutique.city}` : null,
    boutique.verification?.verifiedAt
      ? `موثّق منذ ${new Date(boutique.verification.verifiedAt).toLocaleDateString("ar-EG", { month: "short", year: "numeric" })}`
      : "محل موثّق",
    `${products.length} ${products.length === 1 ? "قطعة" : "قطعة"}`,
    rating.count > 0 ? `★ ${rating.average} (${rating.count})` : null,
  ].filter(Boolean) as string[];

  return (
    <main dir="rtl" lang="ar" className="min-h-screen bg-[#F5F1E8] text-[#3D3025]" style={{ fontFamily: "Tahoma, Arial, var(--font-jost), sans-serif" }}>
      {/* ── Editorial hero ── */}
      <section className="relative isolate overflow-hidden bg-[#171513] text-[#FFF9EF]">
        {cover ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cover}
              alt={`واجهة ${boutique.boutiqueName}`}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(23,21,19,0.25) 0%, rgba(23,21,19,0.55) 55%, rgba(23,21,19,0.92) 100%)" }} />
          </>
        ) : null}
        <div className="relative mx-auto max-w-6xl px-4 pb-10 pt-24 sm:px-6 sm:pb-14 sm:pt-28 md:px-10">
          <Link href="/boutiques" className="text-[10px] tracking-[0.25em] text-[#D9BC77]">
            كل البوتيكات ←
          </Link>
          <p className="mt-6 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] tracking-[0.18em]" style={{ background: "rgba(80,160,100,0.16)", color: "#9FDCB2" }}>
            ✓ محل حقيقي موثّق
          </p>
          <h1
            className="mt-3 max-w-4xl font-light leading-[1.1]"
            style={{ fontFamily: "'Cormorant Garamond', Tahoma, serif", fontSize: "clamp(2.6rem,7vw,5.5rem)" }}
          >
            {boutique.boutiqueName}
          </h1>
          <p className="mt-3 text-[11px] tracking-[0.22em] text-[#E4DED3]/80">
            {meta.join("  ·  ")}
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a
              href="#pieces"
              className="inline-flex min-h-[52px] items-center justify-center rounded-full px-8 text-[10px] tracking-[0.25em] text-[#171513]"
              style={{ background: "#F5F1E8" }}
            >
              تسوّق القطع
            </a>
            {boutique.googleMapsUrl ? (
              <a
                href={boutique.googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-[52px] items-center justify-center rounded-full border px-8 text-[10px] tracking-[0.25em] text-[#FFF9EF]"
                style={{ borderColor: "rgba(255,249,239,0.3)" }}
              >
                زور المحل
              </a>
            ) : null}
          </div>
        </div>
      </section>

      {/* ── Story ── */}
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 md:px-10">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
          <div>
            <p className="text-[9px] tracking-[0.45em]" style={{ color: "var(--gold-text)" }}>
              القصة
            </p>
            <p className="mt-3 font-light leading-snug" style={{ fontFamily: "'Cormorant Garamond', Tahoma, serif", fontSize: "clamp(1.4rem,3vw,2rem)" }}>
              بعناية {boutique.ownerName}، في قلب {boutique.area || boutique.city}.
            </p>
            <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {[
                ["الحي", boutique.area || boutique.city || "—"],
                ["التخصص", boutique.categories.slice(0, 3).join(" · ") || "تشكيلة مختارة"],
                ["موثّق منذ", boutique.verification?.verifiedAt ? new Date(boutique.verification.verifiedAt).getFullYear().toString() : "—"],
                ...(boutique.instagram ? [["انستجرام", boutique.instagram] as [string, string]] : []),
                ...(rating.count > 0 ? [["التقييم", `★ ${rating.average} · ${rating.count}`] as [string, string]] : []),
                ["القطع", String(products.length)],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl p-4" style={{ border: "1px solid rgba(123,103,82,0.16)", background: "rgba(255,255,255,0.55)" }}>
                  <dt className="text-[9px] tracking-[0.2em]" style={{ color: "var(--gold-text)" }}>{label}</dt>
                  <dd className="mt-1 truncate text-sm font-medium">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
          {gallery.length > 0 ? (
            <div className="grid grid-cols-2 gap-3" role="list" aria-label="صور من داخل المحل">
              {gallery.slice(0, 4).map((url, i) => (
                <span
                  key={url}
                  role="listitem"
                  className={`relative block overflow-hidden rounded-2xl ${i === 0 ? "col-span-2 aspect-[16/9]" : "aspect-square"}`}
                  style={{ border: "1px solid rgba(123,103,82,0.18)" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt={`${boutique.boutiqueName} — صورة ${i + 2}`} className="h-full w-full object-cover" loading="lazy" />
                </span>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl p-6 text-sm leading-7" style={{ border: "1px solid rgba(123,103,82,0.16)", background: "rgba(255,255,255,0.55)", color: "rgba(61,48,37,0.75)" }}>
              كل قطعة هنا عدّت على مراجعة BOUT. الجديد من البوتيك ده بيظهر هنا الأول.
            </div>
          )}
        </div>
      </section>

      {/* ── Pieces ── */}
      <section id="pieces" className="mx-auto max-w-6xl scroll-mt-24 px-4 pb-20 sm:px-6 md:px-10">
        <div className="flex items-end justify-between gap-3">
          <h2 className="font-light" style={{ fontFamily: "'Cormorant Garamond', Tahoma, serif", fontSize: "clamp(1.6rem,4vw,2.4rem)" }}>
            القطع <span style={{ color: "var(--gold-text)" }}>({products.length})</span>
          </h2>
          <Link href="/shop" className="hidden text-[10px] tracking-[0.22em] sm:inline" style={{ color: "var(--gold-text)" }}>
            كل المتجر ←
          </Link>
        </div>
        {products.length === 0 ? (
          <p className="mt-4 text-sm" style={{ color: "rgba(61,48,37,0.7)" }}>
            لسه مفيش قطع live — الجديد بيظهر هنا بعد المراجعة.
          </p>
        ) : (
          <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} compact />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
