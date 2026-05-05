import CategoryCollectionPage from "@/components/CategoryCollectionPage";

export const revalidate = 30;

export const metadata = {
  title: "Pants & Denim | BOUT",
  description: "Browse BOUT trousers, denim, Korean pants, and relaxed silhouettes.",
};

export default function PantsDenimPage() {
  return (
    <CategoryCollectionPage
      title="Pants & Denim"
      category="pants-denim"
      description="Tailored trousers, denim, and relaxed shapes with filters for size, color, price, and availability."
    />
  );
}
