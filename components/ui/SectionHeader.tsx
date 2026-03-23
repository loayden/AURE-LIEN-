"use client";

import { motion } from "framer-motion";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}

export default function SectionHeader({
  title,
  subtitle,
  align = "center",
  className = "",
}: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`${align === "center" ? "text-center" : "text-left"} ${className}`}
    >
      <h2 className="text-xl font-serif font-light text-ivory tracking-luxury-wide sm:text-2xl lg:text-display-md">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 max-w-xl text-[11px] font-light leading-relaxed tracking-[0.08em] text-ivory-muted/80 sm:text-sm lg:text-base">
          {subtitle}
        </p>
      )}
      <div
        className={`h-px w-16 bg-brass mt-6 ${align === "center" ? "mx-auto" : ""}`}
      />
    </motion.div>
  );
}
