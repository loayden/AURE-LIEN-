"use client";

import AdminBanner from "@/components/admin/AdminBanner";
import AdminEmptyState from "@/components/admin/AdminEmptyState";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminPanel from "@/components/admin/AdminPanel";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { Package } from "lucide-react";
import { useEffect, useState } from "react";

interface Stats {
  totalRevenue: number;
  ordersToday: number;
  totalOrders: number;
  totalCustomers: number;
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
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadStats() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch("/api/admin/analytics", { cache: "no-store" });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.error || data?.message || "Failed to load dashboard");
        }

        if (!cancelled) {
          setStats(data);
        }
      } catch (err) {
        if (!cancelled) {
          setStats(null);
          setError(err instanceof Error ? err.message : "Failed to load dashboard");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadStats();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="eyebrow">Loading Dashboard</p>
      </div>
    );
  }

  const s = stats || {
    totalRevenue: 0,
    ordersToday: 0,
    totalOrders: 0,
    totalCustomers: 0,
    bestSellingProducts: [],
    revenueByMonth: [],
    recentCustomers: [],
  };

  const formatDate = (value: string) => {
    try {
      return new Date(value).toLocaleString();
    } catch {
      return "-";
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Admin Dashboard"
        description="Performance, client activity, and order movement inside the same liquid glass system."
      />

      {error ? <AdminBanner message={error} /> : null}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:mb-8 sm:grid-cols-2 sm:gap-5 md:mb-10 lg:grid-cols-4 lg:gap-6">
        <div className="admin-stat-card p-6">
          <p className="eyebrow mb-3">Total Revenue</p>
          <p className="font-light text-[#C9A86A]" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem" }}>
            EGP {s.totalRevenue.toLocaleString()}
          </p>
        </div>
        <div className="admin-stat-card p-6">
          <p className="eyebrow mb-3">Orders Today</p>
          <p className="font-light text-[#C9A86A]" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem" }}>{s.ordersToday}</p>
        </div>
        <div className="admin-stat-card p-6">
          <p className="eyebrow mb-3">Total Orders</p>
          <p className="font-light text-[#C9A86A]" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem" }}>{s.totalOrders}</p>
        </div>
        <div className="admin-stat-card p-6">
          <p className="eyebrow mb-3">Total Customers</p>
          <p className="font-light text-[#C9A86A]" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem" }}>{s.totalCustomers}</p>
        </div>
      </div>

      {s.revenueByMonth.length > 0 && (
        <div className="mb-6 sm:mb-8 md:mb-10">
          <AdminPanel className="p-4 sm:p-6">
            <h2 className="title-display mb-6 text-[2rem]">Revenue <em className="gold-italic">Flow</em></h2>
            <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={s.revenueByMonth}>
                <XAxis dataKey="month" stroke="rgba(255,248,236,0.35)" fontSize={12} />
                <YAxis stroke="rgba(255,248,236,0.35)" fontSize={12} tickFormatter={(v) => `EGP ${v}`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(20,17,15,0.94)",
                    border: "1px solid rgba(255,248,236,0.09)",
                    borderRadius: 16,
                  }}
                  formatter={(value: number) => [`EGP ${value.toLocaleString()}`, "Revenue"]}
                />
                <Line type="monotone" dataKey="revenue" stroke="#C9A86A" strokeWidth={2} dot={{ fill: "#C9A86A" }} />
              </LineChart>
            </ResponsiveContainer>
            </div>
          </AdminPanel>
        </div>
      )}

      {s.recentCustomers.length > 0 && (
        <div className="mb-6 sm:mb-8 md:mb-10">
          <AdminPanel className="p-4 sm:p-6">
            <h2 className="title-display mb-6 text-[2rem]">Recent <em className="gold-italic">Clients</em></h2>
            <div className="space-y-4">
            {s.recentCustomers.map((customer) => (
              <div
                key={customer._id}
                className="liquid-row-link flex-col items-start sm:flex-row sm:items-center"
              >
                <div>
                  <p className="body-copy body-copy-strong">{customer.name}</p>
                  <p className="body-copy mt-1">
                    {customer.email || "No email"}
                  </p>
                  <p className="eyebrow mt-2" style={{ color: "rgba(201,168,106,0.85)" }}>
                    {customer.source === "account" ? "Account" : "Guest"}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm sm:flex sm:items-center sm:gap-6">
                  <div>
                    <p className="eyebrow mb-2">Orders</p>
                    <p className="body-copy body-copy-strong">{customer.orders}</p>
                  </div>
                  <div>
                    <p className="eyebrow mb-2">Spend</p>
                    <p className="body-copy body-copy-strong text-[#C9A86A]">EGP {customer.totalSpent.toLocaleString()}</p>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <p className="eyebrow mb-2">Last Activity</p>
                    <p className="body-copy body-copy-strong">{formatDate(customer.lastOrderAt)}</p>
                  </div>
                </div>
              </div>
            ))}
            </div>
          </AdminPanel>
        </div>
      )}

      {s.bestSellingProducts.length > 0 ? (
        <div className="rounded-xl">
          <AdminPanel className="p-4 sm:p-6">
            <h2 className="title-display mb-6 text-[2rem]">Best Selling <em className="gold-italic">Products</em></h2>
            <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={s.bestSellingProducts} layout="vertical" margin={{ left: 120 }}>
                <XAxis type="number" stroke="rgba(255,248,236,0.35)" fontSize={12} />
                <YAxis type="category" dataKey="name" stroke="rgba(255,248,236,0.35)" fontSize={11} width={110} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(20,17,15,0.94)",
                    border: "1px solid rgba(255,248,236,0.09)",
                    borderRadius: 16,
                  }}
                />
                <Bar dataKey="quantity" fill="#C9A86A" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
            </div>
          </AdminPanel>
        </div>
      ) : (
        <AdminPanel className="p-6 sm:p-8">
          <AdminEmptyState
            title="No Product Metrics"
            description="Best seller tracking will appear here once orders begin moving through the catalogue."
            icon={Package}
          />
        </AdminPanel>
      )}
    </div>
  );
}
