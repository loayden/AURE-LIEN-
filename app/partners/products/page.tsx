import PartnerProductsPage from "@/components/PartnerProductsPage";

export const metadata = {
  title: "Partner Product Desk | BOUT",
  description: "Submit boutique partner products for BOUT admin review before they appear in the live shop.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <PartnerProductsPage />;
}
