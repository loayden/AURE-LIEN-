import BoutiquePartnersPage from "@/components/BoutiquePartnersPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Start Boutique Trial | BOUT",
  description:
    "Submit your BOUT boutique partner application, including an online-only option if you do not have a physical boutique yet.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function BoutiqueApplyPage() {
  return <BoutiquePartnersPage mode="application" />;
}
