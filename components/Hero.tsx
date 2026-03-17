"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">

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
        />
      </motion.div>

      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.8, ease: "easeInOut" }}
        className="relative text-center max-w-4xl"
      >
        <h1 className="text-5xl md:text-6xl mb-10 leading-tight font-light tracking-[0.18em] text-[#F2EFE8]">
          Enduring by Design.
        </h1>

        <p className="text-[#F2EFE8]/70 text-base mb-14 tracking-[0.08em]">
          Founded in restraint. Refined without display.
        </p>

        <button className="px-14 py-4 border border-[#F2EFE8]/60 text-[#F2EFE8] 
          hover:bg-[#F2EFE8] hover:text-[#111111] transition-all duration-700
          tracking-[0.35em] uppercase text-xs">
          EXPLORE COLLECTION
        </button>
      </motion.div>
    </section>
  );
}
