"use client";

import { showToast } from "@/components/ToastProvider";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  Edit3,
  Heart,
  LogOut,
  Mail,
  MapPin,
  Package2,
  Phone,
  Save,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Store,
  TrendingUp,
  User2,
  Wallet,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type AccountUser = {
  id?: string;
  name: string;
  email: string;
  role?: string;
  accountIntent?: "buyer" | "partner" | "both";
  createdAt?: string;
  phone?: string;
  address?: string;
  apartment?: string;
  city?: string;
  postalCode?: string;
  country?: string;
};

type AccountOrder = {
  _id: string;
  id?: string;
  status?: string;
  paymentStatus?: string;
  total?: number;
  totalPrice?: number;
  createdAt?: string;
  items?: Array<{ quantity?: number }>;
};

type PartnerApplicationSummary = {
  _id: string;
  boutiqueName: string;
  ownerName?: string;
  phone?: string;
  email?: string;
  planName?: string;
  subscriptionStatus?: string;
  status: string;
  city?: string;
  area?: string;
  streetAddress?: string;
  noPhysicalShop?: boolean;
  payoutStatus?: "missing" | "incomplete" | "complete";
  access?: {
    canManageProducts: boolean;
    reason: string;
    message: string;
    subscriptionUrl: string;
  };
};

type PartnerWalletData = {
  payoutPreview: {
    destination: string;
    status: "missing" | "incomplete" | "complete";
  };
  summary: {
    available: number;
    payoutProfileStatus: "missing" | "incomplete" | "complete";
  };
};

type PartnerProfileSummary = {
  applications: PartnerApplicationSummary[];
  selectedApplication: PartnerApplicationSummary | null;
  wallet: PartnerWalletData | null;
  pendingProductCount: number;
  loading: boolean;
  error: string;
};

type FieldConfig = {
  key: keyof AccountUser;
  label: string;
  placeholder: string;
  autoComplete?: string;
  readOnly?: boolean;
};

const profileFields: FieldConfig[] = [
  { key: "name", label: "Full Name", placeholder: "Your name", autoComplete: "name" },
  { key: "email", label: "Email", placeholder: "Email address", autoComplete: "email", readOnly: true },
  { key: "phone", label: "Phone", placeholder: "Phone number", autoComplete: "tel" },
  { key: "city", label: "City", placeholder: "City", autoComplete: "address-level2" },
];

const deliveryFields: FieldConfig[] = [
  { key: "address", label: "Street Address", placeholder: "Street address", autoComplete: "street-address" },
  { key: "apartment", label: "Apartment", placeholder: "Apartment, suite, floor", autoComplete: "address-line2" },
  { key: "postalCode", label: "Postal Code", placeholder: "Postal code", autoComplete: "postal-code" },
  { key: "country", label: "Country", placeholder: "Country", autoComplete: "country-name" },
];

const completionFields: Array<keyof AccountUser> = [
  "name",
  "email",
  "phone",
  "address",
  "city",
  "postalCode",
  "country",
];

const initialPartnerSummary: PartnerProfileSummary = {
  applications: [],
  selectedApplication: null,
  wallet: null,
  pendingProductCount: 0,
  loading: true,
  error: "",
};

function getFiniteNumber(value: unknown) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function normalizePayoutProfileStatus(value: unknown): "missing" | "incomplete" | "complete" {
  return value === "complete" || value === "incomplete" || value === "missing" ? value : "missing";
}

function normalizePartnerWallet(value: unknown): PartnerWalletData | null {
  if (!value || typeof value !== "object") return null;

  const wallet = value as Partial<PartnerWalletData>;
  const payoutPreview = (wallet.payoutPreview && typeof wallet.payoutPreview === "object" ? wallet.payoutPreview : {}) as Partial<PartnerWalletData["payoutPreview"]>;
  const summary = (wallet.summary && typeof wallet.summary === "object" ? wallet.summary : {}) as Partial<PartnerWalletData["summary"]>;

  return {
    payoutPreview: {
      destination: String(payoutPreview.destination ?? "No card numbers stored"),
      status: normalizePayoutProfileStatus(payoutPreview.status),
    },
    summary: {
      available: getFiniteNumber(summary.available),
      payoutProfileStatus: normalizePayoutProfileStatus(summary.payoutProfileStatus),
    },
  };
}

function normalizePartnerSummary(value: any): PartnerProfileSummary {
  return {
    applications: Array.isArray(value?.applications) ? value.applications : [],
    selectedApplication: value?.selectedApplication && typeof value.selectedApplication === "object"
      ? value.selectedApplication
      : null,
    wallet: normalizePartnerWallet(value?.wallet),
    pendingProductCount: getFiniteNumber(value?.pendingProductCount),
    loading: false,
    error: "",
  };
}

const accountIntentOptions: Array<{
  value: "buyer" | "partner" | "both";
  title: string;
  copy: string;
  icon: typeof ShoppingBag;
}> = [
  {
    value: "buyer",
    title: "Buy from BOUT",
    copy: "Use the account for shopping, wishlist, delivery, and orders.",
    icon: ShoppingBag,
  },
  {
    value: "partner",
    title: "List a boutique",
    copy: "Use the account to apply, upload products, and manage partner review.",
    icon: Building2,
  },
  {
    value: "both",
    title: "Buy and partner",
    copy: "Keep shopping while also submitting boutique products for review.",
    icon: Store,
  },
];

function formatDate(value?: string) {
  if (!value) return "Not set";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not set";
  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatCurrency(value: number) {
  return `EGP ${Math.round(value).toLocaleString("en-US")}`;
}

function titleCase(value?: string) {
  if (!value) return "Pending";
  return value
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getInitials(user: AccountUser) {
  const source = user.name?.trim() || user.email || "Account";
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return parts
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function orderTotal(order: AccountOrder) {
  return Number(order.totalPrice ?? order.total ?? 0);
}

function orderItemCount(order?: AccountOrder) {
  if (!order?.items?.length) return 0;
  return order.items.reduce((sum, item) => sum + Number(item.quantity ?? 1), 0);
}

function getProfileCompletion(user: AccountUser | null) {
  if (!user) return 0;
  const completed = completionFields.filter((field) => Boolean(String(user[field] ?? "").trim())).length;
  return Math.round((completed / completionFields.length) * 100);
}

function accountIntentLabel(value?: AccountUser["accountIntent"]) {
  if (value === "partner") return "Boutique";
  if (value === "both") return "Both";
  return "Buyer";
}

function payoutStatusCopy(status?: string) {
  if (status === "complete") return "Ready for review";
  if (status === "incomplete") return "Needs details";
  return "Secure";
}

function getMissingProfileFields(user: AccountUser | null) {
  if (!user) return [];
  return completionFields
    .filter((field) => !String(user[field] ?? "").trim())
    .map((field) => {
      if (field === "postalCode") return "postal code";
      return String(field);
    });
}

function getCustomerActions({
  deliveryReady,
  hasOrders,
  hasWishlist,
  hasPartnerProfile,
  missingFields,
}: {
  deliveryReady: boolean;
  hasOrders: boolean;
  hasWishlist: boolean;
  hasPartnerProfile: boolean;
  missingFields: string[];
}) {
  const actions = [
    !deliveryReady
      ? {
          title: "Finish checkout profile",
          copy: missingFields.length
            ? `Add ${missingFields.slice(0, 2).join(" and ")} for faster checkout.`
            : "Complete delivery details before your next order.",
          href: "#profile-details",
          label: "Edit profile",
          icon: ShieldCheck,
          priority: "High",
        }
      : null,
    !hasWishlist
      ? {
          title: "Build a shortlist",
          copy: "Save pieces before comparing outfits, sizes, and prices.",
          href: "/shop",
          label: "Browse shop",
          icon: Heart,
          priority: "Style",
        }
      : {
          title: "Review saved pieces",
          copy: "Turn wishlist intent into a cleaner outfit decision.",
          href: "/wishlist",
          label: "Open wishlist",
          icon: Heart,
          priority: "Ready",
        },
    !hasOrders
      ? {
          title: "Make first order easier",
          copy: "Use filters and intent routes to choose faster.",
          href: "/shop",
          label: "Open shop",
          icon: Sparkles,
          priority: "Start",
        }
      : {
          title: "Track order progress",
          copy: "Check payment, delivery, and order history from one place.",
          href: "/orders",
          label: "View orders",
          icon: Package2,
          priority: "Track",
        },
    hasPartnerProfile
      ? {
          title: "Manage partner profile",
          copy: "Keep boutique uploads, payout readiness, and review status current.",
          href: "/partners/profile",
          label: "Partner area",
          icon: Store,
          priority: "Partner",
        }
      : {
          title: "Optional boutique path",
          copy: "Apply only if you want to list products on BOUT.",
          href: "/boutiques",
          label: "Explore partners",
          icon: Store,
          priority: "Optional",
        },
  ];

  return actions.filter(Boolean) as Array<{
    title: string;
    copy: string;
    href: string;
    label: string;
    icon: typeof ShieldCheck;
    priority: string;
  }>;
}

function StatusPill({ order }: { order?: AccountOrder }) {
  const paid = order?.paymentStatus === "paid" || order?.status === "completed";
  const label = paid ? "Completed" : titleCase(order?.status || order?.paymentStatus);
  const Icon = paid ? CheckCircle2 : Clock;

  return (
    <span
      className="inline-flex min-h-[34px] items-center gap-2 rounded-full px-3 text-[9px] uppercase tracking-[0.24em]"
      style={{
        background: paid ? "rgba(80,160,100,0.1)" : "rgba(168,121,53,0.12)",
        border: paid ? "1px solid rgba(80,160,100,0.18)" : "1px solid rgba(168,121,53,0.22)",
        color: paid ? "#3C7A4D" : "#7A581F",
      }}
    >
      <Icon className="h-3.5 w-3.5" strokeWidth={1.3} />
      {label}
    </span>
  );
}

function AccountField({
  config,
  editing,
  value,
  onChange,
}: {
  config: FieldConfig;
  editing: boolean;
  value: string;
  onChange: (key: keyof AccountUser, value: string) => void;
}) {
  const locked = !editing || config.readOnly;

  return (
    <label className="block">
      <span className="mb-2 block text-[10px] uppercase tracking-[0.24em] text-[#7A581F]">
        {config.label}
      </span>
      <input
        autoComplete={config.autoComplete}
        className={`min-h-[44px] w-full rounded-[12px] border px-3 text-[0.86rem] tracking-[0.02em] text-[#3D3025] outline-none transition sm:min-h-[48px] sm:rounded-[14px] sm:px-4 sm:text-[0.92rem] sm:tracking-[0.04em] ${
          locked
            ? "border-[#7B6752]/10 bg-white/55 shadow-none"
            : "border-[#A87935]/28 bg-[#FFF9EF]/72 shadow-[0_10px_24px_rgba(61,48,37,0.08)] focus:border-[#A87935]/55"
        } placeholder:text-[#6F6254]/45 read-only:text-[#3D3025]/72`}
        onChange={(event) => onChange(config.key, event.target.value)}
        placeholder={config.placeholder}
        readOnly={locked}
        value={value}
      />
    </label>
  );
}

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<AccountUser | null>(null);
  const [draft, setDraft] = useState<AccountUser | null>(null);
  const [orders, setOrders] = useState<AccountOrder[]>([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [partnerSummary, setPartnerSummary] = useState<PartnerProfileSummary>(initialPartnerSummary);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadAccount() {
      try {
        const profileResponse = await fetch("/api/users/me", {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!profileResponse.ok) {
          throw new Error(profileResponse.status === 401 ? "Unauthorized" : "Unable to load account");
        }

        const account = (await profileResponse.json()) as AccountUser;
        if (controller.signal.aborted) return;
        setUser(account);
        setDraft(account);
        setLoading(false);

        const [ordersResult, wishlistResult, partnerSummaryResult] = await Promise.allSettled([
          fetch("/api/orders", { cache: "no-store", signal: controller.signal }).then((res) =>
            res.ok ? res.json() : { orders: [] }
          ),
          fetch("/api/wishlist/list", { signal: controller.signal }).then((res) =>
            res.ok ? res.json() : { items: [], ids: [] }
          ),
          fetch("/api/partners/profile-summary", { cache: "no-store", signal: controller.signal }).then(async (res) => {
            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data?.error || "Unable to load partner summary");
            return data;
          }),
        ]);

        if (controller.signal.aborted) return;

        if (ordersResult.status === "fulfilled") {
          const nextOrders = Array.isArray(ordersResult.value?.orders) ? ordersResult.value.orders : [];
          setOrders(nextOrders);
        }

        if (wishlistResult.status === "fulfilled") {
          const ids = Array.isArray(wishlistResult.value?.ids) ? wishlistResult.value.ids : [];
          const items = Array.isArray(wishlistResult.value?.items) ? wishlistResult.value.items : [];
          setWishlistCount(ids.length || items.length);
        }

        if (partnerSummaryResult.status === "fulfilled") {
          setPartnerSummary(normalizePartnerSummary(partnerSummaryResult.value));
        } else {
          setPartnerSummary((current) => ({
            ...current,
            loading: false,
            error: partnerSummaryResult.reason instanceof Error ? partnerSummaryResult.reason.message : "Unable to load partner summary",
          }));
        }
      } catch (requestError) {
        if (controller.signal.aborted) return;
        if (requestError instanceof Error && requestError.message === "Unauthorized") {
          router.push("/login");
          return;
        }
        setError(requestError instanceof Error ? requestError.message : "Unable to load account");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadAccount();

    return () => controller.abort();
  }, [router]);

  const sortedOrders = useMemo(
    () =>
      [...orders].sort(
        (a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
      ),
    [orders]
  );
  const recentOrder = sortedOrders[0];
  const totalSpend = useMemo(() => orders.reduce((sum, order) => sum + orderTotal(order), 0), [orders]);
  const profileCompletion = getProfileCompletion(draft || user);
  const missingFields = getMissingProfileFields(draft || user);
  const hasChanges = Boolean(user && draft && JSON.stringify(user) !== JSON.stringify(draft));
  const deliveryReady = Boolean(user?.phone && user?.address && user?.city && user?.country);
  const selectedPartnerApplication = partnerSummary.selectedApplication;
  const hasPartnerProfile =
    user?.accountIntent === "partner" ||
    user?.accountIntent === "both" ||
    Boolean(selectedPartnerApplication);
  const isPartnerProfile = false;
  const partnerProductsHref = selectedPartnerApplication
    ? `/partners/products?applicationId=${encodeURIComponent(selectedPartnerApplication._id)}`
    : "/partners/products";
  const partnerSubscriptionHref = selectedPartnerApplication
    ? `/partners/subscription?applicationId=${encodeURIComponent(selectedPartnerApplication._id)}`
    : "/partners/subscription";
  const partnerProfileHref = "/partners/profile";
  const partnerPrimaryHref = hasPartnerProfile ? partnerProfileHref : "/boutiques/apply";
  const partnerReadiness = selectedPartnerApplication
    ? selectedPartnerApplication.access?.canManageProducts
      ? 100
      : selectedPartnerApplication.status === "pending"
        ? 55
        : 72
    : isPartnerProfile
      ? 28
      : profileCompletion;
  const partnerStatusCopy = selectedPartnerApplication
    ? selectedPartnerApplication.access?.message || "Boutique profile loaded. Keep products, payout details, and subscription current."
    : "Start the boutique application to unlock product uploads, admin review, and partner payouts.";
  const headerKicker = isPartnerProfile ? "Partner Profile" : "Account";
  const headerBadge = isPartnerProfile
    ? selectedPartnerApplication
      ? titleCase(selectedPartnerApplication.status)
      : "Application Needed"
    : `${profileCompletion}% complete`;
  const headerTitle = isPartnerProfile ? "Partner Profile" : "Account Overview";
  const roleChip = isPartnerProfile ? "Boutique Partner" : user?.role === "admin" ? "Admin" : "Client";
  const dateChip = isPartnerProfile
    ? selectedPartnerApplication?.planName || selectedPartnerApplication?.subscriptionStatus || "Boutique Setup"
    : formatDate(user?.createdAt);
  const displayName = isPartnerProfile
    ? selectedPartnerApplication?.boutiqueName || user?.name || "Boutique profile"
    : user?.name || "Your profile";
  const displayPhone = isPartnerProfile
    ? selectedPartnerApplication?.phone || user?.phone
    : user?.phone;
  const displayEmail = isPartnerProfile
    ? selectedPartnerApplication?.email || user?.email || ""
    : user?.email || "";
  const profileReadinessValue = isPartnerProfile ? partnerReadiness : profileCompletion;

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (requestError) {
      console.warn("Logout request failed", requestError);
    }
    window.dispatchEvent(new Event("wishlist:invalidate"));
    router.push("/");
    router.refresh();
  }

  function updateDraft(key: keyof AccountUser, value: string) {
    setDraft((current) => (current ? { ...current, [key]: value } : current));
  }

  function cancelEdit() {
    setDraft(user);
    setEditing(false);
  }

  async function saveProfile() {
    if (!draft || saving || !hasChanges) return;
    setSaving(true);
    setError(null);

    try {
      const response = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Unable to update profile");
      }
      setUser(data);
      setDraft(data);
      setEditing(false);
      showToast("Profile updated.", "success");
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : "Unable to update profile";
      setError(message);
      showToast(message, "error");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="liquid-page mobile-comfort pt-20 sm:pt-24">
        <div className="page-wrap flex min-h-[55vh] items-center justify-center">
          <motion.p
            animate={{ opacity: [0.35, 0.78, 0.35] }}
            className="eyebrow"
            transition={{ duration: 1.6, repeat: Infinity }}
          >
            Loading Account
          </motion.p>
        </div>
      </main>
    );
  }

  if (!user || !draft) {
    return (
      <main className="liquid-page mobile-comfort px-3 pb-[calc(7.25rem+env(safe-area-inset-bottom))] pt-14 sm:px-6 sm:pb-20 sm:pt-24 md:px-10">
        <div className="page-wrap max-w-3xl">
          <div className="glass-panel p-6 sm:p-8">
            <p className="eyebrow mb-4">Private Account</p>
            <h1 className="title-display text-[2.4rem]">
              Account <em className="gold-italic">Unavailable</em>
            </h1>
            <div className="page-header-divider mt-6" />
            <p className="body-copy mt-6">
              {error || "We could not load your account details right now. Please refresh or sign in again."}
            </p>
            <div className="mt-6">
              <Link href="/login" className="btn-gold">
                Sign In Again
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const customerStats = [
    { label: "Orders", value: String(orders.length), detail: recentOrder ? "Recent activity loaded" : "No purchases yet", icon: Package2 },
    { label: "Wishlist", value: String(wishlistCount), detail: wishlistCount === 1 ? "Saved piece" : "Saved pieces", icon: Heart },
    { label: "Lifetime", value: formatCurrency(totalSpend), detail: "Tracked spend", icon: CreditCard },
    { label: "Mode", value: accountIntentLabel(user.accountIntent), detail: user.accountIntent === "partner" ? "Boutique partner" : user.accountIntent === "both" ? "Shop and sell" : "Shopping profile", icon: user.accountIntent === "partner" || user.accountIntent === "both" ? Store : ShoppingBag },
    { label: "Profile", value: `${profileCompletion}%`, detail: deliveryReady ? "Checkout ready" : "Details missing", icon: ShieldCheck },
  ];
  const partnerProfileCards = [
    {
      label: "Boutique",
      value: selectedPartnerApplication ? titleCase(selectedPartnerApplication.status) : partnerSummary.loading ? "Loading" : "Missing",
      detail: selectedPartnerApplication ? selectedPartnerApplication.boutiqueName : "Apply first",
      icon: Store,
    },
    {
      label: "Pending",
      value: String(partnerSummary.pendingProductCount),
      detail: "Waiting for admin review",
      icon: Clock,
    },
    {
      label: "Available",
      value: partnerSummary.wallet ? formatCurrency(partnerSummary.wallet.summary.available) : "EGP 0",
      detail: "After paid or delivered orders",
      icon: Wallet,
    },
    {
      label: "Payout",
      value: partnerSummary.wallet ? payoutStatusCopy(partnerSummary.wallet.summary.payoutProfileStatus) : "Secure",
      detail: partnerSummary.wallet?.payoutPreview.destination || "No card numbers stored",
      icon: CreditCard,
    },
  ];
  const stats = isPartnerProfile ? partnerProfileCards : customerStats;
  const customerActions = getCustomerActions({
    deliveryReady,
    hasOrders: orders.length > 0,
    hasWishlist: wishlistCount > 0,
    hasPartnerProfile,
    missingFields,
  });
  const customerQualityScore = Math.min(
    100,
    profileCompletion +
      (orders.length > 0 ? 10 : 0) +
      (wishlistCount > 0 ? 8 : 0) +
      (deliveryReady ? 12 : 0)
  );

  return (
    <main className="liquid-page mobile-comfort px-3 pb-[calc(7.25rem+env(safe-area-inset-bottom))] pt-14 sm:px-6 sm:pb-20 sm:pt-24 md:px-10">
      <div className="page-wrap max-w-6xl">
        {error ? (
          <div
            className="mb-5 rounded-2xl px-4 py-3"
            style={{ background: "rgba(154,34,34,0.08)", border: "1px solid rgba(154,34,34,0.22)" }}
          >
            <p className="text-[10px] uppercase tracking-[0.2em]" style={{ color: "#9A2222" }}>
              {error}
            </p>
          </div>
        ) : null}

        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-3 rounded-[20px] border border-[#7B6752]/12 bg-white/72 p-4 shadow-[0_18px_54px_rgba(61,48,37,0.08)] backdrop-blur-2xl sm:mb-5 sm:rounded-[24px] sm:p-6"
        >
          <div className="flex flex-col gap-4 lg:grid lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-end">
            <div className="min-w-0">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <p className="text-[9px] uppercase tracking-[0.28em] text-[#7A581F]">{headerKicker}</p>
                <span className="inline-flex min-h-[34px] items-center rounded-full border border-[#A87935]/22 bg-[#A87935]/10 px-3 text-[9px] uppercase tracking-[0.22em] text-[#7A581F]">
                  {headerBadge}
                </span>
              </div>

              <div className="flex items-start gap-3 sm:gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[16px] border border-[#A87935]/24 bg-[#FFF9EF] text-[1.05rem] uppercase tracking-[0.08em] text-[#7A581F] shadow-[0_12px_26px_rgba(61,48,37,0.07)] sm:h-16 sm:w-16">
                  {getInitials(user)}
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="font-serif text-[2rem] font-light leading-[1.02] tracking-[0.01em] text-[#3D3025] sm:text-[3.35rem]">
                    {headerTitle}
                  </h1>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="inline-flex min-h-[32px] items-center gap-2 rounded-full border border-[#A87935]/18 bg-[#A87935]/[0.07] px-3 text-[9px] uppercase tracking-[0.2em] text-[#7A581F]">
                      {isPartnerProfile ? (
                        <Store className="h-3.5 w-3.5" strokeWidth={1.35} />
                      ) : (
                        <ShieldCheck className="h-3.5 w-3.5" strokeWidth={1.35} />
                      )}
                      {roleChip}
                    </span>
                    <span className="inline-flex min-h-[32px] items-center gap-2 rounded-full border border-[#7B6752]/12 bg-white/70 px-3 text-[9px] uppercase tracking-[0.18em] text-[#6F6254]">
                      <Calendar className="h-3.5 w-3.5" strokeWidth={1.35} />
                      {dateChip}
                    </span>
                  </div>
                  <div className="mt-4 min-w-0">
                    <p className="text-[1.08rem] font-medium tracking-[0.01em] text-[#3D3025] sm:text-[1.22rem]">
                      {displayName}
                    </p>
                    <div className="mt-2 flex min-w-0 flex-col gap-1.5 text-[0.78rem] tracking-[0.02em] text-[#6F6254] sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
                      <span className="inline-flex min-w-0 items-center gap-2">
                        <Mail className="h-4 w-4 shrink-0 text-[#A87935]" strokeWidth={1.3} />
                        <span className="truncate">{displayEmail}</span>
                      </span>
                      {displayPhone ? (
                        <span className="inline-flex items-center gap-2">
                          <Phone className="h-4 w-4 shrink-0 text-[#A87935]" strokeWidth={1.3} />
                          {displayPhone}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[18px] border border-[#7B6752]/12 bg-[#FDFBF7]/74 p-3 sm:p-4">
              <div className="mb-3 flex items-center justify-between gap-4">
                <span className="text-[9px] uppercase tracking-[0.24em] text-[#7A581F]">
                  {isPartnerProfile ? "Partner Status" : "Readiness"}
                </span>
                <span className="text-[0.82rem] text-[#3D3025]/78">{profileReadinessValue}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-[#7B6752]/12">
                <motion.div
                  animate={{ width: `${profileReadinessValue}%` }}
                  className="h-full rounded-full bg-[#A87935]"
                  initial={{ width: 0 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
              <p className="mt-3 text-[0.74rem] leading-5 tracking-[0.02em] text-[#6F6254]">
                {isPartnerProfile
                  ? partnerStatusCopy
                  : missingFields.length > 0
                    ? `${missingFields.slice(0, 3).join(", ")} ${missingFields.length > 3 ? "and more " : ""}need attention.`
                    : "Ready for faster checkout and delivery."}
              </p>
            </div>
          </div>
        </motion.section>

        <div className={`mb-4 grid grid-cols-2 gap-2 sm:mb-5 sm:gap-3 ${isPartnerProfile ? "lg:grid-cols-4" : "lg:grid-cols-5"}`}>
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-[18px] border border-[#7B6752]/12 bg-white/64 p-3 shadow-[0_12px_32px_rgba(61,48,37,0.05)] backdrop-blur-xl sm:p-4"
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="text-[8px] uppercase tracking-[0.22em] text-[#7A581F]">{stat.label}</p>
                  <Icon className="h-4 w-4 text-[#A87935]" strokeWidth={1.25} />
                </div>
                <p className="font-serif text-[1.2rem] font-light leading-none tracking-[0.01em] text-[#3D3025] sm:text-[1.55rem]">{stat.value}</p>
                <p className="mt-2 text-[0.68rem] leading-5 tracking-[0.02em] text-[#6F6254]">{stat.detail}</p>
              </motion.div>
            );
          })}
        </div>

        <section className="mb-4 rounded-[20px] border border-[#7B6752]/12 bg-white/68 p-4 shadow-[0_18px_48px_rgba(61,48,37,0.07)] backdrop-blur-2xl sm:mb-5 sm:rounded-[24px] sm:p-6">
          <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="eyebrow mb-2">Next Best Actions</p>
              <h2 className="title-display text-[1.85rem] sm:text-[2.45rem]">
                Shopping <em className="gold-italic">Command</em>
              </h2>
              <p className="body-copy mt-3 max-w-2xl">
                BOUT uses your current account state to make the next step obvious: complete profile details, review saved pieces, track orders, or continue shopping.
              </p>
            </div>

            <div className="rounded-[18px] border border-[#A87935]/18 bg-[#FFF9EF]/72 p-4 lg:min-w-[15rem]">
              <div className="mb-3 flex items-center justify-between gap-4">
                <span className="text-[9px] uppercase tracking-[0.24em] text-[#7A581F]">Customer Quality</span>
                <TrendingUp className="h-4 w-4 text-[#A87935]" strokeWidth={1.35} />
              </div>
              <p className="font-serif text-[2rem] font-light leading-none text-[#3D3025]">{customerQualityScore}/100</p>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#7B6752]/12">
                <motion.div
                  animate={{ width: `${customerQualityScore}%` }}
                  className="h-full rounded-full bg-[#A87935]"
                  initial={{ width: 0 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {customerActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.title}
                  href={action.href}
                  className="group rounded-[18px] border border-[#7B6752]/12 bg-[#FDFBF7]/74 p-4 transition hover:-translate-y-0.5 hover:border-[#A87935]/28 hover:bg-[#FFF9EF]"
                >
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-[14px] border border-[#A87935]/18 bg-white/62 text-[#A87935]">
                      <Icon className="h-5 w-5" strokeWidth={1.25} />
                    </span>
                    <span className="rounded-full border border-[#A87935]/18 bg-[#A87935]/10 px-2 py-1 text-[8px] uppercase tracking-[0.18em] text-[#7A581F]">
                      {action.priority}
                    </span>
                  </div>
                  <h3 className="font-serif text-[1.4rem] font-light leading-none text-[#3D3025]">{action.title}</h3>
                  <p className="mt-3 min-h-[3.1rem] text-[0.76rem] leading-6 text-[#6F6254]">{action.copy}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-[#7A581F]">
                    {action.label}
                    <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" strokeWidth={1.35} />
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        <div className="grid gap-4 sm:gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(20rem,0.65fr)]">
          <section id="profile-details" className="rounded-[20px] border border-[#7B6752]/12 bg-white/68 p-4 shadow-[0_18px_48px_rgba(61,48,37,0.07)] backdrop-blur-2xl sm:rounded-[24px] sm:p-6">
            <form
              onSubmit={(event) => {
                event.preventDefault();
                saveProfile();
              }}
            >
              <div className="mb-5 flex flex-wrap items-start justify-between gap-3 sm:mb-7 sm:gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] border border-[#A87935]/18 bg-[#A87935]/[0.07]">
                    <User2 strokeWidth={1.2} className="h-5 w-5 text-[#A87935]" />
                  </div>
                  <div>
                    <p className="eyebrow mb-2">{isPartnerProfile ? "Owner Details" : "Profile Details"}</p>
                    <p className="body-copy body-copy-strong">
                      {isPartnerProfile
                        ? "Keep owner contact details current for review, support, and payout communication."
                        : "Keep sign-in, contact, and delivery details current."}
                    </p>
                  </div>
                </div>

                {editing ? (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-[14px] border border-[#7B6752]/18 bg-white/50 px-4 text-[9px] uppercase tracking-[0.22em] text-[#6F6254] transition-colors hover:border-[#A87935]/35 hover:text-[#7A581F]"
                  >
                    <X className="h-3.5 w-3.5" strokeWidth={1.3} />
                    Cancel
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setEditing(true)}
                    className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-[14px] border border-[#A87935]/24 bg-[#A87935]/10 px-4 text-[9px] uppercase tracking-[0.22em] text-[#7A581F] transition-colors hover:border-[#A87935]/45"
                  >
                    <Edit3 className="h-3.5 w-3.5" strokeWidth={1.3} />
                    Edit
                  </button>
                )}
              </div>

              <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
                {profileFields.map((field) => (
                  <AccountField
                    key={field.key}
                    config={field}
                    editing={editing}
                    onChange={updateDraft}
                    value={String(draft[field.key] ?? "")}
                  />
                ))}
              </div>

              <div className="mt-6 border-t border-[#7B6752]/14 pt-5 sm:mt-8 sm:pt-7">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3 sm:mb-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] border border-[#A87935]/18 bg-[#A87935]/[0.07]">
                      <Building2 strokeWidth={1.2} className="h-5 w-5 text-[#A87935]" />
                    </div>
                    <div>
                      <p className="eyebrow mb-2">{isPartnerProfile ? "Partner Role" : "Account Purpose"}</p>
                      <p className="body-copy body-copy-strong">
                        {isPartnerProfile
                          ? "This account can manage boutique workflows while keeping buyer access when needed."
                          : "Choose whether this account is for buying, boutique selling, or both."}
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex min-h-[34px] items-center rounded-full border border-[#A87935]/22 bg-[#A87935]/10 px-3 text-[9px] uppercase tracking-[0.24em] text-[#7A581F]">
                    {accountIntentLabel(draft.accountIntent)}
                  </span>
                </div>

                <div className="grid gap-2.5 md:grid-cols-3">
                  {accountIntentOptions.map((option) => {
                    const Icon = option.icon;
                    const active = (draft.accountIntent ?? "buyer") === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        aria-pressed={active}
                        disabled={!editing}
                        onClick={() => updateDraft("accountIntent", option.value)}
                        className={`group relative flex min-h-[5rem] items-start gap-3 overflow-hidden !rounded-[14px] border px-3 py-3 pr-10 text-left transition sm:min-h-[5.75rem] sm:px-4 sm:py-4 sm:pr-11 ${
                          active
                            ? "border-[#A87935]/45 bg-[#FFF9EF]/72 shadow-[0_14px_34px_rgba(61,48,37,0.08)]"
                            : "border-[#7B6752]/14 bg-white/30"
                        } ${editing ? "hover:-translate-y-0.5 hover:border-[#A87935]/38 hover:bg-[#FFF9EF]/60" : "cursor-default"}`}
                      >
                        <span
                          className={`mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border transition ${
                            active
                              ? "border-[#A87935]/28 bg-[#A87935]/12 text-[#7A581F]"
                              : "border-[#7B6752]/14 bg-white/54 text-[#A87935]"
                          }`}
                        >
                          <Icon className="h-4 w-4" strokeWidth={1.25} />
                        </span>
                        <span className="block min-w-0 pt-0.5">
                          <span className="block text-[10px] uppercase tracking-[0.22em] text-[#7A581F]">{option.title}</span>
                          <span className="mt-2 block text-xs leading-5 tracking-[0.02em] text-[#6F6254]">{option.copy}</span>
                        </span>
                        <span
                          className={`absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full border transition ${
                            active
                              ? "border-[#A87935]/35 bg-[#A87935]/14 text-[#7A581F]"
                              : "border-[#7B6752]/16 bg-white/40 text-transparent"
                          }`}
                          aria-hidden="true"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={1.45} />
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6 border-t border-[#7B6752]/14 pt-5 sm:mt-8 sm:pt-7">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3 sm:mb-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] border border-[#A87935]/18 bg-[#A87935]/[0.07]">
                      <MapPin strokeWidth={1.2} className="h-5 w-5 text-[#A87935]" />
                    </div>
                    <div>
                      <p className="eyebrow mb-2">{isPartnerProfile ? "Address Profile" : "Delivery Profile"}</p>
                      <p className="body-copy body-copy-strong">
                        {isPartnerProfile
                          ? "Used for account support, order coordination, and checkout when you buy."
                          : "Used to prefill checkout and reduce address mistakes."}
                      </p>
                    </div>
                  </div>
                  <span
                    className="inline-flex min-h-[34px] items-center rounded-full border px-3 text-[9px] uppercase tracking-[0.24em]"
                    style={{
                      borderColor: deliveryReady ? "rgba(80,160,100,0.18)" : "rgba(168,121,53,0.22)",
                      background: deliveryReady ? "rgba(80,160,100,0.1)" : "rgba(168,121,53,0.1)",
                      color: deliveryReady ? "#3C7A4D" : "#7A581F",
                    }}
                  >
                    {deliveryReady ? "Ready" : "Needs Details"}
                  </span>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
                  {deliveryFields.map((field) => (
                    <AccountField
                      key={field.key}
                      config={field}
                      editing={editing}
                      onChange={updateDraft}
                      value={String(draft[field.key] ?? "")}
                    />
                  ))}
                </div>
              </div>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-[0.78rem] leading-6 tracking-[0.07em] text-[#6F6254]">
                  Email stays locked because it is connected to account sign-in.
                </p>
                {editing ? (
                  <button
                    type="submit"
                    disabled={saving || !hasChanges}
                    className="btn-gold justify-center disabled:opacity-45 sm:min-w-[13rem]"
                  >
                    <Save strokeWidth={1.2} className="h-4 w-4" />
                    {saving ? "Saving" : "Save Profile"}
                  </button>
                ) : null}
              </div>
            </form>
          </section>

          <aside className="flex flex-col gap-4 sm:gap-5">
            <section className={`flex flex-col gap-4 rounded-[20px] border border-[#7B6752]/12 bg-white/68 p-4 shadow-[0_18px_48px_rgba(61,48,37,0.07)] backdrop-blur-2xl sm:rounded-[24px] sm:p-6 ${isPartnerProfile ? "order-2" : "order-1"}`}>
              <div className="mb-4 flex items-start justify-between gap-4 sm:mb-5">
                <div>
                  <p className="eyebrow mb-2 sm:mb-3">{isPartnerProfile ? "Buyer Activity" : "Recent Activity"}</p>
                  <h2 className="title-display text-[1.7rem] sm:text-[2rem]">
                    Order <em className="gold-italic">Snapshot</em>
                  </h2>
                </div>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] border border-[#A87935]/18 bg-[#A87935]/[0.07]">
                  <Package2 className="h-5 w-5 text-[#A87935]" strokeWidth={1.2} />
                </div>
              </div>

              {recentOrder ? (
                <div className="space-y-4 sm:space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <StatusPill order={recentOrder} />
                    <span className="text-[10px] uppercase tracking-[0.22em] text-[#6F6254]">
                      {formatDate(recentOrder.createdAt)}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 border-y border-[#7B6752]/12 py-3 sm:gap-3 sm:py-4">
                    <div>
                      <p className="eyebrow mb-2">Items</p>
                      <p className="title-display text-[1.45rem]">{orderItemCount(recentOrder)}</p>
                    </div>
                    <div>
                      <p className="eyebrow mb-2">Total</p>
                      <p className="title-display text-[1.45rem] text-[#7A581F]">{formatCurrency(orderTotal(recentOrder))}</p>
                    </div>
                  </div>
                  <Link
                    href={`/orders/${encodeURIComponent(recentOrder._id)}`}
                    className="liquid-row-link"
                  >
                    <span className="inline-flex items-center gap-3">
                      <ShoppingBag strokeWidth={1.2} className="h-4 w-4 text-[#A87935]" />
                      <span className="text-[0.78rem] uppercase tracking-[0.22em]">View Details</span>
                    </span>
                    <ArrowRight strokeWidth={1.2} className="h-4 w-4 text-[#7B6752]/45" />
                  </Link>
                </div>
              ) : (
                <div className="py-2">
                  <p className="body-copy">
                    Your first order will appear here with status, items, and total spend after checkout.
                  </p>
                  <Link href="/shop" className="btn-gold mt-4 w-full justify-center sm:mt-5">
                    Browse Shop
                    <ArrowRight strokeWidth={1.2} className="h-4 w-4" />
                  </Link>
                </div>
              )}
            </section>

            <section className={`flex flex-col gap-4 rounded-[20px] border border-[#7B6752]/12 bg-white/68 p-4 shadow-[0_18px_48px_rgba(61,48,37,0.07)] backdrop-blur-2xl sm:rounded-[24px] sm:p-6 ${isPartnerProfile ? "order-1" : "order-2"}`}>
              <div>
                <p className="eyebrow mb-2 sm:mb-3">{isPartnerProfile ? "Partner Workspace" : "Boutique Partner"}</p>
                <h2 className="title-display text-[1.7rem] sm:text-[2rem]">
                  {isPartnerProfile ? "Boutique " : "Sell on "}
                  <em className="gold-italic">{isPartnerProfile ? "Desk" : "BOUT"}</em>
                </h2>
                <p className="body-copy mt-3">
                  {isPartnerProfile
                    ? "Manage products, subscription, payout readiness, and boutique review from one focused partner area."
                    : hasPartnerProfile
                      ? "Your boutique profile now lives in a separate partner area, while this page stays focused on your customer account."
                      : "Apply as a boutique, submit products for admin review, and use Paymob for the monthly partner plan when configured."}
                </p>
              </div>

              {isPartnerProfile ? (
                <div className="mt-4 rounded-[16px] border border-[#A87935]/18 bg-[#FFF9EF]/62 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] border border-[#A87935]/18 bg-white/62">
                      <Store className="h-5 w-5 text-[#A87935]" strokeWidth={1.2} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[9px] uppercase tracking-[0.24em] text-[#7A581F]">
                        {selectedPartnerApplication ? titleCase(selectedPartnerApplication.status) : "Setup Needed"}
                      </p>
                      <p className="mt-2 break-words font-serif text-[1.35rem] leading-none text-[#3D3025]">
                        {selectedPartnerApplication?.boutiqueName || "Start your boutique application"}
                      </p>
                      <p className="mt-3 text-[0.74rem] leading-5 tracking-[0.02em] text-[#6F6254]">
                        {partnerStatusCopy}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {partnerProfileCards.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.label}
                        className="rounded-[14px] border border-[#7B6752]/12 bg-[#FDFBF7]/74 p-3"
                      >
                        <Icon className="mb-2 h-4 w-4 text-[#A87935]" strokeWidth={1.25} />
                        <p className="text-[8px] uppercase tracking-[0.18em] text-[#7A581F]">{item.label}</p>
                        <p className="mt-2 break-words font-serif text-[1.05rem] leading-none text-[#3D3025]">
                          {item.value}
                        </p>
                        <p className="mt-2 break-words text-[0.68rem] leading-5 text-[#6F6254]">{item.detail}</p>
                      </div>
                    );
                  })}
                </div>
              )}

              {partnerSummary.error ? (
                <p className="rounded-[14px] border border-[#9A2222]/18 bg-[#9A2222]/[0.04] px-3 py-2 text-[0.72rem] leading-5 text-[#9A2222]">
                  {partnerSummary.error}
                </p>
              ) : null}

              <nav className="flex flex-col gap-2 sm:gap-3">
                <Link href={isPartnerProfile ? partnerPrimaryHref : hasPartnerProfile ? partnerProfileHref : "/boutiques"} className="liquid-row-link">
                  <span className="inline-flex items-center gap-3">
                    <Building2 strokeWidth={1.2} className="h-4 w-4 text-[#A87935]" />
                    <span className="text-[0.78rem] uppercase tracking-[0.22em]">
                      {isPartnerProfile
                        ? selectedPartnerApplication
                          ? "Partner Dashboard"
                          : "Start Application"
                        : hasPartnerProfile
                          ? "Partner Profile"
                          : "Apply Boutique"}
                    </span>
                  </span>
                  <ArrowRight strokeWidth={1.2} className="h-4 w-4 text-[#7B6752]/45" />
                </Link>
                <Link href={partnerProductsHref} className="liquid-row-link">
                  <span className="inline-flex items-center gap-3">
                    <Package2 strokeWidth={1.2} className="h-4 w-4 text-[#A87935]" />
                    <span className="text-[0.78rem] uppercase tracking-[0.22em]">
                      {isPartnerProfile ? "Manage Products" : "Upload Products"}
                    </span>
                  </span>
                  <ArrowRight strokeWidth={1.2} className="h-4 w-4 text-[#7B6752]/45" />
                </Link>
                <Link href={partnerSubscriptionHref} className="liquid-row-link">
                  <span className="inline-flex items-center gap-3">
                    <CreditCard strokeWidth={1.2} className="h-4 w-4 text-[#A87935]" />
                    <span className="text-[0.78rem] uppercase tracking-[0.22em]">
                      {isPartnerProfile ? "Subscription Plan" : "Pay Partner Plan"}
                    </span>
                  </span>
                  <ArrowRight strokeWidth={1.2} className="h-4 w-4 text-[#7B6752]/45" />
                </Link>
                <Link href={partnerProductsHref} className="liquid-row-link">
                  <span className="inline-flex items-center gap-3">
                    <Wallet strokeWidth={1.2} className="h-4 w-4 text-[#A87935]" />
                    <span className="text-[0.78rem] uppercase tracking-[0.22em]">Partner Wallet</span>
                  </span>
                  <ArrowRight strokeWidth={1.2} className="h-4 w-4 text-[#7B6752]/45" />
                </Link>
              </nav>
            </section>

            <section className="order-3 rounded-[20px] border border-[#7B6752]/12 bg-white/68 p-4 shadow-[0_18px_48px_rgba(61,48,37,0.07)] backdrop-blur-2xl sm:rounded-[24px] sm:p-6">
              <div>
                <p className="eyebrow mb-2 sm:mb-3">{isPartnerProfile ? "Buyer Tools" : "Client Services"}</p>
                <h2 className="title-display text-[1.7rem] sm:text-[2rem]">
                  Account <em className="gold-italic">Access</em>
                </h2>
              </div>

              <nav className="flex flex-col gap-2 sm:gap-3">
                <Link href="/orders" className="liquid-row-link">
                  <span className="inline-flex items-center gap-3">
                    <Package2 strokeWidth={1.2} className="h-4 w-4 text-[#A87935]" />
                    <span className="text-[0.78rem] uppercase tracking-[0.22em]">Order History</span>
                  </span>
                  <ArrowRight strokeWidth={1.2} className="h-4 w-4 text-[#7B6752]/45" />
                </Link>
                <Link href="/wishlist" className="liquid-row-link">
                  <span className="inline-flex items-center gap-3">
                    <Heart strokeWidth={1.2} className="h-4 w-4 text-[#A87935]" />
                    <span className="text-[0.78rem] uppercase tracking-[0.22em]">Wishlist</span>
                  </span>
                  <ArrowRight strokeWidth={1.2} className="h-4 w-4 text-[#7B6752]/45" />
                </Link>
                <Link href="/shop" className="liquid-row-link">
                  <span className="inline-flex items-center gap-3">
                    <ShoppingBag strokeWidth={1.2} className="h-4 w-4 text-[#A87935]" />
                    <span className="text-[0.78rem] uppercase tracking-[0.22em]">Continue Shopping</span>
                  </span>
                  <ArrowRight strokeWidth={1.2} className="h-4 w-4 text-[#7B6752]/45" />
                </Link>
              </nav>

              <motion.button
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.985 }}
                onClick={handleLogout}
                className="mt-1 inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-[14px] border border-[#9A2222]/18 bg-[#9A2222]/[0.04] px-4 text-[9px] uppercase tracking-[0.22em] text-[#9A2222] transition-colors hover:border-[#9A2222]/34 sm:mt-2 sm:min-h-[48px] sm:px-5 sm:text-[10px] sm:tracking-[0.26em]"
              >
                <LogOut strokeWidth={1.2} className="h-4 w-4" />
                Sign Out
              </motion.button>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
