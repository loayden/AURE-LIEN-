import type { Metadata } from "next";
import LegalDocumentPage from "@/components/LegalDocumentPage";

export const metadata: Metadata = {
  title: "Terms | BOUT",
  description: "BOUT storefront terms covering purchases, account use, availability, and order responsibilities.",
};

export default function TermsPage() {
  return (
    <LegalDocumentPage
      eyebrow="Legal"
      title="Terms"
      intro="Use of the BOUT storefront is subject to the operating terms below, including purchase flow, availability, and account responsibilities."
      sections={[
        {
          heading: "Store Access",
          body: [
            "The storefront is provided for personal browsing, account management, and lawful purchasing activity.",
            "We may update, pause, or remove products, content, or services without prior notice when inventory, operations, or compliance requires it.",
          ],
        },
        {
          heading: "Orders And Availability",
          body: [
            "Product availability, sizes, and pricing may change. Orders remain subject to review, payment confirmation, and fulfillment feasibility.",
            "If an item becomes unavailable after purchase, the store may contact the customer to adjust, replace, or refund the affected order.",
          ],
        },
        {
          heading: "Accounts And Conduct",
          body: [
            "Customers are responsible for providing accurate information and for keeping account credentials private.",
            "Use of the storefront for abusive, fraudulent, or disruptive behavior may result in account restriction or cancellation of access.",
          ],
        },
      ]}
    />
  );
}
