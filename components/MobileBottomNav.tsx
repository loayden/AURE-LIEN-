"use client";

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
      className="fixed inset-x-0 bottom-0 z-50 border-t px-3 pb-[max(env(safe-area-inset-bottom),0.45rem)] pt-2 backdrop-blur-2xl md:hidden"
      style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.84), rgba(255,249,239,0.74))",
        borderColor: "rgba(123,103,82,0.18)",
        boxShadow: "0 -10px 28px rgba(61,48,37,0.10), inset 0 1px 0 rgba(255,255,255,0.72)",
      }}
      aria-label="Mobile commerce navigation"
    >
      <div className="mx-auto grid max-w-sm grid-cols-5 gap-1.5">
        {ITEMS.map((item) => {
          const Icon = item.icon;
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href || pathname?.startsWith(`${item.href}/`);
          const content = (
            <>
              <span className="relative flex h-5 items-center justify-center">
                <Icon className="h-[18px] w-[18px]" strokeWidth={1.55} />
                {item.label === "Cart" && cartCount > 0 ? (
                  <span className="absolute -right-2 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#A87935] px-1 text-[9px] leading-none text-[#FFF9EF]">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                ) : null}
              </span>
              <span className="text-[9px] leading-none tracking-[0.06em]">{item.label}</span>
            </>
          );

          const event = item.event;
          const itemClass =
            "flex min-h-[44px] flex-col items-center justify-center gap-1 rounded-[18px] px-1 transition-colors";
          const itemStyle = active
            ? {
                background: "linear-gradient(135deg, rgba(168,121,53,0.18), rgba(255,249,239,0.46))",
                color: "#3D3025",
                border: "1px solid rgba(168,121,53,0.20)",
              }
            : {
                background: "rgba(255,255,255,0.28)",
                color: "#6F6254",
                border: "1px solid transparent",
              };

          if (event) {
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => window.dispatchEvent(new Event(event))}
                className={itemClass}
                style={itemStyle}
              >
                {content}
              </button>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              className={itemClass}
              style={itemStyle}
            >
              {content}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
