"use client";

import { showToast } from "@/components/ToastProvider";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
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
  User2,
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
        className={`min-h-[48px] w-full rounded-[14px] border px-4 text-[0.92rem] tracking-[0.04em] text-[#3D3025] outline-none transition ${
          locked
            ? "border-[#7B6752]/10 bg-white/20 shadow-none"
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

        const [ordersResult, wishlistResult] = await Promise.allSettled([
          fetch("/api/orders", { cache: "no-store", signal: controller.signal }).then((res) =>
            res.ok ? res.json() : { orders: [] }
          ),
          fetch("/api/wishlist/list", { signal: controller.signal }).then((res) =>
            res.ok ? res.json() : { items: [], ids: [] }
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
      <main className="liquid-page pt-24">
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
      <main className="liquid-page px-4 pb-16 pt-16 sm:px-6 sm:pb-20 sm:pt-24 md:px-10">
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

  const stats = [
    { label: "Orders", value: String(orders.length), detail: recentOrder ? "Recent activity loaded" : "No purchases yet" },
    { label: "Wishlist", value: String(wishlistCount), detail: wishlistCount === 1 ? "Saved piece" : "Saved pieces" },
    { label: "Lifetime", value: formatCurrency(totalSpend), detail: "Tracked spend" },
    { label: "Profile", value: `${profileCompletion}%`, detail: deliveryReady ? "Checkout ready" : "Details missing" },
  ];

  return (
    <main className="liquid-page px-4 pb-16 pt-16 sm:px-6 sm:pb-20 sm:pt-24 md:px-10">
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

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-7 sm:mb-9">
          <p className="eyebrow mb-4">Private Account</p>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h1 className="title-display" style={{ fontSize: "clamp(2.45rem, 6vw, 4.9rem)" }}>
              Maison <em className="gold-italic">Account</em>
            </h1>
            <span className="count-pill">{profileCompletion}% Ready</span>
          </div>
          <div className="page-header-divider mt-6" />
        </motion.div>

        <section className="glass-panel mb-5 p-5 sm:p-7">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-center">
            <div className="flex items-start gap-4 sm:gap-5 lg:items-center">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.15rem] border border-[#A87935]/25 bg-[#A87935]/10 text-[1.2rem] uppercase tracking-[0.12em] text-[#7A581F] sm:h-20 sm:w-20 sm:rounded-[1.4rem] sm:text-[1.55rem]">
                {getInitials(user)}
              </div>
              <div className="min-w-0">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="inline-flex min-h-[34px] items-center gap-2 rounded-full border border-[#A87935]/20 bg-[#A87935]/10 px-3 text-[9px] uppercase tracking-[0.24em] text-[#7A581F]">
                    <ShieldCheck className="h-3.5 w-3.5" strokeWidth={1.3} />
                    {user.role === "admin" ? "Admin Profile" : "Client Profile"}
                  </span>
                  <span className="inline-flex min-h-[34px] items-center gap-2 rounded-full border border-[#7B6752]/14 bg-white/30 px-3 text-[9px] uppercase tracking-[0.24em] text-[#6F6254]">
                    <Calendar className="h-3.5 w-3.5" strokeWidth={1.3} />
                    Since {formatDate(user.createdAt)}
                  </span>
                </div>
                <h2 className="title-display text-[2rem] sm:text-[2.35rem]">
                  {user.name || "Your profile"}
                </h2>
                <div className="mt-3 flex flex-col gap-2 text-[0.82rem] tracking-[0.06em] text-[#6F6254] sm:flex-row sm:flex-wrap sm:items-center">
                  <span className="inline-flex items-center gap-2">
                    <Mail className="h-4 w-4 text-[#A87935]" strokeWidth={1.3} />
                    {user.email}
                  </span>
                  {user.phone ? (
                    <span className="inline-flex items-center gap-2">
                      <Phone className="h-4 w-4 text-[#A87935]" strokeWidth={1.3} />
                      {user.phone}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between gap-4">
                <span className="text-[10px] uppercase tracking-[0.24em] text-[#7A581F]">Profile Readiness</span>
                <span className="text-sm text-[#3D3025]/72">{profileCompletion}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-[#7B6752]/12">
                <motion.div
                  animate={{ width: `${profileCompletion}%` }}
                  className="h-full rounded-full bg-[#A87935]"
                  initial={{ width: 0 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
              <p className="body-copy mt-3 text-[0.78rem]">
                {missingFields.length > 0
                  ? `${missingFields.slice(0, 3).join(", ")} ${missingFields.length > 3 ? "and more " : ""}still need attention.`
                  : "Your profile is ready for faster checkout and delivery."}
              </p>
            </div>
          </div>
        </section>

        <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel p-4 sm:p-5"
            >
              <p className="eyebrow mb-3">{stat.label}</p>
              <p className="title-display text-[1.4rem] sm:text-[1.75rem]">{stat.value}</p>
              <p className="mt-2 text-[0.74rem] tracking-[0.08em] text-[#6F6254]">{stat.detail}</p>
            </motion.div>
          ))}
        </div>
        <div aria-hidden="true" className="h-44 md:hidden" />

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(20rem,0.65fr)]">
          <section className="glass-panel p-5 sm:p-7">
            <form
              onSubmit={(event) => {
                event.preventDefault();
                saveProfile();
              }}
            >
              <div className="mb-7 flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="empty-icon-panel h-12 w-12 rounded-[1rem]">
                    <User2 strokeWidth={1.2} className="h-5 w-5 text-[#A87935]" />
                  </div>
                  <div>
                    <p className="eyebrow mb-2">Profile Details</p>
                    <p className="body-copy body-copy-strong">Keep sign-in, contact, and delivery details current.</p>
                  </div>
                </div>

                {editing ? (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-[#7B6752]/18 px-4 text-[10px] uppercase tracking-[0.24em] text-[#6F6254] transition-colors hover:border-[#A87935]/35 hover:text-[#7A581F]"
                  >
                    <X className="h-3.5 w-3.5" strokeWidth={1.3} />
                    Cancel
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setEditing(true)}
                    className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-[#A87935]/24 bg-[#A87935]/10 px-4 text-[10px] uppercase tracking-[0.24em] text-[#7A581F] transition-colors hover:border-[#A87935]/45"
                  >
                    <Edit3 className="h-3.5 w-3.5" strokeWidth={1.3} />
                    Edit
                  </button>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
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

              <div className="mt-8 border-t border-[#7B6752]/14 pt-7">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="empty-icon-panel h-11 w-11 rounded-[1rem]">
                      <MapPin strokeWidth={1.2} className="h-5 w-5 text-[#A87935]" />
                    </div>
                    <div>
                      <p className="eyebrow mb-2">Delivery Profile</p>
                      <p className="body-copy body-copy-strong">Used to prefill checkout and reduce address mistakes.</p>
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

                <div className="grid gap-4 sm:grid-cols-2">
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

          <aside className="flex flex-col gap-5">
            <section className="dark-panel p-5 sm:p-6">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <p className="eyebrow mb-3">Recent Activity</p>
                  <h2 className="title-display text-[2rem]">
                    Order <em className="gold-italic">Snapshot</em>
                  </h2>
                </div>
                <div className="empty-icon-panel h-11 w-11 rounded-[1rem]">
                  <Package2 className="h-5 w-5 text-[#A87935]" strokeWidth={1.2} />
                </div>
              </div>

              {recentOrder ? (
                <div className="space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <StatusPill order={recentOrder} />
                    <span className="text-[10px] uppercase tracking-[0.22em] text-[#6F6254]">
                      {formatDate(recentOrder.createdAt)}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 border-y border-[#7B6752]/12 py-4">
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
                  <Link href="/shop" className="btn-gold mt-5 w-full justify-center">
                    Browse Shop
                    <ArrowRight strokeWidth={1.2} className="h-4 w-4" />
                  </Link>
                </div>
              )}
            </section>

            <section className="dark-panel flex flex-col gap-4 p-5 sm:p-6">
              <div>
                <p className="eyebrow mb-3">Client Services</p>
                <h2 className="title-display text-[2rem]">
                  Account <em className="gold-italic">Access</em>
                </h2>
              </div>

              <nav className="flex flex-col gap-3">
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
                className="mt-2 inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full border border-[#9A2222]/18 bg-[#9A2222]/[0.04] px-5 text-[10px] uppercase tracking-[0.26em] text-[#9A2222] transition-colors hover:border-[#9A2222]/34"
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
