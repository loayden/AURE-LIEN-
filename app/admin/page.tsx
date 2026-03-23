"use client";

import { motion } from "framer-motion";
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
      <div className="flex items-center justify-center h-64">
        <p className="text-ivory-muted">Loading...</p>
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
      <h1 className="mb-6 text-2xl font-serif font-light tracking-luxury-wide sm:mb-8 md:mb-10 sm:text-3xl">
        Dashboard
      </h1>

      {error && (
        <div className="mb-6 rounded-xl border border-red-400/20 bg-red-500/5 p-4 text-sm text-red-100 sm:mb-8">
          {error}
        </div>
      )}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:mb-8 sm:grid-cols-2 sm:gap-5 md:mb-10 lg:grid-cols-4 lg:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 border border-brass/20 rounded-xl bg-charcoal-light/50"
        >
          <p className="text-ivory-muted text-sm tracking-wide mb-1">Total Revenue</p>
          <p className="text-3xl font-serif font-light text-brass">
            EGP {s.totalRevenue.toLocaleString()}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="p-6 border border-brass/20 rounded-xl bg-charcoal-light/50"
        >
          <p className="text-ivory-muted text-sm tracking-wide mb-1">Orders Today</p>
          <p className="text-3xl font-serif font-light text-brass">{s.ordersToday}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 border border-brass/20 rounded-xl bg-charcoal-light/50"
        >
          <p className="text-ivory-muted text-sm tracking-wide mb-1">Total Orders</p>
          <p className="text-3xl font-serif font-light text-brass">{s.totalOrders}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="p-6 border border-brass/20 rounded-xl bg-charcoal-light/50"
        >
          <p className="text-ivory-muted text-sm tracking-wide mb-1">Total Customers</p>
          <p className="text-3xl font-serif font-light text-brass">{s.totalCustomers}</p>
        </motion.div>
      </div>

      {s.revenueByMonth.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 rounded-xl border border-brass/20 bg-charcoal-light/30 p-4 sm:mb-8 sm:p-6 md:mb-10"
        >
          <h2 className="text-lg font-serif mb-6">Revenue by Month</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={s.revenueByMonth}>
                <XAxis dataKey="month" stroke="#B0B0B0" fontSize={12} />
                <YAxis stroke="#B0B0B0" fontSize={12} tickFormatter={(v) => `EGP ${v}`} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1A1A1A", border: "1px solid rgba(198,167,94,0.3)" }}
                  formatter={(value: number) => [`EGP ${value.toLocaleString()}`, "Revenue"]}
                />
                <Line type="monotone" dataKey="revenue" stroke="#C6A75E" strokeWidth={2} dot={{ fill: "#C6A75E" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}

      {s.recentCustomers.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
          className="mb-6 rounded-xl border border-brass/20 bg-charcoal-light/30 p-4 sm:mb-8 sm:p-6 md:mb-10"
        >
          <h2 className="text-lg font-serif mb-6">Recent Customers</h2>
          <div className="space-y-4">
            {s.recentCustomers.map((customer) => (
              <div
                key={customer._id}
                className="flex flex-col gap-3 rounded-xl border border-brass/10 bg-black/10 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-ivory font-light">{customer.name}</p>
                  <p className="text-sm text-ivory-muted">
                    {customer.email || "No email"}
                  </p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-brass/80">
                    {customer.source === "account" ? "Account" : "Guest"}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm sm:flex sm:items-center sm:gap-6">
                  <div>
                    <p className="text-ivory-muted">Orders</p>
                    <p className="text-ivory">{customer.orders}</p>
                  </div>
                  <div>
                    <p className="text-ivory-muted">Spend</p>
                    <p className="text-brass">EGP {customer.totalSpent.toLocaleString()}</p>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <p className="text-ivory-muted">Last activity</p>
                    <p className="text-ivory">{formatDate(customer.lastOrderAt)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {s.bestSellingProducts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-xl border border-brass/20 bg-charcoal-light/30 p-4 sm:p-6"
        >
          <h2 className="text-lg font-serif mb-6">Best Selling Products</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={s.bestSellingProducts} layout="vertical" margin={{ left: 120 }}>
                <XAxis type="number" stroke="#B0B0B0" fontSize={12} />
                <YAxis type="category" dataKey="name" stroke="#B0B0B0" fontSize={11} width={110} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1A1A1A", border: "1px solid rgba(198,167,94,0.3)" }}
                />
                <Bar dataKey="quantity" fill="#C6A75E" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}
    </div>
  );
}
