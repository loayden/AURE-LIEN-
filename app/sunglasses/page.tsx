import CategoryCollectionPage from "@/components/CategoryCollectionPage";

export const revalidate = 30;

export default function SunglassesPage() {
  return (
    <CategoryCollectionPage
      title="Sunglasses"
      category="sunglasses"
      eyebrow="Accessories Edit"
      description="Sunglasses now live in the same responsive catalog shell for more comfortable image sizing on smaller screens."
    />
  );
}
