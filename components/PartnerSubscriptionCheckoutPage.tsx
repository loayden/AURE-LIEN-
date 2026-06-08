"use client";

import { showToast } from "@/components/ToastProvider";
import { formatPrice } from "@/lib/commerce";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Building2, CheckCircle2, CreditCard, MapPin, ShieldCheck, Store } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";

const PLAN_OPTIONS = [
  {
    id: "starter",
    name: "Starter Boutique",
    monthlyFee: 1500,
    commissionRate: 10,
    copy: "Continue the Starter plan monthly after the first 7-day trial ends.",
  },
  {
    id: "growth",
    name: "Growth Boutique",
    monthlyFee: 2500,
    commissionRate: 7,
    copy: "For boutiques with steady stock, weekly uploads, and a lower sales commission.",
  },
  {
    id: "signature",
    name: "Signature Boutique",
    monthlyFee: 4500,
    commissionRate: 5,
    copy: "For premium boutiques that need priority placement and curated review.",
  },
] as const;

type CheckoutForm = {
  boutiqueName: string;
  ownerName: string;
  phone: string;
  email: string;
  city: string;
  area: string;
  streetAddress: string;
  googleMapsUrl: string;
  noPhysicalShop: boolean;
};

type PartnerApplicationSummary = CheckoutForm & {
  _id: string;
  boutiqueName: string;
  ownerName: string;
  phone: string;
  email: string;
  planName: string;
  status: string;
};

const initialForm: CheckoutForm = {
  boutiqueName: "",
  ownerName: "",
  phone: "",
  email: "",
  city: "Cairo",
  area: "",
  streetAddress: "",
  googleMapsUrl: "",
  noPhysicalShop: false,
};

const easeOut = [0.22, 1, 0.36, 1] as const;

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-1.5 block text-[9px] uppercase tracking-[0.16em] text-[#7A581F] sm:mb-2 sm:text-[10px] sm:tracking-[0.18em]">
      {children}
    </span>
  );
}

export default function PartnerSubscriptionCheckoutPage() {
  const searchParams = useSearchParams();
  const requestedPlan = searchParams.get("plan");
  const sourceApplicationId = searchParams.get("applicationId") || "";
  const selectedPlan = useMemo(
    () => PLAN_OPTIONS.find((plan) => plan.id === requestedPlan) ?? PLAN_OPTIONS[0],
    [requestedPlan]
  );
  const [form, setForm] = useState<CheckoutForm>(initialForm);
  const [sourceApplication, setSourceApplication] = useState<PartnerApplicationSummary | null>(null);
  const [draftId, setDraftId] = useState("");
  const [draftLoaded, setDraftLoaded] = useState(false);
  const [draftSaving, setDraftSaving] = useState(false);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");
  const [draftSavedAt, setDraftSavedAt] = useState("");
  const [edited, setEdited] = useState(false);
  const draftSignatureRef = useRef("");

  function update<K extends keyof CheckoutForm>(key: K, value: CheckoutForm[K]) {
    setEdited(true);
    setForm((current) => ({ ...current, [key]: value }));
  }

  const getDraftPayload = useCallback((nextForm = form) => {
    return {
      _id: draftId || undefined,
      ...nextForm,
      streetAddress: nextForm.noPhysicalShop ? "" : nextForm.streetAddress,
      planId: selectedPlan.id,
      subscriptionFlow: "paid",
      productCount: 0,
      categories: [],
    };
  }, [draftId, form, selectedPlan.id]);

  const getDraftSignature = useCallback((nextForm = form) => {
    return JSON.stringify({ ...getDraftPayload(nextForm), _id: undefined });
  }, [form, getDraftPayload]);

  function validateForm() {
    if (!form.boutiqueName.trim()) return "Boutique name is required.";
    if (!form.ownerName.trim()) return "Owner name is required.";
    if (!form.phone.trim()) return "Phone number is required.";
    if (!form.email.trim()) return "Business email is required.";
    if (!form.noPhysicalShop) {
      if (!form.city.trim()) return "City is required.";
      if (!form.area.trim()) return "Area is required.";
      if (!form.streetAddress.trim()) return "Shop address is required.";
    }
    return "";
  }

  const saveDraft = useCallback(
    async (options: { force?: boolean } = {}) => {
      const signature = getDraftSignature();
      if (!options.force && signature === draftSignatureRef.current) return null;
      setDraftSaving(true);
      setError("");
      try {
        const response = await fetch("/api/boutiques/draft", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(getDraftPayload()),
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data?.error || "Failed to save checkout draft");
        if (data?.draft?._id) setDraftId(data.draft._id);
        draftSignatureRef.current = signature;
        setDraftSavedAt(new Date().toISOString());
        return data?.draft ?? null;
      } catch (requestError) {
        const message = requestError instanceof Error ? requestError.message : "Failed to save checkout draft";
        setError(message);
        return null;
      } finally {
        setDraftSaving(false);
      }
    },
    [getDraftPayload, getDraftSignature]
  );

  async function startSubscription(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      showToast(validationError, "error");
      return;
    }

    setPaying(true);
    setError("");
    try {
      const draft = sourceApplicationId ? null : await saveDraft({ force: true });
      const applicationId = sourceApplicationId || draft?._id || draftId;
      if (!applicationId) throw new Error("Unable to prepare partner checkout draft.");

      const response = await fetch("/api/paymob/partner-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId,
          planId: selectedPlan.id,
          ...form,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        const missing = Array.isArray(data?.missing) ? ` Missing: ${data.missing.join(", ")}` : "";
        throw new Error(`${data?.error || "Unable to start Paymob checkout."}${missing}`);
      }
      if (!data?.redirectUrl) throw new Error("Paymob did not return a checkout link.");
      window.location.href = data.redirectUrl;
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : "Unable to start Paymob checkout.";
      setError(message);
      showToast(message, "error");
    } finally {
      setPaying(false);
    }
  }

  useEffect(() => {
    let canceled = false;

    async function loadDraft() {
      try {
        if (sourceApplicationId) {
          const response = await fetch("/api/partners/applications", { cache: "no-store" });
          const data = await response.json().catch(() => ({}));
          if (!response.ok) throw new Error(data?.error || "Failed to load boutique application");
          if (canceled) return;
          const application = Array.isArray(data.applications)
            ? data.applications.find((item: PartnerApplicationSummary) => item._id === sourceApplicationId)
            : null;
          if (!application) throw new Error("Boutique application was not found.");
          const nextForm: CheckoutForm = {
            boutiqueName: String(application.boutiqueName ?? ""),
            ownerName: String(application.ownerName ?? ""),
            phone: String(application.phone ?? ""),
            email: String(application.email ?? ""),
            city: String(application.city ?? initialForm.city) || initialForm.city,
            area: String(application.area ?? ""),
            streetAddress: String(application.streetAddress ?? ""),
            googleMapsUrl: String(application.googleMapsUrl ?? ""),
            noPhysicalShop: Boolean(application.noPhysicalShop),
          };
          setSourceApplication(application);
          setForm(nextForm);
          setDraftId(application._id);
          draftSignatureRef.current = JSON.stringify({
            ...getDraftPayload(nextForm),
            _id: undefined,
          });
          return;
        }

        const response = await fetch(`/api/boutiques/draft?planId=${selectedPlan.id}`, { cache: "no-store" });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data?.error || "Failed to load checkout draft");
        if (canceled) return;
        const draft = data?.draft;
        if (draft?._id) {
          const nextForm: CheckoutForm = {
            boutiqueName: String(draft.boutiqueName ?? ""),
            ownerName: String(draft.ownerName ?? ""),
            phone: String(draft.phone ?? ""),
            email: String(draft.email ?? ""),
            city: String(draft.city ?? initialForm.city) || initialForm.city,
            area: String(draft.area ?? ""),
            streetAddress: String(draft.streetAddress ?? ""),
            googleMapsUrl: String(draft.googleMapsUrl ?? ""),
            noPhysicalShop: Boolean(draft.noPhysicalShop),
          };
          setForm(nextForm);
          setDraftId(draft._id);
          setEdited(true);
          draftSignatureRef.current = JSON.stringify({
            ...getDraftPayload(nextForm),
            _id: undefined,
          });
        }
      } catch (requestError) {
        if (!canceled) setError(requestError instanceof Error ? requestError.message : "Failed to load checkout draft");
      } finally {
        if (!canceled) setDraftLoaded(true);
      }
    }

    setDraftId("");
    setDraftSavedAt("");
    draftSignatureRef.current = "";
    void loadDraft();
    return () => {
      canceled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPlan.id, sourceApplicationId]);

  useEffect(() => {
    if (!draftLoaded || !edited || paying) return;
    const signature = getDraftSignature();
    if (signature === draftSignatureRef.current) return;
    const timer = window.setTimeout(() => {
      void saveDraft();
    }, 900);
    return () => window.clearTimeout(timer);
  }, [draftLoaded, edited, form, getDraftSignature, paying, saveDraft]);

  const loginHref = `/login?redirect=${encodeURIComponent(`/partners/checkout?plan=${selectedPlan.id}${sourceApplicationId ? `&applicationId=${sourceApplicationId}` : ""}`)}`;
  const requiresLogin = /sign in/i.test(error);
  const changePlanHref = sourceApplicationId
    ? `/partners/subscription?applicationId=${encodeURIComponent(sourceApplicationId)}`
    : "/boutiques#partner-plans";

  return (
    <main
      dir="rtl"
      className="liquid-page mobile-comfort min-h-screen overflow-hidden px-3 pb-[calc(7.5rem+env(safe-area-inset-bottom))] pt-16 text-[#3D3025] sm:px-6 sm:pb-24 sm:pt-24 md:px-10"
      style={{ fontFamily: "Tahoma, Arial, var(--font-jost), sans-serif" }}
    >
      <div className="page-wrap max-w-6xl">
        <section className="grid gap-4 lg:grid-cols-[0.88fr_1.12fr] lg:items-start">
          <motion.aside
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.44, ease: easeOut }}
            className="glass-panel p-4 sm:p-6 lg:sticky lg:top-24"
          >
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-[1rem] border border-[#A87935]/22 bg-[#A87935]/10 text-[#A87935]">
              <CreditCard className="h-5 w-5" strokeWidth={1.35} />
            </div>
            <p className="eyebrow mb-3" dir="ltr">PARTNER CHECKOUT</p>
            <h1 className="title-display text-[2.5rem] leading-[0.94] sm:text-[4.4rem]" dir="ltr">
              Subscribe to {selectedPlan.name}.
            </h1>
            <p className="mt-4 text-sm leading-7 text-[#6F6254] sm:text-base sm:leading-8">
              ادخل بيانات البوتيك وعنوان النشاط قبل الدفع. لو لسه معندكش محل فعلي، كمل بدون عنوان وسيتم حفظ الحالة للأدمن.
            </p>

            <div className="mt-5 rounded-[18px] border border-[rgba(168,121,53,0.22)] bg-[rgba(168,121,53,0.08)] p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="eyebrow mb-2" dir="ltr">Selected Plan</p>
                  <p className="font-serif text-3xl leading-none text-[#3D3025]" dir="ltr">{selectedPlan.name}</p>
                </div>
                <span className="rounded-full bg-[#171513] px-3 py-1.5 text-[8px] uppercase tracking-[0.16em] text-[#FFF9EF]" dir="ltr">
                  No trial
                </span>
              </div>
              <p className="mt-3 font-serif text-[2.4rem] leading-none text-[#3D3025]" dir="ltr">
                EGP {formatPrice(selectedPlan.monthlyFee)}
              </p>
              <p className="mt-2 text-sm leading-7 text-[#6F6254]">
                {selectedPlan.copy} Commission: {selectedPlan.commissionRate}%.
              </p>
            </div>

            <div className="mt-4 grid gap-2">
              {["No card data stored by BOUT", "Shop address can be added later", "Draft saves automatically"].map((item) => (
                <div key={item} className="flex items-center gap-2 text-xs leading-5 text-[#6F6254]">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-[#A87935]" strokeWidth={1.4} />
                  <span dir="ltr">{item}</span>
                </div>
              ))}
            </div>
          </motion.aside>

          <motion.form
            onSubmit={startSubscription}
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.44, delay: 0.04, ease: easeOut }}
            className="glass-panel p-4 sm:p-6"
          >
            <div className="mb-4 flex flex-col gap-3 border-b border-[rgba(123,103,82,0.14)] pb-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="eyebrow mb-2" dir="ltr">BUSINESS DETAILS</p>
                <h2 className="title-display text-[2rem] leading-none sm:text-[2.7rem]">بيانات الاشتراك</h2>
              </div>
              <Link href={changePlanHref} className="btn-ghost justify-center">
                تغيير الباقة
              </Link>
            </div>

            <div
              className={`mb-4 rounded-[14px] border px-3 py-2 text-[0.72rem] leading-5 sm:text-xs ${
                error
                  ? "border-[#9A2222]/22 bg-[#9A2222]/[0.06] text-[#9A2222]"
                  : "border-[rgba(123,103,82,0.12)] bg-white/48 text-[#6F6254]"
              }`}
              aria-live="polite"
            >
              {error ? (
                <span>
                  {error}
                  {requiresLogin ? (
                    <>
                      {" "}
                      <Link href={loginHref} className="font-medium text-[#7A581F] underline underline-offset-4">
                        Sign in to continue.
                      </Link>
                    </>
                  ) : null}
                </span>
              ) : sourceApplication ? (
                `Using saved boutique application: ${sourceApplication.boutiqueName}. Address updates apply when payment starts.`
              ) : draftSaving ? (
                "Saving checkout draft..."
              ) : draftId ? (
                `Checkout draft saved${draftSavedAt ? ` at ${new Date(draftSavedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : ""}.`
              ) : (
                "Your plan selection and address will save as a draft before payment."
              )}
            </div>

            <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
              <label>
                <FieldLabel>اسم البوتيك</FieldLabel>
                <input required value={form.boutiqueName} onChange={(event) => update("boutiqueName", event.target.value)} placeholder="Cairo Mode Boutique" />
              </label>
              <label>
                <FieldLabel>اسم المسؤول</FieldLabel>
                <input required value={form.ownerName} onChange={(event) => update("ownerName", event.target.value)} placeholder="Owner or manager name" />
              </label>
              <label>
                <FieldLabel>رقم واتساب</FieldLabel>
                <input required inputMode="tel" value={form.phone} onChange={(event) => update("phone", event.target.value)} placeholder="+20 10..." dir="ltr" />
              </label>
              <label>
                <FieldLabel>Business email</FieldLabel>
                <input required type="email" value={form.email} onChange={(event) => update("email", event.target.value)} placeholder="store@example.com" dir="ltr" />
              </label>
            </div>

            <div className="mt-5 rounded-[18px] border border-[rgba(123,103,82,0.14)] bg-white/42 p-3 sm:p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#A87935]/20 bg-[#A87935]/10 text-[#A87935]">
                    {form.noPhysicalShop ? <Building2 className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}
                  </span>
                  <div>
                    <p className="eyebrow mb-1" dir="ltr">SHOP ADDRESS</p>
                    <p className="text-xs leading-5 text-[#6F6254]">
                      {form.noPhysicalShop
                        ? "مفيش محل فعلي حاليا. هنحفظ ده في بيانات الشريك."
                        : "اكتب عنوان المحل أو اضغط الزر لو لسه مفيش محل."}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const nextNoShop = !form.noPhysicalShop;
                    setEdited(true);
                    setForm((current) => ({
                      ...current,
                      noPhysicalShop: nextNoShop,
                      streetAddress: nextNoShop ? "" : current.streetAddress,
                    }));
                  }}
                  className={form.noPhysicalShop ? "btn-gold justify-center" : "btn-ghost justify-center"}
                >
                  {form.noPhysicalShop ? "Add Shop Address" : "I Don't Have a Shop Yet"}
                </button>
              </div>

              <AnimatePresence mode="popLayout">
                {!form.noPhysicalShop ? (
                  <motion.div
                    key="address-fields"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="mt-4 grid gap-3 sm:grid-cols-2 sm:gap-4"
                  >
                    <label>
                      <FieldLabel>المحافظة</FieldLabel>
                      <input required value={form.city} onChange={(event) => update("city", event.target.value)} placeholder="Cairo" />
                    </label>
                    <label>
                      <FieldLabel>المنطقة</FieldLabel>
                      <input required value={form.area} onChange={(event) => update("area", event.target.value)} placeholder="Zamalek, Maadi..." />
                    </label>
                    <label className="sm:col-span-2">
                      <FieldLabel>عنوان المحل</FieldLabel>
                      <input required value={form.streetAddress} onChange={(event) => update("streetAddress", event.target.value)} placeholder="Street, mall, building, floor" />
                    </label>
                    <label className="sm:col-span-2">
                      <FieldLabel>Google Maps optional</FieldLabel>
                      <input value={form.googleMapsUrl} onChange={(event) => update("googleMapsUrl", event.target.value)} placeholder="maps.google.com/..." dir="ltr" />
                    </label>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>

            <div className="mt-5 grid gap-2 border-t border-[rgba(123,103,82,0.14)] pt-4 sm:grid-cols-[1fr_auto] sm:items-center">
              <p className="text-xs leading-6 text-[#6F6254]">
                Payment opens through Paymob. BOUT stores only the application, plan, and shop status.
              </p>
              <button type="submit" disabled={draftSaving || paying} className="btn-gold justify-center">
                {paying ? "Opening Paymob" : draftSaving ? "Saving Draft" : "Subscribe"}
                <ArrowRight className="h-4 w-4" strokeWidth={1.35} />
              </button>
            </div>
          </motion.form>
        </section>

        <section className="mt-4 grid gap-2 sm:mt-6 sm:grid-cols-3">
          {[
            { icon: Store, title: "Application draft", copy: "Saved before payment so the partner can resume later." },
            { icon: ShieldCheck, title: "Secure payment", copy: "Card details stay inside Paymob checkout." },
            { icon: Building2, title: "No shop option", copy: "Partners can continue without a physical store address." },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="glass-panel p-3 sm:p-4">
                <Icon className="mb-2 h-4 w-4 text-[#A87935]" strokeWidth={1.35} />
                <h3 className="font-serif text-xl leading-none text-[#3D3025]">{item.title}</h3>
                <p className="mt-2 text-xs leading-5 text-[#6F6254]">{item.copy}</p>
              </div>
            );
          })}
        </section>
      </div>
    </main>
  );
}
