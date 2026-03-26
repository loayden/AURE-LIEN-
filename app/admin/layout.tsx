"use client";

import AdminBanner from "@/components/admin/AdminBanner";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Download, LayoutDashboard, Package, Plus, ShoppingBag, Users } from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/add-product", label: "Add Product", icon: Plus },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState("");

  const handleExportOrders = async () => {
    setError("");
    setExporting(true);
    try {
      const res = await fetch("/api/admin/export-orders");
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = res.headers.get("Content-Disposition")?.match(/filename="([^"]+)"/)?.[1] ?? "orders-export.json";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to download orders.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <main className="admin-shell liquid-page px-4 pb-16 pt-16 sm:px-6 sm:pb-20 sm:pt-24 md:px-10">
      <div className="page-wrap max-w-[90rem]">
        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="dark-panel flex flex-col gap-5 p-5 sm:p-6">
            <div>
              <p className="eyebrow mb-4">Maison Control</p>
              <h2 className="title-display text-[2.15rem]">
                Admin <em className="gold-italic">Suite</em>
              </h2>
              <p className="body-copy mt-4">
                Every operational route now sits inside the same liquid shell as the storefront.
              </p>
            </div>

            <div className="page-header-divider" />

            <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={false}
                className={`liquid-row-link ${
                  pathname === item.href
                    ? "border-[rgba(198,169,98,0.24)] text-[#C6A962]"
                    : ""
                }`}
              >
                <span className="inline-flex items-center gap-3">
                  {Icon && <Icon className="h-4 w-4 shrink-0 text-[#C6A962]" />}
                  <span className="text-[0.76rem] uppercase tracking-[0.24em]">{item.label}</span>
                </span>
              </Link>
            );
          })}
            </nav>

            {error ? <AdminBanner message={error} /> : null}

            <button
              type="button"
              onClick={handleExportOrders}
              disabled={exporting}
              className="btn-gold w-full justify-center"
            >
              <Download className="h-4 w-4 shrink-0" />
              {exporting ? "Exporting" : "Download Orders"}
            </button>
          </aside>

          <section className="glass-panel p-5 sm:p-7 md:p-8">{children}</section>
        </div>
      </div>
    </main>
  );
}
