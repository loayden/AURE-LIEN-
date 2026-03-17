"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LayoutDashboard, Download } from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/add-product", label: "Add Product" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [exporting, setExporting] = useState(false);

  const handleExportOrders = async () => {
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
    } catch {
      alert("Failed to download orders.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-charcoal text-ivory flex">
      <aside className="w-64 border-r border-brass/20 p-6 flex flex-col">
        <h2 className="text-xl font-serif font-light tracking-luxury-wide mb-8">
          Admin
        </h2>
        <nav className="space-y-2 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={false}
                className={`flex items-center gap-3 py-3 px-4 rounded-lg text-sm tracking-wide transition-colors ${
                  pathname === item.href
                    ? "bg-brass/20 text-brass border border-brass/30"
                    : "text-ivory-muted hover:text-ivory hover:bg-charcoal-light"
                }`}
              >
                {Icon && <Icon className="w-4 h-4 shrink-0" />}
                {item.label}
              </Link>
            );
          })}
        </nav>
        <button
          type="button"
          onClick={handleExportOrders}
          disabled={exporting}
          className="mt-4 flex items-center gap-3 py-3 px-4 rounded-lg border border-brass/30 text-brass hover:bg-brass/10 disabled:opacity-50 disabled:cursor-not-allowed text-sm tracking-wide transition-colors w-full"
        >
          <Download className="w-4 h-4 shrink-0" />
          {exporting ? "Exporting…" : "Download orders (JSON)"}
        </button>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
