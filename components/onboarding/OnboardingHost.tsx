"use client";

import WelcomeOnboarding, { ONBOARDING_REPLAY_EVENT } from "@/components/onboarding/WelcomeOnboarding";
import { AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const FLAG_PREFIX = "bout:onboarded:v1:";
const RESOLVED_KEY = "bout:ob:resolved";
const GUEST_KEY = "bout:ob:guest";
const LOGIN_EVENT = "wishlist:invalidate";

// Accounts created within this window are treated as genuinely new.
// Older accounts never see the welcome (they predate the feature or
// already had their chance) — completion is still recorded for them.
const NEW_ACCOUNT_WINDOW_MS = 72 * 60 * 60 * 1000;

const SKIPPED_PREFIXES = ["/login", "/signup", "/forgot-password", "/reset-password", "/admin"];

type MeUser = {
  id?: string;
  name?: string | null;
  role?: string | null;
  accountIntent?: string | null;
  createdAt?: string | null;
};

function flagFor(userId: string) {
  return `${FLAG_PREFIX}${userId}`;
}

function isFreshAccount(createdAt?: string | null) {
  if (!createdAt) return false;
  const time = Date.parse(createdAt);
  if (Number.isNaN(time)) return false;
  return Date.now() - time <= NEW_ACCOUNT_WINDOW_MS;
}

export default function OnboardingHost() {
  const pathname = usePathname();
  const [user, setUser] = useState<MeUser | null>(null);
  const [portalReady, setPortalReady] = useState(false);
  const checkingRef = useRef(false);

  const resolve = useCallback(() => {
    try {
      sessionStorage.setItem(RESOLVED_KEY, "1");
    } catch {
      // storage unavailable — overlay simply won't re-trigger this session
    }
    setUser(null);
  }, []);

  const evaluate = useCallback(async () => {
    if (checkingRef.current) return;
    if (typeof window === "undefined") return;
    try {
      if (sessionStorage.getItem(RESOLVED_KEY)) return;
      if (sessionStorage.getItem(GUEST_KEY)) return;
    } catch {
      return;
    }
    checkingRef.current = true;
    try {
      const res = await fetch("/api/users/me", { cache: "no-store" });
      if (!res.ok) {
        // Guest: stay quiet until a login event wakes us up.
        try {
          sessionStorage.setItem(GUEST_KEY, "1");
        } catch {
          // ignore
        }
        return;
      }
      const data = (await res.json().catch(() => null)) as MeUser | null;
      const id = String(data?.id ?? "");
      if (!id || id === "env-admin" || data?.role === "admin") {
        resolve();
        return;
      }
      let seen = false;
      try {
        seen = localStorage.getItem(flagFor(id)) === "1";
      } catch {
        seen = false;
      }
      if (seen) {
        resolve();
        return;
      }
      if (!isFreshAccount(data?.createdAt)) {
        // Genuinely old account — record completion silently, never show.
        try {
          localStorage.setItem(flagFor(id), "1");
        } catch {
          // ignore
        }
        resolve();
        return;
      }
      try {
        sessionStorage.removeItem(GUEST_KEY);
      } catch {
        // ignore
      }
      setUser({
        id,
        name: data?.name ?? null,
        role: data?.role ?? null,
        accountIntent: data?.accountIntent ?? null,
        createdAt: data?.createdAt ?? null,
      });
    } finally {
      checkingRef.current = false;
    }
  }, [resolve]);

  const complete = useCallback(() => {
    setUser((current) => {
      if (current?.id) {
        try {
          localStorage.setItem(flagFor(current.id), "1");
        } catch {
          // ignore
        }
      }
      return current;
    });
    resolve();
  }, [resolve]);

  useEffect(() => {
    setPortalReady(true);
  }, []);

  // Re-evaluate on navigation (covers login redirects + replay-safe pages).
  useEffect(() => {
    if (!pathname) return;
    if (SKIPPED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) return;
    void evaluate();
  }, [pathname, evaluate]);

  // Login success fires `wishlist:invalidate` — wake up from the guest state.
  useEffect(() => {
    function onAuthChange() {
      try {
        sessionStorage.removeItem(GUEST_KEY);
        sessionStorage.removeItem(RESOLVED_KEY);
      } catch {
        // ignore
      }
      setUser(null);
      void evaluate();
    }
    window.addEventListener(LOGIN_EVENT, onAuthChange);
    return () => window.removeEventListener(LOGIN_EVENT, onAuthChange);
  }, [evaluate]);

  // Explicit replay (e.g. from Account → Security).
  useEffect(() => {
    async function onReplay() {
      try {
        const res = await fetch("/api/users/me", { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json().catch(() => null)) as MeUser | null;
        const id = String(data?.id ?? "");
        if (!id) return;
        setUser({
          id,
          name: data?.name ?? null,
          role: data?.role ?? null,
          accountIntent: data?.accountIntent ?? null,
          createdAt: data?.createdAt ?? null,
        });
      } catch {
        // stay silent — replay is optional
      }
    }
    window.addEventListener(ONBOARDING_REPLAY_EVENT, onReplay);
    return () => window.removeEventListener(ONBOARDING_REPLAY_EVENT, onReplay);
  }, []);

  if (!portalReady) return null;

  return createPortal(
    <AnimatePresence>
      {user ? (
        <WelcomeOnboarding
          key={user.id}
          userName={user.name}
          accountIntent={user.accountIntent}
          onDone={complete}
        />
      ) : null}
    </AnimatePresence>,
    document.body
  );
}
