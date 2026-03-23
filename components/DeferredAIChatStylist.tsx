"use client";

import dynamic from "next/dynamic";

const AIChatStylist = dynamic(() => import("./AIChatStylist"), {
  ssr: false,
});

export default function DeferredAIChatStylist() {
  return <AIChatStylist />;
}
