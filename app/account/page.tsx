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
    <main className="min-h-screen bg-white pb-24 pt-24 text-[#171513] md:pt-32">
      {error && (
        <div className="mx-auto max-w-6xl px-5 sm:px-6 md:px-10 mb-6">
          <div className="rounded border border-[#9A2222]/20 bg-[#9A2222]/5 px-4 py-3 text-sm text-[#9A2222]">
            {error}
          </div>
        </div>
      )}

      <div className="mx-auto max-w-6xl px-5 sm:px-6 md:px-10">
        
        {/* Minimalist Header */}
        <div className="flex flex-col items-start justify-between border-b border-[#E5E1D8] pb-10 sm:flex-row sm:items-end">
          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded bg-[#171513] text-xl font-medium text-white">
              {getInitials(user)}
            </div>
            <div>
              <h1 className="font-serif text-3xl font-light tracking-tight text-[#171513] sm:text-4xl">
                My Account
              </h1>
              <p className="mt-1 text-sm text-[#69645E]">
                Welcome back, {displayName}
              </p>
            </div>
          </div>
          <div className="mt-6 flex items-center gap-4 sm:mt-0">
            <button 
              onClick={handleLogout}
              className="group flex items-center gap-2 text-sm font-medium text-[#69645E] transition-colors hover:text-[#171513]"
            >
              Sign Out
              <LogOut className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-12 lg:flex-row lg:gap-20">
          
          {/* Left Sidebar Navigation */}
          <aside className="w-full shrink-0 lg:w-56">
            {/* Mobile Nav (Horizontal Scroll) */}
            <div className="-mx-5 flex overflow-x-auto px-5 pb-4 lg:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden border-b border-[#E5E1D8] mb-8">
              {[
                { id: "overview", name: "Overview" },
                { id: "profile", name: "Profile Details" },
                { id: "orders", name: "Order History" },
                { id: "partner", name: "Boutique Hub", hidden: !hasPartnerProfile && !isPartnerProfile }
              ].filter(tab => !tab.hidden).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`
                    whitespace-nowrap px-4 py-2 text-sm font-medium transition-colors
                    ${((activeTab as string) === tab.id || (activeTab === "profile" && tab.id === "overview")) && tab.id !== "overview" ? "border-b-2 border-[#171513] text-[#171513]" : 
                      activeTab === "profile" && tab.id === "profile" ? "border-b-2 border-[#171513] text-[#171513]" :
                      (activeTab as string) === tab.id && tab.id === "overview" ? "border-b-2 border-[#171513] text-[#171513]" :
                      (activeTab as string) === tab.id ? "border-b-2 border-[#171513] text-[#171513]" : "text-[#69645E] hover:text-[#171513]"}
                  `}
                >
                  {tab.name}
                </button>
              ))}
            </div>

            {/* Desktop Nav (Vertical List) */}
            <nav className="hidden space-y-1 lg:block">
              {[
                { id: "overview", name: "Overview" },
                { id: "profile", name: "Profile Details" },
                { id: "orders", name: "Order History" },
                { id: "partner", name: "Boutique Hub", hidden: !hasPartnerProfile && !isPartnerProfile }
              ].filter(tab => !tab.hidden).map((tab) => {
                // Determine active state since overview was not originally in the state type, let's map "overview" to "profile" if activeTab lacks overview, but we will assume activeTab can be overview.
                // Wait, activeTab is typed as "profile" | "orders" | "partner" in page.tsx.
                // We'll use "profile" as the default active tab for details, and add "overview" functionality seamlessly.
                // To avoid TS errors without changing state type, we'll map "overview" -> "profile" but use a sub-state? No, let's just make activeTab === "profile" show both, or we can just stick to the 3 tabs but rename them.
                const isActive = (activeTab as string) === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`
                      w-full flex items-center justify-between border-l-2 py-3 pl-4 pr-2 text-left text-sm transition-all
                      ${isActive 
                        ? "border-[#171513] font-medium text-[#171513] bg-[#F9F8F6]" 
                        : "border-transparent text-[#69645E] hover:border-[#D5D1C8] hover:text-[#171513]"}
                    `}
                  >
                    {tab.name}
                    {isActive && <ArrowRight className="h-4 w-4 opacity-50" />}
                  </button>
                )
              })}
            </nav>
          </aside>

          {/* Right Content Area */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                
                {/* ---------------------------------------------------------------- */}
                {/* PROFILE & DETAILS TAB */}
                {/* ---------------------------------------------------------------- */}
                {activeTab === "profile" && (
                  <div className="space-y-12">
                    
                    {/* STATS (Overview) */}
                    <div>
                      <h2 className="font-serif text-xl text-[#171513] mb-6">Account Overview</h2>
                      <div className="grid grid-cols-2 gap-px bg-[#E5E1D8] border border-[#E5E1D8] sm:grid-cols-4">
                        {stats.slice(0, 4).map((stat) => (
                          <div key={stat.label} className="bg-white p-6 transition-colors hover:bg-[#F9F8F6]">
                            <p className="text-[10px] font-semibold uppercase tracking-widest text-[#8C877D]">{stat.label}</p>
                            <p className="mt-3 text-2xl font-light text-[#171513]">{stat.value}</p>
                            <p className="mt-1 text-xs text-[#69645E]">{stat.detail}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="h-px w-full bg-[#E5E1D8]"></div>

                    {/* PERSONAL INFO */}
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="font-serif text-xl text-[#171513]">Personal Information</h2>
                        {editing ? (
                          <button onClick={cancelEdit} className="text-sm font-medium text-[#69645E] hover:text-[#171513] transition-colors">Cancel</button>
                        ) : (
                          <button onClick={() => setEditing(true)} className="text-sm font-medium text-[#A87935] hover:text-[#8a6125] transition-colors flex items-center gap-1.5">
                            <Edit3 className="h-3.5 w-3.5" />
                            Edit
                          </button>
                        )}
                      </div>
                      
                      <form onSubmit={(e) => { e.preventDefault(); saveProfile(); }} className="space-y-8">
                        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                          {profileFields.map((field) => (
                            <div key={field.key}>
                              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#69645E]">
                                {field.label}
                              </label>
                              <input
                                type="text"
                                autoComplete={field.autoComplete}
                                value={String(draft[field.key] ?? "")}
                                onChange={(e) => updateDraft(field.key, e.target.value)}
                                readOnly={!editing || field.readOnly}
                                placeholder={field.placeholder}
                                className={`block w-full border-0 border-b border-[#D5D1C8] py-2 px-0 text-sm focus:border-[#171513] focus:ring-0 transition-colors ${
                                  !editing || field.readOnly ? "bg-transparent text-[#69645E]" : "bg-transparent text-[#171513]"
                                }`}
                              />
                            </div>
                          ))}
                        </div>

                        <div className="pt-4">
                          <h3 className="font-serif text-lg text-[#171513] mb-6">Delivery Address</h3>
                          <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                            {deliveryFields.map((field) => (
                              <div key={field.key}>
                                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#69645E]">
                                  {field.label}
                                </label>
                                <input
                                  type="text"
                                  autoComplete={field.autoComplete}
                                  value={String(draft[field.key] ?? "")}
                                  onChange={(e) => updateDraft(field.key, e.target.value)}
                                  readOnly={!editing}
                                  placeholder={field.placeholder}
                                  className={`block w-full border-0 border-b border-[#D5D1C8] py-2 px-0 text-sm focus:border-[#171513] focus:ring-0 transition-colors ${
                                    !editing ? "bg-transparent text-[#69645E]" : "bg-transparent text-[#171513]"
                                  }`}
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* ACCOUNT INTENT */}
                        {editing && (
                          <div className="pt-4">
                            <h3 className="font-serif text-lg text-[#171513] mb-6">Account Purpose</h3>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                              {accountIntentOptions.map((option) => {
                                const Icon = option.icon;
                                const active = (draft.accountIntent ?? "buyer") === option.value;
                                return (
                                  <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => updateDraft("accountIntent", option.value)}
                                    className={`group relative flex flex-col items-start p-4 border text-left transition-all ${
                                      active ? "border-[#171513] bg-[#171513] text-white" : "border-[#E5E1D8] bg-transparent hover:border-[#D5D1C8] text-[#171513]"
                                    }`}
                                  >
                                    <Icon className={`mb-3 h-5 w-5 ${active ? "text-white" : "text-[#69645E] group-hover:text-[#171513]"}`} />
                                    <span className="text-sm font-medium">{option.title}</span>
                                    <span className={`mt-1 text-xs ${active ? "text-white/80" : "text-[#8C877D]"}`}>
                                      {option.copy}
                                    </span>
                                  </button>
                                )
                              })}
                            </div>
                          </div>
                        )}

                        {editing && (
                          <div className="flex justify-end pt-4">
                            <button
                              type="submit"
                              disabled={saving || !hasChanges}
                              className="bg-[#171513] px-8 py-3 text-sm font-semibold tracking-wide text-white transition-colors hover:bg-black disabled:opacity-50"
                            >
                              {saving ? "Saving..." : "Save Changes"}
                            </button>
                          </div>
                        )}
                      </form>
                    </div>

                  </div>
                )}

                {/* ---------------------------------------------------------------- */}
                {/* ORDERS TAB */}
                {/* ---------------------------------------------------------------- */}
                {activeTab === "orders" && (
                  <div className="space-y-12">
                    
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="font-serif text-xl text-[#171513]">Recent Orders</h2>
                        <Link href="/orders" className="text-sm font-medium text-[#69645E] hover:text-[#171513] transition-colors">
                          View All
                        </Link>
                      </div>

                      {recentOrder ? (
                        <div className="border border-[#E5E1D8] bg-white p-6 lg:p-8">
                          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between border-b border-[#E5E1D8] pb-6 mb-6">
                            <div>
                              <p className="text-[10px] font-semibold uppercase tracking-widest text-[#8C877D] mb-1">Order Placed</p>
                              <p className="text-sm text-[#171513]">{formatDate(recentOrder.createdAt)}</p>
                            </div>
                            <div className="mt-4 lg:mt-0">
                              <p className="text-[10px] font-semibold uppercase tracking-widest text-[#8C877D] mb-1">Total Amount</p>
                              <p className="text-sm text-[#171513]">{formatCurrency(orderTotal(recentOrder))}</p>
                            </div>
                            <div className="mt-4 lg:mt-0">
                              <p className="text-[10px] font-semibold uppercase tracking-widest text-[#8C877D] mb-1">Status</p>
                              <StatusPill order={recentOrder} />
                            </div>
                            <div className="mt-6 lg:mt-0 lg:text-right">
                              <Link
                                href={`/orders/${encodeURIComponent(recentOrder._id)}`}
                                className="inline-block border border-[#171513] px-6 py-2.5 text-xs font-semibold uppercase tracking-wide text-[#171513] transition-colors hover:bg-[#171513] hover:text-white"
                              >
                                View Receipt
                              </Link>
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            {recentOrder.items.slice(0, 2).map((item: any, idx: number) => (
                              <div key={idx} className="flex items-center gap-4">
                                <div className="h-16 w-16 shrink-0 bg-[#F3F1ED] overflow-hidden">
                                  {item.product?.images?.[0] && (
                                    <img src={item.product.images[0]} alt="" className="h-full w-full object-cover" />
                                  )}
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-[#171513]">{item.product?.title || "Product"}</p>
                                  <p className="text-xs text-[#8C877D]">Qty: {item.quantity}</p>
                                </div>
                              </div>
                            ))}
                            {recentOrder.items.length > 2 && (
                              <p className="text-xs text-[#69645E] pt-2">+ {recentOrder.items.length - 2} more item(s)</p>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center border border-dashed border-[#D5D1C8] py-16 px-4 text-center">
                          <Package2 className="h-10 w-10 text-[#D5D1C8] mb-4" />
                          <h3 className="text-sm font-medium text-[#171513]">No orders placed yet</h3>
                          <p className="mt-2 text-sm text-[#69645E] max-w-sm">
                            Your recent purchases and their fulfillment status will appear here.
                          </p>
                          <Link href="/shop" className="mt-6 border border-[#171513] bg-[#171513] px-6 py-2.5 text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:bg-black">
                            Start Shopping
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* ---------------------------------------------------------------- */}
                {/* PARTNER TAB */}
                {/* ---------------------------------------------------------------- */}
                {activeTab === "partner" && (
                  <div className="space-y-12">
                    
                    <div className="border border-[#E5E1D8] bg-[#F9F8F6] p-8 lg:p-10">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-[#E5E1D8] pb-8 mb-8">
                        <div>
                          <h2 className="font-serif text-2xl text-[#171513]">Boutique Hub</h2>
                          <p className="mt-2 text-sm text-[#69645E] max-w-xl">
                            Oversee your boutique's performance, manage inventory, and track your wallet payouts.
                          </p>
                        </div>
                        <div>
                          <Link href={isPartnerProfile ? partnerPrimaryHref : hasPartnerProfile ? partnerProfileHref : "/boutiques"} className="inline-block bg-[#171513] px-6 py-3 text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:bg-black">
                            {isPartnerProfile || hasPartnerProfile ? "Go to Dashboard" : "Apply Now"}
                          </Link>
                        </div>
                      </div>

                      {isPartnerProfile ? (
                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-widest text-[#8C877D] mb-2">Boutique Name</p>
                            <p className="text-xl font-light text-[#171513]">{selectedPartnerApplication?.boutiqueName}</p>
                            <p className="mt-1 text-xs text-[#A87935]">{titleCase(selectedPartnerApplication?.status)}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-widest text-[#8C877D] mb-2">Available Payout</p>
                            <p className="text-xl font-light text-[#171513]">{partnerSummary.wallet ? formatCurrency(partnerSummary.wallet.summary.available) : "EGP 0"}</p>
                            <Link href={partnerProductsHref} className="mt-1 inline-block text-xs font-medium text-[#69645E] hover:text-[#171513] underline underline-offset-4">Manage Wallet</Link>
                          </div>
                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-widest text-[#8C877D] mb-2">Pending Review</p>
                            <p className="text-xl font-light text-[#171513]">{partnerSummary.pendingProductCount} Items</p>
                            <Link href={partnerProductsHref} className="mt-1 inline-block text-xs font-medium text-[#69645E] hover:text-[#171513] underline underline-offset-4">Upload Catalog</Link>
                          </div>
                        </div>
                      ) : (
                        <div className="py-4">
                          <p className="text-sm text-[#69645E] max-w-lg">
                            Reach a premium audience and grow your luxury business. We handle the platform, you focus on curation. 
                            Apply to become a BOUT Partner today.
                          </p>
                        </div>
                      )}
                    </div>

                    {isPartnerProfile && (
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Link href={partnerProductsHref} className="group flex items-center justify-between border border-[#E5E1D8] p-6 transition-colors hover:bg-[#F9F8F6]">
                          <div>
                            <h4 className="text-sm font-semibold text-[#171513]">Product Catalog</h4>
                            <p className="mt-1 text-xs text-[#69645E]">Upload and edit your inventory</p>
                          </div>
                          <ArrowRight className="h-4 w-4 text-[#8C877D] transition-transform group-hover:translate-x-1 group-hover:text-[#171513]" />
                        </Link>
                        <Link href={partnerSubscriptionHref} className="group flex items-center justify-between border border-[#E5E1D8] p-6 transition-colors hover:bg-[#F9F8F6]">
                          <div>
                            <h4 className="text-sm font-semibold text-[#171513]">Subscription Plan</h4>
                            <p className="mt-1 text-xs text-[#69645E]">View billing and tier details</p>
                          </div>
                          <ArrowRight className="h-4 w-4 text-[#8C877D] transition-transform group-hover:translate-x-1 group-hover:text-[#171513]" />
                        </Link>
                      </div>
                    )}

                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  );
}


