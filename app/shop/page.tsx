import ProductBrowser from "@/components/commerce/ProductBrowser";

export const metadata = {
  title: "Shop BOUT",
  description: "Shop the full BOUT menswear catalog with filters for category, price, size, color, and stock.",
};

export default function ShopPage() {
  return (
    <ProductBrowser
      title="Shop BOUT"
      description="The full live catalog, rebuilt for faster browsing: category filters, price range, size, color, stock state, sorting, quick view, and clear empty states."
    />
  );
}
