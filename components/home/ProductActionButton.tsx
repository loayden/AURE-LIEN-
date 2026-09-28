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
      className="btn-primary inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full !min-h-[40px] !px-4 !py-2 !text-[10px]"
      style={
        state === "sold-out" || busy
          ? {
              background: "#D9D5CC",
              backgroundColor: "#D9D5CC",
              color: "#65605A",
              borderColor: "#D9D5CC",
              boxShadow: "none",
            }
          : undefined
      }
    >
      <ShoppingBag className="h-4 w-4" strokeWidth={1.45} />
      <span>{busy ? "Adding" : requiresChoice ? "Choose options" : "Add to Cart"}</span>
    </motion.button>
  );
}
