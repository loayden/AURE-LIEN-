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
    <div className="flex min-h-screen flex-col bg-charcoal text-ivory lg:flex-row">
      <aside className="flex w-full flex-col border-b border-brass/20 p-4 sm:p-6 lg:w-64 lg:border-b-0 lg:border-r">
        <h2 className="mb-6 text-xl font-serif font-light tracking-luxury-wide sm:mb-8">
          Admin
        </h2>
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={false}
                className={`flex min-h-[44px] min-w-[44px] items-center gap-2 rounded-lg px-4 py-3 text-[11px] tracking-wide transition-colors sm:gap-3 sm:text-sm ${
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
          className="mt-4 flex min-h-[44px] min-w-[44px] w-full items-center gap-2 rounded-lg border border-brass/30 px-4 py-3 text-[11px] tracking-wide text-brass transition-colors hover:bg-brass/10 disabled:cursor-not-allowed disabled:opacity-50 sm:gap-3 sm:text-sm"
        >
          <Download className="w-4 h-4 shrink-0" />
          {exporting ? "Exporting…" : "Download orders (JSON)"}
        </button>
      </aside>
      <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8 md:px-10">{children}</main>
    </div>
  );
}
