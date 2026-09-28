import type { InputHTMLAttributes } from "react";

export function Input({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-shadow placeholder:text-[rgba(61,48,37,0.62)] focus:ring-2 focus:ring-[#A87935] ${className}`}
      style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.72), rgba(248,241,229,0.48))",
        border: "1px solid rgba(123,103,82,0.22)",
        color: "rgba(61,48,37,0.92)",
      }}
    />
  );
}
