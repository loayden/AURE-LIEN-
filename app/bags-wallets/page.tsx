import CategoryCollectionPage from "@/components/CategoryCollectionPage";

export const revalidate = 30;

export default function BagsPage() {
  return (
    <CategoryCollectionPage
      title="Bags & Wallets"
      category="bags-wallets"
      eyebrow="Accessories Edit"
      description="Leather goods now use a roomier catalog layout that feels less cramped on mobile widths."
    />
  );
}
