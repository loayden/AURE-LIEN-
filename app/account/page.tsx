"use client";

import { showToast } from "@/components/ToastProvider";
import { AnimatePresence, motion } from "framer-motion";
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
  Settings,
  HelpCircle,
  Bell,
  Gift,
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
        className={`min-h-[48px] w-full rounded-[12px] border px-4 text-[0.9rem] tracking-[0.02em] text-[#3D3025] outline-none transition sm:min-h-[52px] sm:rounded-[14px] sm:px-5 sm:text-[0.95rem] sm:tracking-[0.04em] ${
          locked
            ? "border-[#7B6752]/10 bg-[#FDFBF7]/40 shadow-none"
            : "border-[#A87935]/28 bg-[#FFF9EF]/72 shadow-[0_10px_24px_rgba(61,48,37,0.08)] focus:border-[#A87935]/55 focus:bg-white"
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
  const [activeTab, setActiveTab] = useState<"profile" | "orders" | "partner">("profile");

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
      <main className="liquid-page mobile-comfort px-5 pb-[calc(7.25rem+env(safe-area-inset-bottom))] pt-14 sm:px-6 sm:pb-20 sm:pt-24 md:px-10">
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
    <main className="min-h-screen bg-[#F4F2EE] pb-24 text-[#171513]">
      {error ? (
        <div className="mx-auto max-w-5xl px-4 pt-4 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-[#9A2222]/20 bg-[#9A2222]/5 px-4 py-3 text-sm text-[#9A2222]">
            {error}
          </div>
        </div>
      ) : null}

      {/* 1. Facebook-style Cover & Profile Header */}
      <div className="relative bg-white shadow-sm">
        {/* Cover Photo Area (Gradient with grain) */}
        <div className="relative h-48 w-full overflow-hidden sm:h-64 md:h-72 lg:h-80 bg-gradient-to-tr from-[#1a1c23] via-[#2c2f3b] to-[#3f4354]">
          <div className="absolute inset-0 opacity-[0.15] mix-blend-overlay pointer-events-none" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }}></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        </div>

        {/* Profile Info Overlay */}
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="relative -mt-16 flex flex-col items-center pb-6 sm:-mt-20 sm:flex-row sm:items-end sm:justify-between sm:pb-8">
            <div className="flex flex-col items-center sm:flex-row sm:items-end sm:space-x-6">
              {/* Avatar with Completion Ring */}
              <div className="relative group">
                <div className="absolute -inset-1 rounded-full bg-white"></div>
                <div className="relative flex h-32 w-32 items-center justify-center rounded-full border-4 border-white bg-[#F3F1ED] text-4xl font-light text-[#7A581F] shadow-md sm:h-40 sm:w-40 sm:text-5xl">
                  {getInitials(user)}
                  {/* Circular Progress Ring */}
                  <svg className="absolute inset-[-4px] h-[calc(100%+8px)] w-[calc(100%+8px)] -rotate-90 transform" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="48" fill="none" stroke="#E5E7EB" strokeWidth="4" />
                    <circle 
                      cx="50" cy="50" r="48" fill="none" stroke="#A87935" strokeWidth="4" 
                      strokeDasharray="301.59" 
                      strokeDashoffset={301.59 - (301.59 * profileCompletion) / 100}
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                </div>
                {/* Camera Icon Overlay (Decorative) */}
                <button className="absolute bottom-1 right-1 sm:bottom-3 sm:right-3 flex h-8 w-8 items-center justify-center rounded-full border border-black/10 bg-white/90 text-black/70 shadow-sm backdrop-blur transition hover:bg-white hover:text-black">
                  <Edit3 className="h-4 w-4" />
                </button>
              </div>

              {/* Name & Basic Info */}
              <div className="mt-4 text-center sm:mt-0 sm:pb-2 sm:text-left">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl">
                  {displayName}
                </h1>
                <div className="mt-1 flex flex-wrap items-center justify-center gap-2 text-sm text-gray-500 sm:justify-start">
                  <span className="inline-flex items-center gap-1.5 font-medium">
                    {isPartnerProfile ? (
                      <Store className="h-4 w-4 text-[#A87935]" />
                    ) : (
                      <ShieldCheck className="h-4 w-4 text-[#A87935]" />
                    )}
                    {roleChip}
                  </span>
                  <span>&bull;</span>
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    {dateChip}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-wrap justify-center gap-3 sm:mt-0 sm:pb-2 sm:justify-end">
              <button 
                onClick={() => { setActiveTab("profile"); setEditing(true); }}
                className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2.5 text-sm font-semibold text-gray-900 transition hover:bg-gray-200"
              >
                <Edit3 className="h-4 w-4" />
                Edit Profile
              </button>
              <button 
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-lg bg-[#171513] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-black"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation (Facebook style) */}
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 border-t border-gray-200">
          <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
            {[
              { id: "profile", name: "About & Details", icon: User2 },
              { id: "orders", name: "Orders & Activity", icon: Package2 },
              { id: "partner", name: "Boutique Hub", icon: Store, hidden: !hasPartnerProfile && !isPartnerProfile }
            ].filter(tab => !tab.hidden).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                  group inline-flex items-center gap-2 whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium transition-colors
                  ${activeTab === tab.id 
                    ? "border-[#A87935] text-[#A87935]" 
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"}
                `}
              >
                <tab.icon className={`h-5 w-5 ${activeTab === tab.id ? "text-[#A87935]" : "text-gray-400 group-hover:text-gray-500"}`} />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        
        {/* 2. Amazon-style Stats Dashboard (Visible across all tabs as a quick overview) */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="flex flex-col rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-wider text-gray-500">{stat.label}</span>
                  <div className="rounded-full bg-gray-50 p-2 text-[#A87935]">
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-2xl font-semibold text-gray-900">{stat.value}</span>
                </div>
                <div className="mt-1 text-xs text-gray-500">{stat.detail}</div>
              </div>
            );
          })}
        </div>

        {/* 3. Tab Content Area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "profile" && (
              <div className="space-y-6">
                
                {/* Profile Details Form */}
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                  <div className="border-b border-gray-200 bg-gray-50/50 px-6 py-5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
                      {editing ? (
                        <button onClick={cancelEdit} className="text-sm font-medium text-gray-500 hover:text-gray-700">Cancel</button>
                      ) : (
                        <button onClick={() => setEditing(true)} className="text-sm font-medium text-[#A87935] hover:text-[#8a6125]">Edit Info</button>
                      )}
                    </div>
                  </div>
                  <div className="px-6 py-6">
                    <form onSubmit={(e) => { e.preventDefault(); saveProfile(); }}>
                      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                        {profileFields.map((field) => (
                          <div key={field.key}>
                            <label className="block text-sm font-medium text-gray-700">{field.label}</label>
                            <div className="mt-1">
                              <input
                                type="text"
                                autoComplete={field.autoComplete}
                                value={String(draft[field.key] ?? "")}
                                onChange={(e) => updateDraft(field.key, e.target.value)}
                                readOnly={!editing || field.readOnly}
                                placeholder={field.placeholder}
                                className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-[#A87935] focus:ring-[#A87935] sm:text-sm ${
                                  !editing || field.readOnly ? "bg-gray-50 text-gray-500" : "bg-white"
                                }`}
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-8 border-t border-gray-200 pt-8">
                        <h4 className="text-base font-medium text-gray-900">Delivery Address</h4>
                        <p className="mt-1 text-sm text-gray-500">Used to pre-fill your checkout for faster shopping.</p>
                        <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                          {deliveryFields.map((field) => (
                            <div key={field.key}>
                              <label className="block text-sm font-medium text-gray-700">{field.label}</label>
                              <div className="mt-1">
                                <input
                                  type="text"
                                  autoComplete={field.autoComplete}
                                  value={String(draft[field.key] ?? "")}
                                  onChange={(e) => updateDraft(field.key, e.target.value)}
                                  readOnly={!editing}
                                  placeholder={field.placeholder}
                                  className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-[#A87935] focus:ring-[#A87935] sm:text-sm ${
                                    !editing ? "bg-gray-50 text-gray-500" : "bg-white"
                                  }`}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {editing && (
                        <div className="mt-8 flex justify-end">
                          <button
                            type="submit"
                            disabled={saving || !hasChanges}
                            className="inline-flex justify-center rounded-md border border-transparent bg-[#171513] py-2 px-6 text-sm font-medium text-white shadow-sm hover:bg-black focus:outline-none focus:ring-2 focus:ring-[#A87935] focus:ring-offset-2 disabled:opacity-50"
                          >
                            {saving ? "Saving..." : "Save Changes"}
                          </button>
                        </div>
                      )}
                    </form>
                  </div>
                </div>

                {/* Account Intent (Buyer/Partner) */}
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                  <div className="border-b border-gray-200 bg-gray-50/50 px-6 py-5">
                    <h3 className="text-lg font-medium text-gray-900">Account Type</h3>
                  </div>
                  <div className="px-6 py-6">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      {accountIntentOptions.map((option) => {
                        const Icon = option.icon;
                        const active = (draft.accountIntent ?? "buyer") === option.value;
                        return (
                          <button
                            key={option.value}
                            type="button"
                            disabled={!editing}
                            onClick={() => updateDraft("accountIntent", option.value)}
                            className={`relative flex cursor-pointer rounded-lg border p-4 shadow-sm focus:outline-none ${
                              active ? "border-[#A87935] bg-orange-50/30 ring-1 ring-[#A87935]" : "border-gray-300 bg-white"
                            }`}
                          >
                            <span className="flex flex-1">
                              <span className="flex flex-col">
                                <span className={`block text-sm font-medium ${active ? "text-[#A87935]" : "text-gray-900"}`}>
                                  <Icon className="mb-2 h-5 w-5" />
                                  {option.title}
                                </span>
                                <span className="mt-1 flex items-center text-xs text-gray-500">
                                  {option.copy}
                                </span>
                              </span>
                            </span>
                            {active && (
                              <CheckCircle2 className="h-5 w-5 text-[#A87935] absolute top-4 right-4" aria-hidden="true" />
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>

              </div>
            )}

            {activeTab === "orders" && (
              <div className="space-y-6">
                
                {/* Amazon-style Quick Action Tiles */}
                <h3 className="text-xl font-bold text-gray-900 mb-4">Your Account</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <Link href="/orders" className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md hover:border-gray-300">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f2f4f8]">
                      <Package2 className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Your Orders</h4>
                      <p className="text-sm text-gray-500">Track, return, or buy things again</p>
                    </div>
                  </Link>

                  <Link href="/wishlist" className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md hover:border-gray-300">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#fff0f0]">
                      <Heart className="h-6 w-6 text-red-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Your Wishlist</h4>
                      <p className="text-sm text-gray-500">View and manage saved items</p>
                    </div>
                  </Link>
                  
                  <Link href="/shop" className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md hover:border-gray-300">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f0f9ff]">
                      <ShoppingBag className="h-6 w-6 text-blue-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Keep Shopping</h4>
                      <p className="text-sm text-gray-500">Discover new arrivals and trends</p>
                    </div>
                  </Link>
                </div>

                <div className="mt-10 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                  <div className="border-b border-gray-200 bg-gray-50/50 px-6 py-5 flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">Recent Order Snapshot</h3>
                    <Link href="/orders" className="text-sm font-medium text-[#A87935] hover:text-[#8a6125]">View all orders &rarr;</Link>
                  </div>
                  <div className="px-6 py-6">
                    {recentOrder ? (
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-lg border border-gray-100 bg-gray-50 p-4">
                        <div className="mb-4 sm:mb-0">
                          <p className="text-sm font-medium text-gray-900">Order placed on {formatDate(recentOrder.createdAt)}</p>
                          <p className="text-sm text-gray-500 mt-1">Total: {formatCurrency(orderTotal(recentOrder))} • {orderItemCount(recentOrder)} items</p>
                          <div className="mt-3">
                            <StatusPill order={recentOrder} />
                          </div>
                        </div>
                        <Link
                          href={`/orders/${encodeURIComponent(recentOrder._id)}`}
                          className="inline-flex justify-center items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none"
                        >
                          View Order Details
                        </Link>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Package2 className="mx-auto h-12 w-12 text-gray-300" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No orders yet</h3>
                        <p className="mt-1 text-sm text-gray-500">Your recent purchases will appear here.</p>
                        <div className="mt-6">
                          <Link href="/shop" className="inline-flex items-center rounded-md border border-transparent bg-[#171513] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-black">
                            Start Shopping
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            )}

            {activeTab === "partner" && (
              <div className="space-y-6">
                
                {/* Boutique Dashboard Intro */}
                <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
                  <div className="bg-[#171513] px-6 py-8 text-white sm:px-10 flex flex-col sm:flex-row items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-bold">Boutique Partner Hub</h3>
                      <p className="mt-2 text-gray-400 max-w-xl">
                        Manage your boutique profile, upload products for review, and track your payout balance in one secure location.
                      </p>
                    </div>
                    <div className="mt-6 sm:mt-0">
                      <Link href={isPartnerProfile ? partnerPrimaryHref : hasPartnerProfile ? partnerProfileHref : "/boutiques"} className="inline-flex items-center justify-center rounded-lg bg-[#A87935] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#8a6125]">
                        {isPartnerProfile || hasPartnerProfile ? "Go to Dashboard" : "Apply Now"}
                      </Link>
                    </div>
                  </div>
                  
                  {isPartnerProfile ? (
                     <div className="grid grid-cols-1 divide-y divide-gray-200 sm:grid-cols-3 sm:divide-y-0 sm:divide-x">
                        <div className="px-6 py-5">
                          <p className="text-sm font-medium text-gray-500">Boutique Name</p>
                          <p className="mt-1 text-lg font-semibold text-gray-900">{selectedPartnerApplication?.boutiqueName}</p>
                          <p className="mt-1 text-sm text-gray-500">{titleCase(selectedPartnerApplication?.status)}</p>
                        </div>
                        <div className="px-6 py-5">
                          <p className="text-sm font-medium text-gray-500">Available Payout</p>
                          <p className="mt-1 text-lg font-semibold text-gray-900">{partnerSummary.wallet ? formatCurrency(partnerSummary.wallet.summary.available) : "EGP 0"}</p>
                          <Link href={partnerProductsHref} className="mt-1 text-sm text-[#A87935] hover:underline">Manage Wallet &rarr;</Link>
                        </div>
                        <div className="px-6 py-5">
                          <p className="text-sm font-medium text-gray-500">Pending Products</p>
                          <p className="mt-1 text-lg font-semibold text-gray-900">{partnerSummary.pendingProductCount}</p>
                          <Link href={partnerProductsHref} className="mt-1 text-sm text-[#A87935] hover:underline">Upload more &rarr;</Link>
                        </div>
                     </div>
                  ) : (
                    <div className="px-6 py-8 text-center sm:px-10">
                      <Store className="mx-auto h-12 w-12 text-gray-300" />
                      <h4 className="mt-4 text-lg font-medium text-gray-900">Become a BOUT Partner</h4>
                      <p className="mt-2 text-gray-500 max-w-lg mx-auto">
                        Reach a premium audience and grow your luxury business. We handle the platform, you focus on curation.
                      </p>
                    </div>
                  )}
                </div>

                {isPartnerProfile && (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Link href={partnerProductsHref} className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                        <Package2 className="h-6 w-6 text-gray-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Manage Products</h4>
                        <p className="text-sm text-gray-500">Upload and edit your inventory</p>
                      </div>
                    </Link>
                    <Link href={partnerSubscriptionHref} className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                        <CreditCard className="h-6 w-6 text-gray-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Subscription Plan</h4>
                        <p className="text-sm text-gray-500">View your billing and plan details</p>
                      </div>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}
