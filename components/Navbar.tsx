"use client";

import { useOverlayIsolation } from "@/components/useOverlayIsolation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ChevronDown,
  Compass,
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
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import MiniCartDrawer from "./MiniCartDrawer";

const SearchOverlay = dynamic(() => import("./SearchOverlay"));

type SubmenuItem = { title: string; link: string };
type MenuItem = {
  title: string;
  link: string;
  icon?: React.ReactNode;
  submenu?: SubmenuItem[];
};

const mainMenuItems: MenuItem[] = [
  { title: "Home", link: "/", icon: <Home strokeWidth={1.4} className="h-3.5 w-3.5" /> },
  { title: "Discover", link: "/discover", icon: <Compass strokeWidth={1.4} className="h-3.5 w-3.5" /> },
  { title: "Shop", link: "/shop", icon: <ShoppingBag strokeWidth={1.4} className="h-3.5 w-3.5" /> },
  {
    title: "Collection",
    link: "/collection",
    icon: <Layers strokeWidth={1.4} className="h-3.5 w-3.5" />,
    submenu: [
      { title: "Jackets & Coats", link: "/jackets-coats" },
      { title: "Suits", link: "/suits" },
      { title: "Shirts", link: "/shirts" },
    ],
  },
  {
    title: "Pants",
    link: "/pants-denim",
    icon: <Shirt strokeWidth={1.4} className="h-3.5 w-3.5" />,
    submenu: [
      { title: "Denim", link: "/denim" },
      { title: "Korean", link: "/korean" },
      { title: "Baggy", link: "/jeans" },
    ],
  },
  {
    title: "Footwear",
    link: "/footwear",
    icon: <Footprints strokeWidth={1.4} className="h-3.5 w-3.5" />,
    submenu: [
      { title: "Sneakers", link: "/sneakers" },
      { title: "Loafers", link: "/loafers" },
      { title: "Lace Ups", link: "/lace-ups" },
    ],
  },
  {
    title: "Accessories",
    link: "/accessories",
    icon: <Watch strokeWidth={1.4} className="h-3.5 w-3.5" />,
    submenu: [
      { title: "Sunglasses", link: "/sunglasses" },
      { title: "Bags & Wallets", link: "/bags-wallets" },
      { title: "Belts", link: "/belts" },
    ],
  },
];

const utilityItems: MenuItem[] = [
  { title: "Wishlist", link: "/wishlist", icon: <Heart strokeWidth={1.4} className="h-4 w-4" /> },
  { title: "Cart", link: "/cart", icon: <ShoppingCart strokeWidth={1.4} className="h-4 w-4" /> },
  { title: "Orders", link: "/orders", icon: <CreditCard strokeWidth={1.4} className="h-4 w-4" /> },
  { title: "Account", link: "/account", icon: <User strokeWidth={1.4} className="h-4 w-4" /> },
];

const navText = "#5B4E42";
const navInk = "#3D3025";
const navGold = "#A87935";
const softLine = "rgba(123,103,82,0.18)";
const hoverFill = "rgba(168,121,53,0.09)";
const creamGlass = "linear-gradient(135deg, rgba(255,255,255,0.86) 0%, rgba(255,249,239,0.74) 52%, rgba(237,227,214,0.72) 100%)";

function DesktopMenuItem({ item }: { item: MenuItem }) {
  const [open, setOpen] = useState(false);
  const timer = useRef<NodeJS.Timeout | null>(null);

  const enter = () => {
    if (timer.current) clearTimeout(timer.current);
    setOpen(true);
  };
  const leave = () => {
    timer.current = setTimeout(() => setOpen(false), 180);
  };

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  return (
    <li className="relative flex items-center" onMouseEnter={enter} onMouseLeave={leave}>
      <Link
        href={item.link}
        className="group relative flex min-h-[44px] min-w-[44px] items-center gap-1.5 rounded-full px-3.5 py-2 transition-all duration-300"
        style={{ color: navText, fontSize: "10px", letterSpacing: "0.22em", fontFamily: "'Jost', sans-serif", fontWeight: 300 }}
      >
        <span
          className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: hoverFill }}
        />
        <span className="relative z-10 flex items-center gap-1.5 transition-colors duration-300 group-hover:text-[#3D3025]">
          {item.icon}
          <span className="uppercase tracking-[0.22em]">{item.title}</span>
          {item.submenu ? (
            <ChevronDown strokeWidth={1.3} className={`h-3 w-3 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
          ) : null}
        </span>
      </Link>

      <AnimatePresence>
        {item.submenu && open ? (
          <motion.ul
            initial={{ opacity: 0, y: 10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-1/2 top-full z-50 mt-3 min-w-[210px] -translate-x-1/2 overflow-hidden"
            style={{
              borderRadius: 18,
              background: creamGlass,
              backdropFilter: "blur(30px) saturate(170%)",
              WebkitBackdropFilter: "blur(30px) saturate(170%)",
              border: `1px solid ${softLine}`,
              boxShadow: "0 24px 60px rgba(61,48,37,0.14), inset 0 1px 0 rgba(255,255,255,0.82)",
            }}
          >
            <div
              className="pointer-events-none absolute inset-x-4 top-0 h-px"
              style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.92), transparent)" }}
            />
            {item.submenu.map((sub, index) => (
              <li key={sub.link}>
                <Link
                  href={sub.link}
                  className="group flex items-center justify-between px-5 py-3 transition-all duration-200 hover:bg-[rgba(168,121,53,0.08)]"
                  style={{ color: navText, fontSize: "10px", letterSpacing: "0.2em", fontFamily: "'Jost', sans-serif", fontWeight: 300 }}
                >
                  <span className="uppercase transition-colors group-hover:text-[#3D3025]">{sub.title}</span>
                  <ArrowRight strokeWidth={1.2} className="h-3 w-3 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
                </Link>
                {index < item.submenu!.length - 1 ? <div className="mx-4 h-px" style={{ background: "rgba(123,103,82,0.10)" }} /> : null}
              </li>
            ))}
          </motion.ul>
        ) : null}
      </AnimatePresence>
    </li>
  );
}

function UtilityBtn({
  item,
  cartCount,
  onCartClick,
}: {
  item: MenuItem;
  cartCount: number;
  onCartClick: () => void;
}) {
  const content = (
    <>
      <span
        className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: hoverFill }}
      />
      <span className="relative z-10">{item.icon}</span>
      {item.title === "Cart" && cartCount > 0 ? (
        <span className="absolute -right-0.5 -top-0.5 z-20 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#A87935] px-1 text-[9px] leading-none text-[#1D1815]">
          {cartCount > 9 ? "9+" : cartCount}
        </span>
      ) : null}
    </>
  );

  const className = "relative group flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full transition-colors duration-300 hover:text-[#3D3025] lg:h-10 lg:w-10";

  return (
    <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.9 }}>
      {item.title === "Cart" ? (
        <button type="button" onClick={onCartClick} aria-label={item.title} className={className} style={{ color: navText }}>
          {content}
        </button>
      ) : (
        <Link href={item.link} aria-label={item.title} className={className} style={{ color: navText }}>
          {content}
        </Link>
      )}
    </motion.div>
  );
}

function MobileMenu({
  activeSubmenu,
  setActiveSubmenu,
  closeMenu,
}: {
  activeSubmenu: number | null;
  setActiveSubmenu: (i: number | null) => void;
  closeMenu: () => void;
}) {
  const [portalReady, setPortalReady] = useState(false);

  useOverlayIsolation(true);

  useEffect(() => {
    setPortalReady(true);
  }, []);

  if (!portalReady) return null;

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[60] md:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
      data-overlay-root="true"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0"
        style={{ background: "rgba(61,48,37,0.22)", backdropFilter: "blur(7px)" }}
        onClick={closeMenu}
      />

      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="absolute bottom-0 right-0 top-0 flex flex-col overflow-y-auto overscroll-contain"
        style={{ touchAction: "pan-y", width: "min(92vw, 372px)" }}
      >
        <div
          className="flex flex-1 flex-col"
          style={{
            background: creamGlass,
            backdropFilter: "blur(34px) saturate(170%)",
            WebkitBackdropFilter: "blur(34px) saturate(170%)",
            borderLeft: `1px solid ${softLine}`,
            boxShadow: "-18px 0 60px rgba(61,48,37,0.14), inset 1px 0 0 rgba(255,255,255,0.72)",
          }}
        >
          <div className="flex items-center justify-between px-4 pb-4 pt-[max(env(safe-area-inset-top),1rem)] sm:px-5 sm:pt-[max(env(safe-area-inset-top),1.4rem)]">
            <span className="font-light uppercase tracking-[0.35em]" style={{ color: "#7B6E60", fontSize: "10px", fontFamily: "'Jost', sans-serif" }}>
              Navigation
            </span>
            <motion.button
              type="button"
              onClick={closeMenu}
              whileTap={{ scale: 0.85 }}
              className="flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full transition-all duration-300"
              style={{ color: navText, background: "rgba(255,255,255,0.50)", border: `1px solid ${softLine}` }}
              aria-label="Close menu"
            >
              <X strokeWidth={1.3} className="h-3.5 w-3.5" />
            </motion.button>
          </div>

          <div className="mx-6 mb-3 h-px" style={{ background: softLine }} />

          <ul className="flex flex-col gap-1 px-3 pb-2">
            {mainMenuItems.map((item, index) => (
              <li key={item.link}>
                <div className="flex items-center justify-between rounded-2xl px-3 py-3 transition-all duration-300 hover:bg-[rgba(168,121,53,0.07)]">
                  <Link
                    href={item.link}
                    onClick={!item.submenu ? closeMenu : undefined}
                    className="flex min-h-[44px] min-w-[44px] flex-1 items-center gap-2 sm:gap-3"
                  >
                    <span
                      className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl"
                      style={{
                        background: "linear-gradient(135deg, rgba(255,255,255,0.62), rgba(168,121,53,0.08))",
                        border: `1px solid ${softLine}`,
                        color: navGold,
                      }}
                    >
                      {item.icon}
                    </span>
                    <span className="font-light tracking-wide" style={{ color: navInk, fontSize: "13px", fontFamily: "'Jost', sans-serif", letterSpacing: "0.08em" }}>
                      {item.title}
                    </span>
                  </Link>

                  {item.submenu ? (
                    <motion.button
                      type="button"
                      onClick={() => setActiveSubmenu(activeSubmenu === index ? null : index)}
                      className="flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full transition-all duration-300"
                      style={{ background: "rgba(255,255,255,0.44)", color: "#7B6E60" }}
                      animate={{ rotate: activeSubmenu === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      aria-label={activeSubmenu === index ? `Hide ${item.title} links` : `Show ${item.title} links`}
                    >
                      <ChevronDown strokeWidth={1.3} className="h-3 w-3" />
                    </motion.button>
                  ) : null}
                </div>

                <AnimatePresence initial={false}>
                  {item.submenu && activeSubmenu === index ? (
                    <motion.ul
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="mb-1.5 ml-5 mr-2 overflow-hidden"
                    >
                      <div className="overflow-hidden rounded-2xl" style={{ background: "rgba(255,255,255,0.42)", border: `1px solid ${softLine}` }}>
                        {item.submenu.map((sub, subIndex) => (
                          <div key={sub.link}>
                            <Link
                              href={sub.link}
                              onClick={closeMenu}
                              className="group flex min-h-[44px] min-w-[44px] items-center justify-between px-4 py-3.5 transition-all duration-200 hover:bg-[rgba(168,121,53,0.07)]"
                              style={{ color: navText, fontSize: "11px", letterSpacing: "0.12em", fontFamily: "'Jost', sans-serif", fontWeight: 300 }}
                            >
                              <span>{sub.title}</span>
                              <ArrowRight strokeWidth={1.2} className="h-3 w-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                            </Link>
                            {subIndex < item.submenu!.length - 1 ? <div className="mx-4 h-px" style={{ background: "rgba(123,103,82,0.10)" }} /> : null}
                          </div>
                        ))}
                      </div>
                    </motion.ul>
                  ) : null}
                </AnimatePresence>
              </li>
            ))}
          </ul>

          <div className="mx-6 my-3 h-px" style={{ background: softLine }} />

          <ul className="flex flex-col gap-1 px-3 pb-6">
            {utilityItems.filter((item) => item.title !== "Cart" && item.title !== "Account").map((item) => (
              <li key={item.link}>
                <Link
                  href={item.link}
                  onClick={closeMenu}
                  className="flex min-h-[44px] min-w-[44px] items-center gap-2 rounded-2xl px-3 py-3.5 transition-all duration-300 hover:bg-[rgba(168,121,53,0.07)] sm:gap-3"
                >
                  <span
                    className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl"
                    style={{
                      background: "linear-gradient(135deg, rgba(255,255,255,0.62), rgba(168,121,53,0.08))",
                      border: `1px solid ${softLine}`,
                      color: navGold,
                    }}
                  >
                    {item.icon}
                  </span>
                  <span className="font-light tracking-wide" style={{ color: navInk, fontSize: "12.5px", fontFamily: "'Jost', sans-serif", letterSpacing: "0.08em" }}>
                    {item.title}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-auto px-5 pb-[max(env(safe-area-inset-bottom),2rem)]">
            <div className="mb-5 h-px" style={{ background: softLine }} />
            <p className="text-center font-light uppercase tracking-[0.5em]" style={{ color: "rgba(61,48,37,0.72)", fontSize: "9px", fontFamily: "'Cormorant Garamond', serif" }}>
              BOUT
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<number | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [miniCartOpen, setMiniCartOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const scrolledRef = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      const nextScrolled = window.scrollY > 12;
      if (scrolledRef.current === nextScrolled) return;
      scrolledRef.current = nextScrolled;
      setScrolled(nextScrolled);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

  useEffect(() => {
    async function loadCartCount() {
      try {
        const response = await fetch("/api/cart", { cache: "no-store" });
        const data = await response.json();
        const count = Array.isArray(data.items)
          ? data.items.reduce((sum: number, item: any) => sum + Number(item.quantity || 1), 0)
          : 0;
        setCartCount(count);
      } catch {
        setCartCount(0);
      }
    }

    const onCartChange = () => void loadCartCount();
    const onCartOpen = () => setMiniCartOpen(true);
    const onSearchOpen = () => setSearchOpen(true);

    void loadCartCount();
    window.addEventListener("cart:changed", onCartChange);
    window.addEventListener("cart:open", onCartOpen);
    window.addEventListener("search:open", onSearchOpen);
    return () => {
      window.removeEventListener("cart:changed", onCartChange);
      window.removeEventListener("cart:open", onCartOpen);
      window.removeEventListener("search:open", onSearchOpen);
    };
  }, []);

  const controlClass = "relative group flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full transition-colors duration-300 hover:text-[#3D3025]";

  return (
    <>
      <motion.nav
        initial={false}
        animate={{ y: 0, opacity: 1 }}
        className="fixed inset-x-0 top-0 z-50 transition-all duration-500"
        style={{
          background: scrolled
            ? "linear-gradient(135deg, rgba(255,255,255,0.92) 0%, rgba(255,249,239,0.82) 54%, rgba(237,227,214,0.80) 100%)"
            : "linear-gradient(135deg, rgba(255,255,255,0.82) 0%, rgba(255,249,239,0.70) 54%, rgba(237,227,214,0.68) 100%)",
          backdropFilter: "blur(30px) saturate(170%)",
          WebkitBackdropFilter: "blur(30px) saturate(170%)",
          borderBottom: `1px solid ${softLine}`,
          boxShadow: scrolled ? "0 12px 34px rgba(61,48,37,0.12), inset 0 1px 0 rgba(255,255,255,0.76)" : "inset 0 1px 0 rgba(255,255,255,0.60)",
        }}
      >
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.90) 30%, rgba(255,255,255,0.90) 70%, transparent)" }}
        />

        <div className="mx-auto flex h-[54px] max-w-[1440px] items-center justify-between px-3 sm:h-[58px] sm:px-5 md:px-8">
          <Link href="/" className="group relative flex-shrink-0">
            <span
              className="font-light uppercase tracking-[0.4em] transition-colors duration-500 group-hover:text-[#A87935]"
              style={{ color: navInk, fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(0.78rem, 2.6vw, 0.92rem)" }}
            >
              BOUT
            </span>
            <span
              className="absolute -bottom-0.5 left-0 h-px w-0 transition-all duration-500 ease-out group-hover:w-full"
              style={{ background: "linear-gradient(90deg, rgba(168,121,53,0.82), transparent)" }}
            />
          </Link>

          <ul className="hidden items-center gap-0.5 md:flex">
            {mainMenuItems.map((item) => (
              <DesktopMenuItem key={item.link} item={item} />
            ))}
          </ul>

          <div className="hidden items-center gap-0.5 md:flex">
            <div className="mx-2 h-4 w-px" style={{ background: softLine }} />
            <motion.button
              type="button"
              onClick={() => setSearchOpen(true)}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.9 }}
              className="relative group flex h-10 w-10 min-h-[44px] min-w-[44px] items-center justify-center rounded-full transition-colors duration-300 hover:text-[#3D3025]"
              style={{ color: navText }}
              aria-label="Search"
            >
              <span className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: hoverFill }} />
              <Search strokeWidth={1.4} className="relative z-10 h-4 w-4" />
            </motion.button>

            {utilityItems.map((item) => (
              <UtilityBtn key={item.link} item={item} cartCount={cartCount} onCartClick={() => setMiniCartOpen(true)} />
            ))}
          </div>

          <div className="flex items-center gap-1 md:hidden">
            {[
              { href: "/cart", label: "Cart", icon: <ShoppingCart strokeWidth={1.4} className="h-4 w-4" />, action: () => setMiniCartOpen(true) },
              { href: "/account", label: "Account", icon: <User strokeWidth={1.4} className="h-4 w-4" /> },
            ].map((button) => (
              <motion.div key={button.label} whileTap={{ scale: 0.88 }}>
                {button.action ? (
                  <button type="button" onClick={button.action} aria-label={button.label} className={controlClass} style={{ color: navText }}>
                    <span className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: hoverFill }} />
                    <span className="relative z-10">{button.icon}</span>
                    {cartCount > 0 ? (
                      <span className="absolute -right-0.5 -top-0.5 z-20 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#A87935] px-1 text-[9px] leading-none text-[#1D1815]">
                        {cartCount > 9 ? "9+" : cartCount}
                      </span>
                    ) : null}
                  </button>
                ) : (
                  <Link href={button.href} aria-label={button.label} className={controlClass} style={{ color: navText }}>
                    <span className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: hoverFill }} />
                    <span className="relative z-10">{button.icon}</span>
                  </Link>
                )}
              </motion.div>
            ))}

            <motion.button
              type="button"
              onClick={() => setSearchOpen(true)}
              whileTap={{ scale: 0.88 }}
              className={controlClass}
              style={{ color: navText }}
              aria-label="Open search"
            >
              <span className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: hoverFill }} />
              <Search strokeWidth={1.4} className="relative z-10 h-4 w-4" />
            </motion.button>

            <motion.button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              whileTap={{ scale: 0.88 }}
              className={`${controlClass} ml-0.5`}
              style={{ color: navText }}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              <span className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: hoverFill }} />
              <AnimatePresence mode="wait">
                {mobileOpen ? (
                  <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }} className="relative z-10">
                    <X strokeWidth={1.4} className="h-4 w-4" />
                  </motion.span>
                ) : (
                  <motion.span key="m" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }} className="relative z-10">
                    <Menu strokeWidth={1.4} className="h-4 w-4" />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen ? (
          <MobileMenu activeSubmenu={activeSubmenu} setActiveSubmenu={setActiveSubmenu} closeMenu={() => setMobileOpen(false)} />
        ) : null}
      </AnimatePresence>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <MiniCartDrawer open={miniCartOpen} onClose={() => setMiniCartOpen(false)} />
    </>
  );
}
