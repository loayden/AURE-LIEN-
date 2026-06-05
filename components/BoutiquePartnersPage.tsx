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
  Sparkles,
  Smartphone,
  Store,
} from "lucide-react";
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
    bestFor: "محلات صغيرة بتجرب أول drop أونلاين.",
  },
  {
    id: "growth",
    name: "Growth Boutique",
    monthlyFee: 2500,
    commissionRate: 7,
    trialDays: 14,
    bestFor: "بوتيكات عندها stock ثابت ورفع منتجات أسبوعي.",
  },
  {
    id: "signature",
    name: "Signature Boutique",
    monthlyFee: 4500,
    commissionRate: 5,
    trialDays: 14,
    bestFor: "محلات premium محتاجة ظهور أعلى وتجربة curated.",
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
  hidden: { opacity: 0.01, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.52, ease: easeOut } },
};

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-2 block text-[10px] uppercase tracking-[0.22em] text-[#7A581F]">
      {children}
    </span>
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
      <section className="relative isolate overflow-hidden border-b border-[rgba(123,103,82,0.16)] bg-[#F5F1E8] px-3 pb-7 pt-16 sm:px-6 sm:pb-14 sm:pt-28 md:px-10">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_24%,rgba(168,121,53,0.16),transparent_30%),linear-gradient(135deg,rgba(255,249,239,0.94),rgba(245,241,232,0.82)_52%,rgba(234,225,211,0.88))]" />
        <div className="page-wrap grid gap-5 sm:gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <motion.div initial="hidden" animate="show" variants={fadeUp} className="max-w-4xl">
            <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(168,121,53,0.24)] bg-white/60 text-[#A87935] shadow-[0_18px_44px_rgba(61,48,37,0.08)] sm:mb-6 sm:h-14 sm:w-14">
              <Store className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={1.35} />
            </div>
            <p className="eyebrow mb-3 sm:mb-5" dir="ltr">BOUTIQUE PARTNERS</p>
            <h1 className="title-display max-w-4xl text-[clamp(3.1rem,8vw,7.4rem)] leading-[0.88]" dir="ltr">
              Boutique Partners Egypt
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#5F554B] sm:mt-6 sm:text-lg sm:leading-9">
              خلي منتجات البوتيك بتاعك تظهر على BOUT، مع موقع المحل، بيانات التواصل، نظام عمولة واضح، وتجربة مجانية لمدة أسبوع أو أسبوعين قبل الاشتراك الشهري.
            </p>
            <div className="mt-5 flex flex-col gap-2 sm:mt-8 sm:flex-row sm:flex-row-reverse sm:gap-3">
              <a href="#boutique-application" className="btn-gold justify-center">
                ابدأ التجربة المجانية
                <ArrowRight className="h-4 w-4 rotate-180" strokeWidth={1.4} />
              </a>
              <a href="#partner-plans" className="btn-ghost justify-center">
                شوف الباقات
              </a>
              <a href="/partners/products" className="btn-ghost justify-center">
                عندي طلب بالفعل
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0.01, y: 28, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
            className="glass-panel overflow-hidden p-4 sm:p-6"
          >
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { icon: CalendarDays, label: "Trial", value: "7-14 Days", copy: "مجانا قبل الاشتراك" },
                { icon: Percent, label: "Commission", value: "5-10%", copy: "حسب الباقة" },
                { icon: Building2, label: "Monthly", value: "EGP 1,500+", copy: "بعد التجربة" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="rounded-[16px] border border-[rgba(123,103,82,0.14)] bg-white/54 p-3 text-right sm:rounded-[22px] sm:p-4">
                    <Icon className="mb-3 h-4 w-4 text-[#A87935] sm:mb-5 sm:h-5 sm:w-5" strokeWidth={1.35} />
                    <p className="text-[10px] uppercase tracking-[0.22em] text-[#7B6E60]" dir="ltr">{item.label}</p>
                    <p className="mt-1.5 font-serif text-2xl leading-none text-[#3D3025] sm:mt-2 sm:text-3xl" dir="ltr">{item.value}</p>
                    <p className="mt-2 text-xs leading-5 text-[#6F6254] sm:mt-3 sm:text-sm sm:leading-6">{item.copy}</p>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 rounded-[18px] border border-[rgba(168,121,53,0.22)] bg-[rgba(168,121,53,0.08)] p-4 sm:mt-4 sm:rounded-[24px] sm:p-5">
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#7A581F]" dir="ltr">Marketplace flow</p>
              <p className="mt-3 text-base leading-8 text-[#4D4237]">
                البوتيك يبعث البيانات والمنتجات المبدئية، فريق BOUT يراجع الجودة والتسعير، وبعد الموافقة المنتجات تظهر داخل المتجر والصفحات الخاصة بالمنتجات.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="partner-plans" className="page-wrap px-3 py-7 sm:px-6 sm:py-14 md:px-10">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.18 }} variants={fadeUp}>
          <div className="mb-5 flex flex-col gap-3 sm:mb-7 sm:gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="eyebrow mb-3 sm:mb-4" dir="ltr">COMMERCIAL MODEL</p>
              <h2 className="title-display text-[clamp(2.5rem,6vw,5.8rem)] leading-[0.9]">
                تجربة مجانية، وبعدها اشتراك شهري.
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-[#6F6254]">
              كل باقة فيها رسوم شهرية ونسبة على المبيعات. النسب قابلة للتعديل حسب حجم المنتجات وجودة الصور وسرعة تجهيز الطلبات.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {PLAN_OPTIONS.map((plan) => (
              <button
                key={plan.id}
                type="button"
                onClick={() => update("planId", plan.id)}
                className={`relative flex aspect-square w-full flex-col justify-between overflow-hidden !rounded-lg border p-4 text-right transition sm:p-5 ${
                  form.planId === plan.id
                    ? "border-[rgba(168,121,53,0.48)] bg-[rgba(168,121,53,0.10)] shadow-[0_24px_60px_rgba(61,48,37,0.10)]"
                    : "border-[rgba(123,103,82,0.16)] bg-white/54 hover:border-[rgba(168,121,53,0.32)]"
                }`}
              >
                <span className="mb-5 flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(168,121,53,0.22)] bg-white/66 text-[#A87935] sm:mb-8 sm:h-11 sm:w-11">
                  <Sparkles className="h-4 w-4" strokeWidth={1.35} />
                </span>
                <span className="block text-[10px] uppercase tracking-[0.22em] text-[#7A581F]" dir="ltr">
                  {plan.name}
                </span>
                <span className="mt-3 block font-serif text-3xl leading-none text-[#3D3025] sm:mt-4 sm:text-4xl" dir="ltr">
                  EGP {formatPrice(plan.monthlyFee)}
                </span>
                <span className="mt-2 block text-sm text-[#6F6254]">شهريا بعد {plan.trialDays} يوم تجربة مجانية</span>
                <span className="mt-5 grid gap-2 text-sm leading-7 text-[#5F554B]">
                  <span>نسبة مبيعات: {plan.commissionRate}%</span>
                  <span>{plan.bestFor}</span>
                </span>
              </button>
            ))}
          </div>
        </motion.div>
      </section>

      <section id="boutique-application" className="border-y border-[rgba(123,103,82,0.16)] bg-[#171513] px-3 py-7 text-[#F8F7F2] sm:px-6 sm:py-14 md:px-10">
        <div className="page-wrap grid gap-5 sm:gap-8 lg:grid-cols-[0.84fr_1.16fr] lg:items-start">
          <motion.aside initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="lg:sticky lg:top-24">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full border border-[#D8C08A]/28 bg-white/[0.06] text-[#D8C08A] sm:mb-5 sm:h-14 sm:w-14">
              <ClipboardList className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={1.35} />
            </div>
            <p className="text-xs uppercase tracking-[0.22em] text-[#D8C08A]" dir="ltr">PARTNER APPLICATION</p>
            <h2 className="mt-3 font-serif text-[clamp(2rem,9vw,5.8rem)] font-light leading-[0.95] tracking-[0.02em] sm:mt-4 sm:leading-[0.9] sm:tracking-[0.04em]">
              سجل بيانات البوتيك.
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-7 text-[#C9C5B8] sm:mt-5 sm:leading-8">
              اكتب اسم المحل، موقعه، نوع المنتجات، وعدد القطع المتوقع. الطلب هيتخزن للأدمن كـ pending application عشان يتم التواصل والمراجعة.
            </p>

            <div className="mt-5 grid gap-2.5 sm:mt-7 sm:gap-3">
              {[
                "استقبال الطلب ومراجعته",
                "تأكيد العمولة والاشتراك",
                "رفع المنتجات بعد الموافقة",
                "ظهور المنتجات في shop و product pages",
              ].map((step) => (
                <div key={step} className="flex items-center gap-3 rounded-[16px] border border-white/[0.10] bg-white/[0.04] p-3 sm:rounded-[20px]">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-[#D8C08A]" strokeWidth={1.4} />
                  <span className="text-sm text-[#E9E4D8]">{step}</span>
                </div>
              ))}
            </div>
          </motion.aside>

          <motion.form
            onSubmit={handleSubmit}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.12 }}
            variants={fadeUp}
            className="rounded-[22px] border border-white/[0.12] bg-[#FFF9EF] p-3 text-[#3D3025] shadow-[0_20px_58px_rgba(0,0,0,0.20)] sm:rounded-[30px] sm:p-6 sm:shadow-[0_32px_90px_rgba(0,0,0,0.24)]"
          >
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

            <div className="mt-4 sm:mt-5">
              <FieldLabel>نوع المنتجات</FieldLabel>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {CATEGORY_OPTIONS.map((category) => {
                  const active = form.categories.includes(category);
                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => toggleCategory(category)}
                      className={`min-h-[40px] rounded-full border px-3 text-[10px] tracking-[0.04em] transition sm:min-h-[44px] sm:px-4 sm:text-[11px] sm:tracking-[0.08em] ${
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
              <div className="mt-3 rounded-[16px] border border-[rgba(168,121,53,0.20)] bg-[rgba(168,121,53,0.08)] p-3 text-sm leading-6 text-[#5F554B] sm:rounded-[22px] sm:p-4 sm:leading-7">
                بعد التجربة: <span dir="ltr">EGP {formatPrice(selectedPlan.monthlyFee)}/month</span> + عمولة {selectedPlan.commissionRate}% على المبيعات.
              </div>
            </div>

            <div className="mt-4 rounded-[18px] border border-[rgba(123,103,82,0.16)] bg-white/54 p-3 sm:mt-5 sm:rounded-[24px] sm:p-4">
              <div className="mb-3 flex items-start gap-3 sm:mb-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#A87935]/20 bg-[#A87935]/10 text-[#A87935]">
                  <Landmark className="h-4 w-4" strokeWidth={1.35} />
                </span>
                <div>
                  <p className="eyebrow mb-2" dir="ltr">Payout Profile</p>
                  <p className="text-xs leading-6 text-[#6F6254] sm:text-sm sm:leading-7">
                    هنحتاج بيانات تحويل آمنة عشان يتم صرف أرباح البوتيك بعد تسليم الطلب. لا نطلب رقم فيزا، CVV، أو تاريخ انتهاء كارت.
                  </p>
                </div>
              </div>

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

            <div className="mt-4 grid gap-3 sm:mt-5 sm:gap-4 md:grid-cols-2">
              <label>
                <FieldLabel>أمثلة منتجات وأسعار</FieldLabel>
                <textarea value={form.sampleProducts} onChange={(event) => update("sampleProducts", event.target.value)} placeholder="Jacket 1500 EGP, Pants 1200 EGP..." />
              </label>
              <label>
                <FieldLabel>ملاحظات إضافية</FieldLabel>
                <textarea value={form.notes} onChange={(event) => update("notes", event.target.value)} placeholder="مواعيد الاستلام، سياسة الاستبدال، طريقة تجهيز الطلبات..." />
              </label>
            </div>

            <div className="mt-5 flex flex-col gap-3 border-t border-[rgba(123,103,82,0.16)] pt-4 sm:mt-6 sm:flex-row sm:flex-row-reverse sm:items-center sm:justify-between sm:pt-5">
              <button type="submit" disabled={submitting} className="btn-gold justify-center">
                {submitting ? "جاري الإرسال" : "إرسال طلب الشراكة ورفع المنتجات"}
              </button>
              <span className="inline-flex items-center gap-2 text-sm text-[#6F6254]">
                <MapPin className="h-4 w-4 text-[#A87935]" strokeWidth={1.35} />
                مناسب للبوتيكات داخل مصر
              </span>
            </div>

            <AnimatePresence>
              {result ? (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mt-5 rounded-[24px] border border-[rgba(80,150,100,0.24)] bg-[rgba(80,150,100,0.10)] p-4 text-sm leading-7 text-[#365A3E]"
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
