import ProductBrowser from "@/components/commerce/ProductBrowser";
import { getAllProducts } from "@/lib/getAllProducts";

export const revalidate = 30;

export const metadata = {
  title: "Shop BOUT",
  description: "Shop the full BOUT menswear catalog with filters for category, price, size, color, and stock.",
};

export default async function ShopPage() {
  const products = await getAllProducts();

  return (
    <ProductBrowser
      initialProducts={products.slice(0, 50)}
      title="Shop BOUT"
      description="The full live catalog, rebuilt for faster browsing: category filters, price range, size, color, stock state, sorting, quick view, and clear empty states."
    />
  );
}
