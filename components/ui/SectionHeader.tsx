"use client";

import { motion } from "framer-motion";

interface SectionHeaderProps {
  title: string;
  eyebrow?: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}

function renderTitle(title: string) {
  const words = title.trim().split(/\s+/).filter(Boolean)

  if (words.length < 2) {
    return title
  }

  const accent = words.pop()

  return (
    <>
      {words.join(" ")} <em className="gold-italic">{accent}</em>
    </>
  )
}

export default function SectionHeader({
  title,
  eyebrow,
  subtitle,
  align = "center",
  className = "",
}: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`${align === "center" ? "text-center" : "text-left"} ${className}`}
    >
      {eyebrow ? <p className="eyebrow mb-4">{eyebrow}</p> : null}
      <h2
        className="font-light text-white"
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: "clamp(1.8rem,4vw,3.2rem)",
          letterSpacing: "0.06em",
        }}
      >
        {renderTitle(title)}
      </h2>
      {subtitle && (
        <p className={`body-copy mt-4 ${align === "center" ? "mx-auto max-w-xl" : "max-w-xl"}`}>
          {subtitle}
        </p>
      )}
      <div
        className={`mt-5 h-px w-10 ${align === "center" ? "mx-auto" : ""}`}
        style={{ background: "linear-gradient(90deg, transparent, rgba(168,121,53,0.55), transparent)" }}
      />
    </motion.div>
  );
}
