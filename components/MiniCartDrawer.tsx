"use client";

import { useOverlayIsolation } from "@/components/useOverlayIsolation";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { showToast } from "./ToastProvider";

type MiniCartItem = {
  _id?: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  size?: string | null;
  color?: string | null;
};

export default function MiniCartDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [portalReady, setPortalReady] = useState(false);
  const [items, setItems] = useState<MiniCartItem[]>([]);
  const [loading, setLoading] = useState(false);

  useOverlayIsolation(open);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + Number(item.price ?? 0) * Number(item.quantity ?? 0), 0),
    [items]
  );

  const fetchCart = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cart", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Unable to load cart");
      setItems(Array.isArray(data.items) ? data.items : []);
    } catch (error) {
      showToast({
        tone: "error",
        title: "Cart",
        message: error instanceof Error ? error.message : "Unable to load cart.",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setPortalReady(true);
  }, []);

  useEffect(() => {
    if (open) void fetchCart();
  }, [fetchCart, open]);

  useEffect(() => {
    const onCartChanged = () => {
      if (open) void fetchCart();
    };
    window.addEventListener("cart:changed", onCartChanged);
    return () => window.removeEventListener("cart:changed", onCartChanged);
  }, [fetchCart, open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, open]);

  const updateQuantity = async (item: MiniCartItem, quantity: number) => {
    try {
      if (quantity < 1) {
        await removeItem(item);
        return;
      }

      const res = await fetch("/api/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: item.productId,
          quantity,
          size: item.size ?? null,
          color: item.color ?? null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Unable to update quantity");
      await fetchCart();
      window.dispatchEvent(new Event("cart:changed"));
      showToast({ tone: "success", title: "Cart", message: "Quantity updated." });
    } catch (error) {
      showToast({
        tone: "error",
        title: "Cart",
        message: error instanceof Error ? error.message : "Unable to update quantity.",
      });
    }
  };

  const removeItem = async (item: MiniCartItem) => {
    try {
      const res = await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: item.productId,
          size: item.size ?? null,
          color: item.color ?? null,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Unable to remove item");
      await fetchCart();
      window.dispatchEvent(new Event("cart:changed"));
      showToast({ tone: "success", title: "Cart", message: "Item removed." });
    } catch (error) {
      showToast({
        tone: "error",
        title: "Cart",
        message: error instanceof Error ? error.message : "Unable to remove item.",
      });
    }
  };

  if (!portalReady) return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div className="fixed inset-0 z-[80]" role="dialog" aria-modal="true" aria-label="Mini cart">
          <motion.button
            type="button"
            aria-label="Close cart"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 cursor-default bg-black/55 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-0 right-0 top-0 flex w-full max-w-[430px] flex-col overflow-hidden"
            style={{
              background: "linear-gradient(160deg, rgba(24,19,17,0.98), rgba(10,9,8,0.99))",
              borderLeft: "1px solid rgba(255,248,236,0.10)",
              boxShadow: "-24px 0 70px rgba(0,0,0,0.55)",
            }}
          >
            <header className="flex items-center justify-between border-b border-white/10 px-4 py-4 sm:px-5">
              <div>
                <p className="text-[9px] uppercase tracking-[0.35em] text-white/25">Cart</p>
                <h2 className="mt-1 font-serif text-2xl font-light tracking-[0.08em] text-white">
                  Mini Cart
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-white/55 transition-colors hover:text-white"
                aria-label="Close cart"
              >
                <X className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-5">
              {loading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="h-24 animate-pulse rounded-2xl bg-white/[0.05]" />
                  ))}
                </div>
              ) : items.length === 0 ? (
                <div className="flex min-h-[48vh] flex-col items-center justify-center text-center">
                  <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl border border-white/10 bg-white/[0.04] text-white/28">
                    <ShoppingBag className="h-7 w-7" strokeWidth={1.2} />
                  </div>
                  <h3 className="font-serif text-2xl font-light text-white">Your cart is empty</h3>
                  <p className="mt-3 max-w-xs text-sm font-light leading-relaxed text-white/40">
                    Add pieces from the shop and they will appear here.
                  </p>
                  <Link
                    href="/shop"
                    onClick={onClose}
                    className="mt-7 inline-flex min-h-[44px] items-center rounded-full border border-brass/30 px-6 text-[10px] uppercase tracking-[0.24em] text-brass"
                  >
                    Shop Now
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((item, index) => (
                    <div
                      key={`${item.productId}-${item.size ?? "size"}-${item.color ?? "color"}-${index}`}
                      className="rounded-2xl border border-white/10 bg-white/[0.035] p-3"
                    >
                      <div className="flex gap-3">
                        <Link
                          href={`/product/${encodeURIComponent(item.productId)}`}
                          onClick={onClose}
                          className="relative h-24 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-white/[0.04]"
                        >
                          <Image
                            src={item.image || "/images/placeholder.svg"}
                            alt={item.name}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        </Link>
                        <div className="min-w-0 flex-1">
                          <Link
                            href={`/product/${encodeURIComponent(item.productId)}`}
                            onClick={onClose}
                            className="font-serif text-lg font-light leading-tight text-white transition-colors hover:text-brass"
                          >
                            {item.name}
                          </Link>
                          {(item.size || item.color) && (
                            <p className="mt-2 text-[9px] uppercase tracking-[0.22em] text-white/32">
                              {item.size ? `Size ${item.size}` : ""}
                              {item.size && item.color ? " / " : ""}
                              {item.color ? `Color ${item.color}` : ""}
                            </p>
                          )}
                          <p className="mt-2 text-sm font-light text-brass">
                            EGP {(Number(item.price ?? 0) * item.quantity).toLocaleString()}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => void removeItem(item)}
                          aria-label={`Remove ${item.name}`}
                          className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full text-white/35 transition-colors hover:text-red-200"
                        >
                          <Trash2 className="h-4 w-4" strokeWidth={1.4} />
                        </button>
                      </div>
                      <div className="mt-3 flex items-center justify-between border-t border-white/[0.06] pt-3">
                        <div className="inline-flex items-center rounded-full border border-white/10 bg-black/20">
                          <button
                            type="button"
                            onClick={() => void updateQuantity(item, item.quantity - 1)}
                            aria-label={`Decrease quantity for ${item.name}`}
                            className="flex h-11 w-11 items-center justify-center text-white/55 hover:text-white"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="min-w-8 text-center text-sm text-white/75">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => void updateQuantity(item, item.quantity + 1)}
                            aria-label={`Increase quantity for ${item.name}`}
                            className="flex h-11 w-11 items-center justify-center text-white/55 hover:text-white"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <span className="text-[9px] uppercase tracking-[0.22em] text-white/28">
                          EGP {Number(item.price ?? 0).toLocaleString()} each
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <footer className="border-t border-white/10 px-4 py-4 sm:px-5">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-[0.28em] text-white/35">Subtotal</span>
                  <span className="font-serif text-2xl font-light text-brass">
                    EGP {subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/cart"
                    onClick={onClose}
                    className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-white/12 text-[10px] uppercase tracking-[0.22em] text-white/65"
                  >
                    View Cart
                  </Link>
                  <Link
                    href="/checkout"
                    onClick={onClose}
                    className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-brass/35 bg-brass/12 text-[10px] uppercase tracking-[0.22em] text-brass"
                  >
                    Checkout
                  </Link>
                </div>
              </footer>
            )}
          </motion.aside>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}
