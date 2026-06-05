"use client";

import { showToast } from "@/components/ToastProvider";
import { formatPrice } from "@/lib/commerce";
import type { PartnerProductDraft } from "@/lib/partnerProducts";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Banknote,
  CheckCircle2,
  CreditCard,
  ImagePlus,
  Landmark,
  PackageCheck,
  RefreshCw,
  ShieldCheck,
  Smartphone,
  Store,
  UploadCloud,
  Wallet,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react";

const CATEGORY_OPTIONS = [
  "jackets-coats",
  "shirts",
  "pants-denim",
  "sneakers",
  "boots",
  "loafers",
  "bags-wallets",
  "sunglasses",
  "belts",
] as const;

const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);

const initialForm = {
  name: "",
  category: "jackets-coats",
  price: "",
  description: "",
  material: "",
  size: "",
  colors: "",
  stock: "",
  imageUrl: "",
};

type FormState = typeof initialForm;

type PayoutMethod = "bank_account" | "mobile_wallet" | "paymob_merchant";

type PayoutFormState = {
  method: PayoutMethod;
  accountHolderName: string;
  bankName: string;
  iban: string;
  mobileWalletPhone: string;
  paymobMerchantId: string;
  taxId: string;
};

type PartnerWalletData = {
  application: {
    _id: string;
    boutiqueName: string;
    ownerName: string;
    phone: string;
    planName: string;
    commissionRate: number;
    monthlyFee: number;
    trialDays: number;
  };
  payoutProfile?: Partial<PayoutFormState> & { status?: string };
  payoutPreview: {
    method: string;
    destination: string;
    status: "missing" | "incomplete" | "complete";
  };
  summary: {
    orders: number;
    items: number;
    grossSales: number;
    pending: number;
    available: number;
    paid: number;
    commission: number;
    refunds: number;
    paymentFees: number;
    payoutProfileStatus: "missing" | "incomplete" | "complete";
  };
  lines: Array<{
    orderId: string;
    createdAt: string;
    status: string;
    paymentStatus: string;
    paymentMethod: string;
    payoutStatus: "pending" | "available" | "paid";
    productName: string;
    quantity: number;
    size?: string | null;
    color?: string | null;
    grossAmount: number;
    commissionAmount: number;
    estimatedPayout: number;
    customer: {
      name: string;
      phone: string;
      city: string;
      address: string;
    };
  }>;
};

const initialPayoutForm: PayoutFormState = {
  method: "mobile_wallet",
  accountHolderName: "",
  bankName: "",
  iban: "",
  mobileWalletPhone: "",
  paymobMerchantId: "",
  taxId: "",
};

function cleanList(value: string): string[] {
  return value.split(",").map((entry) => entry.trim()).filter(Boolean);
}

function statusCopy(status: PartnerProductDraft["status"]) {
  if (status === "approved") return "Approved and live in shop";
  if (status === "rejected") return "Rejected by admin review";
  return "Waiting for admin review";
}

function payoutStatusCopy(status?: string) {
  if (status === "complete") return "Ready for review";
  if (status === "incomplete") return "Needs payout details";
  return "Add payout details";
}

export default function PartnerProductsPage() {
  const searchParams = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [applicationId, setApplicationId] = useState(searchParams.get("applicationId") || "");
  const [form, setForm] = useState<FormState>(initialForm);
  const [payoutForm, setPayoutForm] = useState<PayoutFormState>(initialPayoutForm);
  const [products, setProducts] = useState<PartnerProductDraft[]>([]);
  const [wallet, setWallet] = useState<PartnerWalletData | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [walletLoading, setWalletLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [paying, setPaying] = useState(false);
  const [savingPayout, setSavingPayout] = useState(false);
  const [error, setError] = useState("");
  const [walletError, setWalletError] = useState("");

  const pendingCount = useMemo(
    () => products.filter((product) => product.status === "pending").length,
    [products]
  );

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function updatePayout<K extends keyof PayoutFormState>(key: K, value: PayoutFormState[K]) {
    setPayoutForm((current) => ({ ...current, [key]: value }));
  }

  function syncPayoutForm(nextWallet: PartnerWalletData) {
    const profile = nextWallet.payoutProfile;
    setPayoutForm({
      method: (profile?.method as PayoutMethod | undefined) ?? "mobile_wallet",
      accountHolderName: String(profile?.accountHolderName ?? ""),
      bankName: String(profile?.bankName ?? ""),
      iban: String(profile?.iban ?? ""),
      mobileWalletPhone: String(profile?.mobileWalletPhone ?? ""),
      paymobMerchantId: String(profile?.paymobMerchantId ?? ""),
      taxId: String(profile?.taxId ?? ""),
    });
  }

  function resetFileInput() {
    setFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleFileSelection(event: ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(event.target.files ?? []);
    if (!selectedFiles.length) {
      setFiles([]);
      return;
    }

    const validFiles = selectedFiles.filter((selectedFile) => (
      ACCEPTED_IMAGE_TYPES.has(selectedFile.type) && selectedFile.size <= MAX_UPLOAD_BYTES
    ));

    if (validFiles.length !== selectedFiles.length) {
      showToast("Use JPG, PNG, WebP, or AVIF images under 8 MB each.", "error");
    }

    setFiles(validFiles);
    if (!validFiles.length && fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function loadProducts(id = applicationId) {
    if (!id.trim()) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/partners/products?applicationId=${encodeURIComponent(id.trim())}`, {
        cache: "no-store",
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data?.error || "Unable to load submitted products");
      setProducts(Array.isArray(data.products) ? data.products : []);
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : "Unable to load submitted products";
      setError(message);
      showToast(message, "error");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  async function loadWallet(id = applicationId) {
    if (!id.trim()) return;
    setWalletLoading(true);
    setWalletError("");
    try {
      const response = await fetch(`/api/partners/wallet?applicationId=${encodeURIComponent(id.trim())}`, {
        cache: "no-store",
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data?.error || "Unable to load partner wallet");
      if (data?.wallet) {
        setWallet(data.wallet);
        syncPayoutForm(data.wallet);
      }
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : "Unable to load partner wallet";
      setWallet(null);
      setWalletError(message);
    } finally {
      setWalletLoading(false);
    }
  }

  useEffect(() => {
    const id = searchParams.get("applicationId") || "";
    setApplicationId(id);
    if (id) {
      void loadProducts(id);
      void loadWallet(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  async function savePayoutProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const id = applicationId.trim();
    if (!id) {
      showToast("Application id is required before saving payout details.", "error");
      return;
    }

    setSavingPayout(true);
    setWalletError("");
    try {
      const response = await fetch("/api/partners/payout-profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId: id,
          ...payoutForm,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data?.error || "Unable to save payout profile");
      showToast("Payout profile saved for admin review.", "success");
      await loadWallet(id);
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : "Unable to save payout profile";
      setWalletError(message);
      showToast(message, "error");
    } finally {
      setSavingPayout(false);
    }
  }

  async function uploadSelectedImages(id: string) {
    setUploading(true);
    setError("");
    try {
      const uploadedUrls: string[] = [];

      for (const selectedFile of files) {
        const payload = new FormData();
        payload.set("applicationId", id);
        payload.set("file", selectedFile);
        const response = await fetch("/api/partners/upload", {
          method: "POST",
          body: payload,
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok || !data?.url) throw new Error(data?.error || "Upload failed");
        uploadedUrls.push(data.url);
      }

      setImages((current) => Array.from(new Set([...current, ...uploadedUrls])));
      resetFileInput();
      return uploadedUrls;
    } finally {
      setUploading(false);
    }
  }

  async function uploadImage() {
    const id = applicationId.trim();
    if (!id) {
      showToast("Application id is required before uploading images.", "error");
      return;
    }
    if (!files.length) {
      showToast("Choose an image first.", "error");
      return;
    }

    try {
      const uploadedUrls = await uploadSelectedImages(id);
      showToast(`${uploadedUrls.length} image${uploadedUrls.length === 1 ? "" : "s"} uploaded.`, "success");
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : "Upload failed";
      setError(message);
      showToast(message, "error");
    }
  }

  async function submitProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const id = applicationId.trim();
    if (!id) {
      showToast("Paste the application id first.", "error");
      return;
    }

    let uploadedUrls: string[] = [];
    if (files.length) {
      try {
        uploadedUrls = await uploadSelectedImages(id);
      } catch (requestError) {
        const message = requestError instanceof Error ? requestError.message : "Upload failed";
        setError(message);
        showToast(message, "error");
        return;
      }
    }

    const nextImages = Array.from(new Set([...images, ...uploadedUrls, form.imageUrl.trim()].filter(Boolean)));
    if (!nextImages.length) {
      showToast("Add at least one product image.", "error");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      const response = await fetch("/api/partners/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId: id,
          name: form.name,
          category: form.category,
          price: Number(form.price) || 0,
          description: form.description,
          material: form.material,
          images: nextImages,
          size: cleanList(form.size),
          colors: cleanList(form.colors),
          stock: form.stock ? Number(form.stock) : undefined,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data?.error || "Unable to submit product");
      setForm(initialForm);
      setImages([]);
      resetFileInput();
      setProducts((current) => data?.product ? [data.product, ...current] : current);
      showToast("Product sent to admin review.", "success");
      void loadWallet(id);
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : "Unable to submit product";
      setError(message);
      showToast(message, "error");
    } finally {
      setSubmitting(false);
    }
  }

  async function startPaymobPayment() {
    const id = applicationId.trim();
    if (!id) {
      showToast("Application id is required before payment.", "error");
      return;
    }

    setPaying(true);
    setError("");
    try {
      const response = await fetch("/api/paymob/partner-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId: id }),
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

  return (
    <main
      dir="rtl"
      className="liquid-page mobile-comfort overflow-hidden px-3 pb-[calc(7.25rem+env(safe-area-inset-bottom))] pt-16 text-[#3D3025] sm:px-6 sm:pb-24 sm:pt-28 md:px-10"
      style={{ fontFamily: "Tahoma, Arial, var(--font-jost), sans-serif" }}
    >
      <div className="page-wrap max-w-6xl">
        <section className="mb-5 grid gap-4 sm:mb-7 sm:gap-5 lg:grid-cols-[1fr_22rem] lg:items-end">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-4 sm:p-7">
            <p className="eyebrow mb-3 sm:mb-4" dir="ltr">PARTNER PRODUCT INTAKE</p>
            <h1 className="title-display text-[clamp(2.6rem,6vw,5.7rem)] leading-[0.92]" dir="ltr">
              Boutique Product Desk
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-[#6F6254] sm:mt-5 sm:text-base sm:leading-8">
              ارفع منتجات البوتيك للمراجعة. كل منتج يفضل صورة واضحة، سعر بالجنيه المصري، المقاسات، الألوان، ووصف مختصر. المنتج لا يظهر في المتجر إلا بعد موافقة الأدمن.
            </p>
          </motion.div>

          <motion.aside initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="dark-panel p-4 sm:p-6">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-[0.9rem] border border-[#A87935]/20 bg-[#A87935]/10 text-[#A87935] sm:mb-5 sm:h-12 sm:w-12 sm:rounded-[1rem]">
              <ShieldCheck className="h-5 w-5" strokeWidth={1.35} />
            </div>
            <p className="eyebrow mb-3">Review First</p>
            <p className="body-copy">
              المنتجات الجديدة تدخل pending review. الموافقة تنشر المنتج في Shop و Product Page بنفس نظام الكتالوج الحالي.
            </p>
          </motion.aside>
        </section>

        {error ? (
          <div className="mb-5 rounded-2xl border border-[#9A2222]/22 bg-[#9A2222]/[0.06] px-4 py-3 text-[10px] uppercase tracking-[0.2em] text-[#9A2222]">
            {error}
          </div>
        ) : null}

        <section className="mb-5 grid grid-cols-2 gap-2 sm:mb-7 sm:gap-4 md:grid-cols-4">
          {[
            { label: "Application", value: applicationId ? "Connected" : "Missing", copy: applicationId || "Submit boutique form first" },
            { label: "Pending", value: String(pendingCount), copy: "Waiting for admin review" },
            {
              label: "Available",
              value: wallet ? `EGP ${formatPrice(wallet.summary.available)}` : "EGP 0",
              copy: "Ready after paid or delivered orders",
            },
            {
              label: "Payout",
              value: wallet ? payoutStatusCopy(wallet.summary.payoutProfileStatus) : "Secure",
              copy: wallet?.payoutPreview.destination || "No card numbers stored",
            },
          ].map((item) => (
            <div key={item.label} className="glass-panel p-3 sm:p-5">
              <p className="eyebrow mb-2 sm:mb-3">{item.label}</p>
              <p className="title-display text-[clamp(1.55rem,3vw,2rem)] leading-none">{item.value}</p>
              <p className="mt-2 break-words text-[11px] leading-5 text-[#6F6254] sm:mt-3 sm:text-xs sm:leading-6" dir="ltr">{item.copy}</p>
            </div>
          ))}
        </section>

        <div className="grid gap-5 sm:gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.85fr)]">
          <section className="glass-panel p-4 sm:p-7">
            <div className="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
              <div>
                <p className="eyebrow mb-3">Application ID</p>
                <h2 className="title-display text-[1.85rem] leading-none sm:text-[2.25rem]">اربط المنتجات بالطلب</h2>
              </div>
              <Link href="/boutiques#boutique-application" className="btn-ghost justify-center">
                طلب شراكة جديد
                <ArrowRight className="h-4 w-4 rotate-180" />
              </Link>
            </div>

            <div className="mb-5 grid gap-2 sm:mb-7 sm:grid-cols-[1fr_auto] sm:gap-3">
              <input
                value={applicationId}
                onChange={(event) => setApplicationId(event.target.value)}
                placeholder="boutique-..."
                dir="ltr"
                aria-label="Boutique application id"
              />
              <button
                type="button"
                onClick={() => {
                  void loadProducts();
                  void loadWallet();
                }}
                disabled={loading || walletLoading || !applicationId.trim()}
                className="btn-gold justify-center"
              >
                <RefreshCw className="h-4 w-4" />
                {loading || walletLoading ? "Loading" : "Load"}
              </button>
            </div>

            <form onSubmit={submitProduct} className="space-y-4 sm:space-y-5">
              <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
                <label>
                  <span className="eyebrow mb-3 block">اسم المنتج</span>
                  <input required value={form.name} onChange={(event) => update("name", event.target.value)} placeholder="Premium summer jacket" />
                </label>
                <label>
                  <span className="eyebrow mb-3 block">القسم</span>
                  <select value={form.category} onChange={(event) => update("category", event.target.value)} className="luxury-select">
                    {CATEGORY_OPTIONS.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  <span className="eyebrow mb-3 block">السعر بالجنيه</span>
                  <input required type="number" min="1" inputMode="numeric" value={form.price} onChange={(event) => update("price", event.target.value)} placeholder="1500" />
                </label>
                <label>
                  <span className="eyebrow mb-3 block">الكمية</span>
                  <input type="number" min="0" inputMode="numeric" value={form.stock} onChange={(event) => update("stock", event.target.value)} placeholder="12" />
                </label>
                <label>
                  <span className="eyebrow mb-3 block">المقاسات</span>
                  <input value={form.size} onChange={(event) => update("size", event.target.value)} placeholder="S, M, L, XL" dir="ltr" />
                </label>
                <label>
                  <span className="eyebrow mb-3 block">الألوان</span>
                  <input value={form.colors} onChange={(event) => update("colors", event.target.value)} placeholder="black, cream" dir="ltr" />
                </label>
                <label className="sm:col-span-2">
                  <span className="eyebrow mb-3 block">الخامة</span>
                  <input value={form.material} onChange={(event) => update("material", event.target.value)} placeholder="Cotton denim, leather, linen..." />
                </label>
                <label className="sm:col-span-2">
                  <span className="eyebrow mb-3 block">الوصف</span>
                  <textarea value={form.description} onChange={(event) => update("description", event.target.value)} placeholder="وصف واضح يساعد العميل يفهم القصة، الخامة، والمناسبة." />
                </label>
              </div>

              <div className="rounded-[18px] border border-[rgba(123,103,82,0.16)] bg-white/38 p-3 sm:rounded-[24px] sm:p-4">
                <div className="mb-3 flex items-center gap-3 sm:mb-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#A87935]/20 bg-[#A87935]/10 text-[#A87935] sm:h-10 sm:w-10">
                    <ImagePlus className="h-4 w-4" strokeWidth={1.35} />
                  </span>
                  <div>
                    <p className="eyebrow mb-1">Product Images</p>
                    <p className="text-xs leading-5 text-[#6F6254]">ارفع صورة أو أضف رابط صورة. أول صورة تصبح صورة المنتج الرئيسية.</p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
                  <label
                    htmlFor="partner-product-images"
                    className="group flex min-h-[6.5rem] cursor-pointer flex-col items-center justify-center rounded-[16px] border border-dashed border-[rgba(168,121,53,0.32)] bg-[#FFF9EF]/70 px-3 py-4 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.70)] transition hover:border-[rgba(168,121,53,0.56)] hover:bg-[#FFF9EF] sm:min-h-[8rem] sm:rounded-[18px] sm:px-4 sm:py-5"
                  >
                    <input
                      ref={fileInputRef}
                      id="partner-product-images"
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/avif"
                      multiple
                      onChange={handleFileSelection}
                      disabled={uploading || submitting}
                      className="sr-only"
                    />
                    <span className="mb-2 flex h-10 w-10 items-center justify-center rounded-full border border-[#A87935]/22 bg-white/78 text-[#A87935] transition group-hover:scale-105 sm:mb-3 sm:h-11 sm:w-11">
                      <UploadCloud className="h-5 w-5" strokeWidth={1.35} />
                    </span>
                    <span className="text-[0.7rem] uppercase tracking-[0.24em] text-[#7A581F]">
                      {files.length ? `${files.length} image${files.length === 1 ? "" : "s"} selected` : "Choose images from device"}
                    </span>
                    <span className="mt-2 text-xs leading-5 text-[#6F6254]">
                      JPG, PNG, WebP, or AVIF. Max 8 MB each.
                    </span>
                  </label>

                  <button
                    type="button"
                    onClick={uploadImage}
                    disabled={uploading || !files.length || !applicationId.trim()}
                    className="btn-ghost min-h-[3rem] justify-center !rounded-[16px] sm:min-h-[8rem] sm:!rounded-[18px]"
                  >
                    <UploadCloud className="h-4 w-4" />
                    {uploading ? "Uploading" : "Upload selected"}
                  </button>
                </div>

                {files.length ? (
                  <div className="mt-3 flex flex-wrap gap-2" aria-live="polite">
                    {files.map((selectedFile) => (
                      <span
                        key={`${selectedFile.name}-${selectedFile.size}-${selectedFile.lastModified}`}
                        className="rounded-full border border-[rgba(168,121,53,0.18)] bg-white/64 px-3 py-1.5 text-[11px] text-[#6F6254]"
                        dir="ltr"
                      >
                        {selectedFile.name}
                      </span>
                    ))}
                  </div>
                ) : null}

                <label className="mt-4 block">
                  <span className="eyebrow mb-3 block">أو رابط صورة</span>
                  <input value={form.imageUrl} onChange={(event) => update("imageUrl", event.target.value)} placeholder="/uploads/product.jpg" dir="ltr" />
                </label>

                {images.length ? (
                  <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
                    {images.map((image) => (
                      <div key={image} className="relative aspect-square overflow-hidden rounded-[18px] border border-[rgba(123,103,82,0.16)] bg-[#F5F1E8]">
                        <Image src={image} alt="Uploaded product preview" fill sizes="12rem" className="object-cover" unoptimized />
                        <button
                          type="button"
                          onClick={() => setImages((current) => current.filter((item) => item !== image))}
                          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full border border-white/70 bg-[#18130F]/70 text-white shadow-[0_8px_20px_rgba(0,0,0,0.18)] backdrop-blur-sm transition hover:bg-[#18130F]"
                          aria-label="Remove uploaded image"
                        >
                          <X className="h-4 w-4" strokeWidth={1.5} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>

              <button type="submit" disabled={submitting || !applicationId.trim()} className="btn-gold w-full justify-center">
                <PackageCheck className="h-4 w-4" />
                {submitting ? "Submitting" : "Send Product for Approval"}
              </button>
            </form>
          </section>

          <aside className="space-y-4 sm:space-y-5">
            <section className="dark-panel p-4 sm:p-6">
              <div className="mb-4 flex items-start justify-between gap-4 sm:mb-5">
                <div>
                  <p className="eyebrow mb-2 sm:mb-3">Partner Wallet</p>
                  <h2 className="title-display text-[1.8rem] leading-none sm:text-[2.05rem]">
                    Payout <em className="gold-italic">Desk</em>
                  </h2>
                </div>
                <Wallet className="h-5 w-5 text-[#A87935]" strokeWidth={1.35} />
              </div>
              <p className="body-copy mb-4 sm:mb-5">
                Customer payments stay with BOUT first. Partner payouts are estimated after commission and become available when orders are paid or delivered.
              </p>
              {walletError ? (
                <div className="mb-4 rounded-[18px] border border-[#A87935]/24 bg-[#A87935]/10 p-3 text-xs leading-6 text-[#F0DEC0]">
                  {walletError}
                </div>
              ) : null}
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {[
                  { label: "Available", value: wallet ? `EGP ${formatPrice(wallet.summary.available)}` : "EGP 0", icon: CreditCard },
                  { label: "Pending", value: wallet ? `EGP ${formatPrice(wallet.summary.pending)}` : "EGP 0", icon: CheckCircle2 },
                  { label: "Paid", value: wallet ? `EGP ${formatPrice(wallet.summary.paid)}` : "EGP 0", icon: Banknote },
                  { label: "Orders", value: wallet ? String(wallet.summary.orders) : "0", icon: PackageCheck },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="rounded-[16px] border border-white/[0.08] bg-white/[0.04] p-2.5 sm:rounded-[18px] sm:p-3">
                      <Icon className="mb-2 h-4 w-4 text-[#D8C08A] sm:mb-3" strokeWidth={1.35} />
                      <p className="text-[8px] uppercase tracking-[0.18em] text-white/45 sm:text-[9px] sm:tracking-[0.22em]">{item.label}</p>
                      <p className="mt-2 break-words font-serif text-lg leading-none text-[#F8F7F2] sm:text-xl">{item.value}</p>
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 rounded-[16px] border border-white/[0.08] bg-white/[0.04] p-3 sm:mt-4 sm:rounded-[18px]">
                <p className="text-[9px] uppercase tracking-[0.22em] text-white/45">Commission</p>
                <p className="mt-2 text-sm leading-6 text-[#D8C08A]">
                  {wallet ? `${wallet.application.commissionRate}% commission · EGP ${formatPrice(wallet.summary.commission)} platform fee tracked` : "Load an application to calculate commission."}
                </p>
              </div>
            </section>

            <section className="glass-panel p-4 sm:p-6">
              <div className="mb-4 flex items-start justify-between gap-4 sm:mb-5">
                <div>
                  <p className="eyebrow mb-2 sm:mb-3">Payout Profile</p>
                  <h2 className="title-display text-[1.8rem] leading-none sm:text-[2rem]">أرباح البوتيك</h2>
                </div>
                <Landmark className="h-5 w-5 text-[#A87935]" strokeWidth={1.35} />
              </div>
              <p className="mb-4 text-xs leading-6 text-[#6F6254] sm:mb-5">
                لا تضف رقم فيزا أو CVV. استخدم حساب بنكي، محفظة موبايل، أو Paymob merchant ID فقط.
              </p>
              <form onSubmit={savePayoutProfile} className="space-y-3">
                <label className="block">
                  <span className="eyebrow mb-2 block">Payout method</span>
                  <select
                    value={payoutForm.method}
                    onChange={(event) => updatePayout("method", event.target.value as PayoutMethod)}
                    className="luxury-select"
                  >
                    <option value="mobile_wallet">Mobile wallet</option>
                    <option value="bank_account">Bank account / IBAN</option>
                    <option value="paymob_merchant">Paymob merchant ID</option>
                  </select>
                </label>
                <label className="block">
                  <span className="eyebrow mb-2 block">Account holder</span>
                  <input
                    required
                    value={payoutForm.accountHolderName}
                    onChange={(event) => updatePayout("accountHolderName", event.target.value)}
                    placeholder="Legal owner name"
                  />
                </label>
                {payoutForm.method === "bank_account" ? (
                  <>
                    <label className="block">
                      <span className="eyebrow mb-2 block">Bank name</span>
                      <input required value={payoutForm.bankName} onChange={(event) => updatePayout("bankName", event.target.value)} placeholder="Bank name" />
                    </label>
                    <label className="block">
                      <span className="eyebrow mb-2 block">IBAN / account reference</span>
                      <input required value={payoutForm.iban} onChange={(event) => updatePayout("iban", event.target.value)} placeholder="EG..." dir="ltr" />
                    </label>
                  </>
                ) : null}
                {payoutForm.method === "mobile_wallet" ? (
                  <label className="block">
                    <span className="eyebrow mb-2 block">Mobile wallet phone</span>
                    <div className="relative">
                      <Smartphone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A87935]" strokeWidth={1.35} />
                      <input required value={payoutForm.mobileWalletPhone} onChange={(event) => updatePayout("mobileWalletPhone", event.target.value)} placeholder="+20 10..." dir="ltr" className="pl-11" />
                    </div>
                  </label>
                ) : null}
                {payoutForm.method === "paymob_merchant" ? (
                  <label className="block">
                    <span className="eyebrow mb-2 block">Paymob merchant ID</span>
                    <input required value={payoutForm.paymobMerchantId} onChange={(event) => updatePayout("paymobMerchantId", event.target.value)} placeholder="merchant_..." dir="ltr" />
                  </label>
                ) : null}
                <label className="block">
                  <span className="eyebrow mb-2 block">Tax ID optional</span>
                  <input value={payoutForm.taxId} onChange={(event) => updatePayout("taxId", event.target.value)} placeholder="Tax or commercial registration" dir="ltr" />
                </label>
                <button type="submit" disabled={savingPayout || !applicationId.trim()} className="btn-gold w-full justify-center">
                  <Landmark className="h-4 w-4" />
                  {savingPayout ? "Saving" : "Save Payout Profile"}
                </button>
              </form>
            </section>

            <section className="dark-panel p-4 sm:p-6">
              <p className="eyebrow mb-3">Partner Plan</p>
              <h2 className="title-display text-[1.8rem] leading-none sm:text-[2.15rem]">
                Paymob <em className="gold-italic">Subscription</em>
              </h2>
              <p className="body-copy mt-3 sm:mt-4">
                الدفع يتم من خلال صفحة Paymob المستضافة. لو المفاتيح غير مضافة في الإعدادات، الزر هيعرض رسالة واضحة للأدمن.
              </p>
              <button type="button" onClick={startPaymobPayment} disabled={paying || !applicationId.trim()} className="btn-gold mt-4 w-full justify-center sm:mt-5">
                <CreditCard className="h-4 w-4" />
                {paying ? "Opening Paymob" : "Pay With Paymob"}
              </button>
            </section>

            <section className="dark-panel p-4 sm:p-6">
              <div className="mb-4 flex items-start justify-between gap-4 sm:mb-5">
                <div>
                  <p className="eyebrow mb-2 sm:mb-3">Submitted Products</p>
                  <h2 className="title-display text-[1.8rem] leading-none sm:text-[2.05rem]">حالة المنتجات</h2>
                </div>
                <Store className="h-5 w-5 text-[#A87935]" strokeWidth={1.35} />
              </div>

              {loading ? (
                <p className="body-copy">Loading products...</p>
              ) : products.length === 0 ? (
                <p className="body-copy">لسه مفيش منتجات مرفوعة لهذا الطلب.</p>
              ) : (
                <div className="space-y-3">
                  <AnimatePresence initial={false}>
                    {products.map((product) => (
                      <motion.div
                        key={product._id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="rounded-[18px] border border-[rgba(123,103,82,0.14)] bg-white/42 p-3 sm:rounded-[22px] sm:p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-[10px] uppercase tracking-[0.22em] text-[#A87935]">{product.status}</p>
                            <p className="mt-2 font-serif text-xl leading-none text-[#3D3025] sm:text-2xl">{product.name}</p>
                          </div>
                          <span className="whitespace-nowrap rounded-full border border-[#A87935]/20 px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-[#7A581F]">
                            EGP {formatPrice(product.price)}
                          </span>
                        </div>
                        <p className="mt-3 flex items-center gap-2 text-xs leading-6 text-[#6F6254]">
                          <CheckCircle2 className="h-3.5 w-3.5 text-[#A87935]" />
                          {statusCopy(product.status)}
                        </p>
                        {product.status === "approved" ? (
                          <Link href={`/product/${encodeURIComponent(product.productId)}`} className="mt-3 inline-flex text-[10px] uppercase tracking-[0.22em] text-[#A87935]">
                            View live product
                          </Link>
                        ) : null}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </section>

            <section className="dark-panel p-4 sm:p-6">
              <div className="mb-4 flex items-start justify-between gap-4 sm:mb-5">
                <div>
                  <p className="eyebrow mb-2 sm:mb-3">Partner Orders</p>
                  <h2 className="title-display text-[1.8rem] leading-none sm:text-[2.05rem]">طلبات العملاء</h2>
                </div>
                <PackageCheck className="h-5 w-5 text-[#A87935]" strokeWidth={1.35} />
              </div>
              {!wallet ? (
                <p className="body-copy">Load a signed-in partner application to see customer orders.</p>
              ) : wallet.lines.length === 0 ? (
                <p className="body-copy">No customer orders yet for approved partner products.</p>
              ) : (
                <div className="space-y-3">
                  {wallet.lines.slice(0, 5).map((line) => (
                    <div key={`${line.orderId}-${line.productName}-${line.size}-${line.color}`} className="rounded-[18px] border border-white/[0.08] bg-white/[0.04] p-3 sm:rounded-[20px] sm:p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-[9px] uppercase tracking-[0.22em] text-[#D8C08A]">{line.payoutStatus}</p>
                          <p className="mt-2 text-sm leading-6 text-[#F8F7F2]">{line.productName}</p>
                        </div>
                        <span className="whitespace-nowrap text-[10px] uppercase tracking-[0.18em] text-white/45">
                          EGP {formatPrice(line.estimatedPayout)}
                        </span>
                      </div>
                      <div className="mt-3 grid gap-1 text-xs leading-5 text-white/52">
                        <span>Qty {line.quantity} · {line.size || "One Size"} · {line.color || "Default"}</span>
                        <span>{line.customer.name} · {line.customer.phone || "No phone"}</span>
                        <span>{[line.customer.city, line.customer.address].filter(Boolean).join(" · ") || "Address hidden until order details are complete"}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
