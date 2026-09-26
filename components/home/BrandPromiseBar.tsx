"use client";

import { motion } from "framer-motion";
import { CreditCard, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import { easeOut, sectionReveal } from "@/components/home/sectionMotion";

const BRAND_PROMISES = [
  { icon: ShieldCheck, label: "100% Genuine", detail: "Verified authentic products" },
  { icon: Truck, label: "Egypt-Wide Delivery", detail: "2-5 business days" },
  { icon: RotateCcw, label: "Easy Returns", detail: "14-day hassle-free" },
  { icon: CreditCard, label: "Secure Payment", detail: "Card, COD, installments" },
] as const;

export default function BrandPromiseBar() {
  return (
    <motion.section
      variants={sectionReveal}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      data-testid="brand-promise-bar"
      className="border-y border-[#DDDAD2] bg-gradient-to-r from-[#F7F7F4] via-[#FDFCF9] to-[#F7F7F4] px-4 py-8 [content-visibility:auto] [contain-intrinsic-size:180px] sm:px-6 sm:py-10 md:px-10"
    >
      <div className="mx-auto grid w-full max-w-[92rem] grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {BRAND_PROMISES.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="group flex items-start gap-3 sm:items-center">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#171513] text-[#D8C08A] transition duration-300 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(216,192,138,0.3)] sm:h-12 sm:w-12">
                <Icon className="h-5 w-5" strokeWidth={1.5} />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium text-[#171513]">{item.label}</p>
                <p className="mt-0.5 text-[12px] leading-4 text-[#69645E]">{item.detail}</p>
              </div>
            </div>
          );
        })}
      </div>
    </motion.section>
  );
}

