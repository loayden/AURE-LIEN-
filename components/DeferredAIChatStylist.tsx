"use client";

import ClientErrorBoundary from "@/components/ClientErrorBoundary";
import { usePerformanceProfile } from "@/hooks/usePerformanceProfile";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const AIChatStylist = dynamic(() => import("./AIChatStylist"), {
  ssr: false,
});

export default function DeferredAIChatStylist() {
  const { lowEndDevice } = usePerformanceProfile();
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    let timeoutId: number | null = null;
    let idleId: number | null = null;

    const enable = () => setEnabled(true);
    const delay = lowEndDevice ? 2400 : 900;
    const idleWindow = window as Window & {
      requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
      cancelIdleCallback?: (handle: number) => void;
    };

    if (typeof idleWindow.requestIdleCallback === "function") {
      idleId = idleWindow.requestIdleCallback(() => enable(), { timeout: delay });
    } else {
      timeoutId = window.setTimeout(enable, delay);
    }

    // Let user interaction unlock the widget sooner on slow devices.
    window.addEventListener("pointerdown", enable, { once: true, passive: true });
    window.addEventListener("keydown", enable, { once: true });

    return () => {
      if (idleId !== null && typeof idleWindow.cancelIdleCallback === "function") {
        idleWindow.cancelIdleCallback(idleId);
      }
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
      window.removeEventListener("pointerdown", enable);
      window.removeEventListener("keydown", enable);
    };
  }, [lowEndDevice]);

  if (!enabled) return null;

  return (
    <ClientErrorBoundary fallback={null}>
      <AIChatStylist />
    </ClientErrorBoundary>
  );
}
