"use client";

import { formatPrice } from "@/lib/commerce";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Clock, CreditCard, ShieldCheck, Sparkles, Store } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const PLAN_OPTIONS = [
  {
    id: "starter",
    name: "Starter Boutique",
    monthlyFee: 1500,
    commissionRate: 10,
    label: "Continue",
    copy: "Keep the same workflow after the first 7-day trial ends.",
    bestFor: "Best when you want to continue simply without changing the setup.",
    features: ["Monthly continuation", "Product uploads", "Admin review"],
  },
  {
    id: "growth",
    name: "Growth Boutique",
    monthlyFee: 2500,
    commissionRate: 7,
    label: "Upgrade",
    copy: "Lower commission for boutiques with steady stock.",
    bestFor: "Best for weekly uploads and a larger product catalog.",
    features: ["Lower commission", "Priority review", "Bigger catalog"],
  },
  {
    id: "signature",
    name: "Signature Boutique",
    monthlyFee: 4500,
    commissionRate: 5,
    label: "Premium",
    copy: "Premium visibility for stronger boutique positioning.",
    bestFor: "Best for curated stores that need premium placement.",
    features: ["Best commission", "Premium placement", "Curated review"],
  },
] as const;

type PartnerApplicationSummary = {
  _id: string;
  boutiqueName: string;
  planName: string;
  access?: {
    canManageProducts: boolean;
    reason: string;
    message: string;
    trialEndsAt?: string;
    daysRemaining: number;
  };
};

const easeOut = [0.22, 1, 0.36, 1] as const;

type PartnerSubscriptionPlansPageProps = {
  applicationId?: string;
};

export default function PartnerSubscriptionPlansPage({ applicationId = "" }: PartnerSubscriptionPlansPageProps) {
  const [selectedApplicationId, setSelectedApplicationId] = useState(applicationId);
  const [applications, setApplications] = useState<PartnerApplicationSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const selectedApplication = useMemo(
    () => applications.find((application) => application._id === selectedApplicationId) ?? applications[0] ?? null,
    [selectedApplicationId, applications]
  );
  const trialEnded = selectedApplication?.access?.reason === "trial_expired";
  const checkoutPending = selectedApplication?.access?.reason === "checkout_pending";
  const selectedId = selectedApplication?._id || selectedApplicationId;
  const recommendedPlanId = trialEnded || checkoutPending ? "starter" : "growth";
  const pageTitle = checkoutPending
    ? "Payment needs confirmation."
    : trialEnded
      ? "Choose how to continue."
      : "Choose the right plan.";
  const pageCopy = checkoutPending
    ? "الدفع بدأ لكنه لسه منتظر تأكيد Paymob. لو ماكملتش الدفع اختار باقة وابدأ checkout من جديد."
    : trialEnded
      ? "انتهت تجربة الـ 7 أيام. اختار باقة شهرية عشان تكمل رفع المنتجات وإدارة البوتيك بدون تعقيد."
      : "اختار باقة واضحة للبوتيك. الدفع يتم من خلال Paymob، وبيانات الكارت لا يتم حفظها داخل BOUT.";
  const statusLabel = checkoutPending
    ? "Payment pending"
    : trialEnded
      ? "Trial ended"
      : selectedApplication?.access?.canManageProducts
        ? "Active"
        : "Plan needed";

  useEffect(() => {
    if (typeof window === "undefined") return;
    const applicationIdParam = new URLSearchParams(window.location.search).get("applicationId");
    if (applicationIdParam) setSelectedApplicationId(applicationIdParam);
  }, []);

  useEffect(() => {
    let canceled = false;

    async function loadApplications() {
      setLoading(true);
      setError("");
      try {
        const response = await fetch("/api/partners/applications", { cache: "no-store" });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data?.error || "Unable to load boutique applications.");
        if (!canceled) setApplications(Array.isArray(data.applications) ? data.applications : []);
      } catch (requestError) {
        if (!canceled) setError(requestError instanceof Error ? requestError.message : "Unable to load boutique applications.");
      } finally {
        if (!canceled) setLoading(false);
      }
    }

    void loadApplications();
    return () => {
      canceled = true;
    };
  }, []);

  function checkoutHref(planId: string) {
    if (!selectedId) return `/partners/checkout?plan=${encodeURIComponent(planId)}`;
    return `/partners/checkout?plan=${encodeURIComponent(planId)}&applicationId=${encodeURIComponent(selectedId)}`;
  }

  return (
    <main
      dir="rtl"
      className="liquid-page mobile-comfort min-h-screen overflow-hidden px-3 pb-[calc(8rem+env(safe-area-inset-bottom))] pt-[4.35rem] text-[#3D3025] sm:px-6 sm:pb-24 sm:pt-24 md:px-10"
      style={{ fontFamily: "Tahoma, Arial, var(--font-jost), sans-serif" }}
    >
      <div className="page-wrap max-w-5xl">
        <section className="grid gap-2.5 lg:grid-cols-[1fr_0.78fr] lg:items-stretch">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.42, ease: easeOut }}
            className="rounded-[18px] border border-[rgba(123,103,82,0.14)] bg-white/72 p-3 shadow-[0_10px_26px_rgba(61,48,37,0.055)] backdrop-blur-xl sm:rounded-[26px] sm:p-6"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[0.9rem] border border-[#A87935]/22 bg-[#A87935]/10 text-[#A87935] sm:h-12 sm:w-12 sm:rounded-[1rem]">
                {trialEnded || checkoutPending ? <Clock className="h-5 w-5" strokeWidth={1.35} /> : <Store className="h-5 w-5" strokeWidth={1.35} />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <p className="eyebrow" dir="ltr">PARTNER SUBSCRIPTION</p>
                  <span className="rounded-full border border-[rgba(168,121,53,0.22)] bg-[rgba(168,121,53,0.08)] px-2.5 py-1 text-[7px] uppercase tracking-[0.14em] text-[#7A581F]" dir="ltr">
                    {statusLabel}
                  </span>
                </div>
                <h1 className="font-serif text-[2rem] font-light leading-[0.98] tracking-[0.01em] text-[#3D3025] sm:text-[4rem] sm:leading-[0.92]" dir="ltr">
                  {pageTitle}
                </h1>
                <p className="mt-2 max-w-3xl text-[0.78rem] leading-6 text-[#6F6254] sm:mt-4 sm:text-base sm:leading-8">
                  {pageCopy}
                </p>
              </div>
            </div>

            <div className="mt-2 flex flex-wrap gap-1.5 text-[0.66rem] leading-5 text-[#6F6254] sm:hidden">
              <span className="rounded-full border border-[rgba(123,103,82,0.12)] bg-[#F8F5EF]/80 px-2 py-1">Paymob فقط</span>
              <span className="rounded-full border border-[rgba(123,103,82,0.12)] bg-[#F8F5EF]/80 px-2 py-1">Starter مرة واحدة</span>
              <span className="rounded-full border border-[rgba(123,103,82,0.12)] bg-[#F8F5EF]/80 px-2 py-1">موافقة الأدمن</span>
            </div>

            <div className="mt-3 hidden grid-cols-3 gap-1.5 sm:mt-5 sm:grid sm:gap-2">
              <div className="rounded-[12px] border border-[rgba(123,103,82,0.12)] bg-[#F8F5EF]/80 p-2 sm:rounded-[16px] sm:p-3">
                <p className="text-[7px] uppercase tracking-[0.12em] text-[#7A581F] sm:text-[8px] sm:tracking-[0.18em]" dir="ltr">Card data</p>
                <p className="mt-1 text-[0.72rem] leading-5 text-[#5F554B] sm:text-sm">Paymob فقط</p>
              </div>
              <div className="rounded-[12px] border border-[rgba(123,103,82,0.12)] bg-[#F8F5EF]/80 p-2 sm:rounded-[16px] sm:p-3">
                <p className="text-[7px] uppercase tracking-[0.12em] text-[#7A581F] sm:text-[8px] sm:tracking-[0.18em]" dir="ltr">Trial</p>
                <p className="mt-1 text-[0.72rem] leading-5 text-[#5F554B] sm:text-sm">Starter مرة واحدة</p>
              </div>
              <div className="rounded-[12px] border border-[rgba(123,103,82,0.12)] bg-[#F8F5EF]/80 p-2 sm:rounded-[16px] sm:p-3">
                <p className="text-[7px] uppercase tracking-[0.12em] text-[#7A581F] sm:text-[8px] sm:tracking-[0.18em]" dir="ltr">Products</p>
                <p className="mt-1 text-[0.72rem] leading-5 text-[#5F554B] sm:text-sm">بعد موافقة الأدمن</p>
              </div>
            </div>

            <div className="mt-2 rounded-[14px] border border-[rgba(23,21,19,0.14)] bg-[#171513] p-2.5 text-[#F8F7F2] lg:hidden">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[7px] uppercase tracking-[0.16em] text-[#D8C08A]" dir="ltr">Current Boutique</span>
                <span className="max-w-[11rem] truncate text-[0.75rem] text-white" dir="auto">
                  {loading ? "Loading..." : selectedApplication?.boutiqueName || "No application selected"}
                </span>
              </div>
              <p className="mt-1 text-[0.68rem] leading-5 text-[#D8C08A]" aria-live="polite">
                {error || selectedApplication?.access?.message || "Start with the free Starter trial first."}
              </p>
              {!selectedApplication && !loading ? (
                <Link href="/boutiques/apply" className="mt-2 inline-flex min-h-[34px] w-full items-center justify-center rounded-full border border-[#D8C08A]/28 px-3 text-[8px] uppercase tracking-[0.16em] text-[#D8C08A]">
                  Start 7-Day Free Trial
                </Link>
              ) : null}
            </div>
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.42, delay: 0.05, ease: easeOut }}
            className="hidden rounded-[18px] border border-[rgba(23,21,19,0.18)] bg-[#171513] p-2.5 text-[#F8F7F2] shadow-[0_16px_38px_rgba(61,48,37,0.14)] sm:rounded-[26px] sm:p-6 lg:block"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[8px] uppercase tracking-[0.18em] text-[#D8C08A] sm:text-[9px] sm:tracking-[0.22em]" dir="ltr">CURRENT BOUTIQUE</p>
                <h2 className="mt-1.5 truncate font-serif text-[1.25rem] font-light leading-none text-white sm:text-[2.5rem]" dir="auto">
                  {loading ? "Loading..." : selectedApplication?.boutiqueName || "No application selected"}
                </h2>
              </div>
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-[#D8C08A]/24 bg-white/[0.06] text-[#D8C08A] sm:h-9 sm:w-9">
                <ShieldCheck className="h-4 w-4" strokeWidth={1.35} />
              </span>
            </div>
            <p className="mt-2 text-[0.7rem] leading-5 text-[#D8C08A] sm:mt-4 sm:text-sm sm:leading-7" aria-live="polite">
              {error || selectedApplication?.access?.message || "If you are new, start with the free Starter trial first."}
            </p>
            {selectedApplication?.access?.daysRemaining ? (
              <div className="mt-3 rounded-[14px] border border-[#D8C08A]/18 bg-white/[0.05] px-3 py-2 text-[0.72rem] leading-5 text-[#E9E4D8] sm:text-sm">
                باقي {selectedApplication.access.daysRemaining} يوم في التجربة.
              </div>
            ) : null}
            {!selectedApplication && !loading ? (
              <Link href="/boutiques/apply" className="btn-gold mt-3 w-full justify-center sm:mt-4">
                Start 7-Day Free Trial
                <ArrowRight className="h-4 w-4" strokeWidth={1.35} />
              </Link>
            ) : null}
          </motion.aside>
        </section>

        <section className="mt-3 grid gap-2.5 sm:mt-5 lg:grid-cols-3">
          {PLAN_OPTIONS.map((plan, index) => {
            const featured = plan.id === recommendedPlanId;
            const ctaLabel = plan.id === "starter" ? "Continue Starter" : `Subscribe ${plan.name.replace(" Boutique", "")}`;
            return (
              <motion.article
                key={plan.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.38, delay: 0.05 * index, ease: easeOut }}
                className={`relative overflow-hidden rounded-[18px] border p-3 shadow-[0_10px_26px_rgba(61,48,37,0.055)] sm:rounded-[24px] sm:p-5 ${
                  featured
                    ? "border-[rgba(168,121,53,0.36)] bg-[linear-gradient(135deg,rgba(168,121,53,0.12),rgba(255,249,239,0.9))]"
                    : "border-[rgba(123,103,82,0.14)] bg-white/68"
                }`}
              >
                <div className="mb-2 flex items-start justify-between gap-3 sm:mb-4">
                  <span className={`rounded-full px-2.5 py-1.5 text-[7px] uppercase tracking-[0.14em] sm:text-[8px] ${
                    featured ? "bg-[#171513] text-[#FFF9EF]" : "border border-[rgba(168,121,53,0.22)] bg-[rgba(168,121,53,0.08)] text-[#7A581F]"
                  }`} dir="ltr">
                    {featured ? "Recommended" : plan.label}
                  </span>
                  {featured ? <Sparkles className="h-4 w-4 text-[#A87935]" strokeWidth={1.35} /> : <ShieldCheck className="h-4 w-4 text-[#A87935]" strokeWidth={1.35} />}
                </div>

                <h3 className="font-serif text-[1.55rem] font-light leading-none text-[#3D3025] sm:text-[2.35rem]" dir="ltr">
                  {plan.name}
                </h3>
                <p className="mt-1.5 hidden text-[0.74rem] leading-5 text-[#6F6254] sm:mt-2 sm:block sm:text-sm sm:leading-6">{plan.copy}</p>

                <div className="mt-2.5 grid grid-cols-[1fr_auto] items-end gap-2 border-y border-[rgba(123,103,82,0.12)] py-2.5 sm:mt-4 sm:py-3">
                  <div>
                    <p className="text-[7px] uppercase tracking-[0.14em] text-[#7A581F] sm:text-[8px]" dir="ltr">Monthly</p>
                    <p className="mt-1 font-serif text-[1.85rem] leading-none text-[#3D3025] sm:text-[2.45rem]" dir="ltr">
                      EGP {formatPrice(plan.monthlyFee)}
                    </p>
                  </div>
                  <div className="rounded-[12px] border border-[rgba(123,103,82,0.12)] bg-white/58 px-2.5 py-2 text-center sm:rounded-[14px] sm:px-3">
                    <p className="text-[7px] uppercase tracking-[0.12em] text-[#7A581F]" dir="ltr">Commission</p>
                    <p className="mt-1 font-serif text-xl leading-none text-[#3D3025]" dir="ltr">{plan.commissionRate}%</p>
                  </div>
                </div>

                <p className="mt-2 text-[0.7rem] leading-5 text-[#5F554B] sm:mt-2.5 sm:text-sm sm:leading-6">{plan.bestFor}</p>
                <div className="mt-2 grid gap-1.5 sm:mt-3">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2 text-[0.7rem] leading-5 text-[#5F554B] sm:text-sm">
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[#A87935]" strokeWidth={1.4} />
                      <span dir="ltr">{feature}</span>
                    </div>
                  ))}
                </div>

                <Link href={checkoutHref(plan.id)} className="btn-gold mt-3 w-full justify-center sm:mt-4">
                  <CreditCard className="h-4 w-4" strokeWidth={1.35} />
                  {ctaLabel}
                </Link>
              </motion.article>
            );
          })}
        </section>

        <section className="mt-3 rounded-[16px] border border-[rgba(123,103,82,0.14)] bg-white/58 p-3 text-[0.72rem] leading-5 text-[#6F6254] sm:mt-5 sm:rounded-[22px] sm:p-4 sm:text-sm sm:leading-7">
          <div className="grid grid-cols-3 gap-2">
            <div>
              <span className="block text-[7px] uppercase tracking-[0.14em] text-[#7A581F] sm:text-[8px]" dir="ltr">1. Choose</span>
              باقة شهرية واضحة.
            </div>
            <div>
              <span className="block text-[7px] uppercase tracking-[0.14em] text-[#7A581F] sm:text-[8px]" dir="ltr">2. Paymob</span>
              الدفع خارج BOUT.
            </div>
            <div>
              <span className="block text-[7px] uppercase tracking-[0.14em] text-[#7A581F] sm:text-[8px]" dir="ltr">3. Access</span>
              التفعيل بعد التأكيد.
            </div>
          </div>
          <p className="mt-3 border-t border-[rgba(123,103,82,0.12)] pt-3 text-[0.68rem] leading-5 text-[#7A6A59] sm:text-xs" dir="auto">
            Starter trial is one-time. Growth and Signature are paid plans from day one.
          </p>
        </section>
      </div>
    </main>
  );
}
