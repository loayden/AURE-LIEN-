import CategoryCollectionPage from "@/components/CategoryCollectionPage";

export const revalidate = 30;

export default function LoafersPage() {
  return (
    <CategoryCollectionPage
      title="Loafers"
      category="loafers"
      eyebrow="Footwear Edit"
      description="Loafers now render with smaller mobile gutters, calmer typography, and a more comfortable card grid."
    />
  );
}
