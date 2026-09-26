"use client";

import { showToast } from "@/components/ToastProvider";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock,
  CreditCard,
  Edit3,
  Heart,
  LogOut,
  Package2,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Store,
} from "lucide-react";import Image from "next/image";
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

type AccountOrderItem = {
  productId?: string;
  name?: string;
  price?: number;
  quantity?: number;
  image?: string;
  size?: string | null;
  color?: string | null;
};

type AccountOrder = {
  _id: string;
  id?: string;
  status?: string;
  paymentStatus?: string;
  paymentMethod?: string;
  total?: number;
  totalPrice?: number;
  createdAt?: string;
  items?: AccountOrderItem[];
  timeline?: Array<{ status?: string; at?: string; note?: string }>;
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

type Loyalty = { points: number; tier: string; ordersCount: number };

type ReturnRow = {
  _id: string;
  orderId: string;
  reason: string;
  status: string;
  createdAt?: string;
};

type FieldConfig = {
  key: keyof AccountUser;
  label: string;
  placeholder: string;
  autoComplete?: string;
  readOnly?: boolean;
};

type TabId = "overview" | "orders" | "profile" | "boutique" | "security";

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

function normalizePartnerSummary(value: unknown): PartnerProfileSummary {
  const record = (value && typeof value === "object" ? value : {}) as Partial<PartnerProfileSummary>;
  return {
    applications: Array.isArray(record.applications) ? record.applications : [],
    selectedApplication:
      record.selectedApplication && typeof record.selectedApplication === "object"
        ? record.selectedApplication
        : null,
    wallet: normalizePartnerWallet(record.wallet),
    pendingProductCount: getFiniteNumber(record.pendingProductCount),
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
    copy: "Shopping, wishlist, delivery, and orders.",
    icon: ShoppingBag,
  },
  {
    value: "partner",
    title: "List a boutique",
    copy: "Apply, upload products, manage partner review.",
    icon: Building2,
  },
  {
    value: "both",
    title: "Buy and partner",
    copy: "Shop while submitting boutique products.",
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

function getProfileCompletion(user: AccountUser | null) {
  if (!user) return 0;
  const completed = completionFields.filter((field) => Boolean(String(user[field] ?? "").trim())).length;
  return Math.round((completed / completionFields.length) * 100);
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

function StatusPill({ order }: { order?: AccountOrder }) {
  const paid = order?.paymentStatus === "paid" || order?.status === "completed" || order?.status === "delivered";
  const label = paid ? "Completed" : titleCase(order?.status || order?.paymentStatus);
  const Icon = paid ? CheckCircle2 : Clock;

  return (
    <span
      className="inline-flex min-h-[34px] items-center gap-2 rounded-full px-3 text-[9px] uppercase tracking-[0.24em]"
      style={{
        background: paid ? "rgba(80,160,100,0.1)" : "rgba(168,121,53,0.12)",
        border: paid ? "1px solid rgba(80,160,100,0.18)" : "1px solid rgba(168,121,53,0.22)",
        color: paid ? "#3C7A4D" : "var(--gold-text)",
      }}
    >
      <Icon className="h-3.5 w-3.5" strokeWidth={1.3} />
      {label}
    </span>
  );
}

function SectionTitle({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="mb-5 flex items-center justify-between gap-3">
      <h2
        className="font-light text-[#3D3025]"
        style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem", letterSpacing: "0.04em" }}
      >
        {children}
      </h2>
      {action}
    </div>
  );
}

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<AccountUser | null>(null);
  const [draft, setDraft] = useState<AccountUser | null>(null);
  const [orders, setOrders] = useState<AccountOrder[]>([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [partnerSummary, setPartnerSummary] = useState<PartnerProfileSummary>(initialPartnerSummary);
  const [loyalty, setLoyalty] = useState<Loyalty>({ points: 0, tier: "Bronze", ordersCount: 0 });
  const [myReturns, setMyReturns] = useState<ReturnRow[]>([]);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [returnFor, setReturnFor] = useState<string | null>(null);
  const [returnReason, setReturnReason] = useState("");
  const [returnBusy, setReturnBusy] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [twoFactorQr, setTwoFactorQr] = useState("");
  const [twoFactorToken, setTwoFactorToken] = useState("");
  const [twoFactorBusy, setTwoFactorBusy] = useState(false);
  const [twoFactorMessage, setTwoFactorMessage] = useState("");
  const [revoking, setRevoking] = useState(false);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [referralConverted, setReferralConverted] = useState(0);
  const [pushMessage, setPushMessage] = useState("");
  const [pushBusy, setPushBusy] = useState(false);

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

        const account = (await profileResponse.json()) as AccountUser & { twoFactorEnabled?: boolean };
        if (controller.signal.aborted) return;
        setUser(account);
        setDraft(account);
        setTwoFactorEnabled(Boolean(account.twoFactorEnabled));
        setLoading(false);

        const [ordersResult, wishlistResult, partnerSummaryResult, loyaltyResult, returnsResult] =
          await Promise.allSettled([
            fetch("/api/orders", { cache: "no-store", signal: controller.signal }).then((res) =>
              res.ok ? res.json() : { orders: [] }
            ),
            fetch("/api/wishlist/list", { signal: controller.signal }).then((res) =>
              res.ok ? res.json() : { items: [], ids: [] }
            ),
            fetch("/api/partners/profile-summary", { cache: "no-store", signal: controller.signal }).then(
              async (res) => {
                const data = await res.json().catch(() => ({}));
                if (!res.ok) throw new Error(data?.error || "Unable to load partner summary");
                return data;
              }
            ),
            fetch("/api/loyalty", { cache: "no-store", signal: controller.signal }).then((res) =>
              res.ok ? res.json() : null
            ),
            fetch("/api/returns", { cache: "no-store", signal: controller.signal }).then((res) =>
              res.ok ? res.json() : { returns: [] }
            ),
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
            error:
              partnerSummaryResult.reason instanceof Error
                ? partnerSummaryResult.reason.message
                : "Unable to load partner summary",
          }));
        }

        if (loyaltyResult.status === "fulfilled" && loyaltyResult.value) {
          setLoyalty({
            points: Number(loyaltyResult.value.points ?? 0),
            tier: String(loyaltyResult.value.tier ?? "Bronze"),
            ordersCount: Number(loyaltyResult.value.ordersCount ?? 0),
          });
        }

        if (returnsResult.status === "fulfilled") {
          const rows = Array.isArray(returnsResult.value?.returns) ? returnsResult.value.returns : [];
          setMyReturns(rows);
        }

        fetch("/api/referrals", { cache: "no-store", signal: controller.signal })
          .then((res) => (res.ok ? res.json() : null))
          .then((data) => {
            if (controller.signal.aborted || !data) return;
            if (data.code) setReferralCode(String(data.code));
            setReferralConverted(Number(data.converted ?? 0));
          })
          .catch(() => undefined);
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
  const partnerProductsHref = selectedPartnerApplication
    ? `/partners/products?applicationId=${encodeURIComponent(selectedPartnerApplication._id)}`
    : "/partners/products";
  const partnerSubscriptionHref = selectedPartnerApplication
    ? `/partners/subscription?applicationId=${encodeURIComponent(selectedPartnerApplication._id)}`
    : "/partners/subscription";
  const displayName = user?.name || "Your profile";

  const tabs = useMemo(() => {
    const list: Array<{ id: TabId; label: string }> = [
      { id: "overview", label: "Overview" },
      { id: "orders", label: `Orders${orders.length > 0 ? ` (${orders.length})` : ""}` },
      { id: "profile", label: "Profile" },
    ];
    if (hasPartnerProfile) list.push({ id: "boutique", label: "Boutique" });
    list.push({ id: "security", label: "Security" });
    return list;
  }, [hasPartnerProfile, orders.length]);

  useEffect(() => {
    if (activeTab === "boutique" && !hasPartnerProfile) setActiveTab("overview");
  }, [activeTab, hasPartnerProfile]);

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

  async function submitReturn() {
    if (!returnFor || !returnReason.trim() || returnBusy) return;
    setReturnBusy(true);
    try {
      const res = await fetch("/api/returns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: returnFor, reason: returnReason.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not submit return request");
      showToast("Return request submitted.", "success");
      setReturnFor(null);
      setReturnReason("");
      const list = await fetch("/api/returns", { cache: "no-store" }).then((r) => r.json().catch(() => ({})));
      if (Array.isArray(list.returns)) setMyReturns(list.returns);
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Could not submit return request", "error");
    } finally {
      setReturnBusy(false);
    }
  }

  async function startTwoFactor() {
    setTwoFactorBusy(true);
    setTwoFactorMessage("");
    try {
      const res = await fetch("/api/auth/2fa", { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not start setup");
      setTwoFactorQr(String(data.qr ?? ""));
      setTwoFactorMessage("Scan the code with your authenticator app, then enter the 6-digit code.");
    } catch (e) {
      setTwoFactorMessage(e instanceof Error ? e.message : "Could not start setup");
    } finally {
      setTwoFactorBusy(false);
    }
  }

  async function confirmTwoFactor() {
    setTwoFactorBusy(true);
    setTwoFactorMessage("");
    try {
      const res = await fetch("/api/auth/2fa", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: twoFactorToken }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Invalid code");
      setTwoFactorEnabled(true);
      setTwoFactorQr("");
      setTwoFactorToken("");
      setTwoFactorMessage("Two-factor authentication is on.");
      showToast("Two-factor enabled.", "success");
    } catch (e) {
      setTwoFactorMessage(e instanceof Error ? e.message : "Invalid code");
    } finally {
      setTwoFactorBusy(false);
    }
  }

  async function enablePush() {
    setPushBusy(true);
    setPushMessage("");
    try {
      const { enablePushNotifications } = await import("@/lib/pushClient");
      const result = await enablePushNotifications();
      setPushMessage(result.message);
      if (result.ok) showToast(result.message, "success");
    } finally {
      setPushBusy(false);
    }
  }

  async function revokeSessions() {    setRevoking(true);
    try {
      const res = await fetch("/api/auth/revoke", { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not revoke sessions");
      showToast("All other sessions signed out.", "success");
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Could not revoke sessions", "error");
    } finally {
      setRevoking(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F5F1E8] pt-20 sm:pt-24">
        <div className="mx-auto flex min-h-[55vh] max-w-3xl items-center justify-center px-4">
          <motion.p
            animate={{ opacity: [0.35, 0.78, 0.35] }}
            transition={{ duration: 1.6, repeat: Infinity }}
            className="text-[10px] uppercase tracking-[0.4em]"
            style={{ color: "var(--gold-text)", fontFamily: "'Jost', sans-serif" }}
          >
            Loading Account
          </motion.p>
        </div>
      </main>
    );
  }

  if (!user || !draft) {
    return (
      <main className="min-h-screen bg-[#F5F1E8] px-4 pb-[calc(7.25rem+env(safe-area-inset-bottom))] pt-14 text-[#3D3025] sm:px-6 sm:pt-24 md:px-10">
        <div className="mx-auto max-w-3xl">
          <Card>
            <p className="text-[10px] uppercase tracking-[0.4em]" style={{ color: "var(--gold-text)" }}>
              Private Account
            </p>
            <h1
              className="mt-3 font-light"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem,5vw,2.8rem)" }}
            >
              Account Unavailable
            </h1>
            <p className="mt-4 text-sm leading-7" style={{ color: "rgba(61,48,37,0.75)" }}>
              {error || "We could not load your account details right now. Please refresh or sign in again."}
            </p>
            <div className="mt-6">
              <Link href="/login">
                <Button>Sign In Again</Button>
              </Link>
            </div>
          </Card>
        </div>
      </main>
    );
  }

  const stats = [
    { label: "Orders", value: String(orders.length), detail: recentOrder ? `Latest ${formatDate(recentOrder.createdAt)}` : "No purchases yet", icon: Package2, href: "/orders" },
    { label: "Wishlist", value: String(wishlistCount), detail: wishlistCount === 1 ? "Saved piece" : "Saved pieces", icon: Heart, href: "/wishlist" },
    { label: "Lifetime", value: formatCurrency(totalSpend), detail: `${loyalty.points} loyalty points · ${loyalty.tier}`, icon: CreditCard, href: "/orders" },
    { label: "Profile", value: `${profileCompletion}%`, detail: deliveryReady ? "Checkout ready" : `Missing: ${missingFields.slice(0, 2).join(", ") || "details"}`, icon: ShieldCheck, href: undefined as string | undefined },
  ];

  return (
    <main
      className="min-h-screen bg-[#F5F1E8] px-4 pb-[calc(7.25rem+env(safe-area-inset-bottom))] pt-16 text-[#3D3025] sm:px-6 sm:pt-24 md:px-10"
      style={{ fontFamily: "'Jost', sans-serif" }}
    >
      <div className="mx-auto max-w-6xl">
        {error && (
          <div
            className="mb-5 rounded-2xl px-4 py-3 text-sm"
            role="alert"
            style={{ background: "rgba(154,34,34,0.08)", border: "1px solid rgba(154,34,34,0.22)", color: "#9A2222" }}
          >
            {error}
          </div>
        )}

        {/* ── Header ── */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div
              className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-xl font-light"
              style={{
                background: "linear-gradient(135deg, rgba(168,121,53,0.2), rgba(168,121,53,0.06))",
                border: "1px solid rgba(168,121,53,0.3)",
                color: "var(--gold-text)",
                fontFamily: "'Cormorant Garamond', serif",
              }}
              aria-hidden
            >
              {getInitials(user)}
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-[0.45em]" style={{ color: "var(--gold-text)" }}>
                Private Account{user.role === "admin" ? " · Admin" : ""}
              </p>
              <h1
                className="mt-1 font-light leading-none"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem,5vw,3rem)" }}
              >
                {displayName}
              </h1>
              <p className="mt-1.5 text-sm" style={{ color: "rgba(61,48,37,0.7)" }}>
                {user.email} · Member since {formatDate(user.createdAt)}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex min-h-[44px] items-center gap-2 self-start rounded-full px-4 text-[10px] uppercase tracking-[0.22em] transition-colors sm:self-auto"
            style={{ border: "1px solid rgba(123,103,82,0.25)", color: "rgba(61,48,37,0.75)" }}
          >
            <LogOut className="h-4 w-4" strokeWidth={1.4} />
            Sign Out
          </button>
        </div>

        {/* ── Stats ── */}
        <div className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            const body = (
              <>
                <span className="flex items-center gap-2 text-[9px] uppercase tracking-[0.24em]" style={{ color: "var(--gold-text)" }}>
                  <Icon className="h-3.5 w-3.5" strokeWidth={1.4} />
                  {stat.label}
                </span>
                <span
                  className="mt-2 block font-light"
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.7rem", lineHeight: 1 }}
                >
                  {stat.value}
                </span>
                <span className="mt-1 block text-xs" style={{ color: "rgba(61,48,37,0.65)" }}>
                  {stat.detail}
                </span>
              </>
            );
            return stat.href ? (
              <Link key={stat.label} href={stat.href} className="rounded-2xl p-4 transition-shadow sm:p-5" style={{ border: "1px solid rgba(123,103,82,0.16)", background: "rgba(255,255,255,0.55)" }}>
                {body}
              </Link>
            ) : (
              <div key={stat.label} className="rounded-2xl p-4 sm:p-5" style={{ border: "1px solid rgba(123,103,82,0.16)", background: "rgba(255,255,255,0.55)" }}>
                {body}
              </div>
            );
          })}
        </div>

        {/* ── Tabs ── */}
        <div
          className="sticky top-[3.4rem] z-30 -mx-4 mt-7 border-y px-4 py-2 sm:top-[3.7rem] sm:mx-0 sm:rounded-2xl sm:border sm:px-3"
          style={{ borderColor: "rgba(123,103,82,0.16)", background: "rgba(245,241,232,0.92)", backdropFilter: "blur(16px)" }}
          role="tablist"
          aria-label="Account sections"
        >
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map((tab) => {
              const selected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setActiveTab(tab.id)}
                  className="whitespace-nowrap rounded-full px-4 py-2.5 text-[10px] uppercase tracking-[0.2em] transition-colors"
                  style={
                    selected
                      ? { background: "#3D3025", color: "#FFF9EF" }
                      : { color: "rgba(61,48,37,0.65)" }
                  }
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Panels ── */}
        <div className="mt-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              role="tabpanel"
            >
              {activeTab === "overview" && (
                <div className="grid gap-4 lg:grid-cols-2">
                  <Card>
                    <span className="flex items-center gap-2 text-[9px] uppercase tracking-[0.24em]" style={{ color: "var(--gold-text)" }}>
                      <Sparkles className="h-3.5 w-3.5" strokeWidth={1.4} />
                      Loyalty
                    </span>
                    <p className="mt-2 font-light" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem", lineHeight: 1 }}>
                      {loyalty.points} <span className="text-base">points · {loyalty.tier}</span>
                    </p>
                    <p className="mt-1 text-xs" style={{ color: "rgba(61,48,37,0.65)" }}>
                      1 point per EGP 100 · {loyalty.ordersCount} counted orders
                    </p>
                  </Card>
                  <Card>
                    <span className="flex items-center gap-2 text-[9px] uppercase tracking-[0.24em]" style={{ color: "var(--gold-text)" }}>
                      <Heart className="h-3.5 w-3.5" strokeWidth={1.4} />
                      Refer & Earn
                    </span>
                    {referralCode ? (
                      <>
                        <p className="mt-2 font-light" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem", lineHeight: 1 }}>
                          {referralCode}
                        </p>
                        <p className="mt-1 text-xs" style={{ color: "rgba(61,48,37,0.65)" }}>
                          Share it — you both get 200 bonus points. {referralConverted} joined.
                        </p>
                        <div className="mt-3">
                          <Button
                            variant="secondary"
                            onClick={() => {
                              const url = `${window.location.origin}/signup?ref=${encodeURIComponent(referralCode)}`;
                              navigator.clipboard?.writeText(url).then(
                                () => showToast("Referral link copied.", "success"),
                                () => showToast(url, "success")
                              );
                            }}
                          >
                            Copy Invite Link
                          </Button>
                        </div>
                      </>
                    ) : (
                      <p className="mt-2 text-sm" style={{ color: "rgba(61,48,37,0.7)" }}>
                        Sign in to get your referral code.
                      </p>
                    )}
                  </Card>
                  <Card>
                    <span className="flex items-center gap-2 text-[9px] uppercase tracking-[0.24em]" style={{ color: "var(--gold-text)" }}>
                      <ShieldCheck className="h-3.5 w-3.5" strokeWidth={1.4} />
                      Next Steps
                    </span>
                    <ul className="mt-3 space-y-3">
                      {!deliveryReady && (
                        <li>
                          <button type="button" onClick={() => setActiveTab("profile")} className="flex w-full items-center justify-between gap-3 text-left">
                            <span className="text-sm">Finish checkout profile{missingFields.length > 0 ? ` — missing ${missingFields.slice(0, 2).join(", ")}` : ""}</span>
                            <ArrowRight className="h-4 w-4 shrink-0" style={{ color: "var(--gold-text)" }} />
                          </button>
                        </li>
                      )}
                      <li>
                        <Link href={wishlistCount > 0 ? "/wishlist" : "/shop"} className="flex w-full items-center justify-between gap-3">
                          <span className="text-sm">{wishlistCount > 0 ? `Review ${wishlistCount} saved ${wishlistCount === 1 ? "piece" : "pieces"}` : "Build a shortlist"}</span>
                          <ArrowRight className="h-4 w-4 shrink-0" style={{ color: "var(--gold-text)" }} />
                        </Link>
                      </li>
                      <li>
                        <Link href={orders.length > 0 ? "/orders" : "/shop"} className="flex w-full items-center justify-between gap-3">
                          <span className="text-sm">{orders.length > 0 ? "Track order progress" : "Start shopping"}</span>
                          <ArrowRight className="h-4 w-4 shrink-0" style={{ color: "var(--gold-text)" }} />
                        </Link>
                      </li>
                      {!hasPartnerProfile && (
                        <li>
                          <Link href="/boutiques" className="flex w-full items-center justify-between gap-3">
                            <span className="text-sm">Explore boutique partnership (optional)</span>
                            <ArrowRight className="h-4 w-4 shrink-0" style={{ color: "var(--gold-text)" }} />
                          </Link>
                        </li>
                      )}
                    </ul>
                  </Card>
                  {recentOrder && (
                    <Card className="lg:col-span-2">                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="text-[9px] uppercase tracking-[0.24em]" style={{ color: "var(--gold-text)" }}>
                            Latest Order · {formatDate(recentOrder.createdAt)}
                          </p>
                          <p className="mt-1 font-light" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem" }}>
                            {formatCurrency(orderTotal(recentOrder))}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <StatusPill order={recentOrder} />
                          <Link href={`/orders/${encodeURIComponent(recentOrder._id)}`}>
                            <Button variant="secondary">Receipt</Button>
                          </Link>
                        </div>
                      </div>
                    </Card>
                  )}
                </div>
              )}

              {activeTab === "orders" && (
                <div className="grid gap-4">
                  <SectionTitle
                    action={
                      <Link href="/orders" className="text-[10px] uppercase tracking-[0.22em]" style={{ color: "var(--gold-text)" }}>
                        View All
                      </Link>
                    }
                  >
                    Order History
                  </SectionTitle>
                  {sortedOrders.length === 0 ? (
                    <Card>
                      <p className="font-light" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem" }}>
                        No orders yet
                      </p>
                      <p className="mt-1 text-sm" style={{ color: "rgba(61,48,37,0.7)" }}>
                        Your purchases and their status will appear here.
                      </p>
                      <div className="mt-4">
                        <Link href="/shop">
                          <Button>Start Shopping</Button>
                        </Link>
                      </div>
                    </Card>
                  ) : (
                    sortedOrders.slice(0, 10).map((order) => (
                      <Card key={order._id}>
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="text-[9px] uppercase tracking-[0.24em]" style={{ color: "var(--gold-text)" }}>
                              {formatDate(order.createdAt)} · {(order.items ?? []).reduce((s, i) => s + Number(i.quantity ?? 1), 0)} items
                            </p>
                            <p className="mt-1 font-light" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem" }}>
                              {formatCurrency(orderTotal(order))}
                            </p>
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            <StatusPill order={order} />
                            <Link href={`/orders/${encodeURIComponent(order._id)}`}>
                              <Button variant="secondary">Receipt</Button>
                            </Link>
                            {!["cancelled", "refunded"].includes(String(order.status)) && (
                              <Button variant="ghost" onClick={() => { setReturnFor(order._id); setReturnReason(""); }}>
                                Return
                              </Button>
                            )}
                          </div>
                        </div>
                        {(order.items ?? []).slice(0, 3).map((item, idx) => (
                          <div key={idx} className="mt-3 flex items-center gap-3">
                            {item.image ? (
                              <span className="relative block h-12 w-12 shrink-0 overflow-hidden rounded-xl" style={{ border: "1px solid rgba(123,103,82,0.15)" }}>
                                <Image src={item.image} alt="" fill className="object-cover" sizes="48px" />
                              </span>
                            ) : null}
                            <p className="text-sm">
                              {item.name || "Product"}{" "}
                              <span style={{ color: "rgba(61,48,37,0.6)" }}>× {item.quantity ?? 1}</span>
                            </p>
                          </div>
                        ))}
                        {Array.isArray(order.timeline) && order.timeline.length > 0 && (
                          <ol className="mt-4 space-y-1.5 border-t pt-3" style={{ borderColor: "rgba(123,103,82,0.15)" }}>
                            {order.timeline.slice(-4).map((t, i) => (
                              <li key={i} className="text-xs" style={{ color: "rgba(61,48,37,0.7)" }}>
                                <span style={{ color: "var(--gold-text)" }}>{titleCase(t.status)}</span>
                                {t.at ? ` · ${formatDate(t.at)}` : ""}{t.note ? ` — ${t.note}` : ""}
                              </li>
                            ))}
                          </ol>
                        )}
                      </Card>
                    ))
                  )}
                  {myReturns.length > 0 && (
                    <>
                      <SectionTitle>My Returns</SectionTitle>
                      {myReturns.map((r) => (
                        <Card key={r._id}>
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <p className="text-sm">
                              {r.orderId} · <span style={{ color: "var(--gold-text)" }}>{titleCase(r.status)}</span>
                            </p>
                            <p className="text-xs" style={{ color: "rgba(61,48,37,0.6)" }}>{formatDate(r.createdAt)}</p>
                          </div>
                          <p className="mt-1 text-sm" style={{ color: "rgba(61,48,37,0.75)" }}>{r.reason}</p>
                        </Card>
                      ))}
                    </>
                  )}
                </div>
              )}

              {activeTab === "profile" && (
                <Card>
                  <div className="mb-6 flex items-center justify-between gap-3">
                    <h2 className="font-light text-[#3D3025]" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem" }}>
                      Personal Information
                    </h2>
                    {editing ? (
                      <Button variant="ghost" onClick={cancelEdit}>Cancel</Button>
                    ) : (
                      <Button variant="secondary" onClick={() => setEditing(true)}>
                        <Edit3 className="h-3.5 w-3.5" /> Edit
                      </Button>
                    )}
                  </div>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      saveProfile();
                    }}
                    className="grid gap-6"
                  >
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {profileFields.map((field) => (
                        <label key={field.key} className="block">
                          <span className="mb-2 block text-[10px] uppercase tracking-[0.24em]" style={{ color: "var(--gold-text)" }}>
                            {field.label}
                          </span>
                          <Input
                            autoComplete={field.autoComplete}
                            value={String(draft[field.key] ?? "")}
                            onChange={(e) => updateDraft(field.key, e.target.value)}
                            readOnly={!editing || field.readOnly}
                            placeholder={field.placeholder}
                          />
                        </label>
                      ))}
                    </div>
                    <div>
                      <h3 className="mb-4 font-light text-[#3D3025]" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.25rem" }}>
                        Delivery Address
                      </h3>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {deliveryFields.map((field) => (
                          <label key={field.key} className="block">
                            <span className="mb-2 block text-[10px] uppercase tracking-[0.24em]" style={{ color: "var(--gold-text)" }}>
                              {field.label}
                            </span>
                            <Input
                              autoComplete={field.autoComplete}
                              value={String(draft[field.key] ?? "")}
                              onChange={(e) => updateDraft(field.key, e.target.value)}
                              readOnly={!editing}
                              placeholder={field.placeholder}
                            />
                          </label>
                        ))}
                      </div>
                    </div>
                    {editing && (
                      <div>
                        <h3 className="mb-4 font-light text-[#3D3025]" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.25rem" }}>
                          Account Purpose
                        </h3>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3" role="radiogroup" aria-label="Account purpose">
                          {accountIntentOptions.map((option) => {
                            const Icon = option.icon;
                            const selected = (draft.accountIntent ?? "buyer") === option.value;
                            return (
                              <button
                                key={option.value}
                                type="button"
                                role="radio"
                                aria-checked={selected}
                                onClick={() => updateDraft("accountIntent", option.value)}
                                className="flex flex-col items-start gap-1 rounded-2xl p-4 text-left transition-colors"
                                style={
                                  selected
                                    ? { background: "#3D3025", color: "#FFF9EF", border: "1px solid #3D3025" }
                                    : { border: "1px solid rgba(123,103,82,0.2)", color: "#3D3025" }
                                }
                              >
                                <Icon className="mb-1 h-5 w-5" style={{ color: selected ? "#FFF9EF" : "var(--gold-text)" }} />
                                <span className="text-sm font-medium">{option.title}</span>
                                <span className="text-xs" style={{ color: selected ? "rgba(255,249,239,0.75)" : "rgba(61,48,37,0.65)" }}>
                                  {option.copy}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    {editing && (
                      <div className="flex justify-end">
                        <Button type="submit" disabled={saving || !hasChanges}>
                          {saving ? "Saving…" : "Save Changes"}
                        </Button>
                      </div>
                    )}
                  </form>
                </Card>
              )}

              {activeTab === "boutique" && (
                <div className="grid gap-4">
                  <Card>
                    <span className="flex items-center gap-2 text-[9px] uppercase tracking-[0.24em]" style={{ color: "var(--gold-text)" }}>
                      <Store className="h-3.5 w-3.5" strokeWidth={1.4} />
                      Boutique Hub
                    </span>
                    {selectedPartnerApplication ? (
                      <div className="mt-3">
                        <p className="font-light" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.7rem", lineHeight: 1.1 }}>
                          {selectedPartnerApplication.boutiqueName}
                        </p>
                        <p className="mt-1 text-sm" style={{ color: "rgba(61,48,37,0.7)" }}>
                          {titleCase(selectedPartnerApplication.status)}
                          {selectedPartnerApplication.access?.message ? ` · ${selectedPartnerApplication.access.message}` : ""}
                        </p>
                        <div className="mt-4 grid gap-4 sm:grid-cols-3">
                          <div>
                            <p className="text-[9px] uppercase tracking-[0.24em]" style={{ color: "var(--gold-text)" }}>Available Payout</p>
                            <p className="mt-1 font-light" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem" }}>
                              {partnerSummary.wallet ? formatCurrency(partnerSummary.wallet.summary.available) : "EGP 0"}
                            </p>
                          </div>
                          <div>
                            <p className="text-[9px] uppercase tracking-[0.24em]" style={{ color: "var(--gold-text)" }}>Pending Review</p>
                            <p className="mt-1 font-light" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem" }}>
                              {partnerSummary.pendingProductCount}
                            </p>
                          </div>
                          <div>
                            <p className="text-[9px] uppercase tracking-[0.24em]" style={{ color: "var(--gold-text)" }}>Applications</p>
                            <p className="mt-1 font-light" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem" }}>
                              {partnerSummary.applications.length}
                            </p>
                          </div>
                        </div>
                        <div className="mt-5 flex flex-wrap gap-2">
                          <Link href={partnerProductsHref}>
                            <Button variant="secondary">Product Desk</Button>
                          </Link>
                          <Link href={partnerSubscriptionHref}>
                            <Button variant="secondary">Subscription</Button>
                          </Link>
                          <Link href="/partners/profile">
                            <Button variant="ghost">Partner Profile</Button>
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-3">
                        <p className="text-sm leading-7" style={{ color: "rgba(61,48,37,0.75)" }}>
                          Reach a premium audience — apply to list your boutique on BOUT.
                        </p>
                        <div className="mt-4">
                          <Link href="/boutiques/apply">
                            <Button>Apply Now</Button>
                          </Link>
                        </div>
                      </div>
                    )}
                  </Card>
                </div>
              )}

              {activeTab === "security" && (
                <div className="grid gap-4 lg:grid-cols-2">
                  <Card>
                    <span className="flex items-center gap-2 text-[9px] uppercase tracking-[0.24em]" style={{ color: "var(--gold-text)" }}>
                      <ShieldCheck className="h-3.5 w-3.5" strokeWidth={1.4} />
                      Two-Factor Authentication
                    </span>
                    <p className="mt-2 font-light" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem" }}>
                      {twoFactorEnabled ? "On" : "Off"}
                    </p>
                    {!twoFactorEnabled ? (
                      <div className="mt-3">
                        {!twoFactorQr ? (
                          <Button variant="secondary" onClick={startTwoFactor} disabled={twoFactorBusy}>
                            {twoFactorBusy ? "Starting…" : "Set Up 2FA"}
                          </Button>
                        ) : (
                          <div className="grid gap-3">
                            {twoFactorQr ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={twoFactorQr} alt="Authenticator QR code" className="h-40 w-40 rounded-xl" style={{ border: "1px solid rgba(123,103,82,0.2)" }} />
                            ) : null}
                            <Input
                              value={twoFactorToken}
                              onChange={(e) => setTwoFactorToken(e.target.value)}
                              placeholder="6-digit code"
                              inputMode="numeric"
                              aria-label="Authenticator code"
                              maxLength={10}
                            />
                            <div>
                              <Button onClick={confirmTwoFactor} disabled={twoFactorBusy || !twoFactorToken}>
                                {twoFactorBusy ? "Verifying…" : "Enable 2FA"}
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="mt-2 text-sm" style={{ color: "rgba(61,48,37,0.7)" }}>
                        Extra code required at sign-in. Disable from a signed-in session only.
                      </p>
                    )}
                    {twoFactorMessage ? (
                      <p className="mt-2 text-sm" role="status" style={{ color: "var(--gold-text)" }}>{twoFactorMessage}</p>
                    ) : null}
                  </Card>
                  <Card>
                    <span className="flex items-center gap-2 text-[9px] uppercase tracking-[0.24em]" style={{ color: "var(--gold-text)" }}>
                      <LogOut className="h-3.5 w-3.5" strokeWidth={1.4} />
                      Sessions
                    </span>                    <p className="mt-2 text-sm leading-7" style={{ color: "rgba(61,48,37,0.75)" }}>
                      Signed-in devices stay valid for 7 days. Revoking signs out every device, including this one — you will need to sign in again.
                    </p>
                    <div className="mt-4">
                      <Button variant="secondary" onClick={revokeSessions} disabled={revoking}>
                        {revoking ? "Revoking…" : "Sign Out Everywhere"}
                      </Button>
                    </div>
                  </Card>
                  <Card>
                    <span className="flex items-center gap-2 text-[9px] uppercase tracking-[0.24em]" style={{ color: "var(--gold-text)" }}>
                      <Sparkles className="h-3.5 w-3.5" strokeWidth={1.4} />
                      Notifications
                    </span>
                    <p className="mt-2 text-sm leading-7" style={{ color: "rgba(61,48,37,0.75)" }}>
                      Get order updates and restock alerts on this device.
                    </p>
                    <div className="mt-4">
                      <Button variant="secondary" onClick={enablePush} disabled={pushBusy}>
                        {pushBusy ? "Enabling…" : "Enable Push"}
                      </Button>
                    </div>
                    {pushMessage ? (
                      <p className="mt-2 text-sm" role="status" style={{ color: "var(--gold-text)" }}>{pushMessage}</p>
                    ) : null}
                  </Card>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <Modal open={returnFor !== null} onClose={() => setReturnFor(null)} label="Request a return">
        <h2 className="font-light text-[#3D3025]" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem" }}>
          Request a Return
        </h2>
        <p className="mt-1 text-sm" style={{ color: "rgba(61,48,37,0.7)" }}>
          Order {returnFor}
        </p>
        <label className="mt-4 block">
          <span className="mb-2 block text-[10px] uppercase tracking-[0.24em]" style={{ color: "var(--gold-text)" }}>
            Reason
          </span>
          <textarea
            value={returnReason}
            onChange={(e) => setReturnReason(e.target.value)}
            rows={4}
            maxLength={1000}
            placeholder="Tell us briefly why (size, defect, changed mind…)"
            className="w-full rounded-xl px-4 py-2.5 text-sm"
            style={{ border: "1px solid rgba(123,103,82,0.22)", background: "rgba(255,255,255,0.7)" }}
          />
        </label>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setReturnFor(null)}>Cancel</Button>
          <Button onClick={submitReturn} disabled={returnBusy || returnReason.trim().length < 4}>
            {returnBusy ? "Sending…" : "Submit Request"}
          </Button>
        </div>
      </Modal>
    </main>
  );
}
