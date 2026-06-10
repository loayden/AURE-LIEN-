"use client";

import NewsletterForm from "@/components/NewsletterForm";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaInstagram } from "react-icons/fa";

const NAV_COLLECTIONS = [
  { label: "Collection", href: "/collection" },
  { label: "Pants", href: "/pants-denim" },
  { label: "Footwear", href: "/footwear" },
  { label: "Accessories", href: "/accessories" },
];

const NAV_SERVICE = [
  { label: "Account", href: "/account" },
  { label: "Orders", href: "/orders" },
  { label: "Returns", href: "/returns" },
  { label: "Discover", href: "/discover" },
  { label: "About", href: "/about" },
];

const INSTAGRAM_URL = "https://www.instagram.com/bout.clothes/?__pwa=1";
const POWERED_BY_URL = "https://www.instagram.com/fr3_fdn/?__pwa=1";

const SOCIALS = [{ Icon: FaInstagram, href: INSTAGRAM_URL }];
const LEGAL_LINKS = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Cookies", href: "/cookies" },
];

const footerText = "#4B4137";
const footerInk = "#3D3025";
const footerGold = "#7A581F";
const footerLine = "rgba(123,103,82,0.18)";

export default function LuxuryFooter() {
  return (
    <footer
      className="relative mt-20 overflow-hidden sm:mt-32"
      style={{
        background: "linear-gradient(180deg, rgba(255,249,239,0.92) 0%, rgba(245,241,232,0.98) 42%, rgba(231,219,203,0.96) 100%)",
        borderTop: `1px solid ${footerLine}`,
        fontFamily: "'Jost', sans-serif",
      }}
    >
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(168,121,53,0.36), transparent)" }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(110deg, rgba(168,121,53,0.06) 0%, transparent 34%, rgba(255,255,255,0.42) 66%, rgba(123,103,82,0.05) 100%)",
        }}
      />

      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-12 sm:grid-cols-2 sm:gap-10 sm:px-6 sm:py-20 md:px-10 xl:grid-cols-4 xl:gap-12">
        <div className="flex flex-col gap-5 md:col-span-1">
          <Link href="/" className="group inline-block">
            <h2
              className="font-light leading-none tracking-[0.18em] transition-colors duration-500 group-hover:text-[#A87935]"
              style={{ color: footerInk, fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.65rem, 8vw, 1.9rem)" }}
            >
              BOUT
            </h2>
          </Link>
          <div className="h-px w-10" style={{ background: "linear-gradient(90deg, rgba(168,121,53,0.65), transparent)" }} />
          <p className="max-w-none text-[11px] font-light leading-relaxed tracking-[0.08em] sm:max-w-[240px] sm:text-sm" style={{ color: footerText }}>
            Crafted in silence. Designed with discipline. A study in structure, presence, and restraint.
          </p>

          <div className="flex items-center gap-3 pt-2 sm:gap-4">
            {SOCIALS.map(({ Icon, href }) => (
              <motion.a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.12, y: -1 }}
                whileTap={{ scale: 0.92 }}
                className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl p-3 transition-all duration-300 sm:p-2.5"
                style={{
                  background: "linear-gradient(135deg, rgba(255,255,255,0.62), rgba(168,121,53,0.08))",
                  border: `1px solid ${footerLine}`,
                  backdropFilter: "blur(12px)",
                  color: footerGold,
                }}
                aria-label="Instagram"
              >
                <Icon className="h-4 w-4" />
              </motion.a>
            ))}
          </div>
        </div>

        <FooterLinkGroup title="Collections" items={NAV_COLLECTIONS} />
        <FooterLinkGroup title="Customer Service" items={NAV_SERVICE} />

        <div className="flex flex-col gap-5">
          <p className="text-[9px] uppercase tracking-[0.45em]" style={{ color: "rgba(61,48,37,0.74)" }}>
            Private Access
          </p>
          <div className="h-px w-6" style={{ background: "rgba(168,121,53,0.38)" }} />
          <p className="text-[11px] font-light leading-relaxed tracking-[0.08em] sm:text-sm" style={{ color: footerText }}>
            Join the Maison.
            <br />
            Receive exclusive releases.
          </p>
          <NewsletterForm compact />
          <p className="text-[9px] leading-relaxed tracking-[0.2em]" style={{ color: "rgba(61,48,37,0.74)" }}>
            No spam. Unsubscribe any time.
          </p>
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 md:px-10">
        <div className="h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(123,103,82,0.16), transparent)" }} />
      </div>

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:gap-6 sm:px-6 sm:py-10 md:px-10">
        <motion.a
          href={POWERED_BY_URL}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ opacity: 1 }}
          className="flex cursor-pointer select-none flex-col items-center gap-1 sm:items-start"
          style={{ opacity: 0.72, transition: "opacity 0.3s" }}
        >
          <span className="text-[8px] font-light uppercase tracking-[0.35em]" style={{ color: "rgba(61,48,37,0.74)" }}>
            Powered By
          </span>
          <span className="flex items-center gap-1 text-[10px] font-light uppercase tracking-[0.24em] sm:text-xs" style={{ color: footerInk }}>
            <span>FR</span>
            <span
              style={{
                color: footerGold,
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "1.1em",
                lineHeight: 1,
              }}
            >
              ع
            </span>
          </span>
        </motion.a>

        <p className="text-center text-[9px] uppercase tracking-[0.3em]" style={{ color: "rgba(61,48,37,0.74)" }}>
          © {new Date().getFullYear()} Bout. All rights reserved.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5">
          {LEGAL_LINKS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="inline-flex min-h-[44px] min-w-[44px] items-center text-[9px] uppercase tracking-[0.25em] transition-colors duration-300 hover:text-[#3D3025]"
              style={{ color: footerText }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}

function FooterLinkGroup({ title, items }: { title: string; items: { label: string; href: string }[] }) {
  return (
    <div className="flex flex-col gap-5">
      <p className="text-[9px] uppercase tracking-[0.45em]" style={{ color: "rgba(61,48,37,0.74)" }}>
        {title}
      </p>
      <div className="h-px w-6" style={{ background: "rgba(168,121,53,0.38)" }} />
      <ul className="flex flex-col gap-3">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="group flex min-h-[44px] min-w-[44px] items-center gap-2 transition-all duration-300 hover:text-[#3D3025]"
              style={{ color: footerText, fontSize: "0.75rem", letterSpacing: "0.08em" }}
            >
              <span className="h-px w-3 flex-shrink-0 transition-all duration-300 group-hover:w-5" style={{ background: "rgba(168,121,53,0.48)" }} />
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
