"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Info, X } from "lucide-react";
import { useEffect, useState } from "react";

export type ToastType = "success" | "error" | "info";

type ToastItem = {
  id: string;
  message: string;
  type: ToastType;
};

const TOAST_STYLES: Record<
  ToastType,
  {
    background: string;
    borderColor: string;
    textColor: string;
    iconBackground: string;
    iconColor: string;
    closeColor: string;
    closeHoverColor: string;
  }
> = {
  success: {
    background: "linear-gradient(135deg, rgba(249,255,246,0.98), rgba(255,249,239,0.98))",
    borderColor: "rgba(37,105,68,0.26)",
    textColor: "#274D35",
    iconBackground: "rgba(37,105,68,0.12)",
    iconColor: "#256944",
    closeColor: "rgba(61,48,37,0.62)",
    closeHoverColor: "#3D3025",
  },
  error: {
    background: "linear-gradient(135deg, rgba(255,245,242,0.98), rgba(255,249,239,0.98))",
    borderColor: "rgba(154,34,34,0.26)",
    textColor: "#8B1E1E",
    iconBackground: "rgba(154,34,34,0.12)",
    iconColor: "#9A2222",
    closeColor: "rgba(61,48,37,0.62)",
    closeHoverColor: "#3D3025",
  },
  info: {
    background: "linear-gradient(135deg, rgba(255,249,239,0.98), rgba(245,241,232,0.98))",
    borderColor: "rgba(122,88,31,0.28)",
    textColor: "#3D3025",
    iconBackground: "rgba(122,88,31,0.12)",
    iconColor: "#7A581F",
    closeColor: "rgba(61,48,37,0.62)",
    closeHoverColor: "#3D3025",
  },
};

export function showToast(message: string, type: ToastType = "info") {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("bout:toast", {
      detail: { message, type },
    })
  );
}

function ToastIcon({ type }: { type: ToastType }) {
  if (type === "success") return <CheckCircle2 className="h-4 w-4" strokeWidth={1.4} />;
  if (type === "error") return <AlertTriangle className="h-4 w-4" strokeWidth={1.4} />;
  return <Info className="h-4 w-4" strokeWidth={1.4} />;
}

export default function ToastProvider() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    function onToast(event: Event) {
      const detail = (event as CustomEvent).detail ?? {};
      const message = typeof detail.message === "string" ? detail.message : "";
      if (!message) return;

      const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const type: ToastType = detail.type === "success" || detail.type === "error" ? detail.type : "info";
      setToasts((current) => [...current, { id, message, type }].slice(-4));
      window.setTimeout(() => {
        setToasts((current) => current.filter((toast) => toast.id !== id));
      }, 4200);
    }

    window.addEventListener("bout:toast", onToast);
    return () => window.removeEventListener("bout:toast", onToast);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-3 top-[70px] z-[120] flex flex-col items-end gap-2 sm:top-[78px]">
      <AnimatePresence initial={false}>
        {toasts.map((toast) => (
          (() => {
            const styles = TOAST_STYLES[toast.type];
            return (
              <motion.div
                key={toast.id}
                layout
                initial={{ opacity: 0, y: -12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border px-4 py-3 text-sm shadow-[0_22px_56px_rgba(61,48,37,0.18)] backdrop-blur-2xl"
                style={{
                  background: styles.background,
                  borderColor: styles.borderColor,
                  color: styles.textColor,
                }}
                role="status"
              >
                <span
                  className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                  style={{
                    background: styles.iconBackground,
                    color: styles.iconColor,
                  }}
                >
                  <ToastIcon type={toast.type} />
                </span>
                <p className="flex-1 pt-1 text-[11px] leading-5 tracking-[0.08em]">{toast.message}</p>
                <button
                  type="button"
                  onClick={() => setToasts((current) => current.filter((item) => item.id !== toast.id))}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors"
                  style={{
                    color: styles.closeColor,
                  }}
                  onMouseEnter={(event) => {
                    event.currentTarget.style.color = styles.closeHoverColor;
                  }}
                  onMouseLeave={(event) => {
                    event.currentTarget.style.color = styles.closeColor;
                  }}
                  aria-label="Dismiss notification"
                >
                  <X className="h-3.5 w-3.5" strokeWidth={1.4} />
                </button>
              </motion.div>
            );
          })()
        ))}
      </AnimatePresence>
    </div>
  );
}
