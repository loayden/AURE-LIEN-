import CategoryCollectionPage from "@/components/CategoryCollectionPage";

export const revalidate = 30;

export default function DenimPage() {
  return (
    <CategoryCollectionPage
      title="Denim"
      category="denim"
      eyebrow="Denim Edit"
      description="A sharper denim catalog with more forgiving gutters and card spacing for one-hand browsing."
      fullMobileCards
    />
  );
}
