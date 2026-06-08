import PartnerSubscriptionPlansPage from "@/components/PartnerSubscriptionPlansPage";

export const metadata = {
  title: "Partner Subscription Plans | BOUT",
  description: "Choose a BOUT boutique partner plan after the Starter trial or upgrade an existing boutique.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <PartnerSubscriptionPlansPage />;
}
