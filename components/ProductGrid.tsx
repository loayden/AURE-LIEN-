import products from "@/lib/productsData";
import ProductCard from "./ProductCard";

export default function ProductGrid() {
  return (
    <section className="max-w-7xl mx-auto px-6 pb-40 grid md:grid-cols-4 gap-20">
      {products.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
          className="transition-transform duration-300 hover:scale-[1.03] hover:shadow-lg hover:shadow-[#C6A962]/25 rounded-xl"
        />
      ))}
    </section>
  );
}
