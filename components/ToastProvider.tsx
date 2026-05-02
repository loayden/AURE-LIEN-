"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Info, X, XCircle } from "lucide-react";
import { useEffect, useState } from "react";

type ToastTone = "success" | "error" | "info";

type Toast = {
  id: number;
  message: string;
  title?: string;
  tone: ToastTone;
};

type ToastEventDetail = {
  message?: string;
  title?: string;
  tone?: ToastTone;
};

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
};

export function showToast(detail: ToastEventDetail) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("toast:show", { detail }));
}

export default function ToastProvider() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const onToast = (event: Event) => {
      const detail = (event as CustomEvent<ToastEventDetail>).detail ?? {};
      const message = detail.message?.trim();
      if (!message) return;

      const id = Date.now() + Math.floor(Math.random() * 1000);
      const toast: Toast = {
        id,
        message,
        title: detail.title,
        tone: detail.tone ?? "info",
      };

      setToasts((current) => [...current, toast].slice(-4));
      window.setTimeout(() => {
        setToasts((current) => current.filter((item) => item.id !== id));
      }, 3600);
    };

    window.addEventListener("toast:show", onToast);
    return () => window.removeEventListener("toast:show", onToast);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-3 top-16 z-[90] flex flex-col items-end gap-2 sm:inset-x-auto sm:right-5 sm:top-20 sm:w-[380px]">
      <AnimatePresence initial={false}>
        {toasts.map((toast) => {
          const Icon = ICONS[toast.tone];
          const isError = toast.tone === "error";
          const isSuccess = toast.tone === "success";

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 24, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 24, scale: 0.98 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-auto w-full overflow-hidden rounded-2xl px-4 py-3"
              style={{
                background: "linear-gradient(135deg, rgba(20,17,15,0.92), rgba(14,11,10,0.96))",
                border: isError
                  ? "1px solid rgba(255,100,100,0.24)"
                  : isSuccess
                    ? "1px solid rgba(201,168,106,0.26)"
                    : "1px solid rgba(255,248,236,0.12)",
                boxShadow: "0 18px 50px rgba(0,0,0,0.42), inset 0 1px 0 rgba(255,248,236,0.10)",
                backdropFilter: "blur(24px) saturate(160%)",
                WebkitBackdropFilter: "blur(24px) saturate(160%)",
              }}
            >
              <div className="flex gap-3">
                <span
                  className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl"
                  style={{
                    background: isError ? "rgba(255,90,90,0.10)" : "rgba(201,168,106,0.12)",
                    color: isError ? "rgba(255,130,130,0.88)" : "#C9A86A",
                  }}
                >
                  <Icon className="h-4 w-4" strokeWidth={1.5} />
                </span>
                <div className="min-w-0 flex-1">
                  {toast.title ? (
                    <p className="mb-1 text-[9px] uppercase tracking-[0.28em] text-white/38">
                      {toast.title}
                    </p>
                  ) : null}
                  <p className="text-sm font-light leading-relaxed text-white/76">
                    {toast.message}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setToasts((current) => current.filter((item) => item.id !== toast.id))}
                  aria-label="Dismiss notification"
                  className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-white/35 transition-colors hover:text-white"
                >
                  <X className="h-4 w-4" strokeWidth={1.5} />
                </button>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
