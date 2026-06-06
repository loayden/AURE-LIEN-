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
  Landmark,
  MapPin,
  Percent,
  ShieldCheck,
  Sparkles,
  Smartphone,
  Store,
  UploadCloud,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";

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
    bestFor: "محل صغير بيجرب أول drop أونلاين.",
  },
  {
    id: "growth",
    name: "Growth Boutique",
    monthlyFee: 2500,
    commissionRate: 7,
    trialDays: 14,
    bestFor: "بوتيك عنده stock ثابت ورفع منتجات أسبوعي.",
  },
  {
    id: "signature",
    name: "Signature Boutique",
    monthlyFee: 4500,
    commissionRate: 5,
    trialDays: 14,
    bestFor: "محل premium محتاج ظهور أعلى وتجربة curated.",
  },
] as const;

type FormState = {
  boutiqueName: string;
  ownerName: string;
  phone: string;
  email: string;
  city: string;
  area: string;
  streetAddress: string;
  googleMapsUrl: string;
  instagram: string;
  categories: string[];
  productCount: string;
  averagePrice: string;
  planId: (typeof PLAN_OPTIONS)[number]["id"];
  trialDays: "7" | "14";
  payoutMethod: "bank_account" | "mobile_wallet" | "paymob_merchant";
  payoutAccountName: string;
  payoutBankName: string;
  payoutIban: string;
  payoutWalletPhone: string;
  paymobMerchantId: string;
  taxId: string;
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
  streetAddress: "",
  googleMapsUrl: "",
  instagram: "",
  categories: ["Menswear"],
  productCount: "",
  averagePrice: "",
  planId: "growth",
  trialDays: "14",
  payoutMethod: "mobile_wallet",
  payoutAccountName: "",
  payoutBankName: "",
  payoutIban: "",
  payoutWalletPhone: "",
  paymobMerchantId: "",
  taxId: "",
  sampleProducts: "",
  notes: "",
};

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
    <div className="mb-3 flex items-start gap-2.5 sm:mb-4 sm:gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[rgba(168,121,53,0.20)] bg-[rgba(168,121,53,0.10)] text-[#A87935] sm:h-11 sm:w-11 sm:rounded-xl">
        <Icon className="h-4 w-4 sm:h-[1.125rem] sm:w-[1.125rem]" strokeWidth={1.35} />
      </span>
      <div>
        <p className="text-[8px] uppercase tracking-[0.22em] text-[#A87935] sm:text-[9px] sm:tracking-[0.24em]" dir="ltr">
          {step}
        </p>
        <h3 className="mt-0.5 font-serif text-xl font-light leading-tight tracking-[0.02em] text-[#3D3025] sm:mt-1 sm:text-3xl">
          {title}
        </h3>
        <p className="mt-1.5 max-w-2xl text-[0.8rem] leading-6 text-[#6F6254] sm:mt-2 sm:text-sm sm:leading-7">{copy}</p>
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
    <div className="min-w-0 rounded-[14px] border border-[rgba(123,103,82,0.14)] bg-white/62 p-2 shadow-[0_10px_24px_rgba(61,48,37,0.06)] sm:rounded-[18px] sm:p-4 sm:shadow-[0_12px_34px_rgba(61,48,37,0.06)]">
      <div className="mb-2 flex items-center justify-between gap-2 sm:mb-4 sm:gap-3">
        <Icon className="h-3.5 w-3.5 text-[#A87935] sm:h-4 sm:w-4" strokeWidth={1.35} />
        <span className="text-[7px] uppercase tracking-[0.16em] text-[#7B6E60] sm:text-[9px] sm:tracking-[0.2em]" dir="ltr">
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

export default function BoutiquePartnersPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{
    id: string;
    planName: string;
    monthlyFee: number;
    commissionRate: number;
    trialDays: number;
  } | null>(null);

  const selectedPlan = useMemo(
    () => PLAN_OPTIONS.find((plan) => plan.id === form.planId) ?? PLAN_OPTIONS[1],
    [form.planId]
  );

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function toggleCategory(category: string) {
    setForm((current) => {
      const exists = current.categories.includes(category);
      const next = exists
        ? current.categories.filter((item) => item !== category)
        : [...current.categories, category];

      return { ...current, categories: next.length ? next : [category] };
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setResult(null);

    try {
      const response = await fetch("/api/boutiques/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          productCount: Number(form.productCount) || 0,
          averagePrice: form.averagePrice ? Number(form.averagePrice) : undefined,
          trialDays: Number(form.trialDays),
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data?.error || "Unable to submit application");

      setResult({
        id: data.application._id,
        planName: data.application.planName,
        monthlyFee: data.application.monthlyFee,
        commissionRate: data.application.commissionRate,
        trialDays: data.application.trialDays,
      });
      setForm(initialForm);
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
      className="liquid-page mobile-comfort overflow-hidden pb-[calc(7.25rem+env(safe-area-inset-bottom))] text-[#3D3025] md:pb-28"
      style={{ fontFamily: "Tahoma, Arial, var(--font-jost), sans-serif" }}
    >
      <section className="relative isolate overflow-hidden border-b border-[rgba(123,103,82,0.16)] bg-[#F5F1E8] px-3 pb-5 pt-14 sm:px-6 sm:pb-12 sm:pt-24 md:px-10">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,rgba(255,249,239,0.98)_0%,rgba(245,241,232,0.90)_52%,rgba(234,225,211,0.86)_100%)]" />
        <div className="page-wrap grid gap-4 sm:gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0.01, y: 22, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.54, ease: easeOut }}
            className="order-2 lg:order-1"
          >
            <div className="relative overflow-hidden rounded-[18px] border border-[rgba(123,103,82,0.16)] bg-[#15110E] shadow-[0_18px_44px_rgba(61,48,37,0.12)] sm:rounded-[24px] sm:shadow-[0_24px_70px_rgba(61,48,37,0.15)]">
              <div className="relative min-h-[11.5rem] sm:min-h-[22rem]">
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
              <div className="absolute inset-x-3 bottom-3 rounded-[14px] border border-white/15 bg-[#FFF9EF]/88 p-3 text-[#3D3025] shadow-[0_14px_34px_rgba(0,0,0,0.16)] backdrop-blur-xl sm:inset-x-4 sm:bottom-4 sm:rounded-[18px] sm:p-4 sm:shadow-[0_18px_44px_rgba(0,0,0,0.18)]">
                <p className="text-[7px] uppercase tracking-[0.2em] text-[#7A581F] sm:text-[9px] sm:tracking-[0.24em]" dir="ltr">
                  WHAT HAPPENS AFTER APPLYING
                </p>
                <p className="mt-1.5 text-xs leading-5 text-[#5F554B] sm:hidden">
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

          <motion.div initial="hidden" animate="show" variants={fadeUp} className="order-1 w-full min-w-0 max-w-3xl text-left lg:order-2" dir="ltr">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[rgba(168,121,53,0.24)] bg-white/62 px-3 py-1.5 text-[#7A581F] shadow-[0_10px_24px_rgba(61,48,37,0.06)] sm:mb-4 sm:py-2 sm:shadow-[0_14px_32px_rgba(61,48,37,0.07)]">
              <Store className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={1.35} />
              <span className="text-[8px] uppercase tracking-[0.2em] sm:text-[9px] sm:tracking-[0.22em]" dir="ltr">
                BOUTIQUE PARTNERS
              </span>
            </div>
            <h1 className="max-w-[21rem] font-serif text-[2.05rem] font-light leading-[0.98] tracking-[0.01em] text-[#3D3025] sm:max-w-3xl sm:text-[4.65rem] sm:leading-[0.9] lg:text-[5.6rem]" dir="ltr">
              Sell your boutique <span className="block">on BOUT.</span>
            </h1>
            <p className="mt-3 w-full max-w-2xl text-right text-[0.86rem] leading-7 text-[#5F554B] sm:mt-5 sm:text-lg sm:leading-9" dir="rtl">
              لو عندك بوتيك في مصر، سجّل بيانات المحل والموقع ونوع المنتجات. فريق BOUT يراجع الطلب، وبعد الموافقة تقدر ترفع المنتجات وتظهر في المتجر.
            </p>

            <div className="mt-4 grid w-full min-w-0 grid-cols-2 gap-2 sm:hidden" dir="ltr">
              <SignalCard icon={CalendarDays} label="Trial" value="7-14 Days" copy="تجربة مجانية قبل الاشتراك." />
              <SignalCard icon={Percent} label="Commission" value="5-10%" copy="نسبة واضحة حسب الباقة." />
              <div className="col-span-2">
                <SignalCard icon={Building2} label="Monthly" value="EGP 1,500+" copy="بعد انتهاء التجربة." />
              </div>
            </div>
            <div className="mt-5 hidden w-full min-w-0 gap-3 sm:grid sm:grid-cols-3" dir="ltr">
              <SignalCard icon={CalendarDays} label="Trial" value="7-14 Days" copy="تجربة مجانية قبل الاشتراك." />
              <SignalCard icon={Percent} label="Commission" value="5-10%" copy="نسبة واضحة حسب الباقة." />
              <SignalCard icon={Building2} label="Monthly" value="EGP 1,500+" copy="بعد انتهاء التجربة." />
            </div>

            <div className="mt-4 grid w-full min-w-0 grid-cols-2 gap-2 sm:mt-5 sm:flex sm:flex-row-reverse sm:gap-3" dir="rtl">
              <a href="#boutique-application" className="btn-gold col-span-2 justify-center" style={{ letterSpacing: "0.03em" }}>
                ابدأ الطلب
                <ArrowRight className="h-4 w-4 rotate-180" strokeWidth={1.4} />
              </a>
              <a href="#partner-plans" className="btn-ghost justify-center" style={{ letterSpacing: "0.03em" }}>
                قارن الباقات
              </a>
              <a href="/partners/products" className="btn-ghost justify-center" style={{ letterSpacing: "0.03em" }}>
                عندي طلب بالفعل
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="page-wrap px-3 py-4 sm:px-6 sm:py-12 md:px-10">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.22 }}
          variants={fadeUp}
          className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-4"
        >
          {[
            { icon: ClipboardList, title: "قدم الطلب", copy: "بيانات المحل، الموقع، التواصل، ونوع المنتجات." },
            { icon: ShieldCheck, title: "مراجعة آمنة", copy: "الأدمن يراجع جودة المحل والبيانات قبل النشر." },
            { icon: UploadCloud, title: "ارفع المنتجات", copy: "بعد الطلب تفتح صفحة رفع الصور والتفاصيل." },
            { icon: Store, title: "بيع داخل BOUT", copy: "المنتجات تظهر في Shop بعد موافقة الأدمن." },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="rounded-[16px] border border-[rgba(123,103,82,0.14)] bg-white/60 p-3 shadow-[0_10px_26px_rgba(61,48,37,0.05)] sm:rounded-[20px] sm:p-4 sm:shadow-[0_12px_36px_rgba(61,48,37,0.06)]">
                <Icon className="mb-2 h-4 w-4 text-[#A87935] sm:mb-4 sm:h-5 sm:w-5" strokeWidth={1.35} />
                <h2 className="font-serif text-lg font-light tracking-[0.02em] text-[#3D3025] sm:text-2xl">{item.title}</h2>
                <p className="mt-1 text-xs leading-5 text-[#6F6254] sm:mt-2 sm:text-sm sm:leading-7">{item.copy}</p>
              </div>
            );
          })}
        </motion.div>
      </section>

      <section id="partner-plans" className="page-wrap px-3 pb-5 sm:px-6 sm:pb-12 md:px-10">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.18 }} variants={fadeUp}>
          <div className="mb-3 grid gap-2 sm:mb-5 sm:gap-3 lg:grid-cols-[1fr_0.72fr] lg:items-end">
            <div>
              <p className="eyebrow mb-2 sm:mb-3" dir="ltr">COMMERCIAL MODEL</p>
              <h2 className="title-display text-[2.1rem] leading-[1] tracking-[0.02em] sm:text-[4rem] sm:leading-[0.92]">
                باقات واضحة قبل ما تبدأ.
              </h2>
            </div>
            <p className="text-[0.82rem] leading-6 text-[#6F6254] sm:text-base sm:leading-8">
              اختار الباقة المناسبة لحجم البوتيك. تقدر تبدأ بتجربة مجانية، وبعدها الاشتراك الشهري ونسبة المبيعات تظهر بوضوح في الطلب.
            </p>
          </div>

          <div className="rounded-[18px] border border-[rgba(123,103,82,0.16)] bg-white/62 p-3 shadow-[0_12px_28px_rgba(61,48,37,0.06)] sm:hidden">
            <label>
              <FieldLabel>اختار الباقة</FieldLabel>
              <select value={form.planId} onChange={(event) => update("planId", event.target.value as FormState["planId"])} className="luxury-select">
                {PLAN_OPTIONS.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.name}
                  </option>
                ))}
              </select>
            </label>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-xl bg-[rgba(168,121,53,0.09)] p-2">
                <p className="text-[7px] uppercase tracking-[0.16em] text-[#7A581F]" dir="ltr">Monthly</p>
                <p className="mt-1 font-serif text-lg leading-none text-[#3D3025]" dir="ltr">EGP {formatPrice(selectedPlan.monthlyFee)}</p>
              </div>
              <div className="rounded-xl bg-[rgba(168,121,53,0.09)] p-2">
                <p className="text-[7px] uppercase tracking-[0.16em] text-[#7A581F]" dir="ltr">Trial</p>
                <p className="mt-1 font-serif text-lg leading-none text-[#3D3025]" dir="ltr">{selectedPlan.trialDays}d</p>
              </div>
              <div className="rounded-xl bg-[rgba(168,121,53,0.09)] p-2">
                <p className="text-[7px] uppercase tracking-[0.16em] text-[#7A581F]" dir="ltr">Rate</p>
                <p className="mt-1 font-serif text-lg leading-none text-[#3D3025]" dir="ltr">{selectedPlan.commissionRate}%</p>
              </div>
            </div>
            <p className="mt-3 text-xs leading-5 text-[#6F6254]">{selectedPlan.bestFor}</p>
          </div>

          <div className="hidden gap-3 sm:grid lg:grid-cols-3">
            {PLAN_OPTIONS.map((plan) => {
              const active = form.planId === plan.id;
              return (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => update("planId", plan.id)}
                  aria-pressed={active}
                  className={`relative w-full rounded-[20px] border p-4 text-right transition sm:p-5 ${
                    active
                      ? "border-[rgba(168,121,53,0.50)] bg-[rgba(168,121,53,0.10)] shadow-[0_20px_54px_rgba(61,48,37,0.11)]"
                      : "border-[rgba(123,103,82,0.16)] bg-white/58 hover:border-[rgba(168,121,53,0.34)]"
                  }`}
                >
                  <span className="mb-5 flex items-center justify-between gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-[rgba(168,121,53,0.22)] bg-white/70 text-[#A87935]">
                      <Sparkles className="h-4 w-4" strokeWidth={1.35} />
                    </span>
                    {active ? (
                      <span className="rounded-full bg-[#3D3025] px-3 py-1.5 text-[9px] uppercase tracking-[0.18em] text-[#FFF9EF]">
                        Selected
                      </span>
                    ) : null}
                  </span>
                  <span className="block text-[10px] uppercase tracking-[0.22em] text-[#7A581F]" dir="ltr">
                    {plan.name}
                  </span>
                  <span className="mt-3 flex flex-wrap items-end gap-x-2 gap-y-1">
                    <span className="font-serif text-4xl leading-none text-[#3D3025]" dir="ltr">
                      EGP {formatPrice(plan.monthlyFee)}
                    </span>
                    <span className="pb-1 text-sm text-[#6F6254]">شهريا</span>
                  </span>
                  <span className="mt-3 grid gap-2 text-sm leading-7 text-[#5F554B]">
                    <span>تجربة مجانية {plan.trialDays} يوم</span>
                    <span>عمولة مبيعات {plan.commissionRate}%</span>
                    <span>{plan.bestFor}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>
      </section>

      <section id="boutique-application" className="border-y border-[rgba(123,103,82,0.16)] bg-[#F8F5EF] px-3 py-5 sm:px-6 sm:py-12 md:px-10">
        <div className="page-wrap grid gap-4 sm:gap-6 lg:grid-cols-[0.74fr_1.26fr] lg:items-start">
          <motion.aside initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="hidden lg:sticky lg:top-24 lg:block">
            <div className="rounded-[24px] border border-[rgba(123,103,82,0.14)] bg-[#171513] p-5 text-[#F8F7F2] shadow-[0_24px_70px_rgba(61,48,37,0.16)] sm:p-6">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-[#D8C08A]/28 bg-white/[0.06] text-[#D8C08A]">
                <ClipboardList className="h-5 w-5" strokeWidth={1.35} />
              </div>
              <p className="text-[10px] uppercase tracking-[0.24em] text-[#D8C08A]" dir="ltr">
                APPLICATION
              </p>
              <h2 className="mt-3 font-serif text-4xl font-light leading-[0.95] tracking-[0.02em] sm:text-5xl">
                الطلب بياخد دقائق.
              </h2>
              <p className="mt-4 text-sm leading-7 text-[#C9C5B8]">
                ركز على بيانات المحل وطريقة التواصل. بعد الإرسال هتنتقل مباشرة لصفحة إضافة المنتجات.
              </p>
              <div className="mt-5 rounded-[18px] border border-[#D8C08A]/20 bg-white/[0.05] p-4">
                <p className="text-[9px] uppercase tracking-[0.2em] text-[#D8C08A]" dir="ltr">
                  SELECTED PLAN
                </p>
                <p className="mt-2 font-serif text-3xl text-white" dir="ltr">
                  {selectedPlan.name}
                </p>
                <p className="mt-2 text-sm leading-7 text-[#D8C08A]">
                  EGP {formatPrice(selectedPlan.monthlyFee)} / month + {selectedPlan.commissionRate}% commission after {selectedPlan.trialDays} free days.
                </p>
              </div>
              <div className="mt-5 grid gap-2">
                {["لا نطلب بيانات كارت أو CVV", "الأدمن يراجع الطلب قبل النشر", "المنتجات تظهر بعد الموافقة فقط"].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm text-[#E9E4D8]">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-[#D8C08A]" strokeWidth={1.4} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.aside>

          <motion.form
            onSubmit={handleSubmit}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.12 }}
            variants={fadeUp}
            className="rounded-[20px] border border-[rgba(123,103,82,0.16)] bg-[#FFF9EF] p-3 text-[#3D3025] shadow-[0_16px_40px_rgba(61,48,37,0.08)] sm:rounded-[30px] sm:p-6 sm:shadow-[0_20px_58px_rgba(61,48,37,0.10)]"
          >
            <div className="mb-4 rounded-[16px] border border-[rgba(168,121,53,0.18)] bg-[rgba(168,121,53,0.08)] p-3 lg:hidden">
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#3D3025] text-[#FFF9EF]">
                  <ClipboardList className="h-4 w-4" strokeWidth={1.35} />
                </span>
                <div>
                  <p className="text-[8px] uppercase tracking-[0.22em] text-[#7A581F]" dir="ltr">
                    APPLICATION
                  </p>
                  <p className="mt-1 text-sm leading-6 text-[#5F554B]">
                    املأ البيانات الأساسية. بعد الإرسال هتنتقل لرفع المنتجات.
                  </p>
                </div>
              </div>
            </div>

            <div className="border-b border-[rgba(123,103,82,0.14)] pb-4 sm:pb-6">
              <SectionHeading
                icon={Store}
                step="STEP 01"
                title="بيانات البوتيك"
                copy="اكتب اسم المحل والمسؤول وطريقة التواصل الأساسية."
              />
              <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
                <label>
                  <FieldLabel>اسم البوتيك</FieldLabel>
                  <input required value={form.boutiqueName} onChange={(event) => update("boutiqueName", event.target.value)} placeholder="مثلا: Cairo Mode Boutique" />
                </label>
                <label>
                  <FieldLabel>اسم المسؤول</FieldLabel>
                  <input required value={form.ownerName} onChange={(event) => update("ownerName", event.target.value)} placeholder="اسم صاحب المحل أو المدير" />
                </label>
                <label>
                  <FieldLabel>رقم واتساب</FieldLabel>
                  <input required inputMode="tel" value={form.phone} onChange={(event) => update("phone", event.target.value)} placeholder="+20 10..." dir="ltr" />
                </label>
                <label>
                  <FieldLabel>الإيميل</FieldLabel>
                  <input type="email" value={form.email} onChange={(event) => update("email", event.target.value)} placeholder="store@example.com" dir="ltr" />
                </label>
              </div>
            </div>

            <div className="border-b border-[rgba(123,103,82,0.14)] py-4 sm:py-6">
              <SectionHeading
                icon={MapPin}
                step="STEP 02"
                title="موقع المحل"
                copy="الموقع يساعد الأدمن والعميل يعرفوا مكان البوتيك بوضوح."
              />
              <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
                <label>
                  <FieldLabel>المحافظة</FieldLabel>
                  <input required value={form.city} onChange={(event) => update("city", event.target.value)} placeholder="Cairo, Giza, Alexandria..." />
                </label>
                <label>
                  <FieldLabel>المنطقة</FieldLabel>
                  <input required value={form.area} onChange={(event) => update("area", event.target.value)} placeholder="Zamalek, Nasr City, Maadi..." />
                </label>
                <label className="md:col-span-2">
                  <FieldLabel>عنوان المحل في الشارع</FieldLabel>
                  <input required value={form.streetAddress} onChange={(event) => update("streetAddress", event.target.value)} placeholder="رقم، شارع، مول أو منطقة" />
                </label>
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

            <div className="border-b border-[rgba(123,103,82,0.14)] py-4 sm:py-6">
              <SectionHeading
                icon={Sparkles}
                step="STEP 03"
                title="المنتجات والباقة"
                copy="حدد نوع المنتجات وحجم الكتالوج المتوقع عشان المراجعة تكون أسرع."
              />
              <div>
                <FieldLabel>نوع المنتجات</FieldLabel>
                <div className="flex flex-wrap gap-2">
                  {CATEGORY_OPTIONS.map((category) => {
                    const active = form.categories.includes(category);
                    return (
                      <button
                        key={category}
                        type="button"
                        onClick={() => toggleCategory(category)}
                        className={`min-h-[36px] rounded-full border px-3 text-[10px] tracking-[0.04em] transition sm:min-h-[42px] sm:px-4 sm:text-[11px] sm:tracking-[0.06em] ${
                          active
                            ? "border-[#A87935] bg-[rgba(168,121,53,0.14)] text-[#7A581F]"
                            : "border-[rgba(123,103,82,0.16)] bg-white/60 text-[#6F6254]"
                        }`}
                        dir="ltr"
                      >
                        {category}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:mt-5 sm:gap-4 md:grid-cols-3">
                <label>
                  <FieldLabel>عدد المنتجات</FieldLabel>
                  <input type="number" min="0" inputMode="numeric" value={form.productCount} onChange={(event) => update("productCount", event.target.value)} placeholder="50" />
                </label>
                <label>
                  <FieldLabel>متوسط السعر</FieldLabel>
                  <input type="number" min="0" inputMode="numeric" value={form.averagePrice} onChange={(event) => update("averagePrice", event.target.value)} placeholder="1500" />
                </label>
                <label>
                  <FieldLabel>مدة التجربة</FieldLabel>
                  <select value={form.trialDays} onChange={(event) => update("trialDays", event.target.value as "7" | "14")} className="luxury-select">
                    <option value="14">14 يوم مجانا</option>
                    <option value="7">7 أيام مجانا</option>
                  </select>
                </label>
              </div>

              <div className="mt-4 sm:mt-5">
                <FieldLabel>الباقة التجارية</FieldLabel>
                <select value={form.planId} onChange={(event) => update("planId", event.target.value as FormState["planId"])} className="luxury-select">
                  {PLAN_OPTIONS.map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      {plan.name} - EGP {formatPrice(plan.monthlyFee)} / {plan.commissionRate}% commission
                    </option>
                  ))}
                </select>
                <div className="mt-3 rounded-[14px] border border-[rgba(168,121,53,0.20)] bg-[rgba(168,121,53,0.08)] p-3 text-xs leading-6 text-[#5F554B] sm:rounded-[18px] sm:p-4 sm:text-sm sm:leading-7">
                  بعد التجربة: <span dir="ltr">EGP {formatPrice(selectedPlan.monthlyFee)}/month</span> + عمولة {selectedPlan.commissionRate}% على المبيعات.
                </div>
              </div>
            </div>

            <div className="border-b border-[rgba(123,103,82,0.14)] py-4 sm:py-6">
              <SectionHeading
                icon={Landmark}
                step="STEP 04"
                title="بيانات التحويل"
                copy="بيانات صرف الأرباح فقط. لا نخزن أو نطلب بيانات كروت بنكية."
              />
              <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
                <label>
                  <FieldLabel>طريقة التحويل</FieldLabel>
                  <select
                    value={form.payoutMethod}
                    onChange={(event) => update("payoutMethod", event.target.value as FormState["payoutMethod"])}
                    className="luxury-select"
                  >
                    <option value="mobile_wallet">Mobile wallet</option>
                    <option value="bank_account">Bank account / IBAN</option>
                    <option value="paymob_merchant">Paymob merchant ID</option>
                  </select>
                </label>
                <label>
                  <FieldLabel>اسم صاحب الحساب</FieldLabel>
                  <input
                    required
                    value={form.payoutAccountName}
                    onChange={(event) => update("payoutAccountName", event.target.value)}
                    placeholder="اسم صاحب الحساب أو المحفظة"
                  />
                </label>
                {form.payoutMethod === "bank_account" ? (
                  <>
                    <label>
                      <FieldLabel>اسم البنك</FieldLabel>
                      <input
                        required
                        value={form.payoutBankName}
                        onChange={(event) => update("payoutBankName", event.target.value)}
                        placeholder="CIB, Banque Misr, NBE..."
                      />
                    </label>
                    <label>
                      <FieldLabel>IBAN أو رقم الحساب</FieldLabel>
                      <input
                        required
                        value={form.payoutIban}
                        onChange={(event) => update("payoutIban", event.target.value)}
                        placeholder="EG..."
                        dir="ltr"
                      />
                    </label>
                  </>
                ) : null}
                {form.payoutMethod === "mobile_wallet" ? (
                  <label className="md:col-span-2">
                    <FieldLabel>رقم المحفظة</FieldLabel>
                    <div className="relative">
                      <Smartphone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A87935]" strokeWidth={1.35} />
                      <input
                        required
                        value={form.payoutWalletPhone}
                        onChange={(event) => update("payoutWalletPhone", event.target.value)}
                        placeholder="+20 10..."
                        dir="ltr"
                        className="pl-11"
                      />
                    </div>
                  </label>
                ) : null}
                {form.payoutMethod === "paymob_merchant" ? (
                  <label className="md:col-span-2">
                    <FieldLabel>Paymob merchant / sub-merchant ID</FieldLabel>
                    <input
                      required
                      value={form.paymobMerchantId}
                      onChange={(event) => update("paymobMerchantId", event.target.value)}
                      placeholder="merchant_..."
                      dir="ltr"
                    />
                  </label>
                ) : null}
                <label className="md:col-span-2">
                  <FieldLabel>رقم ضريبي أو سجل تجاري اختياري</FieldLabel>
                  <input
                    value={form.taxId}
                    onChange={(event) => update("taxId", event.target.value)}
                    placeholder="اختياري للمراجعة والفواتير"
                    dir="ltr"
                  />
                </label>
              </div>
            </div>

            <div className="py-4 sm:py-6">
              <SectionHeading
                icon={ClipboardList}
                step="STEP 05"
                title="ملاحظات المنتجات"
                copy="أمثلة بسيطة تساعد فريق BOUT يراجع جودة المنتجات والأسعار."
              />
              <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
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

            <div className="flex flex-col gap-2 border-t border-[rgba(123,103,82,0.16)] pt-4 sm:flex-row sm:flex-row-reverse sm:items-center sm:justify-between sm:gap-3 sm:pt-5">
              <button type="submit" disabled={submitting} className="btn-gold justify-center">
                {submitting ? "جاري الإرسال" : "إرسال طلب الشراكة"}
              </button>
              <span className="inline-flex items-center justify-center gap-2 text-center text-xs leading-5 text-[#6F6254] sm:justify-start sm:text-sm">
                <MapPin className="h-4 w-4 text-[#A87935]" strokeWidth={1.35} />
                بعد الإرسال هتروح لصفحة رفع المنتجات
              </span>
            </div>

            <AnimatePresence>
              {result ? (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mt-5 rounded-[20px] border border-[rgba(80,150,100,0.24)] bg-[rgba(80,150,100,0.10)] p-4 text-sm leading-7 text-[#365A3E]"
                >
                  تم تسجيل الطلب برقم <span dir="ltr">{result.id}</span>. الباقة المختارة: {result.planName}، تجربة {result.trialDays} يوم، ثم <span dir="ltr">EGP {formatPrice(result.monthlyFee)}/month</span> + عمولة {result.commissionRate}%.
                </motion.div>
              ) : null}
            </AnimatePresence>
          </motion.form>
        </div>
      </section>
    </main>
  );
}
