import PartnerSubscriptionCheckoutPage from "@/components/PartnerSubscriptionCheckoutPage";
import { Suspense } from "react";

export const metadata = {
  title: "Partner Subscription Checkout | BOUT",
  description: "Subscribe to a paid BOUT boutique partner plan and save shop address details securely.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return (
    <Suspense
      fallback={
        <main className="liquid-page mobile-comfort min-h-screen px-3 pb-28 pt-16 sm:px-6 sm:pt-24 md:px-10">
          <div className="page-wrap max-w-4xl">
            <section className="glass-panel p-5 text-[#3D3025]">
              <p className="eyebrow mb-3">PARTNER CHECKOUT</p>
              <p className="body-copy">Loading partner checkout...</p>
            </section>
          </div>
        </main>
      }
    >
      <PartnerSubscriptionCheckoutPage />
    </Suspense>
  );
}
