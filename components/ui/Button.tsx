import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A87935] disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary: "text-white shadow-md",
  secondary: "border",
  ghost: "bg-transparent",
};

export function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; children: ReactNode }) {
  const style =
    variant === "primary"
      ? { background: "linear-gradient(135deg, #4C3A26 0%, #7D592B 100%)", border: "1px solid rgba(168,121,53,0.4)" }
      : variant === "secondary"
        ? { border: "1px solid rgba(61,48,37,0.25)", color: "#3D3025", background: "rgba(255,255,255,0.6)" }
        : { color: "var(--gold-text)" };
  return (
    <button {...props} style={variant === "ghost" ? { color: "var(--gold-text)" } : style} className={`${base} ${variants[variant]} px-5 py-2.5 text-sm ${className}`}>
      {children}
    </button>
  );
}
