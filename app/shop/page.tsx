import ProductBrowser from "@/components/commerce/ProductBrowser";
import { getAllProducts } from "@/lib/getAllProducts";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Shop BOUT",
  description: "Shop the full BOUT menswear catalog with filters for category, price, size, color, and stock.",
};

export default async function ShopPage() {
  const products = await getAllProducts();

  return (
    <ProductBrowser
      initialProducts={products}
      title="Shop BOUT"
      description="The full live catalog, rebuilt for faster browsing: category filters, price range, size, color, stock state, sorting, quick view, and clear empty states."
      showIntro={false}
      compactCards
    />
  );
}
