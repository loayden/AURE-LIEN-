"use client";

import {
  formatCategoryLabel,
  formatPrice,
  productHref,
  productImage,
} from "@/lib/commerce";
import type { Product } from "@/lib/types";
import { motion } from "framer-motion";
import { Star, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { easeOut, fadeUp, sectionReveal, tileReveal } from "@/components/home/sectionMotion";

// ─── Countdown hook (client-only, avoids hydration mismatch) ───
function useCountdown(endMs: number) {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setTimeLeft(Math.max(0, endMs - Date.now()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [endMs]);

  if (timeLeft === null) return { hours: 0, minutes: 0, seconds: 0, expired: true, ready: false };

  return {
    hours: Math.floor(timeLeft / 3_600_000),
    minutes: Math.floor((timeLeft % 3_600_000) / 60_000),
    seconds: Math.floor((timeLeft % 60_000) / 1_000),
    expired: timeLeft <= 0,
    ready: true,
  };
}

function CountdownDigit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#171513] font-mono text-base font-bold tabular-nums text-[#F8F7F2] sm:h-10 sm:w-10 sm:text-lg">
        {String(value).padStart(2, "0")}
      </span>
      <span className="mt-1 text-[9px] uppercase tracking-wider text-[#69645E]">{label}</span>
    </div>
  );
}

// ─── Flash Deals Section ───
export default function FlashDealsSection({
  products,
  onAction,
  addingId,
}: {
  products: Product[];
  onAction: (p: Product) => void;
  addingId: string | null;
}) {
  const dealEndMs = useMemo(() => {
    const d = new Date();
    d.setHours(23, 59, 59, 999);
    return d.getTime();
  }, []);

  const { hours, minutes, seconds, expired, ready } = useCountdown(dealEndMs);
  const dealProducts = useMemo(() => products.slice(0, 6), [products]);

  if (!ready || expired || dealProducts.length === 0) return null;

  return (
    <motion.section
      variants={sectionReveal}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.14 }}
      data-testid="flash-deals-section"
      className="border-b border-[#DDDAD2] bg-gradient-to-br from-[#FFF8EC] via-white to-[#FEF3E2] px-4 py-8 [content-visibility:auto] [contain-intrinsic-size:520px] sm:px-6 sm:py-10 md:px-10"
    >
      <div className="mx-auto w-full max-w-[92rem]">
        <motion.div variants={fadeUp} className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="flash-deal-badge inline-flex items-center gap-1.5 rounded-full bg-[#DC2626] px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider text-white">
                <Zap className="h-3 w-3" strokeWidth={2} />
                Flash Deals
              </span>
            </div>
            <h2 className="font-serif text-3xl font-light leading-none text-[#171513] sm:text-4xl lg:text-5xl">
              Today&apos;s best prices
            </h2>
            <p className="mt-2 text-sm text-[#5A5650]">Limited time offers — ends tonight</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider text-[#DC2626]">Ends in</span>
            <div className="flex items-center gap-1.5">
              <CountdownDigit value={hours} label="hrs" />
              <span className="mt-[-12px] text-lg font-bold text-[#171513]">:</span>
              <CountdownDigit value={minutes} label="min" />
              <span className="mt-[-12px] text-lg font-bold text-[#171513]">:</span>
              <CountdownDigit value={seconds} label="sec" />
            </div>
          </div>
        </motion.div>

        <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-3 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {dealProducts.map((product, i) => {
            const seed = (product.name.length * 7 + i * 13) % 26;
            const discount = 15 + seed;
            const fakeOriginal = Math.round(product.price / (1 - discount / 100));
            const claimed = 40 + ((seed * 2) % 51);
            return (
              <motion.div
                key={product._id}
                variants={tileReveal}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                className="w-[44vw] min-w-[10rem] max-w-[13rem] shrink-0 snap-start sm:w-auto sm:min-w-0 sm:max-w-none"
              >
                <div className="group overflow-hidden rounded-xl border border-[#DEDAD2] bg-white shadow-sm transition hover:shadow-md">
                  <Link href={productHref(product)} className="relative block aspect-square overflow-hidden bg-[#F3F1ED]">
                    <Image
                      src={productImage(product)}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 44vw, (max-width: 1024px) 33vw, 16vw"
                      className="object-cover transition duration-500 group-hover:scale-[1.05]"
                    />
                    <span className="absolute left-2 top-2 rounded-md bg-[#DC2626] px-2 py-1 text-[10px] font-bold text-white shadow-sm">
                      -{discount}%
                    </span>
                  </Link>
                  <div className="p-3 flex flex-col h-full">
                    <p className="text-[10px] uppercase tracking-wider text-[#8A8177] mb-1">{formatCategoryLabel(product.category)}</p>
                    <h3 className="line-clamp-1 text-[13px] font-medium text-[#171513]">{product.name}</h3>
                    <p className="mt-0.5 line-clamp-1 text-[11px] text-[#69645E]">{product.description || "Limited time offer"}</p>
                    <div className="mt-1.5 flex items-baseline gap-2">
                      <span className="text-sm font-bold text-[#DC2626]">EGP {formatPrice(product.price)}</span>
                      <span className="text-[11px] text-[#8A8177] line-through">EGP {formatPrice(fakeOriginal)}</span>
                    </div>
                    <div className="mt-2">
                      <div className="h-1.5 overflow-hidden rounded-full bg-[#FEE2E2]">
                        <div className="h-full rounded-full bg-[#DC2626] transition-[width]" style={{ width: `${claimed}%` }} />
                      </div>
                      <p className="mt-1 text-[10px] text-[#DC2626]">{claimed}% claimed</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}

