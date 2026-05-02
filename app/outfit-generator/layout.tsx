import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Outfit Generator | BOUT",
  description: "Generate curated outfit combinations from BOUT products by occasion, style, and season.",
  openGraph: {
    title: "Outfit Generator | BOUT",
    description: "Curated outfit combinations from the BOUT catalogue.",
    type: "website",
  },
};

export default function OutfitGeneratorLayout({ children }: { children: ReactNode }) {
  return children;
}
