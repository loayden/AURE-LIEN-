"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  Calendar,
  CreditCard,
  Mail,
  MapPin,
  Package2,
  Phone,
  ShieldCheck,
  Store,
  User2,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type AccountUser = {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  accountIntent?: "buyer" | "partner" | "both";
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
};

function getFiniteNumber(value: unknown) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function normalizePayoutProfileStatus(value: unknown): "missing" | "incomplete" | "complete" {
  return value === "complete" || value === "incomplete" || value === "missing" ? value : "missing";
}

function normalizePartnerSummary(value: any): PartnerProfileSummary {
  const wallet = value?.wallet && typeof value.wallet === "object" ? value.wallet : null;
  const payoutPreview = wallet?.payoutPreview && typeof wallet.payoutPreview === "object" ? wallet.payoutPreview : {};
  const summary = wallet?.summary && typeof wallet.summary === "object" ? wallet.summary : {};

  return {
    applications: Array.isArray(value?.applications) ? value.applications : [],
    selectedApplication: value?.selectedApplication && typeof value.selectedApplication === "object"
      ? value.selectedApplication
      : null,
    wallet: wallet
      ? {
          payoutPreview: {
            destination: String(payoutPreview.destination ?? "No card numbers stored"),
            status: normalizePayoutProfileStatus(payoutPreview.status),
          },
          summary: {
            available: getFiniteNumber(summary.available),
            payoutProfileStatus: normalizePayoutProfileStatus(summary.payoutProfileStatus),
          },
        }
      : null,
    pendingProductCount: getFiniteNumber(value?.pendingProductCount),
  };
}

function titleCase(value?: string) {
  if (!value) return "Pending";
  return value
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatCurrency(value: number) {
  return `EGP ${Math.round(value).toLocaleString("en-US")}`;
}

function payoutStatusCopy(status?: string) {
  if (status === "complete") return "Ready";
  if (status === "incomplete") return "Needs Details";
  return "Missing";
}

function getInitials(user: AccountUser | null, application: PartnerApplicationSummary | null) {
  const source = application?.boutiqueName || user?.name || user?.email || "Partner";
  const parts = source.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return parts.slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

export default function PartnerProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<AccountUser | null>(null);
  const [summary, setSummary] = useState<PartnerProfileSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadPartnerProfile() {
      setLoading(true);
      setError("");

      try {
        const [profileResponse, summaryResponse] = await Promise.all([
          fetch("/api/users/me", { cache: "no-store", signal: controller.signal }),
          fetch("/api/partners/profile-summary", { cache: "no-store", signal: controller.signal }),
        ]);

        if (profileResponse.status === 401 || summaryResponse.status === 401) {
          router.push("/login?redirect=/partners/profile");
          return;
        }

        const profileData = await profileResponse.json().catch(() => ({}));
        const summaryData = await summaryResponse.json().catch(() => ({}));

        if (!profileResponse.ok) throw new Error(profileData?.error || "Unable to load account.");
        if (!summaryResponse.ok) throw new Error(summaryData?.error || "Unable to load partner profile.");
        if (controller.signal.aborted) return;

        setUser(profileData);
        setSummary(normalizePartnerSummary(summaryData));
      } catch (requestError) {
        if (controller.signal.aborted) return;
        setError(requestError instanceof Error ? requestError.message : "Unable to load partner profile.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void loadPartnerProfile();
    return () => controller.abort();
  }, [router]);

  const application = summary?.selectedApplication ?? null;
  const productsHref = application
    ? `/partners/products?applicationId=${encodeURIComponent(application._id)}`
    : "/partners/products";
  const subscriptionHref = application
    ? `/partners/subscription?applicationId=${encodeURIComponent(application._id)}`
    : "/partners/subscription";
  const readiness = application
    ? application.access?.canManageProducts
      ? 100
      : application.status === "pending"
        ? 55
        : 72
    : 24;
  const statusCopy = application
    ? application.access?.message || "Boutique profile loaded. Keep products, payout details, and subscription current."
    : "Start a boutique application to unlock product uploads, admin review, partner wallet, and subscription tools.";

  const stats = useMemo(
    () => [
      {
        label: "Boutique",
        value: application ? titleCase(application.status) : "Not Started",
        detail: application?.boutiqueName || "Application needed",
        icon: Store,
      },
      {
        label: "Products",
        value: String(summary?.pendingProductCount ?? 0),
        detail: "Pending admin review",
        icon: Package2,
      },
      {
        label: "Available",
        value: formatCurrency(summary?.wallet?.summary.available ?? 0),
        detail: "Estimated wallet balance",
        icon: Wallet,
      },
      {
        label: "Payout",
        value: payoutStatusCopy(summary?.wallet?.summary.payoutProfileStatus),
        detail: summary?.wallet?.payoutPreview.destination || "No payout details stored",
        icon: CreditCard,
      },
    ],
    [application, summary]
  );

  if (loading) {
    return (
      <main className="liquid-page mobile-comfort pt-20 sm:pt-24">
        <div className="page-wrap flex min-h-[55vh] items-center justify-center">
          <motion.p
            animate={{ opacity: [0.35, 0.78, 0.35] }}
            className="eyebrow"
            transition={{ duration: 1.6, repeat: Infinity }}
          >
            Loading Partner Profile
          </motion.p>
        </div>
      </main>
    );
  }

  return (
    <main className="liquid-page mobile-comfort px-3 pb-[calc(7.25rem+env(safe-area-inset-bottom))] pt-14 sm:px-6 sm:pb-20 sm:pt-24 md:px-10">
      <div className="page-wrap max-w-6xl">
        {error ? (
          <div className="mb-5 rounded-2xl border border-[#9A2222]/22 bg-[#9A2222]/[0.04] px-4 py-3">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#9A2222]">{error}</p>
          </div>
        ) : null}

        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-5 rounded-[24px] border border-[#7B6752]/12 bg-white/72 p-4 shadow-[0_18px_54px_rgba(61,48,37,0.08)] backdrop-blur-2xl sm:p-6"
        >
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_19rem] lg:items-end">
            <div className="min-w-0">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <p className="text-[9px] uppercase tracking-[0.28em] text-[#7A581F]">Partner Profile</p>
                <span className="inline-flex min-h-[34px] items-center rounded-full border border-[#A87935]/22 bg-[#A87935]/10 px-3 text-[9px] uppercase tracking-[0.22em] text-[#7A581F]">
                  {application ? titleCase(application.status) : "Application Needed"}
                </span>
              </div>

              <div className="flex items-start gap-3 sm:gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[16px] border border-[#A87935]/24 bg-[#FFF9EF] text-[1.05rem] uppercase tracking-[0.08em] text-[#7A581F] shadow-[0_12px_26px_rgba(61,48,37,0.07)] sm:h-16 sm:w-16">
                  {getInitials(user, application)}
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="font-serif text-[2.25rem] font-light leading-[1.02] tracking-[0.01em] text-[#3D3025] sm:text-[3.55rem]">
                    Boutique Profile
                  </h1>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="inline-flex min-h-[32px] items-center gap-2 rounded-full border border-[#A87935]/18 bg-[#A87935]/[0.07] px-3 text-[9px] uppercase tracking-[0.2em] text-[#7A581F]">
                      <Store className="h-3.5 w-3.5" strokeWidth={1.35} />
                      Partner Workspace
                    </span>
                    <span className="inline-flex min-h-[32px] items-center gap-2 rounded-full border border-[#7B6752]/12 bg-white/70 px-3 text-[9px] uppercase tracking-[0.18em] text-[#6F6254]">
                      <Calendar className="h-3.5 w-3.5" strokeWidth={1.35} />
                      {application?.planName || application?.subscriptionStatus || "Boutique Setup"}
                    </span>
                  </div>

                  <p className="mt-4 text-[1.1rem] font-medium tracking-[0.01em] text-[#3D3025] sm:text-[1.25rem]">
                    {application?.boutiqueName || "Create your boutique profile"}
                  </p>
                  <div className="mt-2 flex min-w-0 flex-col gap-1.5 text-[0.78rem] tracking-[0.02em] text-[#6F6254] sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
                    <span className="inline-flex min-w-0 items-center gap-2">
                      <Mail className="h-4 w-4 shrink-0 text-[#A87935]" strokeWidth={1.3} />
                      <span className="truncate">{application?.email || user?.email || "No email connected"}</span>
                    </span>
                    {(application?.phone || user?.phone) ? (
                      <span className="inline-flex items-center gap-2">
                        <Phone className="h-4 w-4 shrink-0 text-[#A87935]" strokeWidth={1.3} />
                        {application?.phone || user?.phone}
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[18px] border border-[#7B6752]/12 bg-[#FDFBF7]/74 p-4">
              <div className="mb-3 flex items-center justify-between gap-4">
                <span className="text-[9px] uppercase tracking-[0.24em] text-[#7A581F]">Partner Readiness</span>
                <span className="text-[0.82rem] text-[#3D3025]/78">{readiness}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-[#7B6752]/12">
                <motion.div
                  animate={{ width: `${readiness}%` }}
                  className="h-full rounded-full bg-[#A87935]"
                  initial={{ width: 0 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
              <p className="mt-3 text-[0.74rem] leading-5 tracking-[0.02em] text-[#6F6254]">{statusCopy}</p>
            </div>
          </div>
        </motion.section>

        <div className="mb-5 grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
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
                <p className="break-words font-serif text-[1.2rem] font-light leading-none tracking-[0.01em] text-[#3D3025] sm:text-[1.55rem]">{stat.value}</p>
                <p className="mt-2 break-words text-[0.68rem] leading-5 tracking-[0.02em] text-[#6F6254]">{stat.detail}</p>
              </motion.div>
            );
          })}
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(20rem,0.9fr)]">
          <section className="rounded-[24px] border border-[#7B6752]/12 bg-white/68 p-4 shadow-[0_18px_48px_rgba(61,48,37,0.07)] backdrop-blur-2xl sm:p-6">
            <div className="mb-5 flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] border border-[#A87935]/18 bg-[#A87935]/[0.07]">
                <Building2 strokeWidth={1.2} className="h-5 w-5 text-[#A87935]" />
              </div>
              <div>
                <p className="eyebrow mb-2">Boutique Details</p>
                <h2 className="title-display text-[1.9rem] sm:text-[2.35rem]">
                  Partner <em className="gold-italic">Identity</em>
                </h2>
                <p className="body-copy mt-3">
                  These details are used for BOUT admin review, product publishing, support, and payout coordination.
                </p>
              </div>
            </div>

            {application ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { label: "Owner", value: application.ownerName || user?.name || "Not set", icon: User2 },
                  { label: "Location", value: application.noPhysicalShop ? "Online boutique" : [application.city, application.area].filter(Boolean).join(", ") || "Not set", icon: MapPin },
                  { label: "Subscription", value: application.subscriptionStatus || "Pending", icon: ShieldCheck },
                  { label: "Address", value: application.streetAddress || "Not set", icon: Building2 },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="rounded-[16px] border border-[#7B6752]/12 bg-[#FDFBF7]/74 p-4">
                      <Icon className="mb-3 h-4 w-4 text-[#A87935]" strokeWidth={1.25} />
                      <p className="text-[9px] uppercase tracking-[0.22em] text-[#7A581F]">{item.label}</p>
                      <p className="mt-2 break-words text-[0.9rem] leading-6 text-[#3D3025]">{item.value}</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-[18px] border border-[#A87935]/18 bg-[#FFF9EF]/62 p-5">
                <p className="body-copy body-copy-strong">
                  No boutique application is connected to this account yet. Create one first, then this partner profile will show review status, product readiness, wallet, and payout setup.
                </p>
                <Link href="/boutiques/apply" className="btn-gold mt-5 w-full justify-center sm:w-auto">
                  Start Boutique Application
                  <ArrowRight strokeWidth={1.2} className="h-4 w-4" />
                </Link>
              </div>
            )}
          </section>

          <aside className="rounded-[24px] border border-[#7B6752]/12 bg-white/68 p-4 shadow-[0_18px_48px_rgba(61,48,37,0.07)] backdrop-blur-2xl sm:p-6">
            <p className="eyebrow mb-3">Partner Workspace</p>
            <h2 className="title-display text-[1.9rem] sm:text-[2.35rem]">
              Manage <em className="gold-italic">Operations</em>
            </h2>
            <p className="body-copy mt-3">
              Product uploads, payout setup, and subscription actions stay separate from the customer account profile.
            </p>

            <nav className="mt-6 flex flex-col gap-3">
              <Link href={application ? productsHref : "/boutiques/apply"} className="liquid-row-link">
                <span className="inline-flex items-center gap-3">
                  <Package2 strokeWidth={1.2} className="h-4 w-4 text-[#A87935]" />
                  <span className="text-[0.78rem] uppercase tracking-[0.22em]">
                    {application ? "Manage Products" : "Start Application"}
                  </span>
                </span>
                <ArrowRight strokeWidth={1.2} className="h-4 w-4 text-[#7B6752]/45" />
              </Link>
              <Link href={subscriptionHref} className="liquid-row-link">
                <span className="inline-flex items-center gap-3">
                  <CreditCard strokeWidth={1.2} className="h-4 w-4 text-[#A87935]" />
                  <span className="text-[0.78rem] uppercase tracking-[0.22em]">Subscription Plan</span>
                </span>
                <ArrowRight strokeWidth={1.2} className="h-4 w-4 text-[#7B6752]/45" />
              </Link>
              <Link href={productsHref} className="liquid-row-link">
                <span className="inline-flex items-center gap-3">
                  <Wallet strokeWidth={1.2} className="h-4 w-4 text-[#A87935]" />
                  <span className="text-[0.78rem] uppercase tracking-[0.22em]">Wallet & Payout</span>
                </span>
                <ArrowRight strokeWidth={1.2} className="h-4 w-4 text-[#7B6752]/45" />
              </Link>
              <Link href="/account" className="liquid-row-link">
                <span className="inline-flex items-center gap-3">
                  <User2 strokeWidth={1.2} className="h-4 w-4 text-[#A87935]" />
                  <span className="text-[0.78rem] uppercase tracking-[0.22em]">User Profile</span>
                </span>
                <ArrowRight strokeWidth={1.2} className="h-4 w-4 text-[#7B6752]/45" />
              </Link>
            </nav>

            {application?.access?.canManageProducts ? null : (
              <p className="mt-5 rounded-[14px] border border-[#A87935]/18 bg-[#A87935]/[0.06] px-3 py-3 text-[0.72rem] leading-5 text-[#7A581F]">
                {statusCopy}
              </p>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}
