"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import {
  easeOut,
  fadeUp,
  imageReveal,
  sectionReveal,
  tileReveal,
} from "@/components/home/sectionMotion";
import { UnifiedButton } from "@/components/ui/UnifiedButton";

export { easeOut, fadeUp, imageReveal, sectionReveal, tileReveal };

function AnimatedArrow({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <motion.span
      aria-hidden="true"
      className="inline-flex"
    >
      <ArrowRight className={className} strokeWidth={1.5} />
    </motion.span>
  );
}

export function SectionIntro({
  title,
  copy,
  action,
  inverted = false,
}: {
  title: string;
  copy?: string;
  action?: { label: string; href: string };
  inverted?: boolean;
}) {
  return (
    <motion.div
      variants={fadeUp}
      className="mb-6 flex flex-col gap-4 sm:mb-8 lg:flex-row lg:items-end lg:justify-between"
    >
      <div className="max-w-2xl">
        <h2 className={`font-serif text-4xl font-light leading-none sm:text-5xl lg:text-6xl ${inverted ? "text-[#F8F7F2]" : "text-[#171513]"}`}>
          {title}
        </h2>
        {copy ? <p className={`mt-4 max-w-xl text-sm leading-7 sm:text-base ${inverted ? "text-[#C9C5B8]" : "text-[#5A5650]"}`}>{copy}</p> : null}
      </div>
      {action ? (
        <motion.div
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.97 }}
        >
          <UnifiedButton
            href={action.href}
            variant="primary"
            size="sm"
          >
            {action.label}
            <AnimatedArrow />
          </UnifiedButton>
        </motion.div>
      ) : null}
    </motion.div>
  );
}
