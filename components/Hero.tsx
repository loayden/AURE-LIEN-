"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative mobile-safe-hero flex items-center justify-center overflow-hidden px-4 pb-10 sm:px-6 sm:pb-20 md:px-10">

      {/* Background Image */}
      <motion.div
        initial={{ scale: 1 }}
        animate={{ scale: 1.05 }}
        transition={{ duration: 20, ease: "easeOut" }}
        className="absolute inset-0"
      >
        <Image
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1920"
          alt="Luxury Editorial"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      </motion.div>

      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.8, ease: "easeInOut" }}
        className="relative max-w-4xl text-center"
      >
        <h1
          className="hero-title-fluid mb-6 font-light tracking-[0.16em] text-[#F2EFE8] sm:mb-8"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Enduring by Design.
        </h1>

        <p className="hero-body-copy mb-8 text-[#F2EFE8]/70 sm:mb-12">
          Founded in restraint. Refined without display.
        </p>

        <button className="min-h-[44px] min-w-[44px] border border-[#F2EFE8]/60 px-5 py-3 text-[11px] tracking-[0.35em] uppercase text-[#F2EFE8] transition-all duration-700 hover:bg-[#F2EFE8] hover:text-[#111111] sm:px-14 sm:py-4 sm:text-xs">
          EXPLORE COLLECTION
        </button>
      </motion.div>
    </section>
  );
}
