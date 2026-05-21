import HomePageClient from "@/components/HomePageClient";
import { getAllProducts } from "@/lib/getAllProducts";

export const revalidate = 30;

export default async function HomePage() {
  const products = await getAllProducts();

  return <HomePageClient initialProducts={products} />;
}
