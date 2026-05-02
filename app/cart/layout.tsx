import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Cart | BOUT",
  description: "Review selected BOUT items before checkout.",
  robots: { index: false, follow: false },
};

export default function CartLayout({ children }: { children: ReactNode }) {
  return children;
}
