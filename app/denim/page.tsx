import ProductCard from "@/components/ProductCard";
import productsData from "@/lib/productsData";

export default async function denimPage() {
  const products = productsData.filter((p) => p.category === "denim");

  return (
    <section className="bg-[#0b0b0b] text-white min-h-screen px-16 py-28">
      <h1 className="luxury-title text-6xl uppercase mb-20 text-center">
        Denim
      </h1>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {products.map((p: any) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400 text-xl">
          No products found in this category.
        </p>
      )}
    </section>
  );
}