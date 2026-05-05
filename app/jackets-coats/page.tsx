import CategoryCollectionPage from "@/components/CategoryCollectionPage";

export const revalidate = 30;

export const metadata = {
  title: "Jackets & Coats | BOUT",
  description: "Shop BOUT jackets and coats with clear stock, size, color, and price filters.",
};

export default function JacketsPage() {
  return (
    <CategoryCollectionPage
      title="Jackets & Coats"
      category="jackets-coats"
      eyebrow="Outerwear Edit"
      description="Structured outer layers with mobile-friendly spacing, imagery, and card sizing across the full catalog."
      fullMobileCards
    />
  );
}
