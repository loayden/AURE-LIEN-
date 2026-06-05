"use client";

import { motion } from "framer-motion";
import { Home, Search, ShoppingBag, ShoppingCart, User } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type MobileNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  event?: "search:open" | "cart:open";
};

const ITEMS: MobileNavItem[] = [
  { label: "Home", href: "/", icon: Home },
  { label: "Shop", href: "/shop", icon: ShoppingBag },
  { label: "Search", href: "/search", icon: Search, event: "search:open" },
  { label: "Cart", href: "/cart", icon: ShoppingCart, event: "cart:open" },
  { label: "Account", href: "/account", icon: User },
] as const;

export default function MobileBottomNav() {
  const pathname = usePathname();
  const [cartCount, setCartCount] = useState(0);

  async function loadCount() {
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

  useEffect(() => {
    void loadCount();
    const onChange = () => void loadCount();
    window.addEventListener("cart:changed", onChange);
    return () => window.removeEventListener("cart:changed", onChange);
  }, []);

  return (
    <nav
      className="pointer-events-none fixed bottom-0 left-1/2 z-50 w-[min(18.25rem,calc(100vw-1.25rem))] -translate-x-1/2 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-3 md:hidden"
      aria-label="Mobile commerce navigation"
    >
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-auto w-full rounded-[24px] border p-1.5 backdrop-blur-2xl"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.91), rgba(255,249,239,0.82))",
          borderColor: "rgba(123,103,82,0.18)",
          boxShadow: "0 -18px 48px rgba(61,48,37,0.16), 0 12px 32px rgba(61,48,37,0.08), inset 0 1px 0 rgba(255,255,255,0.78)",
        }}
      >
        <div className="grid grid-cols-[1fr_1fr_3.35rem_1fr_1fr] items-end gap-0.5">
        {ITEMS.map((item) => {
          const Icon = item.icon;
          const featured = item.label === "Search";
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href || pathname?.startsWith(`${item.href}/`);
          const content = (
            <>
              <motion.span
                className={`relative z-10 flex items-center justify-center ${
                  featured
                    ? "h-[46px] w-[46px] rounded-full bg-[#171513] text-[#F8F7F2] shadow-[0_12px_28px_rgba(23,21,19,0.24)]"
                    : "h-7 w-7 rounded-full"
                }`}
                animate={active ? { y: -1 } : { y: 0 }}
                transition={{ duration: 0.2 }}
                style={
                  !featured && active
                    ? {
                        background: "rgba(168,121,53,0.16)",
                        color: "#3D3025",
                      }
                    : undefined
                }
              >
                {featured ? (
                  <motion.span
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full border border-[#D8C08A]/30"
                    initial={{ scale: 0.92, opacity: 0.42 }}
                    animate={{ scale: 1.12, opacity: 0 }}
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  />
                ) : null}
                <Icon className={featured ? "h-[18px] w-[18px]" : "h-[18px] w-[18px]"} strokeWidth={featured ? 1.75 : 1.6} />
                {item.label === "Cart" && cartCount > 0 ? (
                  <motion.span
                    initial={{ scale: 0.7 }}
                    animate={{ scale: [1, 1.18, 1] }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute -right-2 -top-2 flex h-[18px] min-w-[18px] items-center justify-center rounded-full border border-[#F8F7F2] bg-[#A87935] px-1 text-[9px] font-medium leading-none text-white"
                  >
                    {cartCount > 9 ? "9+" : cartCount}
                  </motion.span>
                ) : null}
              </motion.span>
              <span
                className={`relative z-10 leading-none ${
                  featured
                    ? "mt-0.5 text-[8px] font-medium tracking-[0.04em] text-[#3D3025]"
                    : "text-[8px] tracking-[0.04em]"
                }`}
              >
                {item.label}
              </span>
            </>
          );

          const event = item.event;
          const itemClass =
              featured
              ? "relative isolate -mt-4 flex min-h-[62px] flex-col items-center justify-end gap-1 rounded-[20px] px-1 transition-colors"
              : "relative isolate flex min-h-[46px] flex-col items-center justify-center gap-1 overflow-hidden rounded-[18px] px-1 transition-colors";
          const activeBackground = active && !featured ? (
            <motion.span
              layoutId="mobile-bottom-nav-active"
              className="absolute inset-0 rounded-[20px]"
              style={{
                background: "linear-gradient(135deg, rgba(168,121,53,0.18), rgba(255,249,239,0.56))",
                border: "1px solid rgba(168,121,53,0.22)",
              }}
              transition={{ type: "spring", stiffness: 480, damping: 38 }}
            />
          ) : null;
          const itemStyle = active
            ? {
                color: "#3D3025",
              }
            : {
                background: featured ? "transparent" : "rgba(255,255,255,0.18)",
                color: "#6F6254",
                border: "1px solid transparent",
              };

          if (event) {
            return (
              <motion.button
                key={item.label}
                type="button"
                onClick={() => window.dispatchEvent(new Event(event))}
                whileTap={{ scale: featured ? 0.9 : 0.94 }}
                className={itemClass}
                style={itemStyle}
                aria-label={item.label}
              >
                {activeBackground}
                {content}
              </motion.button>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              className={itemClass}
              style={itemStyle}
              aria-label={item.label}
            >
              {activeBackground}
              {content}
            </Link>
          );
        })}
        </div>
      </motion.div>
    </nav>
  );
}
