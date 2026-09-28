"use client";

import { motion, type MotionProps } from "framer-motion";
import Link from "next/link";
import { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "gold" | "ghost" | "outline";
export type ButtonSize = "sm" | "md" | "lg";

const baseStyles =
  "inline-flex min-h-[44px] items-center justify-center gap-2 font-sans font-light uppercase transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]";

const motionProps: MotionProps = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 },
  transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] },
};

const variants: Record<ButtonVariant, string> = {
  primary: "btn-primary",
  gold: "btn-gold-glass",
  ghost: "btn-ghost",
  outline: "btn-outline",
};

const sizes: Record<ButtonSize, string> = {
  sm: "px-5 py-3 text-[10px] tracking-[0.3em]",
  md: "px-8 py-4 text-[11px] tracking-[0.15em]",
  lg: "px-10 py-5 text-[11px] tracking-[0.15em]",
};

type SafeButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 
  "onDrag" | "onDragStart" | "onDragEnd" | "onDragOver" | "onDragLeave" | "onDragEnter" | "onDrop" |
  "onAnimationStart" | "onAnimationEnd" | "onAnimationIteration" |
  "onTransitionStart" | "onTransitionEnd" | "onTransitionRun" | "onTransitionCancel" |
  "onBeforeUnload" | "onError" | "onLoad" | "onUnload" |
  "onCopy" | "onCut" | "onPaste" |
  "onSelect" | "onSelectionChange" |
  "onScroll" | "onScrollEnd" |
  "onWheel" |
  "onTouchStart" | "onTouchEnd" | "onTouchMove" | "onTouchCancel" |
  "onPointerDown" | "onPointerUp" | "onPointerMove" | "onPointerOver" | "onPointerOut" | "onPointerEnter" | "onPointerLeave" | "onPointerCancel" | "onGotPointerCapture" | "onLostPointerCapture" |
  "onFocus" | "onBlur" | "onFocusIn" | "onFocusOut" |
  "onKeyDown" | "onKeyUp" | "onKeyPress"
>;

interface UnifiedButtonProps extends SafeButtonProps {
  href?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  fullWidth?: boolean;
}

export function UnifiedButton({
  href,
  onClick,
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  fullWidth = false,
  type = "button",
  form,
  formAction,
  formEncType,
  formMethod,
  formNoValidate,
  formTarget,
  name,
  value,
  autoFocus,
  ...props
}: UnifiedButtonProps) {
  const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? "w-full" : ""} ${className} ${disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}`;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled && onClick) {
      onClick(e);
    }
  };

  const safeProps = {
    type,
    form,
    formAction,
    formEncType,
    formMethod,
    formNoValidate,
    formTarget,
    name,
    value,
    autoFocus,
  };

  if (href) {
    return (
      <motion.div {...motionProps} style={{ display: "inline-flex" }} role="button">
        <Link
          href={href}
          className={classes}
          aria-disabled={disabled}
          onClick={disabled ? (e) => e.preventDefault() : undefined}
        >
          {children}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      {...motionProps}
      onClick={handleClick}
      disabled={disabled}
      className={classes}
      {...safeProps}
      {...props}
    >
      {children}
    </motion.button>
  );
}

export default UnifiedButton;