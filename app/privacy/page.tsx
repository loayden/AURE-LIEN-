import type { Metadata } from "next";
import LegalDocumentPage from "@/components/LegalDocumentPage";

export const metadata: Metadata = {
  title: "Privacy | BOUT",
  description: "How BOUT uses customer information for orders, service, and store reliability.",
};

export default function PrivacyPage() {
  return (
    <LegalDocumentPage
      eyebrow="Legal"
      title="Privacy"
      intro="BOUT keeps customer information limited to what is required to operate the store, support orders, and improve service quality."
      sections={[
        {
          heading: "Information We Use",
          body: [
            "We may store contact details, delivery information, order history, and account activity when you create an account, place an order, or contact the store.",
            "Basic technical information such as browser, session, and device-related signals may also be used to keep the storefront stable and secure.",
          ],
        },
        {
          heading: "How It Is Used",
          body: [
            "Customer information is used to process orders, provide support, manage account access, and communicate operational updates related to purchases.",
            "We may also use aggregate storefront activity to understand performance and improve merchandising, navigation, and service quality.",
          ],
        },
        {
          heading: "Protection And Retention",
          body: [
            "Information is retained only as long as it remains relevant for order fulfillment, compliance, support, or store operations.",
            "Reasonable technical and operational safeguards are applied to reduce unauthorized access, misuse, or disclosure.",
          ],
        },
      ]}
    />
  );
}
