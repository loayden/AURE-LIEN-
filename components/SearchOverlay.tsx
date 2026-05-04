"use client";

import { useOverlayIsolation } from "@/components/useOverlayIsolation";
import { usePerformanceProfile } from "@/hooks/usePerformanceProfile";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Search, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useDeferredValue, useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface SearchProduct {
  _id: string;
  name: string;
  price: number;
  category?: string;
  images?: string[];
}

export default function SearchOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<SearchProduct[]>([]);
  const [searching, setSearching] = useState(false);
  const [portalReady, setPortalReady] = useState(false);
  const { lowEndDevice, prefersReducedMotion } = usePerformanceProfile();
  const deferredQuery = useDeferredValue(q);
  const trimmedQuery = deferredQuery.trim();
  const shouldReduceDecorativeEffects = lowEndDevice || prefersReducedMotion;
  const loading = q.trim() !== trimmedQuery || searching;

  useOverlayIsolation(open);

  useEffect(() => {
    setPortalReady(true);
  }, []);

  useEffect(() => { if (!open) setQ(""); }, [open]);

  useEffect(() => {
    if (!trimmedQuery) {
      setResults([]);
      setSearching(false);
      return;
    }

    const controller = new AbortController();
    setSearching(true);
    fetch(`/api/search?q=${encodeURIComponent(trimmedQuery)}`, {
      cache: "no-store",
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) throw new Error("Search failed");
        return response.json();
      })
      .then((data) => {
        if (!controller.signal.aborted) {
          setResults(Array.isArray(data.products) ? data.products.slice(0, 12) : []);
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) setResults([]);
      })
      .finally(() => {
        if (!controller.signal.aborted) setSearching(false);
      });

    return () => controller.abort();
  }, [trimmedQuery]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    const previousOverflow = document.body.style.overflow;
    if (open) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!portalReady) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="search-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-label="Search"
          data-overlay-root="true"
          style={{
            background: "rgba(245,241,232,0.92)",
            backdropFilter: shouldReduceDecorativeEffects ? "blur(18px) saturate(135%)" : "blur(36px) saturate(160%)",
            WebkitBackdropFilter: shouldReduceDecorativeEffects ? "blur(18px) saturate(135%)" : "blur(36px) saturate(160%)",
          }}
        >
          {/* ── HEADER ── */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto w-full max-w-3xl flex-shrink-0 px-4 pt-16 pb-4 sm:px-6 sm:pt-24 sm:pb-6 md:px-10"
          >
            {/* Input row */}
            <div
              className="relative flex items-center gap-2 overflow-hidden rounded-2xl px-4 py-3.5 sm:gap-3 sm:px-5 sm:py-4"
              style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.74) 0%, rgba(255,249,239,0.54) 100%)",
                backdropFilter: shouldReduceDecorativeEffects ? "blur(12px)" : "blur(20px)",
                border: "1px solid rgba(123,103,82,0.18)",
                boxShadow: "0 16px 48px rgba(61,48,37,0.12), inset 0 1px 0 rgba(255,255,255,0.72)",
              }}
            >
              {/* Specular */}
              <div className="absolute inset-x-5 top-0 h-px pointer-events-none"
                   style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.90), transparent)" }} />

              <Search
                strokeWidth={1.3}
                className="h-4.5 w-4.5 flex-shrink-0 transition-colors duration-300 sm:h-5 sm:w-5"
                style={{ color: q ? "#7A581F" : "rgba(61,48,37,0.72)" }}
              />

              <input
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search products, styles, categories…"
                autoFocus
                className="flex-1 bg-transparent text-base font-light text-[#3D3025] outline-none placeholder:text-[#5B4E42] sm:text-lg"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(1rem, 4.8vw, 1.25rem)",
                  letterSpacing: "0.04em",
                }}
              />

              {/* Clear button */}
              <AnimatePresence>
                {q && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.7 }}
                    type="button"
                    onClick={() => setQ("")}
                    className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full transition-all duration-300"
                    style={{ background: "rgba(255,255,255,0.52)", border: "1px solid rgba(123,103,82,0.16)" }}
                  >
                    <X strokeWidth={1.3} className="w-3.5 h-3.5 text-[#6F6254]" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* Hint */}
            <p className="mt-3 text-[#7B6E60]/60 text-[9px] tracking-[0.3em] uppercase pl-1"
               style={{ fontFamily: "'Jost', sans-serif" }}>
              Press Esc to close
            </p>
          </motion.div>

          {/* ── RESULTS ── */}
          <div className="mx-auto flex-1 w-full max-w-3xl overflow-y-auto px-4 pb-16 sm:px-6 sm:pb-24 md:px-10">

            {/* Loading shimmer */}
            <AnimatePresence>
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-4 p-3 rounded-2xl overflow-hidden relative"
                         style={{ background: "rgba(255,248,236,0.04)", border: "1px solid rgba(255,248,236,0.06)", height: 88 }}>
                      {shouldReduceDecorativeEffects ? (
                        <div
                          className="absolute inset-0"
                          style={{ background: "rgba(255,248,236,0.03)" }}
                        />
                      ) : (
                        <motion.div
                          animate={{ x: ["-100%", "100%"] }}
                          transition={{ repeat: Infinity, duration: 1.6, delay: i * 0.12, ease: "easeInOut" }}
                          className="absolute inset-0"
                          style={{ background: "linear-gradient(90deg, transparent, rgba(255,248,236,0.04), transparent)" }}
                        />
                      )}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Results grid */}
            {!loading && q.trim() && (
              <>
                {results.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center gap-4 py-16 sm:py-20"
                  >
                    <p className="text-[#7B6E60]/62 text-[9px] tracking-[0.4em] uppercase"
                       style={{ fontFamily: "'Jost', sans-serif" }}>
                      No Results
                    </p>
                    <p className="font-light text-[#5B4E42]"
                       style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.3rem", letterSpacing: "0.06em" }}>
                      No pieces found for <em style={{ color: "#A87935" }}>"{q}"</em>
                    </p>
                  </motion.div>
                ) : (
                  <>
                    {/* Result count */}
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-[#7B6E60]/62 text-[9px] tracking-[0.35em] uppercase mb-5"
                      style={{ fontFamily: "'Jost', sans-serif" }}
                    >
                      {results.length} {results.length === 1 ? "Piece" : "Pieces"} Found
                    </motion.p>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5">
                      {results.slice(0, 8).map((p, i) => (
                        <motion.div
                          key={p._id}
                          initial={{ opacity: 0, y: 14 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.06, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                        >
                          <Link
                            href={`/product/${p._id}`}
                            onClick={onClose}
                            className="group flex min-h-[44px] min-w-[44px] items-center gap-3 rounded-2xl p-3 transition-all duration-300 sm:gap-4"
                            style={{ border: "1px solid rgba(123,103,82,0.16)", background: "rgba(255,255,255,0.54)" }}
                            onMouseEnter={(e) => {
                              (e.currentTarget as HTMLElement).style.borderColor = "rgba(168,121,53,0.25)";
                              (e.currentTarget as HTMLElement).style.background = "rgba(168,121,53,0.08)";
                            }}
                            onMouseLeave={(e) => {
                              (e.currentTarget as HTMLElement).style.borderColor = "rgba(123,103,82,0.16)";
                              (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.54)";
                            }}
                          >
                            {/* Thumbnail */}
                            <div className="relative w-14 h-16 rounded-xl overflow-hidden flex-shrink-0"
                                 style={{ boxShadow: "0 4px 14px rgba(61,48,37,0.16)" }}>
                              {p.images?.[0] ? (
                                <Image
                                  src={p.images[0]}
                                  alt={p.name}
                                  fill
                                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                                  sizes="56px"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center"
                                     style={{ background: "rgba(245,241,232,0.72)" }}>
                                  <span className="text-[#7B6E60]/60 text-[8px]">—</span>
                                </div>
                              )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              {p.category && (
                                <p className="text-[#7B6E60]/62 text-[8px] tracking-[0.3em] uppercase mb-0.5"
                                   style={{ fontFamily: "'Jost', sans-serif" }}>
                                  {p.category}
                                </p>
                              )}
                              <p className="text-[#3D3025] font-light truncate"
                                 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.95rem", letterSpacing: "0.05em" }}>
                                {p.name}
                              </p>
                              <p className="font-light mt-0.5"
                                 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.82rem", color: "#A87935", letterSpacing: "0.06em" }}>
                                EGP {p.price?.toLocaleString()}
                              </p>
                            </div>

                            {/* Arrow */}
                            <ArrowRight
                              strokeWidth={1.2}
                              className="w-3.5 h-3.5 flex-shrink-0 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-300"
                              style={{ color: "#A87935" }}
                            />
                          </Link>
                        </motion.div>
                      ))}
                    </div>

                    {/* View all */}
                    {results.length > 8 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="mt-6"
                      >
                        <Link
                          href={`/search?q=${encodeURIComponent(q)}`}
                          onClick={onClose}
                          className="inline-flex items-center gap-2.5 text-[#7B6E60] transition-colors duration-300 hover:text-[#A87935]"
                          style={{ fontSize: "10px", letterSpacing: "0.3em", fontFamily: "'Jost', sans-serif" }}
                        >
                          <span className="uppercase">View all {results.length} results</span>
                          <ArrowRight strokeWidth={1.3} className="w-3 h-3" />
                        </Link>
                      </motion.div>
                    )}
                  </>
                )}
              </>
            )}

            {/* Empty / idle state */}
            {!loading && !q.trim() && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-[#7B6E60]/70 text-[10px] tracking-[0.3em] uppercase"
                style={{ fontFamily: "'Jost', sans-serif" }}
              >
                Type to search the collection
              </motion.p>
            )}
          </div>

          {/* ── CLOSE BUTTON ── */}
          <motion.button
            type="button"
            onClick={onClose}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.9 }}
            className="absolute top-6 right-6 flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full transition-all duration-300"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.68), rgba(255,249,239,0.52))",
              border: "1px solid rgba(123,103,82,0.18)",
              backdropFilter: "blur(12px)",
              color: "rgba(91,78,66,0.82)",
            }}
            aria-label="Close search"
          >
            <X strokeWidth={1.3} className="w-4 h-4" />
          </motion.button>

        </motion.div>
      )}
    </AnimatePresence>
    , document.body
  );
}
