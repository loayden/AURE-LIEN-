"use client";

import { motion } from "framer-motion";
import { ArrowRight, Instagram } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const NAV_COLLECTIONS = [
  { label: "Collection", href: "/collection" },
  { label: "Pants", href: "/pants-denim" },
  { label: "Footwear", href: "/footwear" },
  { label: "Accessories", href: "/accessories" },
  { label: "Lookbook", href: "/lookbook" },
  { label: "Outfit Generator", href: "/outfit-generator" },
];

const NAV_SERVICE = [
  { label: "Account", href: "/account" },
  { label: "Orders", href: "/orders" },
  { label: "About", href: "/about" },
];

const INSTAGRAM_URL = "https://www.instagram.com/aurelien.clothes/?__pwa=1";

const SOCIALS = [{ Icon: Instagram, href: INSTAGRAM_URL }];
const LEGAL_LINKS = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Cookies", href: "/cookies" },
];

export default function LuxuryFooter() {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  const handleJoin = () => {
    if (email.trim()) { setJoined(true); setEmail(""); }
  };

  return (
    <>
      <footer
        className="relative mt-20 sm:mt-32 overflow-hidden"
        style={{
          background: "#060606",
          fontFamily: "'Jost', sans-serif",
        }}
      >
        {/* Top gold divider */}
        <div className="absolute inset-x-0 top-0 h-px"
             style={{ background: "linear-gradient(90deg, transparent, rgba(198,169,98,0.35), transparent)" }} />

        {/* Ambient glow */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div style={{
            position: "absolute",
            bottom: "-20%", left: "50%", transform: "translateX(-50%)",
            background: "radial-gradient(circle, rgba(198,169,98,0.05) 0%, transparent 65%)",
            filter: "blur(80px)",
          }} className="mobile-orb-lg" />
        </div>

        {/* ── UPPER GRID ── */}
        <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-12 sm:grid-cols-2 sm:gap-10 sm:px-6 sm:py-20 md:px-10 xl:grid-cols-4 xl:gap-12">

          {/* Brand */}
          <div className="flex flex-col gap-5 md:col-span-1">
            <Link href="/" className="group inline-block">
              <h2
                className="font-light text-white tracking-[0.18em] leading-none group-hover:text-[#C6A962] transition-colors duration-500"
                style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:"clamp(1.65rem, 8vw, 1.9rem)" }}
              >
                AURÉLIEN
              </h2>
            </Link>
            <div className="w-10 h-px"
                 style={{ background:"linear-gradient(90deg, rgba(198,169,98,0.7), transparent)" }} />
            <p className="max-w-none text-[11px] font-light leading-relaxed tracking-[0.08em] text-white/72 sm:max-w-[220px] sm:text-sm">
              Crafted in silence. Designed with discipline. A study in structure, presence, and restraint.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-3 sm:gap-4 pt-2">
              {SOCIALS.map(({ Icon, href }, i) => (
                <motion.a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.12, y: -1 }}
                  whileTap={{ scale: 0.92 }}
                  className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl p-3 transition-all duration-400 sm:p-2.5"
                  style={{
                    background: "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))",
                    border: "1px solid rgba(255,255,255,0.08)",
                    backdropFilter: "blur(12px)",
                    color: "rgba(255,255,255,0.58)",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#C6A962"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(198,169,98,0.3)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.58)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)"; }}
                >
                  <Icon strokeWidth={1.3} className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Collections nav */}
          <div className="flex flex-col gap-5">
            <p className="text-[9px] uppercase tracking-[0.45em] text-white/72">Collections</p>
            <div className="w-6 h-px" style={{ background:"rgba(198,169,98,0.4)" }} />
            <ul className="flex flex-col gap-3">
              {NAV_COLLECTIONS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group flex min-h-[44px] min-w-[44px] items-center gap-2 text-white/84 transition-all duration-300 hover:text-white"
                    style={{ fontSize:"0.75rem", letterSpacing:"0.08em" }}
                  >
                    <span className="w-3 h-px transition-all duration-300 group-hover:w-5"
                          style={{ background:"rgba(198,169,98,0.5)", flexShrink:0 }} />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Service nav */}
          <div className="flex flex-col gap-5">
            <p className="text-[9px] uppercase tracking-[0.45em] text-white/72">Customer Service</p>
            <div className="w-6 h-px" style={{ background:"rgba(198,169,98,0.4)" }} />
            <ul className="flex flex-col gap-3">
              {NAV_SERVICE.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group flex min-h-[44px] min-w-[44px] items-center gap-2 text-white/84 transition-all duration-300 hover:text-white"
                    style={{ fontSize:"0.75rem", letterSpacing:"0.08em" }}
                  >
                    <span className="w-3 h-px transition-all duration-300 group-hover:w-5"
                          style={{ background:"rgba(198,169,98,0.5)", flexShrink:0 }} />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="flex flex-col gap-5">
            <p className="text-[9px] uppercase tracking-[0.45em] text-white/72">Private Access</p>
            <div className="w-6 h-px" style={{ background:"rgba(198,169,98,0.4)" }} />
            <p className="text-[11px] font-light leading-relaxed tracking-[0.08em] text-white/72 sm:text-sm">
              Join the Maison.<br />Receive exclusive releases.
            </p>

            {joined ? (
              <motion.div
                initial={{ opacity:0, y:8 }}
                animate={{ opacity:1, y:0 }}
                className="flex items-center gap-2 px-4 py-3 rounded-xl"
                style={{ background:"linear-gradient(135deg, rgba(80,200,120,0.10), rgba(60,180,100,0.04))", border:"1px solid rgba(80,200,120,0.2)" }}
              >
                <span className="text-[9px] tracking-[0.3em] uppercase font-light" style={{ color:"rgba(80,200,120,0.75)" }}>
                  Welcome to the Maison
                </span>
              </motion.div>
            ) : (
              <div
                className="flex flex-col sm:flex-row items-stretch overflow-hidden rounded-xl"
                style={{
                  background: "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)",
                  backdropFilter: "blur(16px)",
                  border: "1px solid rgba(255,255,255,0.09)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
                }}
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleJoin()}
                  placeholder="Your email"
                  className="flex-1 bg-transparent px-4 py-3 text-base tracking-[0.12em] text-white/80 outline-none placeholder:text-white/45 sm:text-sm"
                  style={{ fontFamily:"'Jost', sans-serif" }}
                />
                <motion.button
                  onClick={handleJoin}
                  whileHover={{ scale:1.05 }}
                  whileTap={{ scale:0.95 }}
                  className="flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 border-t border-white/10 px-4 py-3 transition-all duration-300 sm:border-l sm:border-t-0 sm:gap-3"
                >
                  <span className="text-[9px] tracking-[0.3em] uppercase font-light text-white/88 transition-colors hover:text-[#C6A962]">
                    Join
                  </span>
                  <ArrowRight strokeWidth={1.3} className="w-3 h-3 text-white/78" />
                </motion.button>
              </div>
            )}

            {/* Privacy note */}
            <p className="text-[9px] leading-relaxed tracking-[0.2em] text-white/60">
              No spam. Unsubscribe any time.
            </p>
          </div>
        </div>

        {/* ── DIVIDER ── */}
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 md:px-10">
          <div className="h-px" style={{ background:"linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)" }} />
        </div>

        {/* ── BOTTOM BAR ── */}
        <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:gap-6 sm:px-6 sm:py-10 md:px-10">

          {/* Presented by */}
          <motion.a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ opacity:1 }}
            className="flex flex-col items-center sm:items-start gap-1 cursor-pointer select-none"
            style={{ opacity:0.6, transition:"opacity 0.3s" }}
          >
            <span className="text-[8px] uppercase tracking-[0.35em] font-light text-white/68">Instagram</span>
            <span className="tracking-[0.24em] text-[10px] font-light uppercase text-[#C6A962] sm:text-xs">
              @AURELIEN.CLOTHES
            </span>
          </motion.a>

          {/* Copyright */}
          <p className="text-center text-[9px] uppercase tracking-[0.3em] text-white/50">
            © {new Date().getFullYear()} Aurélien. All rights reserved.
          </p>

          {/* Legal links */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5">
            {LEGAL_LINKS.map((item) => (
              <Link key={item.label} href={item.href}
                className="inline-flex min-h-[44px] min-w-[44px] items-center text-[9px] uppercase tracking-[0.25em] text-white/78 transition-colors duration-300 hover:text-white">
                {item.label}
              </Link>
            ))}
          </div>
        </div>

      </footer>
    </>
  );
}
