import CategoryCollectionPage from "@/components/CategoryCollectionPage";

export const revalidate = 30;

export default function JeansPage() {
  return (
    <CategoryCollectionPage
      title="Jeans"
      category="jeans"
      eyebrow="Pants Edit"
      description="A cleaner jeans catalog with more forgiving gutters, spacing, and card rhythm for phone users."
      fullMobileCards
    />
  );
}
