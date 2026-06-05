"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type AccountIntent = "buyer" | "partner" | "both";
type GoogleMode = "login" | "signup";

type GoogleCredentialResponse = {
  credential?: string;
};

type GoogleIdentityApi = {
  initialize: (options: {
    client_id: string;
    callback: (response: GoogleCredentialResponse) => void;
    ux_mode?: "popup" | "redirect";
    auto_select?: boolean;
  }) => void;
  renderButton: (
    parent: HTMLElement,
    options: {
      theme: "outline" | "filled_blue" | "filled_black";
      size: "large" | "medium" | "small";
      type: "standard" | "icon";
      shape: "pill" | "rectangular" | "circle" | "square";
      text: "signin_with" | "signup_with" | "continue_with";
      width: number;
    },
  ) => void;
};

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: GoogleIdentityApi;
      };
    };
  }
}

type Props = {
  mode: GoogleMode;
  accountIntent?: AccountIntent;
  redirect?: string;
  onError?: (message: string) => void;
};

const GOOGLE_SCRIPT_SRC = "https://accounts.google.com/gsi/client";
let googleScriptPromise: Promise<void> | null = null;
let googleInitializedClientId: string | null = null;
let googleCredentialHandler: ((response: GoogleCredentialResponse) => void) | null = null;

function loadGoogleIdentityScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.google?.accounts?.id) return Promise.resolve();
  if (googleScriptPromise) return googleScriptPromise;

  googleScriptPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src="${GOOGLE_SCRIPT_SRC}"]`,
    );

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener("error", () => reject(new Error("Google sign-in failed to load")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = GOOGLE_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.addEventListener("load", () => resolve(), { once: true });
    script.addEventListener("error", () => reject(new Error("Google sign-in failed to load")), { once: true });
    document.head.appendChild(script);
  });

  return googleScriptPromise;
}

function initializeGoogleIdentity(googleId: GoogleIdentityApi, clientId: string) {
  if (googleInitializedClientId === clientId) return;

  googleId.initialize({
    client_id: clientId,
    ux_mode: "popup",
    auto_select: false,
    callback: (response) => {
      googleCredentialHandler?.(response);
    },
  });
  googleInitializedClientId = clientId;
}

export default function GoogleSignInButton({
  mode,
  accountIntent = "buyer",
  redirect,
  onError,
}: Props) {
  const router = useRouter();
  const buttonRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [scriptReady, setScriptReady] = useState(false);
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  useEffect(() => {
    let cancelled = false;

    if (!clientId) return;

    loadGoogleIdentityScript()
      .then(() => {
        if (cancelled) return;
        const googleId = window.google?.accounts?.id;
        const parent = buttonRef.current;
        if (!googleId || !parent) throw new Error("Google sign-in is unavailable");

        parent.innerHTML = "";
        googleCredentialHandler = async (response) => {
          const credential = response.credential;
          if (!credential) {
            onError?.("Google did not return an identity token");
            return;
          }

          setLoading(true);
          onError?.("");
          try {
            const res = await fetch("/api/auth/google", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ credential, accountIntent }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Google sign-in failed");

            window.dispatchEvent(new Event("wishlist:invalidate"));
            router.push(redirect || (data?.user?.role === "admin" ? "/admin" : "/account"));
            router.refresh();
          } catch (error) {
            const message = error instanceof Error ? error.message : "Google sign-in failed";
            onError?.(message);
          } finally {
            setLoading(false);
          }
        };
        initializeGoogleIdentity(googleId, clientId);

        googleId.renderButton(parent, {
          theme: "outline",
          size: "large",
          type: "standard",
          shape: "pill",
          text: mode === "signup" ? "signup_with" : "signin_with",
          width: Math.min(360, Math.max(260, parent.offsetWidth || 320)),
        });
        setScriptReady(true);
      })
      .catch((error) => {
        if (cancelled) return;
        const message = error instanceof Error ? error.message : "Google sign-in failed to load";
        onError?.(message);
      });

    return () => {
      cancelled = true;
      googleCredentialHandler = null;
    };
  }, [accountIntent, clientId, mode, onError, redirect, router]);

  if (!clientId) {
    return (
      <button
        type="button"
        disabled
        className="flex min-h-[46px] w-full items-center justify-center rounded-full border px-4 text-[9px] font-light uppercase tracking-[0.28em] text-white/28"
        style={{
          borderColor: "rgba(255,248,236,0.10)",
          background: "rgba(255,248,236,0.035)",
        }}
      >
        Google sign-in not configured
      </button>
    );
  }

  return (
    <div
      className="relative flex min-h-[46px] w-full justify-center overflow-hidden rounded-full"
      aria-busy={loading}
    >
      <div
        ref={buttonRef}
        className={`flex min-h-[46px] w-full justify-center transition-opacity duration-300 ${
          loading ? "pointer-events-none opacity-35" : ""
        }`}
      />
      {(!scriptReady || loading) && (
        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center gap-2 rounded-full border text-[9px] font-light uppercase tracking-[0.26em]"
          style={{
            borderColor: "rgba(255,248,236,0.10)",
            background: "rgba(12,11,10,0.70)",
            color: "rgba(168,121,53,0.85)",
          }}
        >
          <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={1.3} />
          {loading ? "Connecting Google" : "Loading Google"}
        </div>
      )}
    </div>
  );
}
