import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Lookbook | BOUT",
  description: "Browse BOUT lookbook edits and styling references across the current catalogue.",
  openGraph: {
    title: "Lookbook | BOUT",
    description: "Editorial styling references from BOUT.",
    type: "website",
  },
};

export default function LookbookLayout({ children }: { children: ReactNode }) {
  return children;
}
