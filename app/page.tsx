import HomePageClient from "@/components/HomePageClient";
import { getAllProducts } from "@/lib/getAllProducts";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const products = await getAllProducts();

  return <HomePageClient initialProducts={products} />;
}
