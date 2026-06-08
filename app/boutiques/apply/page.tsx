import BoutiquePartnersPage from "@/components/BoutiquePartnersPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Start Boutique Trial | BOUT",
  description:
    "Submit your BOUT boutique partner application and save your 7-day Starter trial draft automatically.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function BoutiqueApplyPage() {
  return <BoutiquePartnersPage mode="application" />;
}
