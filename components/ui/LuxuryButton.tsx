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
    "inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 font-sans font-light uppercase transition-all duration-400 ease-out";
  const variants = {
    primary: "btn-gold",
    outline: "btn-ghost",
    ghost: "btn-ghost border-transparent bg-transparent shadow-none",
  };
  const sizes = {
    sm: "px-4 py-3 text-[10px]",
    md: "px-6 py-3.5 text-[10px]",
    lg: "px-8 py-4 text-[10px]",
  };

  const motionProps = {
    whileHover: { scale: disabled ? 1 : 1.02 },
    whileTap: { scale: disabled ? 1 : 0.98 },
    transition: { duration: 0.2 },
  };

  const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`;

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
