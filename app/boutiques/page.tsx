import BoutiquePartnersPage from "@/components/BoutiquePartnersPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Boutique Partners Egypt | BOUT",
  description:
    "Partner with BOUT in Egypt. Start with Starter Boutique for 7 free days, then continue monthly or upgrade to a paid boutique plan.",
};

export default function BoutiquesPage() {
  return <BoutiquePartnersPage />;
}
