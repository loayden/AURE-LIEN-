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
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then((r) => r.json())
      .then(setStats)
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
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
  };

  return (
    <div>
      <h1 className="text-3xl font-serif font-light tracking-luxury-wide mb-10">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
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
          className="mb-12 p-6 border border-brass/20 rounded-xl bg-charcoal-light/30"
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

      {s.bestSellingProducts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="p-6 border border-brass/20 rounded-xl bg-charcoal-light/30"
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
