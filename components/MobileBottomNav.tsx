"use client";

import { Home, Search, ShoppingBag, ShoppingCart, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const NAV_ITEMS = [
  { label: "Home", href: "/", icon: Home },
  { label: "Shop", href: "/shop", icon: ShoppingBag },
  { label: "Account", href: "/account", icon: User },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  const [cartCount, setCartCount] = useState(0);

  const refreshCartCount = useCallback(async () => {
    try {
      const res = await fetch("/api/cart", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      const count = Array.isArray(data.items)
        ? data.items.reduce((sum: number, item: { quantity?: number }) => sum + Number(item.quantity ?? 0), 0)
        : 0;
      setCartCount(count);
    } catch {
      setCartCount(0);
    }
  }, []);

  useEffect(() => {
    refreshCartCount();
  }, [pathname, refreshCartCount]);

  useEffect(() => {
    window.addEventListener("cart:changed", refreshCartCount);
    window.addEventListener("focus", refreshCartCount);
    return () => {
      window.removeEventListener("cart:changed", refreshCartCount);
      window.removeEventListener("focus", refreshCartCount);
    };
  }, [refreshCartCount]);

  return (
    <nav
      className="fixed inset-x-3 bottom-3 z-50 rounded-[24px] border border-white/10 bg-[#14110F]/88 px-2 pb-[max(env(safe-area-inset-bottom),0.35rem)] pt-2 backdrop-blur-2xl md:hidden"
      aria-label="Mobile primary navigation"
      style={{ boxShadow: "0 18px 50px rgba(0,0,0,0.48), inset 0 1px 0 rgba(255,248,236,0.09)" }}
    >
      <div className="grid grid-cols-5 items-center gap-1">
        {NAV_ITEMS.slice(0, 2).map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex min-h-[50px] flex-col items-center justify-center gap-1 rounded-2xl text-[9px] uppercase tracking-[0.14em] transition-colors"
              style={{ color: active ? "#C9A86A" : "rgba(255,248,236,0.55)" }}
            >
              <Icon className="h-4 w-4" strokeWidth={1.5} />
              {item.label}
            </Link>
          );
        })}

        <button
          type="button"
          onClick={() => window.dispatchEvent(new Event("search:open"))}
          className="flex min-h-[50px] flex-col items-center justify-center gap-1 rounded-2xl text-[9px] uppercase tracking-[0.14em] text-white/55"
          aria-label="Open search"
        >
          <Search className="h-4 w-4" strokeWidth={1.5} />
          Search
        </button>

        <button
          type="button"
          onClick={() => window.dispatchEvent(new Event("cart:open"))}
          className="relative flex min-h-[50px] flex-col items-center justify-center gap-1 rounded-2xl text-[9px] uppercase tracking-[0.14em] text-white/55"
          aria-label={cartCount > 0 ? `Open cart, ${cartCount} items` : "Open cart"}
        >
          <ShoppingCart className="h-4 w-4" strokeWidth={1.5} />
          Cart
          {cartCount > 0 && (
            <span className="absolute right-3 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brass px-1 text-[8px] leading-none text-black">
              {cartCount > 99 ? "99+" : cartCount}
            </span>
          )}
        </button>

        {NAV_ITEMS.slice(2).map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex min-h-[50px] flex-col items-center justify-center gap-1 rounded-2xl text-[9px] uppercase tracking-[0.14em] transition-colors"
              style={{ color: active ? "#C9A86A" : "rgba(255,248,236,0.55)" }}
            >
              <Icon className="h-4 w-4" strokeWidth={1.5} />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
