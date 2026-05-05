import CategoryCollectionPage from "@/components/CategoryCollectionPage";

export const revalidate = 30;

export default function KnitwearPage() {
  return (
    <CategoryCollectionPage
      title="Knitwear"
      category="knitwear"
      eyebrow="Knitwear Edit"
      description="Softer section rhythm and cleaner responsive grid behavior for knitwear on every device."
    />
  );
}
