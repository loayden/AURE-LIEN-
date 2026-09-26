"use client";

import { motion } from "framer-motion";

/**
 * Signature empty-state medallion: concentric gold rings, serif monogram,
 * slow orbit dot. Pure CSS/SVG, respects reduced motion.
 */
export function EmptyStateArt({
  letter,
  label,
}: {
  letter: string;
  label: string;
}) {
  return (
    <div className="relative mb-6 flex h-28 w-28 items-center justify-center" role="img" aria-label={label}>
      <span aria-hidden="true" className="absolute inset-0 rounded-full" style={{ border: "1px solid rgba(168,121,53,0.28)" }} />
      <span aria-hidden="true" className="absolute inset-3 rounded-full" style={{ border: "1px dashed rgba(168,121,53,0.32)" }} />
      <span
        aria-hidden="true"
        className="absolute inset-0 motion-reduce:hidden"
        style={{ animation: "empty-orbit 14s linear infinite" }}
      >
        <span
          aria-hidden="true"
          className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: "#A87935" }}
        />
      </span>
      <motion.span
        aria-hidden="true"
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="flex h-14 w-14 items-center justify-center rounded-full font-light"
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "1.7rem",
          background: "linear-gradient(135deg, rgba(168,121,53,0.16), rgba(168,121,53,0.05))",
          border: "1px solid rgba(168,121,53,0.3)",
          color: "#7A581F",
        }}
      >
        {letter}
      </motion.span>
      <style>{`@keyframes empty-orbit { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
