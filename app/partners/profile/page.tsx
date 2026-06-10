import PartnerProfilePage from "@/components/PartnerProfilePage";

export const metadata = {
  title: "Partner Profile | BOUT",
  description: "View boutique partner status, payout readiness, subscription, and product workspace links.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <PartnerProfilePage />;
}
