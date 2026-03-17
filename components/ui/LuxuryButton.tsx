"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface LuxuryButtonProps {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
}

export default function LuxuryButton({
  href,
  onClick,
  children,
  variant = "outline",
  size = "md",
  className = "",
  disabled = false,
}: LuxuryButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-sans font-light tracking-[0.2em] uppercase transition-all duration-400 ease-out border border-brass";
  const variants = {
    primary: "bg-brass text-black hover:bg-brass-light hover:border-brass-light",
    outline: "bg-transparent text-ivory hover:bg-brass hover:text-black",
    ghost: "border-transparent text-ivory hover:text-brass hover:border-brass/50",
  };
  const sizes = {
    sm: "px-6 py-2.5 text-xs",
    md: "px-8 py-3 text-xs",
    lg: "px-10 py-4 text-sm",
  };

  const motionProps = {
    whileHover: { scale: disabled ? 1 : 1.02 },
    whileTap: { scale: disabled ? 1 : 0.98 },
    transition: { duration: 0.2 },
  };

  const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className} ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`;

  if (href) {
    return (
      <motion.div {...motionProps}>
        <Link href={href} className={classes} aria-disabled={disabled}>
          {children}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      {...motionProps}
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={classes}
    >
      {children}
    </motion.button>
  );
}
