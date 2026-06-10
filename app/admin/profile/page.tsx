"use client";

import AdminBanner from "@/components/admin/AdminBanner";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminPanel from "@/components/admin/AdminPanel";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Clock3,
  CreditCard,
  Database,
  Download,
  Mail,
  Package,
  ShieldCheck,
  ShoppingBag,
  UserCog,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type AdminUser = {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
  createdAt?: string;
};

type AdminStats = {
  totalRevenue: number;
  ordersToday: number;
  totalOrders: number;
  totalCustomers: number;
  pendingPayments: number;
  lowStockProducts: { id: string; name: string; stock?: number; category?: string }[];
  recentOrders: {
    id: string;
    total: number;
    status: string;
    paymentStatus: string;
    paymentMethod: string;
    createdAt: string;
    email: string;
  }[];
  bestSellingProducts: { id: string; name: string; quantity: number }[];
  revenueByMonth: { month: string; revenue: number }[];
  recentCustomers: {
    _id: string;
    name: string;
    email: string;
    orders: number;
    totalSpent: number;
    lastOrderAt: string;
    source: "account" | "guest";
  }[];
};

const emptyStats: AdminStats = {
  totalRevenue: 0,
  ordersToday: 0,
  totalOrders: 0,
  totalCustomers: 0,
  pendingPayments: 0,
  lowStockProducts: [],
  recentOrders: [],
  bestSellingProducts: [],
  revenueByMonth: [],
  recentCustomers: [],
};

function formatCurrency(value: number) {
  return `EGP ${Math.round(value).toLocaleString("en-US")}`;
}

function formatDate(value?: string) {
  if (!value) return "Environment managed";
  const date = new Date(value);
  if (Number.isNaN(date.getTime()) || date.getTime() === 0) return "Environment managed";
  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getInitials(user: AdminUser | null) {
  const source = user?.name?.trim() || user?.email || "Admin";
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return parts.slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

export default function AdminProfilePage() {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [stats, setStats] = useState<AdminStats>(emptyStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadAdminProfile() {
      setLoading(true);
      setError("");

      try {
        const [profileResponse, analyticsResponse] = await Promise.all([
          fetch("/api/users/me", { cache: "no-store" }),
          fetch("/api/admin/analytics", { cache: "no-store" }),
        ]);
        const profileData = await profileResponse.json().catch(() => ({}));
        const analyticsData = await analyticsResponse.json().catch(() => ({}));

        if (!profileResponse.ok) {
          throw new Error(profileData?.error || "Unable to load admin identity.");
        }
        if (!analyticsResponse.ok) {
          throw new Error(analyticsData?.error || analyticsData?.message || "Unable to load admin analytics.");
        }
        if (cancelled) return;

        setAdmin(profileData);
        setStats({ ...emptyStats, ...analyticsData });
      } catch (requestError) {
        if (!cancelled) {
          setError(requestError instanceof Error ? requestError.message : "Unable to load admin profile.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadAdminProfile();

    return () => {
      cancelled = true;
    };
  }, []);

  const adminScope = useMemo(
    () => [
      { label: "Role", value: admin?.role === "admin" ? "Administrator" : "Restricted", icon: ShieldCheck },
      { label: "Identity", value: admin?.id === "env-admin" ? "Environment Admin" : "Account Admin", icon: UserCog },
      { label: "Created", value: formatDate(admin?.createdAt), icon: Clock3 },
      { label: "Access", value: "Admin Suite", icon: Database },
    ],
    [admin]
  );

  const operationalCards = [
    { label: "Revenue", value: formatCurrency(stats.totalRevenue), detail: "Tracked order revenue", icon: BarChart3 },
    { label: "Orders", value: String(stats.totalOrders), detail: `${stats.ordersToday} today`, icon: ShoppingBag },
    { label: "Customers", value: String(stats.totalCustomers), detail: "Account and guest index", icon: Users },
    { label: "Risk Queue", value: String(stats.pendingPayments + stats.lowStockProducts.length), detail: "Payments plus low stock", icon: AlertTriangle },
  ];

  const securityChecklist = [
    "Admin routes are role-gated by middleware.",
    "Customer data export stays inside the admin suite.",
    "Profile identity is read-only from the signed-in admin token.",
    "Sensitive payment data is not displayed in this profile.",
  ];

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="eyebrow">Loading Admin Profile</p>
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader
        eyebrow="Admin Identity"
        title="Admin Profile"
        description="A separate operational profile for store administrators, focused on access, workload, risk, and system oversight."
      />

      {error ? <AdminBanner message={error} /> : null}

      <div className="mb-6 grid gap-4 sm:mb-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <AdminPanel className="p-5 sm:p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[22px] border border-[#A87935]/30 bg-[#A87935]/10 text-[1.15rem] uppercase tracking-[0.08em] text-[#A87935]">
                {getInitials(admin)}
              </div>
              <div className="min-w-0">
                <p className="eyebrow mb-3">Signed-In Operator</p>
                <h2 className="title-display break-words text-[2rem] sm:text-[2.65rem]">
                  {admin?.name || "Admin"}
                </h2>
                <p className="body-copy mt-3 inline-flex max-w-full items-center gap-2">
                  <Mail className="h-4 w-4 shrink-0 text-[#A87935]" strokeWidth={1.3} />
                  <span className="truncate">{admin?.email || "No admin email"}</span>
                </p>
              </div>
            </div>
            <span className="inline-flex min-h-[36px] items-center justify-center rounded-full border border-[#A87935]/25 bg-[#A87935]/10 px-4 text-[10px] uppercase tracking-[0.24em] text-[#A87935]">
              {admin?.role === "admin" ? "Admin Access" : "Limited Access"}
            </span>
          </div>
        </AdminPanel>

        <AdminPanel className="p-5 sm:p-6">
          <p className="eyebrow mb-4">Security Posture</p>
          <div className="space-y-3">
            {securityChecklist.map((item) => (
              <div key={item} className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#A87935]" strokeWidth={1.35} />
                <p className="body-copy">{item}</p>
              </div>
            ))}
          </div>
        </AdminPanel>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:mb-8 sm:grid-cols-2 lg:grid-cols-4">
        {adminScope.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="admin-stat-card p-5">
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="eyebrow">{item.label}</p>
                <Icon className="h-4 w-4 text-[#A87935]" strokeWidth={1.3} />
              </div>
              <p className="body-copy body-copy-strong break-words">{item.value}</p>
            </div>
          );
        })}
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:mb-8 sm:grid-cols-2 lg:grid-cols-4">
        {operationalCards.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="admin-stat-card p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <p className="eyebrow">{item.label}</p>
                <Icon className="h-4 w-4 text-[#A87935]" strokeWidth={1.3} />
              </div>
              <p className="font-light text-[#A87935]" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem" }}>
                {item.value}
              </p>
              <p className="body-copy mt-2">{item.detail}</p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <AdminPanel className="p-5 sm:p-6">
          <div className="mb-4 flex items-center gap-3">
            <Activity className="h-5 w-5 text-[#A87935]" strokeWidth={1.4} />
            <h2 className="eyebrow">Operational Focus</h2>
          </div>
          <div className="space-y-3">
            <a href="/admin/orders" className="liquid-row-link">
              <span className="inline-flex items-center gap-3">
                <ShoppingBag className="h-4 w-4 text-[#A87935]" strokeWidth={1.2} />
                <span className="text-[0.78rem] uppercase tracking-[0.22em]">Order Control</span>
              </span>
            </a>
            <a href="/admin/partner-products" className="liquid-row-link">
              <span className="inline-flex items-center gap-3">
                <Package className="h-4 w-4 text-[#A87935]" strokeWidth={1.2} />
                <span className="text-[0.78rem] uppercase tracking-[0.22em]">Partner Review</span>
              </span>
            </a>
            <a href="/admin/users" className="liquid-row-link">
              <span className="inline-flex items-center gap-3">
                <Users className="h-4 w-4 text-[#A87935]" strokeWidth={1.2} />
                <span className="text-[0.78rem] uppercase tracking-[0.22em]">Customer Index</span>
              </span>
            </a>
          </div>
        </AdminPanel>

        <AdminPanel className="p-5 sm:p-6">
          <div className="mb-4 flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-[#A87935]" strokeWidth={1.4} />
            <h2 className="eyebrow">Attention Queue</h2>
          </div>
          <div className="space-y-4">
            <div>
              <p className="body-copy body-copy-strong text-[#FFF8EC]">{stats.pendingPayments} pending payments</p>
              <p className="body-copy mt-1">Orders waiting for payment or admin handling.</p>
            </div>
            <div>
              <p className="body-copy body-copy-strong text-[#FFF8EC]">{stats.lowStockProducts.length} low-stock products</p>
              <p className="body-copy mt-1">Inventory items at or under the configured low-stock threshold.</p>
            </div>
          </div>
        </AdminPanel>

        <AdminPanel className="p-5 sm:p-6">
          <div className="mb-4 flex items-center gap-3">
            <Download className="h-5 w-5 text-[#A87935]" strokeWidth={1.4} />
            <h2 className="eyebrow">Data Access</h2>
          </div>
          <p className="body-copy">
            Use the admin sidebar export for operational order exports. Keep raw customer exports limited to staff workflows that actually require them.
          </p>
          <div className="mt-5 rounded-[16px] border border-[#A87935]/18 bg-[#A87935]/[0.06] p-4">
            <div className="flex items-start gap-3">
              <CreditCard className="mt-0.5 h-4 w-4 shrink-0 text-[#A87935]" strokeWidth={1.3} />
              <p className="body-copy">
                Payment card numbers, CVV values, and one-time codes must never be stored or shown in admin profiles.
              </p>
            </div>
          </div>
        </AdminPanel>
      </div>
    </div>
  );
}
