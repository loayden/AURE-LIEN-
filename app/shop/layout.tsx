import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Shop | BOUT",
  description: "Shop the BOUT catalogue of jackets, denim, footwear, accessories, and tailored wardrobe pieces.",
  openGraph: {
    title: "Shop | BOUT",
    description: "Explore the current BOUT catalogue.",
    type: "website",
  },
};

export default function ShopLayout({ children }: { children: ReactNode }) {
  return children;
}
