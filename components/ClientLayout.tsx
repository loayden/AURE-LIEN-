"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";

type SessionResponse = {
  userId?: string;
};

function createFallbackUserId() {
  return `anon_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}

export default function ClientLayout({ children }: { children: ReactNode }) {
  useEffect(() => {
    let active = true;

    async function syncUserId() {
      const existingUserId = window.localStorage.getItem("userId");

      try {
        const response = await fetch("/api/session", {
          cache: "no-store",
          credentials: "same-origin",
        });

        if (!response.ok) {
          throw new Error(`Session bootstrap failed with status ${response.status}`);
        }

        const data = (await response.json()) as SessionResponse;
        const sessionUserId = data.userId?.trim();

        if (!active || !sessionUserId) {
          return;
        }

        window.localStorage.setItem("userId", sessionUserId);

        if (!existingUserId) {
          console.info("✅ Created userId:", sessionUserId);
        } else if (existingUserId === sessionUserId) {
          console.info("✅ Using existing userId:", sessionUserId);
        } else {
          console.info("✅ Synced userId:", sessionUserId);
        }

        return;
      } catch {
        const fallbackUserId = existingUserId || createFallbackUserId();

        if (!active) {
          return;
        }

        window.localStorage.setItem("userId", fallbackUserId);

        if (!existingUserId) {
          console.info("✅ Created userId:", fallbackUserId);
        } else {
          console.info("✅ Using existing userId:", fallbackUserId);
        }
      }
    }

    void syncUserId();

    return () => {
      active = false;
    };
  }, []);

  return <>{children}</>;
}
