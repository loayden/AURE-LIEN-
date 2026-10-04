"use client";

import { UnifiedButton } from "@/components/ui/UnifiedButton";
import { usePerformanceProfile } from "@/hooks/usePerformanceProfile";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import {
  ArrowLeft,
  BadgeCheck,
  Banknote,
  Package,
  RotateCcw,
  ShoppingBag,
  Sparkles,
  Store,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export const ONBOARDING_REPLAY_EVENT = "bout:onboarding:replay";

const AR_FONT = "Tahoma, Arial, var(--font-jost), sans-serif";
const SERIF_AR = "'Cormorant Garamond', Tahoma, serif";

const EASE = [0.22, 1, 0.36, 1] as const;
const TOTAL_STEPS = 4;

type AccountIntent = "buyer" | "partner" | "both";

interface WelcomeOnboardingProps {
  userName?: string | null;
  accountIntent?: AccountIntent | string | null;
  onDone: () => void;
}

function firstName(name?: string | null) {
  const first = String(name ?? "").trim().split(/\s+/)[0] ?? "";
  return first || null;
}

function smartCta(intent?: AccountIntent | string | null): { label: string; href: string; hint: string } {
  if (intent === "partner") {
    return {
      label: "قدّم على بوتيك",
      href: "/boutiques/apply",
      hint: "أحسن بداية: قدّم على بوتيكك في دقيقتين — التوثيق غالباً بيخلص في نفس اليوم.",
    };
  }
  if (intent === "both") {
    return {
      label: "تسوّق الآن",
      href: "/shop",
      hint: "تسوّق براحتك — ولو عندك محل، التقديم على بوتيك مفتوح من حسابك.",
    };
  }
  return {
    label: "تسوّق الآن",
    href: "/shop",
    hint: "أحسن بداية: لفّة سريعة في التشكيل — اختار مزاجك وابدأ.",
  };
}

const TRUST = [
  { icon: BadgeCheck, label: "توثيق بالصور" },
  { icon: Banknote, label: "دفع عند الاستلام" },
  { icon: RotateCcw, label: "إرجاع سهل" },
] as const;

const PLACES = [
  {
    icon: ShoppingBag,
    title: "تسوّق",
    copy: "تشكيلات حسب مزاجك — جاكيتات، دنيم، أحذية.",
    href: "/shop",
  },
  {
    icon: Store,
    title: "بوتيكات",
    copy: "ادخل محلات حقيقية موثّقة وشوف قصتها.",
    href: "/boutiques",
  },
  {
    icon: Package,
    title: "حسابك",
    copy: "طلباتك والمفضلة والنقاط — كلها في مكان واحد.",
    href: "/account",
  },
] as const;

export default function WelcomeOnboarding({ userName, accountIntent, onDone }: WelcomeOnboardingProps) {
  const router = useRouter();
  const { prefersReducedMotion } = usePerformanceProfile();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(-1);

  const reduce = prefersReducedMotion;
  const name = firstName(userName);
  const cta = smartCta(accountIntent);

  const go = useCallback(
    (next: number) => {
      // RTL: forward moves leftward, back moves rightward.
      setDirection(next > step ? -1 : 1);
      setStep(Math.max(0, Math.min(TOTAL_STEPS - 1, next)));
    },
    [step]
  );

  const finish = useCallback(() => onDone(), [onDone]);

  const finishAndGo = useCallback(
    (href: string) => {
      onDone();
      router.push(href);
    },
    [onDone, router]
  );

  // Escape respects the user's decision to skip.
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") finish();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [finish]);

  // Lock scroll while the welcome is on screen.
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  const slide = {
    enter: (dir: number) => ({ opacity: 0, x: reduce ? 0 : dir * 56 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: reduce ? 0 : dir * -56 }),
  };

  const staggerParent = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.09, delayChildren: reduce ? 0 : 0.05 } },
  };
  const staggerChild = {
    hidden: { opacity: 0.01, y: reduce ? 0 : 18 },
    show: { opacity: 1, y: 0, transition: { duration: reduce ? 0.01 : 0.45, ease: EASE } },
  };

  return (
    <MotionConfig reducedMotion={reduce ? "always" : "never"}>
      <motion.div
        dir="rtl"
        lang="ar"
        role="dialog"
        aria-modal="true"
        aria-label="جولة الترحيب"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: reduce ? 0.01 : 0.35, ease: EASE }}
        className="fixed inset-0 z-[200] overflow-y-auto"
        style={{
          fontFamily: AR_FONT,
          background: "linear-gradient(160deg, #141110 0%, #241C12 55%, #171513 100%)",
          color: "#FFF9EF",
        }}
      >
        {/* Ambient gold orbs + grain */}
        {!reduce ? (
          <div aria-hidden className="pointer-events-none fixed inset-0">
            <motion.div
              className="absolute -top-24 right-[8%] h-72 w-72 rounded-full"
              style={{ background: "radial-gradient(circle, rgba(217,188,119,0.22), transparent 65%)", filter: "blur(50px)" }}
              animate={{ y: [0, 26, 0], x: [0, -18, 0] }}
              transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute bottom-[10%] left-[4%] h-80 w-80 rounded-full"
              style={{ background: "radial-gradient(circle, rgba(125,89,43,0.30), transparent 65%)", filter: "blur(60px)" }}
              animate={{ y: [0, -24, 0], x: [0, 20, 0] }}
              transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="grain-overlay absolute inset-0 opacity-[0.05]" />
          </div>
        ) : null}

        <div className="relative mx-auto flex min-h-full w-full max-w-2xl flex-col px-5 pb-[max(1.75rem,env(safe-area-inset-bottom))] pt-5 sm:px-8 sm:pt-8">
          {/* Top bar: progress + skip */}
          <div className="flex items-center gap-4">
            <div className="flex flex-1 items-center gap-1.5" aria-hidden>
              {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                <div
                  key={i}
                  className="h-1 flex-1 overflow-hidden rounded-full"
                  style={{ background: "rgba(255,249,239,0.14)" }}
                >
                  <motion.div
                    className="h-full w-full rounded-full"
                    style={{ background: "linear-gradient(90deg, #D9BC77, #A87935)", transformOrigin: "right" }}
                    initial={false}
                    animate={{ scaleX: i < step ? 1 : i === step ? 1 : 0, opacity: i <= step ? 1 : 0.35 }}
                    transition={{ duration: reduce ? 0.01 : 0.4, ease: EASE }}
                  />
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={finish}
              className="min-h-[44px] shrink-0 px-2 text-xs tracking-[0.2em]"
              style={{ color: "rgba(255,249,239,0.6)" }}
            >
              تخطي
            </button>
          </div>

          {/* Steps */}
          <div className="flex flex-1 flex-col justify-center py-8">
            <AnimatePresence mode="wait" custom={direction} initial={false}>
              <motion.div
                key={step}
                custom={direction}
                variants={slide}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: reduce ? 0.01 : 0.38, ease: EASE }}
              >
                <motion.div variants={staggerParent} initial="hidden" animate="show">
                  {step === 0 ? (
                    <>
                      <motion.p variants={staggerChild} className="text-[10px] tracking-[0.4em]" style={{ color: "#D9BC77" }}>
                        أهلاً بيك في BOUT
                      </motion.p>
                      <motion.h1
                        variants={staggerChild}
                        className="mt-3 font-light leading-[1.2]"
                        style={{ fontFamily: SERIF_AR, fontSize: "clamp(2.4rem,9vw,4.2rem)" }}
                      >
                        {name ? (
                          <>
                            أهلاً، <em style={{ color: "#D9BC77", fontStyle: "normal" }}>{name}</em>{" "}
                            <span aria-hidden>👋</span>
                          </>
                        ) : (
                          <>
                            أهلاً بيك <span aria-hidden>👋</span>
                          </>
                        )}
                      </motion.h1>
                      <motion.p variants={staggerChild} className="mt-4 max-w-md text-sm leading-7 sm:text-base sm:leading-8" style={{ color: "rgba(255,249,239,0.72)" }}>
                        مبسوطين إنك هنا. خد ٣٠ ثانية — هنقولك BOUT بتاع إيه وتبدأ منين.
                      </motion.p>
                      <motion.div variants={staggerChild} className="mt-8 flex items-center gap-3" style={{ color: "rgba(255,249,239,0.55)" }}>
                        <span className="flex h-11 w-11 items-center justify-center rounded-full" style={{ background: "rgba(217,188,119,0.14)", color: "#D9BC77" }}>
                          <Sparkles className="h-5 w-5" strokeWidth={1.4} />
                        </span>
                        <p className="text-xs leading-6">جولة سريعة — مفيش خطوات إجبارية.</p>
                      </motion.div>
                    </>
                  ) : null}

                  {step === 1 ? (
                    <>
                      <motion.p variants={staggerChild} className="text-[10px] tracking-[0.4em]" style={{ color: "#D9BC77" }}>
                        ليه BOUT؟
                      </motion.p>
                      <motion.h1
                        variants={staggerChild}
                        className="mt-3 font-light leading-[1.25]"
                        style={{ fontFamily: SERIF_AR, fontSize: "clamp(2.1rem,8vw,3.6rem)" }}
                      >
                        محلات حقيقية.
                        <br />
                        قطع <em style={{ color: "#D9BC77", fontStyle: "normal" }}>موثّقة.</em>
                      </motion.h1>
                      <motion.p variants={staggerChild} className="mt-4 max-w-md text-sm leading-7 sm:text-base sm:leading-8" style={{ color: "rgba(255,249,239,0.72)" }}>
                        كل بوتيك أثبت محله بالصور قبل ما يبيع قطعة واحدة — وكل طلب عليه مراجعة ودعم لحد باب البيت.
                      </motion.p>
                      <motion.div variants={staggerChild} className="mt-7 flex flex-wrap gap-2">
                        {TRUST.map((t) => {
                          const Icon = t.icon;
                          return (
                            <span
                              key={t.label}
                              className="inline-flex min-h-[44px] items-center gap-2 rounded-full border px-4 text-xs"
                              style={{ borderColor: "rgba(217,188,119,0.3)", background: "rgba(217,188,119,0.08)", color: "#FFF9EF" }}
                            >
                              <Icon className="h-4 w-4" strokeWidth={1.4} style={{ color: "#D9BC77" }} />
                              {t.label}
                            </span>
                          );
                        })}
                      </motion.div>
                    </>
                  ) : null}

                  {step === 2 ? (
                    <>
                      <motion.p variants={staggerChild} className="text-[10px] tracking-[0.4em]" style={{ color: "#D9BC77" }}>
                        فين تروح؟
                      </motion.p>
                      <motion.h1
                        variants={staggerChild}
                        className="mt-3 font-light leading-[1.25]"
                        style={{ fontFamily: SERIF_AR, fontSize: "clamp(2.1rem,8vw,3.6rem)" }}
                      >
                        ٣ أماكن <em style={{ color: "#D9BC77", fontStyle: "normal" }}>تهمك.</em>
                      </motion.h1>
                      <div className="mt-6 grid gap-2.5">
                        {PLACES.map((place) => {
                          const Icon = place.icon;
                          return (
                            <motion.button
                              key={place.title}
                              variants={staggerChild}
                              type="button"
                              onClick={() => finishAndGo(place.href)}
                              whileTap={reduce ? undefined : { scale: 0.98 }}
                              className="flex min-h-[64px] items-center gap-4 rounded-2xl p-4 text-right"
                              style={{ background: "rgba(255,249,239,0.06)", border: "1px solid rgba(217,188,119,0.18)" }}
                            >
                              <span
                                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
                                style={{ background: "rgba(217,188,119,0.14)", color: "#D9BC77" }}
                              >
                                <Icon className="h-5 w-5" strokeWidth={1.4} />
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block text-sm font-medium">{place.title}</span>
                                <span className="mt-0.5 block truncate text-xs leading-5" style={{ color: "rgba(255,249,239,0.6)" }}>
                                  {place.copy}
                                </span>
                              </span>
                              <ArrowLeft className="h-4 w-4 shrink-0" strokeWidth={1.5} style={{ color: "#D9BC77" }} />
                            </motion.button>
                          );
                        })}
                      </div>
                      <motion.p variants={staggerChild} className="mt-4 text-[11px] leading-5" style={{ color: "rgba(255,249,239,0.45)" }}>
                        دوس على أي مكان تدخله على طول — أو كمّل بالتالي.
                      </motion.p>
                    </>
                  ) : null}

                  {step === 3 ? (
                    <>
                      <motion.p variants={staggerChild} className="text-[10px] tracking-[0.4em]" style={{ color: "#D9BC77" }}>
                        جاهز؟
                      </motion.p>
                      <motion.h1
                        variants={staggerChild}
                        className="mt-3 font-light leading-[1.25]"
                        style={{ fontFamily: SERIF_AR, fontSize: "clamp(2.1rem,8vw,3.6rem)" }}
                      >
                        ابدأ <em style={{ color: "#D9BC77", fontStyle: "normal" }}>من هنا.</em>
                      </motion.h1>
                      <motion.p variants={staggerChild} className="mt-4 max-w-md text-sm leading-7 sm:text-base sm:leading-8" style={{ color: "rgba(255,249,239,0.72)" }}>
                        {cta.hint}
                      </motion.p>
                      <motion.div variants={staggerChild} className="mt-8 flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
                        <UnifiedButton variant="gold" size="lg" fullWidth onClick={() => finishAndGo(cta.href)}>
                          {cta.label}
                        </UnifiedButton>
                        <button
                          type="button"
                          onClick={finish}
                          className="inline-flex min-h-[44px] items-center justify-center rounded-full px-6 text-xs tracking-[0.2em]"
                          style={{ color: "rgba(255,249,239,0.7)" }}
                        >
                          استكشف بنفسك
                        </button>
                      </motion.div>
                    </>
                  ) : null}
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom nav */}
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] tracking-[0.3em]" style={{ color: "rgba(255,249,239,0.4)" }} aria-live="polite">
              {step + 1} / {TOTAL_STEPS}
            </p>
            <div className="flex items-center gap-2">
              {step > 0 ? (
                <button
                  type="button"
                  onClick={() => go(step - 1)}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-full px-5 text-xs tracking-[0.2em]"
                  style={{ color: "rgba(255,249,239,0.75)" }}
                >
                  رجوع
                </button>
              ) : null}
              {step < TOTAL_STEPS - 1 ? (
                <UnifiedButton variant="gold" size="md" onClick={() => go(step + 1)}>
                  التالي
                </UnifiedButton>
              ) : null}
            </div>
          </div>
        </div>
      </motion.div>
    </MotionConfig>
  );
}
