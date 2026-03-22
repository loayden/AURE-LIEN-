import products from "@/lib/productsData";
import ProductCard from "./ProductCard";

export default function ProductGrid() {
  return (
    <section className="mx-auto grid max-w-7xl grid-cols-1 gap-5 px-4 pb-24 sm:grid-cols-2 sm:gap-6 sm:px-6 lg:grid-cols-4 lg:gap-8 lg:px-8 lg:pb-40">
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
