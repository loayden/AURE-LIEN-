import CategoryCollectionPage from "@/components/CategoryCollectionPage";

export const revalidate = 30;

export default function BeltsPage() {
  return (
    <CategoryCollectionPage
      title="Belts"
      category="belts"
      eyebrow="Accessories Edit"
      description="Belts are now displayed with improved mobile rhythm, more comfortable padding, and cleaner visual density."
    />
  );
}
