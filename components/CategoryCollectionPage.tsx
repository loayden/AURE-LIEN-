import ProductBrowser from "@/components/commerce/ProductBrowser";
import { categoryMatches, getCategoryMeta } from "@/lib/commerce";
import { getAllProducts } from "@/lib/getAllProducts";

interface CategoryCollectionPageProps {
  title: string;
  category: string;
  eyebrow?: string;
  description?: string;
  emptyMessage?: string;
  fullMobileCards?: boolean;
}

export default async function CategoryCollectionPage({
  title,
  category,
  description = "A focused edit sized for comfortable browsing across phones, tablets, and desktop.",
  emptyMessage = "No products found in this category.",
}: CategoryCollectionPageProps) {
  const products = await getAllProducts();
  const initialProducts = products
    .filter((product) => categoryMatches(product, category))
    .slice(0, 50);

  return (
    <ProductBrowser
      initialProducts={initialProducts}
      title={title}
      description={description || getCategoryMeta(category)?.copy || emptyMessage}
      category={category}
      lockCategory
      heroImage={getCategoryMeta(category)?.image}
    />
  );
}
