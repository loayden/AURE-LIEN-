import products from "@/lib/productsData";
import ProductCard from "./ProductCard";

export default function ProductGrid() {
  return (
    <section className="product-grid-shell mx-auto max-w-7xl px-4 pb-16 sm:px-6 sm:pb-24 md:px-10 md:pb-32">
      {products.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
          className="transition-transform duration-300 hover:scale-[1.03] hover:shadow-lg hover:shadow-[#A87935]/25 rounded-xl"
        />
      ))}
    </section>
  );
}
