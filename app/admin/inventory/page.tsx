"use client";

import AdminEmptyState from "@/components/admin/AdminEmptyState";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { Package2 } from "lucide-react";
import { useEffect, useState } from "react";

type Row = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number | null;
  units30d: number;
  revenue30d: number;
  views30d: number;
  daysOfCover: number | null;
  slow: boolean;
};

export default function AdminInventoryPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [slowCount, setSlowCount] = useState(0);
  const [slowOnly, setSlowOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    fetch(`/api/admin/inventory${slowOnly ? "?slow=1" : ""}`, { cache: "no-store", signal: controller.signal })
      .then((r) => r.json())
      .then((d) => {
        if (controller.signal.aborted) return;
        if (d.error) throw new Error(d.error);
        setRows(Array.isArray(d.rows) ? d.rows : []);
        setSlowCount(Number(d.slowCount ?? 0));
      })
      .catch((e) => {
        if (!controller.signal.aborted) setError(e instanceof Error ? e.message : "Failed to load");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [slowOnly]);

  return (
    <div>
      <AdminPageHeader title="Inventory Health" description="Stock, 30-day sales and views, days of cover." />
      <div className="mb-4 flex items-center gap-3">
        <button
          type="button"
          onClick={() => setSlowOnly((v) => !v)}
          aria-pressed={slowOnly}
          className="inline-flex min-h-[44px] items-center rounded-full px-5 text-[10px] uppercase tracking-[0.2em]"
          style={slowOnly ? { background: "#3D3025", color: "#FFF9EF" } : { border: "1px solid rgba(123,103,82,0.25)", color: "rgba(61,48,37,0.75)" }}
        >
          Slow movers ({slowCount})
        </button>
      </div>
      {loading ? (
        <p className="text-sm" style={{ color: "rgba(61,48,37,0.7)" }}>Loading inventory…</p>
      ) : error ? (
        <p className="text-sm text-red-700" role="alert">{error}</p>
      ) : rows.length === 0 ? (
        <AdminEmptyState title="No rows" description="Inventory data will appear here." icon={Package2} />
      ) : (
        <div className="overflow-x-auto rounded-2xl" style={{ border: "1px solid rgba(123,103,82,0.18)" }}>
          <table className="w-full min-w-[52rem] text-left text-sm">
            <thead>
              <tr className="text-[10px] uppercase tracking-[0.18em] text-[#6F6254]" style={{ background: "rgba(255,255,255,0.5)" }}>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Units 30d</th>
                <th className="px-4 py-3">Revenue 30d</th>
                <th className="px-4 py-3">Views 30d</th>
                <th className="px-4 py-3">Cover</th>
              </tr>
            </thead>
            <tbody>
              {rows.slice(0, 100).map((r) => (
                <tr key={r.id} className="border-t" style={{ borderColor: "rgba(123,103,82,0.12)" }}>
                  <td className="px-4 py-3">{r.name}{r.slow ? <span style={{ color: "var(--gold-text)" }}> · slow</span> : null}</td>
                  <td className="px-4 py-3">{r.stock ?? "—"}</td>
                  <td className="px-4 py-3">{r.units30d}</td>
                  <td className="px-4 py-3">EGP {r.revenue30d.toLocaleString()}</td>
                  <td className="px-4 py-3">{r.views30d}</td>
                  <td className="px-4 py-3">{r.daysOfCover ?? "—"}{r.daysOfCover != null ? "d" : ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
