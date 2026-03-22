import ProductCard from "@/components/ProductCard";
import productsData from "@/lib/productsData";

interface CategoryCollectionPageProps {
  title: string;
  category: string;
  eyebrow?: string;
  description?: string;
  emptyMessage?: string;
}

export default function CategoryCollectionPage({
  title,
  category,
  eyebrow = "Curated Category",
  description = "A focused edit sized for comfortable browsing across phones, tablets, and desktop.",
  emptyMessage = "No products found in this category.",
}: CategoryCollectionPageProps) {
  const products = productsData.filter((product) => product.category === category);
  const pieceLabel = products.length === 1 ? "Piece" : "Pieces";

  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white">
      <section className="catalog-shell">
        <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-14">
          <p className="mb-4 text-[9px] font-light uppercase tracking-[0.4em] text-white/28">
            {eyebrow}
          </p>
          <h1 className="luxury-title mb-5 text-white">
            {title}
          </h1>
          <p className="mx-auto max-w-2xl text-sm font-light leading-relaxed tracking-[0.08em] text-white/40 sm:text-base">
            {description}
          </p>

          <div className="mt-6 flex items-center justify-center gap-3 sm:gap-4">
            <span
              className="h-px w-8 sm:w-10"
              style={{ background: "linear-gradient(90deg, transparent, rgba(198,169,98,0.72), transparent)" }}
            />
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[9px] uppercase tracking-[0.3em] text-white/45">
              {products.length} {pieceLabel}
            </span>
            <span
              className="h-px w-8 sm:w-10"
              style={{ background: "linear-gradient(90deg, transparent, rgba(198,169,98,0.72), transparent)" }}
            />
          </div>
        </div>

        {products.length > 0 ? (
          <div className="catalog-grid">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="mx-auto max-w-2xl rounded-[1.75rem] border border-white/8 bg-white/[0.03] px-6 py-10 text-center shadow-[0_18px_44px_rgba(0,0,0,0.28)]">
            <p className="text-base font-light tracking-[0.08em] text-white/46 sm:text-lg">
              {emptyMessage}
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
