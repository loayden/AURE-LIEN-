import type { ReactNode } from "react";

export function Card({ className = "", children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={`rounded-2xl p-5 sm:p-6 ${className}`}
      style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.72), rgba(248,241,229,0.56))",
        border: "1px solid rgba(123,103,82,0.18)",
        boxShadow: "0 20px 56px rgba(61,48,37,0.12), inset 0 1px 0 rgba(255,255,255,0.72)",
      }}
    >
      {children}
    </div>
  );
}
