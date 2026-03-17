"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface HeroSectionProps {
  image: string;
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaHref?: string;
}

export default function HeroSection({
  image,
  title,
  subtitle,
  ctaText = "Explore Collection",
  ctaHref = "/collection",
}: HeroSectionProps) {
  return (
    <section className="relative h-screen flex items-center justify-center text-center overflow-hidden">
      <motion.div
        initial={{ scale: 1 }}
        animate={{ scale: 1.05 }}
        transition={{ duration: 20, ease: "easeOut" }}
        className="absolute inset-0"
      >
        <Image
          src={image}
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/70" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 px-6"
      >
        <h1 className="text-display-xl font-serif font-light text-ivory tracking-luxury-wide leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-6 text-lg sm:text-xl text-ivory/90 font-light tracking-wide max-w-xl mx-auto">
            {subtitle}
          </p>
        )}
        <div className="gold-line mt-6" />
        <Link
          href={ctaHref}
          className="button-luxury mt-6 inline-block text-center text-ivory"
        >
          {ctaText}
        </Link>
      </motion.div>
    </section>
  );
}
