"use client";

import { stockState } from "@/lib/commerce";
import type { Product } from "@/lib/types";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";

const easeOut = [0.22, 1, 0.36, 1] as const;

export default function ProductActionButton({
  product,
  busy,
  onAction,
}: {
  product: Product;
  busy: boolean;
  onAction: (product: Product) => void;
}) {
  const state = stockState(product);
  const requiresChoice = (product.size?.length ?? 0) > 1 || (product.colors?.length ?? 0) > 1;

  return (
    <motion.button
      type="button"
      disabled={state === "sold-out" || busy}
      onClick={() => onAction(product)}
      whileTap={state === "sold-out" || busy ? undefined : { scale: 0.94 }}
      animate={busy ? { scale: [1, 0.96, 1] } : { scale: 1 }}
      transition={{ duration: 0.26, ease: easeOut }}
      className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-[#171513] px-4 py-2.5 text-sm text-[#F8F7F2] transition hover:bg-[#725D2C] disabled:cursor-not-allowed disabled:bg-[#D9D5CC] disabled:text-[#65605A]"
      style={{
        backgroundColor: state === "sold-out" || busy ? "#D9D5CC" : "#171513",
        color: state === "sold-out" || busy ? "#65605A" : "#F8F7F2",
        borderColor: state === "sold-out" || busy ? "#D9D5CC" : "#171513",
      }}
    >
      <ShoppingBag className="h-4 w-4" strokeWidth={1.45} />
      <span>{busy ? "Adding" : requiresChoice ? "Choose options" : "Add to Cart"}</span>
    </motion.button>
  );
}
