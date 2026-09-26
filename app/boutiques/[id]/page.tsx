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
    title: boutique ? `${boutique.boutiqueName} — BOUT` : "Boutique — BOUT",
    description: boutique
      ? `Shop ${boutique.boutiqueName} (${boutique.city}) — verified physical store on BOUT.`
      : "Boutique storefront on BOUT.",
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

  return (
    <main className="min-h-screen bg-[#F5F1E8] px-4 py-16 text-[#3D3025] sm:px-6" style={{ fontFamily: "'Jost', sans-serif" }}>
      <div className="mx-auto max-w-6xl">
        <Link href="/boutiques" className="text-[10px] uppercase tracking-[0.25em]" style={{ color: "var(--gold-text)" }}>
          ← All boutiques
        </Link>
        <p className="mt-6 text-[9px] uppercase tracking-[0.45em]" style={{ color: "var(--gold-text)" }}>
          Verified Partner Boutique · {boutique.city}{boutique.area ? ` · ${boutique.area}` : ""}
        </p>
        <h1 className="mt-2 font-light" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.2rem,5vw,3.8rem)" }}>
          {boutique.boutiqueName}
        </h1>
        <p className="mt-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] uppercase tracking-[0.18em]" style={{ background: "rgba(80,160,100,0.12)", color: "#3C7A4D" }}>
          ✓ Verified physical store{boutique.verification?.verifiedAt ? ` · since ${new Date(boutique.verification.verifiedAt).toLocaleDateString()}` : ""}
        </p>
        <p className="mt-3 max-w-2xl text-sm leading-7" style={{ color: "rgba(61,48,37,0.75)" }}>
          Curated by {boutique.ownerName}
          {boutique.categories.length > 0 ? ` · ${boutique.categories.join(", ")}` : ""}
          {boutique.instagram ? ` · ${boutique.instagram}` : ""}
          {rating.count > 0 ? ` · ★ ${rating.average} (${rating.count} reviews)` : ""}
        </p>
        {(boutique.shopPhotos ?? []).length > 0 && (
          <div className="mt-6 flex gap-3 overflow-x-auto pb-2" role="list" aria-label="Shop photos">
            {(boutique.shopPhotos ?? []).map((url) => (
              <span key={url} role="listitem" className="relative block aspect-[4/3] w-64 shrink-0 overflow-hidden rounded-2xl sm:w-80" style={{ border: "1px solid rgba(123,103,82,0.18)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt={`${boutique.boutiqueName} storefront`} className="h-full w-full object-cover" loading="lazy" />
              </span>
            ))}
          </div>
        )}

        <h2 className="mt-10 text-sm font-medium uppercase tracking-[0.2em]">
          Pieces ({products.length})
        </h2>
        {products.length === 0 ? (
          <p className="mt-4 text-sm" style={{ color: "rgba(61,48,37,0.7)" }}>
            No live pieces yet — new arrivals appear here after review.
          </p>
        ) : (
          <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} compact />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
