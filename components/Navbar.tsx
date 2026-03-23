"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ChevronDown,
  CreditCard,
  Footprints,
  Heart,
  Home,
  Layers,
  Menu,
  Search,
  Shirt,
  ShoppingBag,
  ShoppingCart,
  User,
  Watch,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import SearchOverlay from "./SearchOverlay";

type SubmenuItem = { title: string; link: string };
type MenuItem = {
  title: string;
  link: string;
  icon?: React.ReactNode;
  submenu?: SubmenuItem[];
};

const mainMenuItems: MenuItem[] = [
  { title: "Home",        link: "/",           icon: <Home        strokeWidth={1.4} className="w-3.5 h-3.5" /> },
  { title: "Shop",        link: "/shop",        icon: <ShoppingBag strokeWidth={1.4} className="w-3.5 h-3.5" /> },
  {
    title: "Collection", link: "/collection", icon: <Layers strokeWidth={1.4} className="w-3.5 h-3.5" />,
    submenu: [
      { title: "Jackets & Coats", link: "/jackets-coats" },
      { title: "Suits",           link: "/suits" },
      { title: "Shirts",          link: "/shirts" },
    ],
  },
  {
    title: "Pants", link: "/pants-denim", icon: <Shirt strokeWidth={1.4} className="w-3.5 h-3.5" />,
    submenu: [
      { title: "Denim",  link: "/denim" },
      { title: "Korean", link: "/korean" },
      { title: "Baggy",  link: "/jeans" },
    ],
  },
  {
    title: "Footwear", link: "/footwear", icon: <Footprints strokeWidth={1.4} className="w-3.5 h-3.5" />,
    submenu: [
      { title: "Sneakers",  link: "/sneakers" },
      { title: "Loafers",   link: "/loafers" },
      { title: "Lace Ups",  link: "/lace-ups" },
    ],
  },
  {
    title: "Accessories", link: "/accessories", icon: <Watch strokeWidth={1.4} className="w-3.5 h-3.5" />,
    submenu: [
      { title: "Sunglasses",    link: "/sunglasses" },
      { title: "Bags & Wallets",link: "/bags-wallets" },
      { title: "Belts",         link: "/belts" },
    ],
  },
];

const utilityItems: MenuItem[] = [
  { title: "Wishlist", link: "/wishlist", icon: <Heart       strokeWidth={1.4} className="w-4 h-4" /> },
  { title: "Cart",     link: "/cart",     icon: <ShoppingCart strokeWidth={1.4} className="w-4 h-4" /> },
  { title: "Orders",   link: "/orders",   icon: <CreditCard   strokeWidth={1.4} className="w-4 h-4" /> },
  { title: "Account",  link: "/account",  icon: <User         strokeWidth={1.4} className="w-4 h-4" /> },
];

/* ── Desktop dropdown ── */
function DesktopMenuItem({ item }: { item: MenuItem }) {
  const [open, setOpen] = useState(false);
  const timer = useRef<NodeJS.Timeout | null>(null);

  const enter = () => { if (timer.current) clearTimeout(timer.current); setOpen(true); };
  const leave = () => { timer.current = setTimeout(() => setOpen(false), 180); };

  return (
    <li className="relative flex items-center" onMouseEnter={enter} onMouseLeave={leave}>
      <Link
        href={item.link}
        className="group relative flex min-h-[44px] min-w-[44px] items-center gap-1.5 rounded-full px-3.5 py-2 text-white/55 transition-all duration-300 hover:text-white/90"
        style={{ fontSize:"10px", letterSpacing:"0.22em", fontFamily:"'Jost', sans-serif", fontWeight:300 }}
      >
        {/* Hover pill bg */}
        <span
          className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background:"rgba(255,255,255,0.07)" }}
        />
        <span className="relative z-10 flex items-center gap-1.5">
          {item.icon}
          <span className="uppercase tracking-[0.22em]">{item.title}</span>
          {item.submenu && (
            <ChevronDown
              strokeWidth={1.3}
              className={`w-3 h-3 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
            />
          )}
        </span>
      </Link>

      {/* Dropdown */}
      <AnimatePresence>
        {item.submenu && open && (
          <motion.ul
            initial={{ opacity:0, y:10, scale:0.97 }}
            animate={{ opacity:1, y:0, scale:1 }}
            exit={{ opacity:0, y:10, scale:0.97 }}
            transition={{ duration:0.22, ease:[0.22,1,0.36,1] }}
            className="absolute left-1/2 -translate-x-1/2 top-full mt-3 min-w-[200px] overflow-hidden z-50"
            style={{
              borderRadius:18,
              background:"linear-gradient(160deg, rgba(20,20,22,0.92) 0%, rgba(12,12,14,0.97) 100%)",
              backdropFilter:"blur(32px) saturate(180%)",
              WebkitBackdropFilter:"blur(32px) saturate(180%)",
              border:"1px solid rgba(255,255,255,0.09)",
              boxShadow:"0 24px 60px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.10)",
            }}
          >
            {/* Top specular */}
            <div className="absolute inset-x-4 top-0 h-px pointer-events-none"
                 style={{ background:"linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)" }} />

            {item.submenu.map((sub, i) => (
              <li key={i}>
                <Link
                  href={sub.link}
                  className="group flex items-center justify-between px-5 py-3 text-white/50 hover:text-white/85 hover:bg-white/[0.05] transition-all duration-200"
                  style={{ fontSize:"10px", letterSpacing:"0.2em", fontFamily:"'Jost', sans-serif", fontWeight:300 }}
                >
                  <span className="uppercase">{sub.title}</span>
                  <ArrowRight strokeWidth={1.2} className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-300" />
                </Link>
                {i < item.submenu!.length - 1 && (
                  <div className="mx-4 h-px" style={{ background:"rgba(255,255,255,0.05)" }} />
                )}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </li>
  );
}

/* ── Utility icon button ── */
function UtilityBtn({ item }: { item: MenuItem }) {
  return (
    <motion.div whileHover={{ scale:1.08 }} whileTap={{ scale:0.9 }}>
      <Link
        href={item.link}
        aria-label={item.title}
        className="relative group flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-white/45 transition-colors duration-300 hover:text-white/85 lg:h-10 lg:w-10"
      >
        <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background:"rgba(255,255,255,0.07)" }} />
        <span className="relative z-10">{item.icon}</span>
      </Link>
    </motion.div>
  );
}

/* ── Mobile menu panel ── */
function MobileMenu({
  activeSubmenu,
  setActiveSubmenu,
  closeMenu,
}: {
  activeSubmenu: number | null;
  setActiveSubmenu: (i: number | null) => void;
  closeMenu: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity:0 }}
      animate={{ opacity:1 }}
      exit={{ opacity:0 }}
      transition={{ duration:0.3 }}
      className="fixed inset-0 z-[60] md:hidden"
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity:0 }}
        animate={{ opacity:1 }}
        exit={{ opacity:0 }}
        className="absolute inset-0"
        style={{ background:"rgba(0,0,0,0.5)", backdropFilter:"blur(4px)" }}
        onClick={closeMenu}
      />

      {/* Slide panel */}
      <motion.div
        initial={{ x:"100%" }}
        animate={{ x:0 }}
        exit={{ x:"100%" }}
        transition={{ duration:0.45, ease:[0.22,1,0.36,1] }}
        className="absolute right-0 top-0 bottom-0 flex flex-col overflow-y-auto overscroll-contain"
        style={{ touchAction:"pan-y", width:"min(92vw, 360px)" }}
      >
        <div
          className="flex-1 flex flex-col"
          style={{
            background:"linear-gradient(160deg, rgba(18,18,20,0.96) 0%, rgba(10,10,12,0.98) 100%)",
            backdropFilter:"blur(36px) saturate(180%)",
            WebkitBackdropFilter:"blur(36px) saturate(180%)",
            borderLeft:"1px solid rgba(255,255,255,0.08)",
          }}
        >
          {/* Panel specular left edge */}
          <div className="absolute left-0 top-0 bottom-0 w-px"
               style={{ background:"linear-gradient(to bottom, transparent, rgba(255,255,255,0.12) 20%, rgba(255,255,255,0.06) 80%, transparent)" }} />

          {/* Header */}
          <div className="flex items-center justify-between px-4 pt-[max(env(safe-area-inset-top),1rem)] pb-4 sm:px-5 sm:pt-[max(env(safe-area-inset-top),1.4rem)]">
            <span
              className="text-white/60 font-light tracking-[0.35em] uppercase"
              style={{ fontSize:"10px", fontFamily:"'Jost', sans-serif" }}
            >
              Navigation
            </span>
            <motion.button
              onClick={closeMenu}
              whileTap={{ scale:0.85 }}
              className="flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-white/45 transition-all duration-300 hover:text-white/80"
              style={{ background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.08)" }}
            >
              <X strokeWidth={1.3} className="w-3.5 h-3.5" />
            </motion.button>
          </div>

          <div className="mx-6 h-px mb-3" style={{ background:"rgba(255,255,255,0.06)" }} />

          {/* Main nav */}
          <ul className="px-3 pb-2 flex flex-col gap-1">
            {mainMenuItems.map((item, idx) => (
              <li key={idx}>
                <div className="flex items-center justify-between rounded-2xl px-3 py-3.5 transition-all duration-300 hover:bg-white/[0.04]">
                  <Link
                    href={item.link}
                    onClick={!item.submenu ? closeMenu : undefined}
                    className="flex min-h-[44px] min-w-[44px] flex-1 items-center gap-2 sm:gap-3"
                  >
                    <span
                      className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl"
                      style={{
                        background:"linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))",
                        border:"1px solid rgba(255,255,255,0.07)",
                        color:"rgba(255,255,255,0.5)",
                      }}
                    >
                      {item.icon}
                    </span>
                    <span
                      className="text-white/70 font-light tracking-wide"
                      style={{ fontSize:"13px", fontFamily:"'Jost', sans-serif", letterSpacing:"0.08em" }}
                    >
                      {item.title}
                    </span>
                  </Link>

                  {item.submenu && (
                    <motion.button
                      type="button"
                      onClick={() => setActiveSubmenu(activeSubmenu === idx ? null : idx)}
                      className="flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-white/30 transition-all duration-300 hover:text-white/60"
                      style={{ background:"rgba(255,255,255,0.05)" }}
                      animate={{ rotate: activeSubmenu === idx ? 180 : 0 }}
                      transition={{ duration:0.3 }}
                    >
                      <ChevronDown strokeWidth={1.3} className="w-3 h-3" />
                    </motion.button>
                  )}
                </div>

                {/* Submenu */}
                <AnimatePresence initial={false}>
                  {item.submenu && activeSubmenu === idx && (
                    <motion.ul
                      initial={{ opacity:0, height:0 }}
                      animate={{ opacity:1, height:"auto" }}
                      exit={{ opacity:0, height:0 }}
                      transition={{ duration:0.35, ease:[0.22,1,0.36,1] }}
                      className="overflow-hidden ml-5 mr-2 mb-1.5"
                    >
                      <div className="rounded-2xl overflow-hidden"
                           style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.05)" }}>
                        {item.submenu.map((sub, si) => (
                          <div key={si}>
                            <Link
                              href={sub.link}
                              onClick={closeMenu}
                              className="group flex min-h-[44px] min-w-[44px] items-center justify-between px-4 py-3.5 text-white/45 transition-all duration-200 hover:bg-white/[0.04] hover:text-white/75"
                              style={{ fontSize:"11px", letterSpacing:"0.12em", fontFamily:"'Jost', sans-serif", fontWeight:300 }}
                            >
                              <span>{sub.title}</span>
                              <ArrowRight strokeWidth={1.2} className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                            </Link>
                            {si < item.submenu!.length - 1 && (
                              <div className="mx-4 h-px" style={{ background:"rgba(255,255,255,0.04)" }} />
                            )}
                          </div>
                        ))}
                      </div>
                    </motion.ul>
                  )}
                </AnimatePresence>
              </li>
            ))}
          </ul>

          <div className="mx-6 h-px my-3" style={{ background:"rgba(255,255,255,0.06)" }} />

          {/* Utility links */}
          <ul className="px-3 pb-6 flex flex-col gap-1">
            {utilityItems.filter((i) => i.title !== "Cart" && i.title !== "Account").map((item, idx) => (
              <li key={idx}>
                <Link
                  href={item.link}
                  onClick={closeMenu}
                  className="flex min-h-[44px] min-w-[44px] items-center gap-2 rounded-2xl px-3 py-3.5 transition-all duration-300 hover:bg-white/[0.04] sm:gap-3"
                >
                  <span
                    className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl"
                    style={{
                      background:"linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))",
                      border:"1px solid rgba(255,255,255,0.07)",
                      color:"rgba(255,255,255,0.5)",
                    }}
                  >
                    {item.icon}
                  </span>
                  <span
                    className="text-white/70 font-light tracking-wide"
                    style={{ fontSize:"12.5px", fontFamily:"'Jost', sans-serif", letterSpacing:"0.08em" }}
                  >
                    {item.title}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Brand footer */}
          <div className="mt-auto px-5 pb-[max(env(safe-area-inset-bottom),2rem)]">
            <div className="h-px mb-5" style={{ background:"rgba(255,255,255,0.06)" }} />
            <p
              className="text-center text-white/15 tracking-[0.5em] uppercase font-light"
              style={{ fontSize:"9px", fontFamily:"'Cormorant Garamond', serif" }}
            >
              AURÉLIEN
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Main Navbar ── */
export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<number | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive:true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@200;300;400&display=swap');
      `}</style>

      <motion.nav
        initial={{ y:-60, opacity:0 }}
        animate={{ y:0, opacity:1 }}
        transition={{ duration:0.7, ease:[0.22,1,0.36,1], delay:0.1 }}
        className="fixed top-0 w-full z-50 transition-all duration-500"
        style={scrolled ? {
          background:"linear-gradient(135deg, rgba(10,10,12,0.7) 0%, rgba(6,6,8,0.75) 100%)",
          backdropFilter:"blur(32px) saturate(180%)",
          WebkitBackdropFilter:"blur(32px) saturate(180%)",
          borderBottom:"1px solid rgba(255,255,255,0.06)",
          boxShadow:"0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)",
        } : {
          background:"rgba(255,255,255,0.02)",
          backdropFilter:"blur(20px) saturate(150%)",
          WebkitBackdropFilter:"blur(20px) saturate(150%)",
          borderBottom:"1px solid rgba(255,255,255,0.04)",
        }}
      >
        {/* Top specular line */}
        <div className="absolute inset-x-0 top-0 h-px pointer-events-none"
             style={{ background:"linear-gradient(90deg, transparent, rgba(255,255,255,0.08) 30%, rgba(255,255,255,0.08) 70%, transparent)" }} />

        <div className="mx-auto flex h-[62px] max-w-[1440px] items-center justify-between px-4 sm:h-[64px] sm:px-6 md:px-10">

          {/* Logo */}
          <Link href="/" className="group relative flex-shrink-0">
            <span
              className="font-light text-white/80 group-hover:text-white transition-colors duration-500 tracking-[0.4em] uppercase"
              style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:"clamp(0.9rem, 3.2vw, 1rem)" }}
            >
              AURÉLIEN
            </span>
            {/* Gold underline */}
            <span
              className="absolute -bottom-0.5 left-0 h-px w-0 group-hover:w-full transition-all duration-500 ease-out"
              style={{ background:"linear-gradient(90deg, rgba(198,169,98,0.8), transparent)" }}
            />
          </Link>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-0.5">
            {mainMenuItems.map((item, i) => (
              <DesktopMenuItem key={i} item={item} />
            ))}
          </ul>

          {/* Desktop utility + search */}
          <div className="hidden md:flex items-center gap-0.5">
            {/* Separator */}
            <div className="w-px h-4 mx-2" style={{ background:"rgba(255,255,255,0.08)" }} />

            {/* Search */}
            <motion.button
              type="button"
              onClick={() => setSearchOpen(true)}
              whileHover={{ scale:1.08 }}
              whileTap={{ scale:0.9 }}
              className="relative group flex h-10 w-10 min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-white/45 transition-colors duration-300 hover:text-white/85"
              aria-label="Search"
            >
              <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background:"rgba(255,255,255,0.07)" }} />
              <Search strokeWidth={1.4} className="relative z-10 w-4 h-4" />
            </motion.button>

            {utilityItems.map((item, i) => <UtilityBtn key={i} item={item} />)}
          </div>

          {/* Mobile controls */}
          <div className="flex items-center gap-1 md:hidden">
            {/* Cart + Account quick links */}
            {[
              { href:"/cart",    label:"Cart",    icon:<ShoppingCart strokeWidth={1.4} className="w-4 h-4" /> },
              { href:"/account", label:"Account", icon:<User         strokeWidth={1.4} className="w-4 h-4" /> },
            ].map((btn, i) => (
              <motion.div key={i} whileTap={{ scale:0.88 }}>
                <Link href={btn.href} aria-label={btn.label}
                  className="relative group flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-white/50 transition-colors duration-300 hover:text-white/85">
                  <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ background:"rgba(255,255,255,0.06)" }} />
                  <span className="relative z-10">{btn.icon}</span>
                </Link>
              </motion.div>
            ))}

            {/* Search */}
            <motion.button
              type="button"
              onClick={() => setSearchOpen(true)}
              whileTap={{ scale:0.88 }}
              className="relative group flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-white/50 transition-colors duration-300 hover:text-white/85"
            >
              <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background:"rgba(255,255,255,0.06)" }} />
              <Search strokeWidth={1.4} className="relative z-10 w-4 h-4" />
            </motion.button>

            {/* Hamburger */}
            <motion.button
              onClick={() => setMobileOpen(!mobileOpen)}
              whileTap={{ scale:0.88 }}
              className="relative group ml-0.5 flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-white/50 transition-colors duration-300 hover:text-white/85"
              aria-label="Toggle menu"
            >
              <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background:"rgba(255,255,255,0.06)" }} />
              <AnimatePresence mode="wait">
                {mobileOpen ? (
                  <motion.span key="x" initial={{ rotate:-90, opacity:0 }} animate={{ rotate:0, opacity:1 }} exit={{ rotate:90, opacity:0 }} transition={{ duration:0.2 }} className="relative z-10">
                    <X strokeWidth={1.4} className="w-4 h-4" />
                  </motion.span>
                ) : (
                  <motion.span key="m" initial={{ rotate:90, opacity:0 }} animate={{ rotate:0, opacity:1 }} exit={{ rotate:-90, opacity:0 }} transition={{ duration:0.2 }} className="relative z-10">
                    <Menu strokeWidth={1.4} className="w-4 h-4" />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile panel */}
      <AnimatePresence>
        {mobileOpen && (
          <MobileMenu
            activeSubmenu={activeSubmenu}
            setActiveSubmenu={setActiveSubmenu}
            closeMenu={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
