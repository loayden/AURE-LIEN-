import CategoryCollectionPage from "@/components/CategoryCollectionPage";

export const revalidate = 30;

export default function KoreanPage() {
  return (
    <CategoryCollectionPage
      title="Korean"
      category="korean"
      eyebrow="Korean Edit"
      description="Modern silhouettes arranged with more breathable spacing and easier touch targets on mobile."
      fullMobileCards
    />
  );
}
