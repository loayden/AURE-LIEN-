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
    <section className="relative mobile-safe-hero flex items-center justify-center overflow-hidden px-4 pb-10 text-center sm:px-6 sm:pb-20 md:px-10">
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
        className="relative z-10 max-w-4xl"
      >
        <h1
          className="font-serif font-light leading-tight text-ivory tracking-luxury-wide"
          style={{ fontSize: "clamp(1.8rem, 7vw, 4.5rem)" }}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="hero-body-copy mx-auto mt-4 max-w-xl text-ivory/90 sm:mt-6">
            {subtitle}
          </p>
        )}
        <div className="gold-line mt-6" />
        <Link
          href={ctaHref}
          className="button-luxury mt-6 inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 sm:gap-3 text-center text-ivory"
        >
          {ctaText}
        </Link>
      </motion.div>
    </section>
  );
}
