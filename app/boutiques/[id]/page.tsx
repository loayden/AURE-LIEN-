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
  const applications = await getBoutiqueApplications().catch(() => []);
  const boutique = applications.find((a) => a._id === id && a.status === "approved");
  return {
    title: boutique ? `${boutique.boutiqueName} — BOUT` : "Boutique — BOUT",
    description: boutique
      ? `Shop ${boutique.boutiqueName} (${boutique.city}) — curated pieces on BOUT.`
      : "Boutique storefront on BOUT.",
  };
}

export default async function BoutiquePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [applications, partnerProducts, catalog] = await Promise.all([
    getBoutiqueApplications().catch(() => []),
    getPartnerProducts().catch(() => []),
    getAllProducts().catch(() => []),
  ]);
  const boutique = applications.find((a) => a._id === id && a.status === "approved");
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
          Partner Boutique · {boutique.city}{boutique.area ? ` · ${boutique.area}` : ""}
        </p>
        <h1 className="mt-2 font-light" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.2rem,5vw,3.8rem)" }}>
          {boutique.boutiqueName}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7" style={{ color: "rgba(61,48,37,0.75)" }}>
          Curated by {boutique.ownerName}
          {boutique.categories.length > 0 ? ` · ${boutique.categories.join(", ")}` : ""}
          {boutique.instagram ? ` · ${boutique.instagram}` : ""}
          {rating.count > 0 ? ` · ★ ${rating.average} (${rating.count} reviews)` : ""}
        </p>

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
