import BoutiquePartnersPage from "@/components/BoutiquePartnersPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Boutique Partners Egypt | BOUT",
  description:
    "Partner with BOUT in Egypt. Register a boutique location, product categories, free trial length, commission model, and monthly plan.",
};

export default function BoutiquesPage() {
  return <BoutiquePartnersPage />;
}
