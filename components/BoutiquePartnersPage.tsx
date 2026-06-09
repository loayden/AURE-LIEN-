"use client";

import { showToast } from "@/components/ToastProvider";
import { formatPrice } from "@/lib/commerce";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  MapPin,
  Percent,
  ShieldCheck,
  Sparkles,
  Store,
  UploadCloud,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";

const CATEGORY_OPTIONS = [
  "Menswear",
  "Womenswear",
  "Shoes",
  "Bags",
  "Accessories",
  "Streetwear",
  "Evening wear",
  "Local designer",
] as const;

const PLAN_OPTIONS = [
  {
    id: "starter",
    name: "Starter Boutique",
    monthlyFee: 1500,
    commissionRate: 10,
    trialDays: 7,
    badge: "Start here",
    priceLead: "Free 7 days",
    priceSub: "then EGP 1,500/month",
    bestFor: "الباقة الأساسية التي يبدأ بها كل Partner على BOUT.",
    features: ["رفع المنتجات بعد الموافقة", "ظهور داخل partner dashboard", "دعم أول setup", "10% عمولة مبيعات"],
  },
  {
    id: "growth",
    name: "Growth Boutique",
    monthlyFee: 2500,
    commissionRate: 7,
    trialDays: 0,
    badge: "Paid upgrade",
    priceLead: "EGP 2,500",
    priceSub: "monthly, no free trial",
    bestFor: "ترقية مدفوعة لبوتيك عنده stock ثابت ورفع منتجات أسبوعي.",
    features: ["7% عمولة مبيعات", "أولوية أعلى في المراجعة", "كتالوج أكبر", "مناسب للنمو الشهري"],
  },
  {
    id: "signature",
    name: "Signature Boutique",
    monthlyFee: 4500,
    commissionRate: 5,
    trialDays: 0,
    badge: "Premium upgrade",
    priceLead: "EGP 4,500",
    priceSub: "monthly, no free trial",
    bestFor: "ترقية مدفوعة لمحلات premium محتاجة ظهور أعلى وتجربة curated.",
    features: ["5% عمولة مبيعات", "ظهور premium", "مراجعة curated", "أفضل للمحلات الكبيرة"],
  },
] as const;

type FormState = {
  boutiqueName: string;
  ownerName: string;
  phone: string;
  email: string;
  city: string;
  area: string;
  noPhysicalShop: boolean;
  streetAddress: string;
  googleMapsUrl: string;
  instagram: string;
  categories: string[];
  productCount: string;
  averagePrice: string;
  planId: (typeof PLAN_OPTIONS)[number]["id"];
  sampleProducts: string;
  notes: string;
};

const initialForm: FormState = {
  boutiqueName: "",
  ownerName: "",
  phone: "",
  email: "",
  city: "Cairo",
  area: "",
  noPhysicalShop: false,
  streetAddress: "",
  googleMapsUrl: "",
  instagram: "",
  categories: ["Menswear"],
  productCount: "",
  averagePrice: "",
  planId: "starter",
  sampleProducts: "",
  notes: "",
};

const LOCAL_BOUTIQUE_DRAFT_KEY = "bout:starter-boutique-application-draft:v1";

type LocalBoutiqueDraftSnapshot = {
  draftId?: string;
  form?: Partial<FormState>;
  savedAt?: string;
};

type ExistingStarterApplication = {
  _id: string;
  boutiqueName: string;
  access?: {
    canManageProducts: boolean;
    reason: string;
    message: string;
    subscriptionUrl: string;
  };
};

function getStarterApplicationTarget(application: ExistingStarterApplication) {
  if (application.access?.canManageProducts) {
    return `/partners/products?applicationId=${encodeURIComponent(application._id)}`;
  }

  return application.access?.subscriptionUrl || `/partners/subscription?applicationId=${encodeURIComponent(application._id)}`;
}

function normalizeDraftForm(draft: any): FormState {
  return {
    boutiqueName: String(draft?.boutiqueName ?? ""),
    ownerName: String(draft?.ownerName ?? ""),
    phone: String(draft?.phone ?? ""),
    email: String(draft?.email ?? ""),
    city: String(draft?.city ?? initialForm.city) || initialForm.city,
    area: String(draft?.area ?? ""),
    noPhysicalShop: Boolean(draft?.noPhysicalShop),
    streetAddress: String(draft?.streetAddress ?? ""),
    googleMapsUrl: String(draft?.googleMapsUrl ?? ""),
    instagram: String(draft?.instagram ?? ""),
    categories: Array.isArray(draft?.categories) && draft.categories.length ? draft.categories : initialForm.categories,
    productCount: draft?.productCount ? String(draft.productCount) : "",
    averagePrice: draft?.averagePrice ? String(draft.averagePrice) : "",
    planId: "starter",
    sampleProducts: String(draft?.sampleProducts ?? ""),
    notes: String(draft?.notes ?? ""),
  };
}

function normalizeLocalDraftForm(form?: Partial<FormState>): FormState {
  return {
    ...initialForm,
    ...form,
    categories: Array.isArray(form?.categories) && form.categories.length ? form.categories : initialForm.categories,
    planId: "starter",
    noPhysicalShop: Boolean(form?.noPhysicalShop),
  };
}

function getLocalDraftSnapshot(): LocalBoutiqueDraftSnapshot | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(LOCAL_BOUTIQUE_DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || !parsed.form) return null;
    return parsed as LocalBoutiqueDraftSnapshot;
  } catch {
    return null;
  }
}

const easeOut = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0.01, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.48, ease: easeOut } },
};

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-1.5 block text-[9px] uppercase tracking-[0.16em] text-[#7A581F] sm:mb-2 sm:text-[10px] sm:tracking-[0.18em]">
      {children}
    </span>
  );
}

function SectionHeading({
  icon: Icon,
  step,
  title,
  copy,
}: {
  icon: LucideIcon;
  step: string;
  title: string;
  copy: string;
}) {
  return (
    <div className="mb-2.5 flex items-start gap-2.5 sm:mb-4 sm:gap-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[rgba(168,121,53,0.20)] bg-[rgba(168,121,53,0.10)] text-[#A87935] sm:h-11 sm:w-11 sm:rounded-xl">
        <Icon className="h-4 w-4 sm:h-[1.125rem] sm:w-[1.125rem]" strokeWidth={1.35} />
      </span>
      <div>
        <p className="text-[8px] uppercase tracking-[0.22em] text-[#A87935] sm:text-[9px] sm:tracking-[0.24em]" dir="ltr">
          {step}
        </p>
        <h3 className="mt-0.5 font-serif text-[1.18rem] font-light leading-tight tracking-[0.01em] text-[#3D3025] sm:mt-1 sm:text-3xl">
          {title}
        </h3>
        <p className="mt-1 max-w-2xl text-[0.76rem] leading-5 text-[#6F6254] sm:mt-2 sm:text-sm sm:leading-7">{copy}</p>
      </div>
    </div>
  );
}

function SignalCard({
  icon: Icon,
  label,
  value,
  copy,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  copy: string;
}) {
  return (
    <div className="min-w-0 rounded-[14px] border border-[rgba(123,103,82,0.14)] bg-white/70 p-2.5 shadow-[0_8px_20px_rgba(61,48,37,0.05)] sm:rounded-[18px] sm:p-4 sm:shadow-[0_12px_34px_rgba(61,48,37,0.06)]">
      <div className="mb-2 flex items-center justify-between gap-2 sm:mb-4 sm:gap-3">
        <Icon className="h-3.5 w-3.5 text-[#A87935] sm:h-4 sm:w-4" strokeWidth={1.35} />
        <span className="text-[7px] uppercase tracking-[0.12em] text-[#7B6E60] sm:text-[9px] sm:tracking-[0.2em]" dir="ltr">
          {label}
        </span>
      </div>
      <p className="truncate font-serif text-[0.95rem] leading-none text-[#3D3025] sm:text-2xl" dir="ltr">
        {value}
      </p>
      <p className="mt-1 hidden text-sm leading-6 text-[#6F6254] sm:mt-2 sm:block">{copy}</p>
    </div>
  );
}

type BoutiquePartnersPageProps = {
  mode?: "landing" | "application";
};

export default function BoutiquePartnersPage({ mode = "landing" }: BoutiquePartnersPageProps = {}) {
  const router = useRouter();
  const showLanding = mode === "landing";
  const showApplication = mode === "application";
  const [form, setForm] = useState<FormState>(initialForm);
  const [draftId, setDraftId] = useState("");
  const [draftLoaded, setDraftLoaded] = useState(false);
  const [draftSaving, setDraftSaving] = useState(false);
  const [draftSavedAt, setDraftSavedAt] = useState("");
  const [draftError, setDraftError] = useState("");
  const [draftActivated, setDraftActivated] = useState(false);
  const [existingStarterApplication, setExistingStarterApplication] = useState<ExistingStarterApplication | null>(null);
  const [navigatingPlan, setNavigatingPlan] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{
    id: string;
    planName: string;
    monthlyFee: number;
    commissionRate: number;
    trialDays: number;
  } | null>(null);

  const selectedPlan = useMemo(
    () => PLAN_OPTIONS.find((plan) => plan.id === form.planId) ?? PLAN_OPTIONS[0],
    [form.planId]
  );
  const starterPlan = PLAN_OPTIONS[0];
  const paidUpgradePlans = PLAN_OPTIONS.slice(1);
  const draftSignatureRef = useRef("");
  const starterCtaLabel = existingStarterApplication
    ? existingStarterApplication.access?.canManageProducts
      ? "Open Product Desk"
      : "Continue Subscription"
    : "Start 7-Day Free Trial";
  const starterCtaHref = existingStarterApplication
    ? getStarterApplicationTarget(existingStarterApplication)
    : "/boutiques/apply";

  const writeLocalDraft = useCallback((nextForm: FormState, nextDraftId = draftId, savedAt = new Date().toISOString()) => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(
        LOCAL_BOUTIQUE_DRAFT_KEY,
        JSON.stringify({
          draftId: nextDraftId || undefined,
          form: nextForm,
          savedAt,
        })
      );
    } catch {
      // Local browser backup is best-effort; database autosave remains the source of truth.
    }
  }, [draftId]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setDraftActivated(true);
    setForm((current) => {
      const next = { ...current, [key]: value };
      writeLocalDraft(next);
      return next;
    });
  }

  function toggleCategory(category: string) {
    setDraftActivated(true);
    setForm((current) => {
      const exists = current.categories.includes(category);
      const next = exists
        ? current.categories.filter((item) => item !== category)
        : [...current.categories, category];

      const nextForm = { ...current, categories: next.length ? next : [category] };
      writeLocalDraft(nextForm);
      return nextForm;
    });
  }

  const getDraftPayload = useCallback((nextForm = form) => {
    return {
      _id: draftId || undefined,
      ...nextForm,
      productCount: Number(nextForm.productCount) || 0,
      averagePrice: nextForm.averagePrice ? Number(nextForm.averagePrice) : undefined,
      noPhysicalShop: Boolean(nextForm.noPhysicalShop),
      planId: starterPlan.id,
      trialDays: starterPlan.trialDays,
      subscriptionFlow: "trial",
    };
  }, [draftId, form, starterPlan.id, starterPlan.trialDays]);

  const getDraftSignature = useCallback((nextForm = form) => {
    const payload = getDraftPayload(nextForm);
    return JSON.stringify({ ...payload, _id: undefined });
  }, [form, getDraftPayload]);

  const saveDraft = useCallback(
    async (options: { force?: boolean; toast?: boolean } = {}) => {
      const signature = getDraftSignature();
      if (!options.force && signature === draftSignatureRef.current) return null;
      setDraftSaving(true);
      setDraftError("");
      try {
        const response = await fetch("/api/boutiques/draft", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(getDraftPayload()),
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data?.error || "Failed to save draft");
        const nextDraftId = data?.draft?._id || draftId;
        if (data?.draft?._id) setDraftId(data.draft._id);
        const savedAt = new Date().toISOString();
        writeLocalDraft(form, nextDraftId, savedAt);
        draftSignatureRef.current = signature;
        setDraftSavedAt(savedAt);
        if (options.toast) showToast("Draft saved. You can finish the application now.", "success");
        return data?.draft ?? null;
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to save draft";
        setDraftError(message);
        if (options.toast) showToast(message, "error");
        return null;
      } finally {
        setDraftSaving(false);
      }
    },
    [draftId, form, getDraftPayload, getDraftSignature, writeLocalDraft]
  );

  function startPaidCheckout(planId: string) {
    setNavigatingPlan(planId);
    router.push(`/partners/checkout?plan=${encodeURIComponent(planId)}`);
  }

  useEffect(() => {
    if (mode !== "landing") return;
    if (typeof window === "undefined") return;
    if (window.location.hash === "#boutique-application") {
      router.replace("/boutiques/apply");
    }
  }, [mode, router]);

  useEffect(() => {
    let canceled = false;

    async function loadDraft() {
      try {
        const localSnapshot = getLocalDraftSnapshot();
        const response = await fetch(`/api/boutiques/draft?planId=${starterPlan.id}`, { cache: "no-store" });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data?.error || "Failed to load draft");
        if (canceled) return;
        const serverDraft = data?.draft;
        const existingApplication = data?.application?._id
          ? (data.application as ExistingStarterApplication)
          : null;
        setExistingStarterApplication(existingApplication);
        if (mode === "application" && existingApplication) {
          router.replace(getStarterApplicationTarget(existingApplication));
          return;
        }
        const localSavedAt = localSnapshot?.savedAt ? new Date(localSnapshot.savedAt).getTime() : 0;
        const serverSavedAt = serverDraft?.updatedAt ? new Date(serverDraft.updatedAt).getTime() : 0;
        const useLocalDraft = Boolean(localSnapshot?.form && localSavedAt >= serverSavedAt);

        if (serverDraft?._id || localSnapshot?.form) {
          const nextForm = useLocalDraft
            ? normalizeLocalDraftForm(localSnapshot?.form)
            : normalizeDraftForm(serverDraft);
          const nextDraftId = localSnapshot?.draftId || serverDraft?._id || "";
          const nextSavedAt = useLocalDraft
            ? localSnapshot?.savedAt || new Date().toISOString()
            : serverDraft?.updatedAt || new Date().toISOString();
          if (nextDraftId) setDraftId(nextDraftId);
          setForm(nextForm);
          setDraftActivated(true);
          draftSignatureRef.current = JSON.stringify({
            ...getDraftPayload(nextForm),
            _id: undefined,
          });
          setDraftSavedAt(nextSavedAt);
          writeLocalDraft(nextForm, nextDraftId, nextSavedAt);
        }
      } catch (error) {
        if (!canceled) setDraftError(error instanceof Error ? error.message : "Failed to load saved draft");
      } finally {
        if (!canceled) setDraftLoaded(true);
      }
    }

    void loadDraft();
    return () => {
      canceled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!draftLoaded || !draftActivated || submitting) return;
    const signature = getDraftSignature();
    if (signature === draftSignatureRef.current) return;
    const timer = window.setTimeout(() => {
      void saveDraft();
    }, 900);
    return () => window.clearTimeout(timer);
  }, [draftActivated, draftLoaded, form, getDraftSignature, saveDraft, submitting]);

  useEffect(() => {
    if (!draftLoaded || !draftActivated || submitting) return;

    function persistBeforeLeaving() {
      const savedAt = new Date().toISOString();
      writeLocalDraft(form, draftId, savedAt);

      const signature = getDraftSignature();
      if (signature === draftSignatureRef.current) return;

      const body = JSON.stringify(getDraftPayload());
      const blob = new Blob([body], { type: "application/json" });

      if (navigator.sendBeacon?.("/api/boutiques/draft", blob)) return;

      void fetch("/api/boutiques/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      }).catch(() => undefined);
    }

    function handleVisibilityChange() {
      if (document.visibilityState === "hidden") persistBeforeLeaving();
    }

    window.addEventListener("pagehide", persistBeforeLeaving);
    window.addEventListener("beforeunload", persistBeforeLeaving);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("pagehide", persistBeforeLeaving);
      window.removeEventListener("beforeunload", persistBeforeLeaving);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [draftActivated, draftId, draftLoaded, form, getDraftPayload, getDraftSignature, submitting, writeLocalDraft]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setResult(null);

    try {
      const savedDraft = await saveDraft({ force: true });
      const finalDraftId = savedDraft?._id || draftId;
      const response = await fetch("/api/boutiques/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            draftId: finalDraftId,
            ...form,
            productCount: Number(form.productCount) || 0,
            averagePrice: form.averagePrice ? Number(form.averagePrice) : undefined,
            noPhysicalShop: Boolean(form.noPhysicalShop),
            planId: starterPlan.id,
            trialDays: starterPlan.trialDays,
          }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        if (data?.redirectUrl) {
          showToast(data?.error || "Continue from your existing boutique application.", "error");
          router.push(data.redirectUrl);
          return;
        }
        throw new Error(data?.error || "Unable to submit application");
      }

      setResult({
        id: data.application._id,
        planName: data.application.planName,
        monthlyFee: data.application.monthlyFee,
        commissionRate: data.application.commissionRate,
        trialDays: data.application.trialDays,
      });
      setForm(initialForm);
      setDraftId("");
      setDraftActivated(false);
      setDraftSavedAt("");
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(LOCAL_BOUTIQUE_DRAFT_KEY);
      }
      draftSignatureRef.current = "";
      showToast("Boutique application submitted.", "success");
      router.push(`/partners/products?applicationId=${encodeURIComponent(data.application._id)}`);
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Unable to submit application.", "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main
      dir="rtl"
      className="boutique-partner-page liquid-page mobile-comfort overflow-hidden pb-[calc(8.25rem+env(safe-area-inset-bottom))] text-[#3D3025] md:pb-28"
      style={{ fontFamily: "Tahoma, Arial, var(--font-jost), sans-serif" }}
    >
      {showLanding ? (
        <>
      <section className="relative isolate overflow-hidden border-b border-[rgba(123,103,82,0.16)] bg-[#F5F1E8] px-3 pb-4 pt-[4.2rem] sm:px-6 sm:pb-12 sm:pt-24 md:px-10">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,rgba(255,249,239,0.98)_0%,rgba(245,241,232,0.90)_52%,rgba(234,225,211,0.86)_100%)]" />
        <div className="page-wrap grid gap-4 sm:gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0.01, y: 22, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.54, ease: easeOut }}
            className="order-2 lg:order-1"
          >
            <div className="relative overflow-hidden rounded-[18px] border border-[rgba(123,103,82,0.16)] bg-[#15110E] shadow-[0_14px_34px_rgba(61,48,37,0.10)] sm:rounded-[24px] sm:shadow-[0_24px_70px_rgba(61,48,37,0.15)]">
              <div className="relative min-h-[10.75rem] sm:min-h-[22rem]">
                <Image
                  src="/uploads/boutique-partner-interior.jpg"
                  alt="Luxury boutique interior with clothing racks and display shelves"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(21,17,14,0.04)_0%,rgba(21,17,14,0.40)_100%)]" />
              </div>
              <div className="absolute inset-x-2.5 bottom-2.5 rounded-[13px] border border-white/15 bg-[#FFF9EF]/90 p-2.5 text-[#3D3025] shadow-[0_10px_24px_rgba(0,0,0,0.14)] backdrop-blur-xl sm:inset-x-4 sm:bottom-4 sm:rounded-[18px] sm:p-4 sm:shadow-[0_18px_44px_rgba(0,0,0,0.18)]">
                <p className="text-[6.5px] uppercase tracking-[0.14em] text-[#7A581F] sm:text-[9px] sm:tracking-[0.24em]" dir="ltr">
                  WHAT HAPPENS AFTER APPLYING
                </p>
                <p className="mt-1 text-[0.72rem] leading-5 text-[#5F554B] sm:hidden">
                  مراجعة الطلب، رفع المنتجات، ثم النشر بعد موافقة الأدمن.
                </p>
                <div className="mt-3 hidden gap-2 text-sm leading-6 text-[#5F554B] sm:grid sm:grid-cols-3">
                  <span>١. مراجعة بيانات المحل</span>
                  <span>٢. رفع المنتجات</span>
                  <span>٣. ظهور المنتج بعد موافقة الأدمن</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div initial={false} animate="show" variants={fadeUp} className="order-1 w-full min-w-0 max-w-3xl text-right lg:order-2" dir="rtl">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[rgba(168,121,53,0.24)] bg-white/70 px-3 py-1.5 text-[#7A581F] shadow-[0_8px_20px_rgba(61,48,37,0.05)] sm:mb-4 sm:py-2 sm:shadow-[0_14px_32px_rgba(61,48,37,0.07)]">
              <Store className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={1.35} />
              <span className="text-[8px] uppercase tracking-[0.2em] sm:text-[9px] sm:tracking-[0.22em]" dir="ltr">
                BOUTIQUE PARTNERS
              </span>
            </div>
            <h1 className="max-w-[23rem] font-serif text-[2.15rem] font-light leading-[1.04] tracking-[0.01em] text-[#2F241C] sm:max-w-3xl sm:text-[4.25rem] sm:leading-[0.95] lg:text-[5rem]">
              بوابتك لبيع منتجات البوتيك على <span className="whitespace-nowrap" dir="ltr">BOUT.</span>
            </h1>
            <p className="mt-3 w-full max-w-2xl text-[0.84rem] leading-7 text-[#5F554B] sm:mt-5 sm:text-lg sm:leading-9">
              لو عندك بوتيك في مصر، ابدأ بتسجيل بيانات المحل والموقع ونوع المنتجات. فريق <span dir="ltr">BOUT</span> يراجع الطلب، وبعد الموافقة تقدر ترفع المنتجات وتظهر داخل المتجر.
            </p>

            <div className="mt-4 grid w-full min-w-0 grid-cols-2 gap-2 sm:hidden" dir="ltr">
              <SignalCard icon={CalendarDays} label="Trial" value="7 Days" copy="التجربة المجانية موجودة في Starter فقط." />
              <SignalCard icon={Percent} label="Commission" value="10%" copy="عمولة Starter أثناء البداية." />
              <div className="col-span-2">
                <SignalCard icon={Building2} label="After 7 days" value="EGP 1,500" copy="بعد أول 7 أيام لو الشريك كمل." />
              </div>
            </div>
            <div className="mt-5 hidden w-full min-w-0 gap-3 sm:grid sm:grid-cols-3" dir="ltr">
              <SignalCard icon={CalendarDays} label="Trial" value="7 Days" copy="التجربة المجانية موجودة في Starter فقط." />
              <SignalCard icon={Percent} label="Commission" value="10%" copy="عمولة Starter أثناء البداية." />
              <SignalCard icon={Building2} label="After 7 days" value="EGP 1,500" copy="بعد أول 7 أيام لو الشريك كمل." />
            </div>

            <div className="mt-4 grid w-full min-w-0 grid-cols-2 gap-2 sm:mt-5 sm:flex sm:flex-row-reverse sm:gap-3" dir="rtl">
              <a href="/boutiques/apply" className="btn-gold col-span-2 justify-center" style={{ letterSpacing: "0.03em" }}>
                ابدأ تجربة 7 أيام
                <ArrowRight className="h-4 w-4 rotate-180" strokeWidth={1.4} />
              </a>
              <a href="#partner-plans" className="btn-ghost col-span-2 justify-center" style={{ letterSpacing: "0.03em" }}>
                شوف الباقات
              </a>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-1.5 rounded-[14px] border border-[rgba(123,103,82,0.12)] bg-white/58 p-2 text-[0.65rem] leading-4 text-[#6F6254] shadow-[0_8px_22px_rgba(61,48,37,0.04)] sm:mt-4 sm:gap-2 sm:rounded-[18px] sm:p-3 sm:text-xs sm:leading-5">
              {["بدون بيانات كارت", "مسودة تلقائية", "مراجعة قبل النشر"].map((item) => (
                <span key={item} className="flex min-w-0 items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[#A87935]" strokeWidth={1.4} />
                  <span>{item}</span>
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="page-wrap px-3 py-3 sm:px-6 sm:py-12 md:px-10">
        <motion.div
          initial={false}
          whileInView="show"
          viewport={{ once: true, amount: 0.22 }}
          variants={fadeUp}
          className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3 md:grid-cols-4"
        >
          {[
            { icon: ClipboardList, title: "قدم الطلب", copy: "بيانات المحل، الموقع، التواصل، ونوع المنتجات." },
            { icon: ShieldCheck, title: "مراجعة آمنة", copy: "الأدمن يراجع جودة المحل والبيانات قبل النشر." },
            { icon: UploadCloud, title: "ارفع المنتجات", copy: "بعد الطلب تفتح صفحة رفع الصور والتفاصيل." },
            { icon: Store, title: "بيع داخل BOUT", copy: "المنتجات تظهر في Shop بعد موافقة الأدمن." },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="flex items-start gap-3 rounded-[14px] border border-[rgba(123,103,82,0.14)] bg-white/68 p-3 shadow-[0_8px_20px_rgba(61,48,37,0.045)] sm:block sm:rounded-[20px] sm:p-4 sm:shadow-[0_12px_36px_rgba(61,48,37,0.06)]">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[rgba(168,121,53,0.18)] bg-[rgba(168,121,53,0.09)] text-[#A87935] sm:mb-4 sm:h-auto sm:w-auto sm:border-0 sm:bg-transparent">
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={1.35} />
                </span>
                <div className="min-w-0">
                  <h2 className="font-serif text-[1.08rem] font-light leading-tight tracking-[0.01em] text-[#3D3025] sm:text-2xl">{item.title}</h2>
                  <p className="mt-1 text-[0.74rem] leading-5 text-[#6F6254] sm:mt-2 sm:text-sm sm:leading-7">{item.copy}</p>
                </div>
              </div>
            );
          })}
        </motion.div>
      </section>

      <section id="partner-plans" className="page-wrap scroll-mt-20 px-3 pb-4 sm:px-6 sm:pb-12 md:px-10">
        <motion.div initial={false} whileInView="show" viewport={{ once: true, amount: 0.18 }} variants={fadeUp}>
          <div className="mb-3 grid gap-2 sm:mb-5 sm:gap-3 lg:grid-cols-[1fr_0.72fr] lg:items-end">
            <div>
              <p className="eyebrow mb-1.5 sm:mb-3" dir="ltr">PARTNER PLANS</p>
              <h2 className="title-display text-[1.85rem] leading-[1.06] tracking-[0.01em] sm:text-[4rem] sm:leading-[0.92]">
                Starter الأول، والترقية بعدين.
              </h2>
            </div>
            <p className="text-[0.78rem] leading-6 text-[#6F6254] sm:text-base sm:leading-8">
              كل شريك جديد يبدأ على Starter Boutique لمدة 7 أيام مجانا. بعد أول أسبوع يكمل Starter بـ EGP 1,500 شهريا أو يترقى لـ Growth / Signature كخطط مدفوعة بدون تجربة مجانية.
            </p>
          </div>

          <div className="rounded-[18px] border border-[rgba(168,121,53,0.32)] bg-[linear-gradient(135deg,rgba(168,121,53,0.13),rgba(255,249,239,0.76))] p-3 shadow-[0_12px_30px_rgba(61,48,37,0.08)] sm:rounded-[28px] sm:p-5 sm:shadow-[0_18px_46px_rgba(61,48,37,0.10)]">
            <div className="grid gap-3 lg:grid-cols-[1fr_0.82fr] lg:items-center">
              <div>
                <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#3D3025] px-3 py-1.5 text-[8px] uppercase tracking-[0.14em] text-[#FFF9EF] sm:mb-3 sm:text-[9px] sm:tracking-[0.18em]" dir="ltr">
                  <Sparkles className="h-3.5 w-3.5" strokeWidth={1.35} />
                  Required start
                </div>
                <h3 className="font-serif text-[2rem] font-light leading-none text-[#3D3025] sm:text-5xl" dir="ltr">
                  {starterPlan.name}
                </h3>
                <p className="mt-2 max-w-2xl text-[0.8rem] leading-6 text-[#5F554B] sm:mt-3 sm:text-base sm:leading-8">
                  دي الباقة الأساسية لأي Partner جديد. يبدأ يرفع منتجاته ويجرب النظام لمدة 7 أيام مجانا، وبعدها يكمل بـ EGP 1,500 شهريا لو عايز يفضل على Starter.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-[14px] border border-[rgba(123,103,82,0.12)] bg-white/72 p-2 sm:rounded-2xl sm:p-3">
                  <p className="text-[7px] uppercase tracking-[0.1em] text-[#7A581F] sm:text-[8px] sm:tracking-[0.18em]" dir="ltr">First 7 days</p>
                  <p className="mt-1.5 font-serif text-xl leading-none text-[#3D3025] sm:mt-2 sm:text-2xl" dir="ltr">Free</p>
                </div>
                <div className="rounded-[14px] border border-[rgba(123,103,82,0.12)] bg-white/72 p-2 sm:rounded-2xl sm:p-3">
                  <p className="text-[7px] uppercase tracking-[0.1em] text-[#7A581F] sm:text-[8px] sm:tracking-[0.18em]" dir="ltr">After</p>
                  <p className="mt-1.5 font-serif text-xl leading-none text-[#3D3025] sm:mt-2 sm:text-2xl" dir="ltr">1,500</p>
                </div>
                <div className="rounded-[14px] border border-[rgba(123,103,82,0.12)] bg-white/72 p-2 sm:rounded-2xl sm:p-3">
                  <p className="text-[7px] uppercase tracking-[0.1em] text-[#7A581F] sm:text-[8px] sm:tracking-[0.18em]" dir="ltr">Rate</p>
                  <p className="mt-1.5 font-serif text-xl leading-none text-[#3D3025] sm:mt-2 sm:text-2xl" dir="ltr">10%</p>
                </div>
              </div>
            </div>

            <div className="mt-3 grid gap-1.5 sm:mt-4 sm:grid-cols-4 sm:gap-2">
              {starterPlan.features.map((feature) => (
                <div key={feature} className="flex items-center gap-2 rounded-[12px] border border-[rgba(123,103,82,0.12)] bg-white/58 px-2.5 py-2 text-[0.72rem] leading-5 text-[#5F554B] sm:rounded-full sm:px-3 sm:text-xs">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[#A87935]" strokeWidth={1.4} />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 grid gap-2 rounded-[14px] border border-[rgba(168,121,53,0.22)] bg-white/62 p-3 sm:mt-4 sm:grid-cols-[1fr_auto] sm:items-center sm:rounded-[18px] sm:p-4">
              <p className="text-[0.76rem] leading-6 text-[#5F554B] sm:text-sm sm:leading-7">
                ابدأ 7 أيام مجانا على Starter. لو الخدمة مناسبة للبوتيك، كمل الاشتراك بعد نهاية التجربة.
              </p>
              {!draftLoaded || draftSaving ? (
                <button
                  type="button"
                  disabled
                  className="btn-gold justify-center"
                  style={{ letterSpacing: "0.03em" }}
                >
                  Checking Access
                  <ArrowRight className="h-4 w-4" strokeWidth={1.35} />
                </button>
              ) : (
                <a
                  href={starterCtaHref}
                  className="btn-gold justify-center"
                  style={{ letterSpacing: "0.03em" }}
                >
                  {starterCtaLabel}
                  <ArrowRight className="h-4 w-4" strokeWidth={1.35} />
                </a>
              )}
            </div>
          </div>

          <div className="mt-2.5 grid gap-2.5 lg:grid-cols-2">
            {paidUpgradePlans.map((plan) => (
              <article
                key={plan.id}
                className="relative overflow-hidden rounded-[18px] border border-[rgba(123,103,82,0.16)] bg-white/68 p-3 shadow-[0_10px_26px_rgba(61,48,37,0.05)] sm:rounded-[26px] sm:p-5 sm:shadow-[0_12px_34px_rgba(61,48,37,0.06)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="inline-flex rounded-full border border-[rgba(168,121,53,0.22)] bg-[rgba(168,121,53,0.08)] px-2.5 py-1.5 text-[7px] uppercase tracking-[0.12em] text-[#7A581F] sm:px-3 sm:text-[8px] sm:tracking-[0.18em]" dir="ltr">
                      {plan.badge}
                    </span>
                    <h3 className="mt-2.5 font-serif text-[1.85rem] font-light leading-none text-[#3D3025] sm:mt-3 sm:text-3xl" dir="ltr">
                      {plan.name}
                    </h3>
                  </div>
                  <span className="shrink-0 rounded-full bg-[#171513] px-2.5 py-1.5 text-[7px] uppercase tracking-[0.12em] text-[#FFF9EF] sm:px-3 sm:text-[8px] sm:tracking-[0.16em]" dir="ltr">
                    No trial
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap items-end gap-x-2 gap-y-1 sm:mt-4">
                  <span className="font-serif text-[2rem] leading-none text-[#3D3025] sm:text-4xl" dir="ltr">
                    EGP {formatPrice(plan.monthlyFee)}
                  </span>
                  <span className="pb-1 text-sm text-[#6F6254]">شهريا</span>
                </div>
                <p className="mt-1.5 text-[0.78rem] leading-6 text-[#6F6254] sm:mt-2 sm:text-sm sm:leading-7">{plan.bestFor}</p>

                <div className="mt-3 grid grid-cols-2 gap-2 sm:mt-4 sm:grid-cols-1">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-1.5 text-[0.72rem] leading-5 text-[#5F554B] sm:gap-2 sm:text-sm sm:leading-6">
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[#A87935] sm:h-4 sm:w-4" strokeWidth={1.4} />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <p className="mt-3 rounded-[14px] border border-[rgba(123,103,82,0.12)] bg-[#F8F5EF]/80 p-2.5 text-[0.72rem] leading-5 text-[#6F6254] sm:mt-4 sm:rounded-[16px] sm:p-3 sm:text-xs sm:leading-6">
                  الترقية دي تظهر للشريك بعد ما يبدأ بـ Starter. الخطة دي مدفوعة بدون تجربة مجانية.
                </p>
                <button
                  type="button"
                  onClick={() => startPaidCheckout(plan.id)}
                  disabled={navigatingPlan === plan.id}
                  className="btn-gold mt-3 w-full justify-center sm:mt-4"
                  style={{ letterSpacing: "0.03em" }}
                >
                  {navigatingPlan === plan.id ? "Opening Checkout" : "Subscribe"}
                  <ArrowRight className="h-4 w-4" strokeWidth={1.35} />
                </button>
              </article>
            ))}
          </div>

          <div className="mt-2.5 grid grid-cols-3 gap-1.5 rounded-[16px] border border-[rgba(123,103,82,0.14)] bg-white/56 p-2.5 text-[0.68rem] leading-5 text-[#6F6254] sm:mt-3 sm:gap-2 sm:rounded-[20px] sm:p-4 sm:text-sm sm:leading-6">
            <div>
              <span className="block text-[7px] uppercase tracking-[0.12em] text-[#7A581F] sm:text-[8px] sm:tracking-[0.2em]" dir="ltr">Day 0</span>
              الشريك يقدم الطلب ويبدأ على Starter.
            </div>
            <div>
              <span className="block text-[7px] uppercase tracking-[0.12em] text-[#7A581F] sm:text-[8px] sm:tracking-[0.2em]" dir="ltr">Days 1-7</span>
              تجربة مجانية للـ Starter فقط.
            </div>
            <div>
              <span className="block text-[7px] uppercase tracking-[0.12em] text-[#7A581F] sm:text-[8px] sm:tracking-[0.2em]" dir="ltr">After day 7</span>
              يكمل Starter أو يترقى لخطة مدفوعة.
            </div>
          </div>
        </motion.div>
      </section>
        </>
      ) : null}

      {showApplication ? (
        <section
          id="boutique-application"
          className="relative isolate scroll-mt-20 overflow-hidden border-y border-[rgba(123,103,82,0.14)] bg-[#F7F3EA] px-3 pb-5 pt-[4.85rem] sm:px-6 sm:pb-12 sm:pt-24 md:px-10"
        >
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(145deg,rgba(255,250,242,0.98)_0%,rgba(246,241,232,0.95)_46%,rgba(235,226,213,0.86)_100%)]" />
          <div className="page-wrap max-w-6xl">
            <motion.div
              initial={false}
              animate="show"
              variants={fadeUp}
              className="grid min-w-0 gap-3 border-b border-[rgba(123,103,82,0.13)] pb-4 sm:gap-5 sm:pb-7 lg:grid-cols-[1.08fr_0.92fr] lg:items-end"
            >
              <div className="min-w-0">
                <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[rgba(168,121,53,0.24)] bg-white/72 px-3 py-1.5 text-[#7A581F] shadow-[0_8px_22px_rgba(61,48,37,0.05)]">
                  <Store className="h-3.5 w-3.5" strokeWidth={1.35} />
                  <span className="text-[8px] uppercase tracking-[0.18em]" dir="ltr">
                    STARTER BOUTIQUE TRIAL
                  </span>
                </div>
                <h1 className="max-w-3xl font-serif text-[2.28rem] font-light leading-[0.98] tracking-[0.01em] text-[#2F241C] sm:text-[4.5rem] sm:leading-[0.9]">
                  قدم طلب البوتيك بشكل واضح ورسمي.
                </h1>
                <p className="mt-3 max-w-2xl text-[0.84rem] leading-7 text-[#5F554B] sm:mt-5 sm:text-base sm:leading-8">
                  املأ بيانات المحل، الموقع، ونوع المنتجات. الطلب بيتحفظ تلقائيا كمسودة، وبعد الموافقة تقدر ترفع المنتجات وتظهر في متجر <span dir="ltr">BOUT.</span>
                </p>
              </div>

              <div className="grid min-w-0 grid-cols-3 gap-2">
                <div className="rounded-[14px] border border-[rgba(123,103,82,0.14)] bg-white/74 p-2.5 shadow-[0_8px_22px_rgba(61,48,37,0.045)] sm:rounded-[18px] sm:p-4">
                  <CalendarDays className="mb-2 h-4 w-4 text-[#A87935]" strokeWidth={1.35} />
                  <p className="text-[7px] uppercase tracking-[0.14em] text-[#7A581F] sm:text-[9px] sm:tracking-[0.2em]" dir="ltr">
                    TRIAL
                  </p>
                  <p className="mt-1 font-serif text-[1.2rem] leading-none text-[#2F241C] sm:text-3xl" dir="ltr">
                    7 Days
                  </p>
                </div>
                <div className="rounded-[14px] border border-[rgba(123,103,82,0.14)] bg-white/74 p-2.5 shadow-[0_8px_22px_rgba(61,48,37,0.045)] sm:rounded-[18px] sm:p-4">
                  <Percent className="mb-2 h-4 w-4 text-[#A87935]" strokeWidth={1.35} />
                  <p className="text-[7px] uppercase tracking-[0.14em] text-[#7A581F] sm:text-[9px] sm:tracking-[0.2em]" dir="ltr">
                    RATE
                  </p>
                  <p className="mt-1 font-serif text-[1.2rem] leading-none text-[#2F241C] sm:text-3xl" dir="ltr">
                    10%
                  </p>
                </div>
                <div className="rounded-[14px] border border-[rgba(123,103,82,0.14)] bg-white/74 p-2.5 shadow-[0_8px_22px_rgba(61,48,37,0.045)] sm:rounded-[18px] sm:p-4">
                  <Building2 className="mb-2 h-4 w-4 text-[#A87935]" strokeWidth={1.35} />
                  <p className="text-[7px] uppercase tracking-[0.14em] text-[#7A581F] sm:text-[9px] sm:tracking-[0.2em]" dir="ltr">
                    AFTER
                  </p>
                  <p className="mt-1 font-serif text-[1.2rem] leading-none text-[#2F241C] sm:text-3xl" dir="ltr">
                    EGP 1,500
                  </p>
                </div>
              </div>
            </motion.div>

            <div className="mt-4 grid min-w-0 gap-4 sm:mt-6 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
              <motion.aside
                initial={false}
                whileInView="show"
                viewport={{ once: true, amount: 0.18 }}
                variants={fadeUp}
                className="order-2 min-w-0 space-y-3 lg:sticky lg:top-24 lg:order-1"
              >
                <div className="rounded-[18px] border border-[rgba(123,103,82,0.14)] bg-[#171513] p-4 text-[#F8F7F2] shadow-[0_18px_48px_rgba(61,48,37,0.14)] sm:rounded-[26px] sm:p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[8px] uppercase tracking-[0.2em] text-[#D8C08A] sm:text-[10px]" dir="ltr">
                        SELECTED PLAN
                      </p>
                      <h2 className="mt-2 break-words font-serif text-[1.65rem] font-light leading-[1.02] !text-[#F8F7F2] sm:text-4xl" dir="ltr">
                        {selectedPlan.name}
                      </h2>
                    </div>
                    <span className="rounded-full border border-[#D8C08A]/28 bg-white/[0.06] px-2.5 py-1.5 text-[7px] uppercase tracking-[0.13em] text-[#D8C08A] sm:text-[8px]" dir="ltr">
                      Required
                    </span>
                  </div>
                  <p className="mt-3 text-left text-[0.78rem] leading-6 text-[#D5CDBE] [overflow-wrap:anywhere] sm:text-sm sm:leading-7" dir="ltr">
                    Starts free for 7 days, then <span dir="ltr">EGP {formatPrice(selectedPlan.monthlyFee)} / month</span> + {selectedPlan.commissionRate}% commission if the boutique continues.
                  </p>
                  <div className="mt-4 grid gap-2">
                    {["لا نطلب بيانات كارت أو CVV", "الأدمن يراجع الطلب قبل النشر", "المنتجات تظهر بعد الموافقة فقط"].map((item) => (
                      <div key={item} className="flex items-center gap-2.5 text-[0.78rem] leading-5 text-[#EFE9DD] sm:text-sm sm:leading-6">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-[#D8C08A]" strokeWidth={1.4} />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div
                  className={`rounded-[18px] border p-4 shadow-[0_12px_32px_rgba(61,48,37,0.055)] sm:rounded-[24px] sm:p-5 ${
                    draftError
                      ? "border-[#9A2222]/24 bg-[#FFF5F3] text-[#9A2222]"
                      : "border-[rgba(123,103,82,0.14)] bg-white/74 text-[#5F554B]"
                  }`}
                  aria-live="polite"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[rgba(168,121,53,0.18)] bg-[rgba(168,121,53,0.10)] text-[#A87935]">
                      <ShieldCheck className="h-4 w-4" strokeWidth={1.35} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[8px] uppercase tracking-[0.2em] text-[#7A581F]" dir="ltr">
                        DRAFT STATUS
                      </p>
                      <p className="mt-1 text-[0.78rem] leading-6 sm:text-sm sm:leading-7">
                        {draftError
                          ? draftError
                          : draftSaving
                            ? "Saving draft..."
                            : draftId
                              ? `Draft saved${draftSavedAt ? ` at ${new Date(draftSavedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : ""}. You can leave and return later.`
                              : "Your application progress saves automatically when you start typing."}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[18px] border border-[rgba(123,103,82,0.14)] bg-white/68 p-4 shadow-[0_12px_32px_rgba(61,48,37,0.05)] sm:rounded-[24px] sm:p-5">
                  <p className="text-[8px] uppercase tracking-[0.2em] text-[#7A581F] sm:text-[9px]" dir="ltr">
                    REVIEW FLOW
                  </p>
                  <div className="mt-3 grid gap-3">
                    {[
                      ["01", "إرسال الطلب", "بيانات البوتيك والموقع والكتالوج."],
                      ["02", "مراجعة الأدمن", "التأكد من جودة البيانات قبل النشر."],
                      ["03", "رفع المنتجات", "بعد القبول تفتح Product Desk مباشرة."],
                    ].map(([step, title, copy]) => (
                      <div key={step} className="grid grid-cols-[2.25rem_1fr] gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(168,121,53,0.22)] bg-[#F8F5EF] text-[10px] tracking-[0.08em] text-[#7A581F]" dir="ltr">
                          {step}
                        </span>
                        <div className="min-w-0">
                          <p className="font-serif text-[1.2rem] leading-none text-[#2F241C] sm:text-2xl">{title}</p>
                          <p className="mt-1 text-[0.74rem] leading-5 text-[#6F6254] sm:text-sm sm:leading-6">{copy}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.aside>

              <motion.form
                onSubmit={handleSubmit}
                initial={false}
                whileInView="show"
                viewport={{ once: true, amount: 0.12 }}
                variants={fadeUp}
                className="order-1 min-w-0 space-y-3 text-[#3D3025] sm:space-y-4 lg:order-2"
              >
                <div
                  className={`rounded-[16px] border px-3 py-2.5 text-[0.75rem] leading-5 shadow-[0_8px_22px_rgba(61,48,37,0.045)] sm:px-4 sm:py-3 sm:text-sm sm:leading-6 ${
                    draftError
                      ? "border-[#9A2222]/24 bg-[#FFF5F3] text-[#9A2222]"
                      : "border-[rgba(123,103,82,0.14)] bg-white/76 text-[#5F554B]"
                  }`}
                  aria-live="polite"
                >
                  <span className="flex items-center gap-2 text-left" dir="ltr">
                    <span className="shrink-0 text-[8px] uppercase tracking-[0.18em] text-[#7A581F]">Draft</span>
                    <span className="min-w-0">
                      {draftError
                        ? draftError
                        : draftSaving
                          ? "Saving your application..."
                          : draftId
                            ? `Saved${draftSavedAt ? ` at ${new Date(draftSavedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : ""}. You can return later.`
                            : "Progress saves automatically once you start typing."}
                    </span>
                  </span>
                </div>

                <div className="rounded-[18px] border border-[rgba(123,103,82,0.14)] bg-[#FFFDF8] p-3 shadow-[0_12px_34px_rgba(61,48,37,0.055)] sm:rounded-[26px] sm:p-5">
                  <div className="mb-3 grid grid-cols-4 gap-1.5 sm:mb-5 sm:gap-2" dir="ltr" aria-label="Application progress">
                    {["Boutique", "Location", "Catalog", "Notes"].map((step, index) => (
                      <span
                        key={step}
                        className="rounded-full border border-[rgba(168,121,53,0.18)] bg-[rgba(168,121,53,0.08)] px-1.5 py-2 text-center text-[7px] uppercase tracking-[0.08em] text-[#7A581F] sm:px-3 sm:text-[9px] sm:tracking-[0.14em]"
                      >
                        {index + 1}. {step}
                      </span>
                    ))}
                  </div>
                  <SectionHeading
                    icon={Store}
                    step="STEP 01"
                    title="بيانات البوتيك"
                    copy="اكتب بيانات واضحة للمحل والمسؤول. دي أول حاجة فريق المراجعة هيشوفها."
                  />
                  <div className="grid gap-2.5 sm:gap-4 md:grid-cols-2">
                    <label>
                      <FieldLabel>اسم البوتيك</FieldLabel>
                      <input required autoComplete="organization" value={form.boutiqueName} onChange={(event) => update("boutiqueName", event.target.value)} placeholder="مثلا: Cairo Mode Boutique" />
                    </label>
                    <label>
                      <FieldLabel>اسم المسؤول</FieldLabel>
                      <input required autoComplete="name" value={form.ownerName} onChange={(event) => update("ownerName", event.target.value)} placeholder="اسم صاحب المحل أو المدير" />
                    </label>
                    <label>
                      <FieldLabel>رقم واتساب</FieldLabel>
                      <input required autoComplete="tel" inputMode="tel" value={form.phone} onChange={(event) => update("phone", event.target.value)} placeholder="+20 10..." dir="ltr" />
                    </label>
                    <label>
                      <FieldLabel>الإيميل</FieldLabel>
                      <input type="email" autoComplete="email" value={form.email} onChange={(event) => update("email", event.target.value)} placeholder="store@example.com" dir="ltr" />
                    </label>
                  </div>
                </div>

                <div className="rounded-[18px] border border-[rgba(123,103,82,0.14)] bg-[#FFFDF8] p-3 shadow-[0_12px_34px_rgba(61,48,37,0.055)] sm:rounded-[26px] sm:p-5">
                  <SectionHeading
                    icon={MapPin}
                    step="STEP 02"
                    title="موقع المحل"
                    copy="العنوان الدقيق يزود الثقة ويساعد في تجهيز الطلبات والتواصل. ولو أنت أونلاين فقط أو لا تنوي فتح بوتيك فعلي، فعّل الخيار أدناه."
                  />
                  <div className="mb-3 rounded-[16px] border border-[rgba(168,121,53,0.16)] bg-[rgba(168,121,53,0.06)] p-3 sm:mb-4 sm:rounded-[20px] sm:p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                      <div className="min-w-0">
                        <p className="text-[8px] uppercase tracking-[0.18em] text-[#7A581F] sm:text-[9px] sm:tracking-[0.2em]" dir="ltr">
                          ONLINE-ONLY OPTION
                        </p>
                        <p className="mt-1 text-[0.8rem] leading-6 text-[#5F554B] sm:text-sm sm:leading-7">
                          I don't have a boutique yet, and I may never open a physical store. I sell online only.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => update("noPhysicalShop", !form.noPhysicalShop)}
                        aria-pressed={form.noPhysicalShop}
                        className={`min-h-[42px] rounded-full border px-4 text-[10px] uppercase tracking-[0.14em] transition sm:min-h-[46px] sm:px-5 sm:text-[11px] ${
                          form.noPhysicalShop
                            ? "border-[#A87935] bg-[#3D3025] text-[#FFF9EF]"
                            : "border-[rgba(123,103,82,0.18)] bg-white/76 text-[#6F6254]"
                        }`}
                        dir="ltr"
                      >
                        {form.noPhysicalShop ? "Online-only selected" : "I don't have a boutique yet"}
                      </button>
                    </div>
                  </div>
                  <div className="grid gap-2.5 sm:gap-4 md:grid-cols-2">
                    <label>
                      <FieldLabel>المحافظة</FieldLabel>
                      <input required autoComplete="address-level1" value={form.city} onChange={(event) => update("city", event.target.value)} placeholder="Cairo, Giza, Alexandria..." />
                    </label>
                    <label>
                      <FieldLabel>المنطقة</FieldLabel>
                      <input required autoComplete="address-level2" value={form.area} onChange={(event) => update("area", event.target.value)} placeholder="Zamalek, Nasr City, Maadi..." />
                    </label>
                    {form.noPhysicalShop ? (
                      <div className="md:col-span-2 rounded-[16px] border border-dashed border-[rgba(168,121,53,0.22)] bg-white/72 p-3 text-[#6F6254] sm:rounded-[20px] sm:p-4">
                        <p className="text-[8px] uppercase tracking-[0.18em] text-[#7A581F]" dir="ltr">
                          Street address skipped
                        </p>
                        <p className="mt-1 text-[0.8rem] leading-6 sm:text-sm sm:leading-7">
                          لأنك اخترت إنك أونلاين فقط، لن نطلب عنوان شارع الآن. يمكنك إكمال الطلب باستخدام المحافظة والمنطقة فقط.
                        </p>
                      </div>
                    ) : (
                      <label className="md:col-span-2">
                        <FieldLabel>عنوان المحل في الشارع</FieldLabel>
                        <input required autoComplete="street-address" value={form.streetAddress} onChange={(event) => update("streetAddress", event.target.value)} placeholder="رقم، شارع، مول أو منطقة" />
                      </label>
                    )}
                    <label>
                      <FieldLabel>لينك Google Maps</FieldLabel>
                      <input value={form.googleMapsUrl} onChange={(event) => update("googleMapsUrl", event.target.value)} placeholder="maps.google.com/..." dir="ltr" />
                    </label>
                    <label>
                      <FieldLabel>Instagram</FieldLabel>
                      <input value={form.instagram} onChange={(event) => update("instagram", event.target.value)} placeholder="@boutique" dir="ltr" />
                    </label>
                  </div>
                </div>

                <div className="rounded-[18px] border border-[rgba(123,103,82,0.14)] bg-[#FFFDF8] p-3 shadow-[0_12px_34px_rgba(61,48,37,0.055)] sm:rounded-[26px] sm:p-5">
                  <SectionHeading
                    icon={Sparkles}
                    step="STEP 03"
                    title="المنتجات والباقة"
                    copy="اختار الأقسام الأساسية واكتب حجم الكتالوج المتوقع."
                  />
                  <div>
                    <FieldLabel>نوع المنتجات</FieldLabel>
                    <div className="hide-scrollbar flex gap-2 overflow-x-auto pb-1">
                      {CATEGORY_OPTIONS.map((category) => {
                        const active = form.categories.includes(category);
                        return (
                          <button
                            key={category}
                            type="button"
                            onClick={() => toggleCategory(category)}
                            aria-pressed={active}
                            className={`min-h-[38px] shrink-0 rounded-full border px-3 text-[10px] tracking-[0.04em] transition sm:min-h-[42px] sm:px-4 sm:text-[11px] sm:tracking-[0.06em] ${
                              active
                                ? "border-[#A87935] bg-[#3D3025] text-[#FFF9EF]"
                                : "border-[rgba(123,103,82,0.16)] bg-white/70 text-[#6F6254]"
                            }`}
                            dir="ltr"
                          >
                            {category}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-3 grid gap-2.5 sm:mt-5 sm:gap-4 md:grid-cols-2">
                    <label>
                      <FieldLabel>عدد المنتجات</FieldLabel>
                      <input type="number" min="0" inputMode="numeric" value={form.productCount} onChange={(event) => update("productCount", event.target.value)} placeholder="50" />
                    </label>
                    <label>
                      <FieldLabel>متوسط السعر</FieldLabel>
                      <input type="number" min="0" inputMode="numeric" value={form.averagePrice} onChange={(event) => update("averagePrice", event.target.value)} placeholder="1500" />
                    </label>
                  </div>

                  <div className="mt-3 rounded-[14px] border border-[rgba(168,121,53,0.20)] bg-[rgba(168,121,53,0.08)] p-3 text-[#5F554B] sm:mt-5 sm:rounded-[18px] sm:p-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                      <div>
                        <FieldLabel>الخطة عند البداية</FieldLabel>
                        <p className="font-serif text-[1.35rem] font-light leading-none text-[#2F241C] sm:text-2xl" dir="ltr">
                          {starterPlan.name}
                        </p>
                        <p className="mt-1.5 text-[0.78rem] leading-6 sm:mt-2 sm:text-sm sm:leading-7">
                          البداية إلزامية على Starter: أول 7 أيام مجانا، وبعدها <span dir="ltr">EGP {formatPrice(starterPlan.monthlyFee)}/month</span> + عمولة {starterPlan.commissionRate}% لو الشريك كمل.
                        </p>
                      </div>
                      <span className="w-fit rounded-full bg-[#3D3025] px-3 py-1.5 text-[8px] uppercase tracking-[0.16em] text-[#FFF9EF]" dir="ltr">
                        Auto assigned
                      </span>
                    </div>
                  </div>
                </div>

                <div className="rounded-[18px] border border-[rgba(123,103,82,0.14)] bg-[#FFFDF8] p-3 shadow-[0_12px_34px_rgba(61,48,37,0.055)] sm:rounded-[26px] sm:p-5">
                  <SectionHeading
                    icon={ClipboardList}
                    step="STEP 04"
                    title="ملاحظات المنتجات"
                    copy="اكتب أمثلة وأسعار مختصرة. بيانات التحويل والدفع تتضاف لاحقا من Partner Desk بعد قبول الطلب."
                  />
                  <div className="grid gap-2.5 sm:gap-4 md:grid-cols-2">
                    <label>
                      <FieldLabel>أمثلة منتجات وأسعار</FieldLabel>
                      <textarea value={form.sampleProducts} onChange={(event) => update("sampleProducts", event.target.value)} placeholder="Jacket 1500 EGP, Pants 1200 EGP..." />
                    </label>
                    <label>
                      <FieldLabel>ملاحظات إضافية</FieldLabel>
                      <textarea value={form.notes} onChange={(event) => update("notes", event.target.value)} placeholder="مواعيد الاستلام، سياسة الاستبدال، طريقة تجهيز الطلبات..." />
                    </label>
                  </div>
                </div>

                <div className="rounded-[18px] border border-[rgba(123,103,82,0.14)] bg-white/78 p-3 shadow-[0_12px_32px_rgba(61,48,37,0.06)] sm:rounded-[24px] sm:p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:flex-row-reverse sm:items-center sm:justify-between sm:gap-3">
                    <button type="submit" disabled={submitting} className="btn-gold justify-center" style={{ letterSpacing: "0.03em" }}>
                      {submitting ? "جاري الإرسال" : "إرسال طلب الشراكة"}
                    </button>
                    <span className="inline-flex items-center justify-center gap-2 text-center text-xs leading-5 text-[#6F6254] sm:justify-start sm:text-sm">
                      <MapPin className="h-4 w-4 text-[#A87935]" strokeWidth={1.35} />
                      بعد الإرسال هتروح لصفحة رفع المنتجات
                    </span>
                  </div>
                </div>

                <AnimatePresence>
                  {result ? (
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="rounded-[20px] border border-[rgba(80,150,100,0.24)] bg-[rgba(80,150,100,0.10)] p-4 text-sm leading-7 text-[#365A3E]"
                    >
                      تم تسجيل الطلب برقم <span dir="ltr">{result.id}</span>. البداية على {result.planName}: أول {result.trialDays} أيام مجانا، ثم <span dir="ltr">EGP {formatPrice(result.monthlyFee)}/month</span> + عمولة {result.commissionRate}%.
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </motion.form>
            </div>
          </div>
        </section>
      ) : null}
      <style jsx global>{`
        @media (max-width: 640px) {
          .boutique-partner-page {
            scroll-padding-top: 4.75rem;
          }

          .boutique-partner-page > .page-wrap {
            padding-left: 0.75rem !important;
            padding-right: 0.75rem !important;
          }

          .boutique-partner-page section > .page-wrap {
            padding-left: 0 !important;
            padding-right: 0 !important;
          }

          .boutique-partner-page .btn-gold,
          .boutique-partner-page .btn-ghost {
            font-size: 0.75rem;
            letter-spacing: 0.03em !important;
            text-transform: none;
          }

          .boutique-partner-page .hide-scrollbar {
            scrollbar-width: none;
            -ms-overflow-style: none;
          }

          .boutique-partner-page .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
        }
      `}</style>
    </main>
  );
}
