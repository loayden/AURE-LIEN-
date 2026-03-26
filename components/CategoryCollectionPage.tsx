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
  const words = title.trim().split(/\s+/).filter(Boolean);
  const accent = words.length > 1 ? words.pop() : null;

  return (
    <main className="liquid-page">
      <section className="catalog-shell relative z-10 pt-20 sm:pt-24">
        <div className="mx-auto mb-6 max-w-3xl text-center sm:mb-8 md:mb-10">
          <p className="eyebrow mb-4">
            {eyebrow}
          </p>
          <h1 className="luxury-title mb-5 text-white">
            {words.join(" ")}
            {accent ? (
              <>
                {" "}
                <em className="gold-italic">{accent}</em>
              </>
            ) : null}
          </h1>
          <p className="body-copy mx-auto max-w-2xl">
            {description}
          </p>

          <div className="mt-6 flex items-center justify-center gap-2 sm:gap-3">
            <span
              className="h-px w-8 sm:w-10"
              style={{ background: "linear-gradient(90deg, transparent, rgba(198,169,98,0.72), transparent)" }}
            />
            <span className="count-pill">
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
          <div className="glass-panel mx-auto max-w-2xl px-4 py-8 text-center sm:px-6 sm:py-10">
            <p className="body-copy mx-auto max-w-xl text-center body-copy-strong">
              {emptyMessage}
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
