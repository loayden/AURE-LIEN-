import type { Metadata } from "next";
import LegalDocumentPage from "@/components/LegalDocumentPage";

export const metadata: Metadata = {
  title: "Cookies | BOUT",
  description: "How BOUT uses cookies and similar storage for sessions, carts, preferences, and reliability.",
};

export default function CookiesPage() {
  return (
    <LegalDocumentPage
      eyebrow="Legal"
      title="Cookies"
      intro="Cookies and similar storage may be used to preserve sessions, keep carts and preferences stable, and support storefront reliability."
      sections={[
        {
          heading: "Essential Cookies",
          body: [
            "Essential cookies help the storefront maintain login state, protect account actions, preserve basket behavior, and support checkout flow.",
            "Without these cookies, some user-facing functions such as account access, carts, and protected pages may not work correctly.",
          ],
        },
        {
          heading: "Functional Storage",
          body: [
            "Functional storage may remember interface state, product interactions, or temporary order-related information to improve continuity across visits.",
            "These mechanisms are intended to reduce friction and help the storefront respond more consistently to returning visitors.",
          ],
        },
        {
          heading: "Managing Preferences",
          body: [
            "Browser settings can be used to restrict or remove cookies, but doing so may affect storefront performance and session behavior.",
            "Customers who clear browser storage may need to sign in again or recreate temporary selections such as carts or preferences.",
          ],
        },
      ]}
    />
  );
}
