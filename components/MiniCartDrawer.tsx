"use client";

import { RowSkeleton } from "@/components/Skeleton";
import { showToast } from "@/components/ToastProvider";
import { formatPrice } from "@/lib/commerce";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type CartLine = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  size?: string | null;
  color?: string | null;
  stock?: number;
};

function lineKey(item: CartLine) {
  return `${item.productId}-${item.size ?? "size"}-${item.color ?? "color"}`;
}

export default function MiniCartDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [items, setItems] = useState<CartLine[]>([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);
  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1), 0),
    [items]
  );

  async function loadCart() {
    setLoading(true);
    try {
      const response = await fetch("/api/cart", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "Unable to load cart");
      setItems(Array.isArray(data.items) ? data.items : []);
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Unable to load cart.", "error");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (open) void loadCart();
  }, [open]);

  useEffect(() => {
    function onCartChange() {
      if (open) void loadCart();
    }

    window.addEventListener("cart:changed", onCartChange);
    return () => window.removeEventListener("cart:changed", onCartChange);
  }, [open]);

  async function updateQuantity(item: CartLine, quantity: number) {
    const key = lineKey(item);
    setUpdating(key);
    try {
      const method = quantity <= 0 ? "DELETE" : "PUT";
      const response = await fetch("/api/cart", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: item.productId,
          quantity,
          size: item.size ?? null,
          color: item.color ?? null,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data?.error || "Unable to update cart");
      setItems((current) => {
        if (quantity <= 0) {
          return current.filter((line) => lineKey(line) !== key);
        }
        return current.map((line) => (lineKey(line) === key ? { ...line, quantity } : line));
      });
      window.dispatchEvent(new Event("cart:changed"));
      showToast(quantity <= 0 ? "Removed from cart." : "Cart updated.", "success");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Unable to update cart.", "error");
    } finally {
      setUpdating(null);
    }
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[90]"
          role="dialog"
          aria-modal="true"
          aria-label="Cart"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            aria-label="Close cart"
            className="absolute inset-0 h-full w-full backdrop-blur-sm"
            style={{ background: "rgba(61,48,37,0.24)" }}
            onClick={onClose}
          />

          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col overflow-hidden border-l text-[#3D3025]"
            style={{
              background: "linear-gradient(160deg, rgba(255,255,255,0.92), rgba(255,249,239,0.88))",
              borderColor: "rgba(123,103,82,0.18)",
              boxShadow: "0 0 70px rgba(61,48,37,0.16)",
            }}
          >
            <div className="flex items-center justify-between border-b px-4 py-4 sm:px-5" style={{ borderColor: "rgba(123,103,82,0.16)" }}>
              <div>
                <p className="eyebrow mb-1">Mini Cart</p>
                <h2 className="font-serif text-2xl font-light tracking-[0.04em] text-[#3D3025]">
                  Your Edit
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(123,103,82,0.18)] bg-white/60 text-[#6F6254] transition-colors hover:text-[#3D3025]"
                aria-label="Close cart"
              >
                <X className="h-4 w-4" strokeWidth={1.4} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-5">
              {loading ? (
                <div className="space-y-3">
                  {[0, 1, 2].map((item) => (
                    <RowSkeleton key={item} />
                  ))}
                </div>
              ) : items.length === 0 ? (
                <div className="flex min-h-[55vh] flex-col items-center justify-center text-center">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-3xl border border-[rgba(123,103,82,0.18)] bg-white/60">
                    <ShoppingBag className="h-7 w-7 text-[#7B6E60]/50" strokeWidth={1.1} />
                  </div>
                  <h3 className="font-serif text-3xl font-light tracking-[0.04em]">
                    Cart is <em className="gold-italic">empty</em>
                  </h3>
                  <p className="mt-3 max-w-xs text-sm leading-6 tracking-[0.06em] text-[#6F6254]">
                    Save the pieces you want, then return here for a faster checkout.
                  </p>
                  <Link href="/shop" onClick={onClose} className="btn-gold mt-7">
                    Shop Now
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((item) => {
                    const key = lineKey(item);
                    return (
                      <article
                        key={key}
                        className="grid grid-cols-[5.25rem_1fr] gap-3 rounded-2xl border border-[rgba(123,103,82,0.16)] bg-white/60 p-3"
                      >
                        <Link href={`/product/${encodeURIComponent(item.productId)}`} onClick={onClose} className="relative aspect-[4/5] overflow-hidden rounded-xl bg-[#F5F1E8]">
                          <Image src={item.image || "/images/placeholder.svg"} alt={item.name} fill sizes="84px" className="object-cover" />
                        </Link>
                        <div className="min-w-0">
                          <Link href={`/product/${encodeURIComponent(item.productId)}`} onClick={onClose}>
                            <h3 className="line-clamp-2 font-serif text-[1.08rem] font-light leading-tight tracking-[0.04em] text-[#3D3025]">
                              {item.name}
                            </h3>
                          </Link>
                          <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-[#7B6E60]/75">
                            {item.size ? `Size ${item.size}` : "One size"}
                            {item.color ? ` / ${item.color}` : ""}
                          </p>
                          {typeof item.stock === "number" && item.quantity > item.stock ? (
                            <p className="mt-2 text-[10px] uppercase tracking-[0.18em] text-red-300/80">
                              Only {item.stock} available
                            </p>
                          ) : null}
                          <div className="mt-3 flex items-center justify-between gap-3">
                            <div className="inline-flex items-center gap-1 rounded-full border border-[rgba(123,103,82,0.16)] bg-white/60 p-1">
                              <button
                                type="button"
                                disabled={updating === key}
                                onClick={() => updateQuantity(item, item.quantity - 1)}
                                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F5F1E8] text-[#5B4E42] disabled:opacity-40"
                                aria-label={`Decrease quantity for ${item.name}`}
                              >
                                <Minus className="h-3.5 w-3.5" strokeWidth={1.4} />
                              </button>
                              <span className="min-w-7 text-center text-xs text-[#5B4E42]">{item.quantity}</span>
                              <button
                                type="button"
                                disabled={updating === key}
                                onClick={() => updateQuantity(item, item.quantity + 1)}
                                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F5F1E8] text-[#5B4E42] disabled:opacity-40"
                                aria-label={`Increase quantity for ${item.name}`}
                              >
                                <Plus className="h-3.5 w-3.5" strokeWidth={1.4} />
                              </button>
                            </div>
                            <button
                              type="button"
                              disabled={updating === key}
                              onClick={() => updateQuantity(item, 0)}
                              className="flex h-10 w-10 items-center justify-center rounded-full border border-red-300/15 bg-red-400/[0.06] text-red-200/70 disabled:opacity-40"
                              aria-label={`Remove ${item.name}`}
                            >
                              <Trash2 className="h-3.5 w-3.5" strokeWidth={1.4} />
                            </button>
                          </div>
                          <p className="mt-3 font-serif text-lg tracking-[0.04em] text-[#A87935]">
                            EGP {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>

            {items.length > 0 ? (
              <div className="border-t px-4 py-4 backdrop-blur-xl sm:px-5" style={{ background: "rgba(245,241,232,0.88)", borderColor: "rgba(123,103,82,0.16)" }}>
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-[#7B6E60]">Subtotal</span>
                  <span className="font-serif text-2xl tracking-[0.04em] text-[#A87935]">
                    EGP {formatPrice(subtotal)}
                  </span>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <Link href="/cart" onClick={onClose} className="btn-ghost justify-center">
                    Cart
                  </Link>
                  <Link href="/checkout" onClick={onClose} className="btn-gold justify-center">
                    Checkout
                  </Link>
                </div>
              </div>
            ) : null}
          </motion.aside>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
