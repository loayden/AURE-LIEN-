"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * Sticky subscribe CTA: follows the shopper after the hero, hides while the
 * partner band is on screen (no duplication) and near the footer.
 * Mobile: full-width bar above the bottom nav. Desktop: floating pill.
 */
export function SubscribeCtaBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("boutiques-hero");
    const band = document.getElementById("partner-band");
    const footer = document.querySelector("footer");
    let pastHero = false;
    let bandVisible = false;
    let footerVisible = false;

    function update() {
      setVisible(pastHero && !bandVisible && !footerVisible);
    }
    const heroObserver = new IntersectionObserver(
      ([entry]) => {
        pastHero = !entry.isIntersecting && (entry.boundingClientRect.top ?? 0) < 0;
        update();
      },
      { threshold: 0 }
    );
    const bandObserver = new IntersectionObserver(
      ([entry]) => {
        bandVisible = entry.isIntersecting;
        update();
      },
      { threshold: 0.08 }
    );
    const footerObserver = new IntersectionObserver(
      ([entry]) => {
        footerVisible = entry.isIntersecting;
        update();
      },
      { threshold: 0 }
    );
    if (hero) heroObserver.observe(hero);
    if (band) bandObserver.observe(band);
    if (footer) footerObserver.observe(footer);
    update();
    return () => {
      heroObserver.disconnect();
      bandObserver.disconnect();
      footerObserver.disconnect();
    };
  }, []);

  return (
    <div
      aria-hidden={!visible}
      className={`fixed inset-x-0 z-40 transition-all duration-300 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      } bottom-[calc(5.5rem+env(safe-area-inset-bottom))] px-4 sm:bottom-6 sm:px-0 md:left-auto md:right-6 md:w-auto md:px-0`}
    >
      <Link
        href="/boutiques/apply"
        tabIndex={visible ? 0 : -1}
        className="flex min-h-[56px] items-center justify-center gap-3 rounded-full px-6 text-[11px] tracking-[0.22em] text-white shadow-[0_18px_50px_rgba(23,21,19,0.35)] sm:px-8"
        style={{ background: "linear-gradient(135deg, #4C3A26, #7D592B)", fontFamily: "Tahoma, Arial, sans-serif" }}
      >
        <span className="sm:hidden">بيع معانا — 7 أيام مجانا</span>
        <span className="hidden sm:inline">افتح بوتيكك — 7 أيام مجانا</span>
        <span aria-hidden>←</span>
      </Link>
    </div>
  );
}
