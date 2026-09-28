"use client";

// Shared motion vocabulary for homepage sections. Single source of truth —
// HomePageClient and components/home/* all import from here so easing and
// reveal timings stay identical after file splits.

export const easeOut = [0.22, 1, 0.36, 1] as const;

export const heroStagger = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.055,
      delayChildren: 0.02,
    },
  },
};

export const fadeUp = {
  hidden: { opacity: 0.01, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.44, ease: easeOut },
  },
};

export const imageReveal = {
  hidden: { opacity: 0.01, y: 18, scale: 0.992 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.58, ease: easeOut },
  },
};

export const sectionReveal = {
  hidden: { opacity: 0.01, y: 26 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.56, ease: easeOut },
  },
};

export const tileReveal = {
  hidden: { opacity: 0, y: 24, scale: 0.985 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.44, ease: easeOut },
  },
};

export const outfitSlideVariants = {
  enter: (direction: number) => ({
    opacity: 0,
    x: direction >= 0 ? 46 : -46,
    scale: 1.018,
  }),
  center: {
    opacity: 1,
    x: 0,
    scale: 1,
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction >= 0 ? -46 : 46,
    scale: 0.992,
  }),
};

export const activeProductsVariants = {
  enter: { opacity: 0, y: 14 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};
