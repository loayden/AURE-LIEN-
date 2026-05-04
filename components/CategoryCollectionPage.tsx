import ProductBrowser from "@/components/commerce/ProductBrowser";
import { getCategoryMeta } from "@/lib/commerce";

interface CategoryCollectionPageProps {
  title: string;
  category: string;
  eyebrow?: string;
  description?: string;
  emptyMessage?: string;
  fullMobileCards?: boolean;
}

export default function CategoryCollectionPage({
  title,
  category,
  description = "A focused edit sized for comfortable browsing across phones, tablets, and desktop.",
  emptyMessage = "No products found in this category.",
}: CategoryCollectionPageProps) {
  return (
    <ProductBrowser
      title={title}
      description={description || getCategoryMeta(category)?.copy || emptyMessage}
      category={category}
      lockCategory
      heroImage={getCategoryMeta(category)?.image}
    />
  );
}
