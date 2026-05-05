import CategoryCollectionPage from "@/components/CategoryCollectionPage";

export const revalidate = 30;

export default function SneakersPage() {
  return (
    <CategoryCollectionPage
      title="Sneakers"
      category="sneakers"
      eyebrow="Footwear Edit"
      description="Sneakers now sit inside a more comfortable catalog shell with responsive gutters and cleaner vertical rhythm."
    />
  );
}
