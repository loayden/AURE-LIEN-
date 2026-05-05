import CategoryCollectionPage from "@/components/CategoryCollectionPage";

export const revalidate = 30;

export default function BootsPage() {
  return (
    <CategoryCollectionPage
      title="Boots"
      category="boots"
      eyebrow="Footwear Edit"
      description="Boots now sit inside a more compact mobile-first catalog shell without the oversized desktop padding."
    />
  );
}
