import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "About | BOUT",
  description: "Learn about BOUT's design discipline, wardrobe point of view, and approach to modern menswear.",
  openGraph: {
    title: "About | BOUT",
    description: "The design point of view behind BOUT.",
    type: "website",
  },
};

export default function AboutLayout({ children }: { children: ReactNode }) {
  return children;
}
