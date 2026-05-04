import CategoryCollectionPage from "@/components/CategoryCollectionPage";

export const metadata = {
  title: "Accessories | BOUT",
  description: "Shop BOUT accessories including sunglasses, belts, bags, and wallets.",
};

export default function AccessoriesPage() {
  return (
    <CategoryCollectionPage
      title="Accessories"
      category="accessories"
      description="Finishing pieces with real product images, stock badges, and clear category filtering."
    />
  );
}
