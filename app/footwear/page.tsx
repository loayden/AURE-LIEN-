import CategoryCollectionPage from "@/components/CategoryCollectionPage";

export const revalidate = 30;

export const metadata = {
  title: "Footwear | BOUT",
  description: "Shop BOUT footwear including sneakers, loafers, boots, and lace-ups.",
};

export default function FootwearPage() {
  return (
    <CategoryCollectionPage
      title="Footwear"
      category="footwear"
      description="Footwear with precise silhouettes, clear stock states, and mobile-friendly product browsing."
    />
  );
}
