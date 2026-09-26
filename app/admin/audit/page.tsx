"use client";

import AdminEmptyState from "@/components/admin/AdminEmptyState";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { ScrollText } from "lucide-react";
import { useEffect, useState } from "react";

type AuditRow = {
  action?: string;
  actorEmail?: string;
  targetType?: string;
  targetId?: string;
  createdAt?: string;
  detail?: unknown;
};

export default function AdminAuditPage() {
  const [rows, setRows] = useState<AuditRow[]>([]);
  const [action, setAction] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "24" });
    if (action) params.set("action", action);
    fetch(`/api/admin/audit?${params.toString()}`, { signal: controller.signal, cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (controller.signal.aborted) return;
        setRows(Array.isArray(d.logs) ? d.logs : []);
        setTotalPages(Number(d.pagination?.totalPages ?? 1));
        setError(d.error ?? "");
      })
      .catch(() => {
        if (!controller.signal.aborted) setError("Failed to load audit log");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [page, action]);

  return (
    <div>
      <AdminPageHeader title="Audit Log" description="Append-only record of admin actions." />
      <div className="mb-4 flex gap-2">
        <input
          value={action}
          onChange={(e) => {
            setPage(1);
            setAction(e.target.value);
          }}
          placeholder="Filter by action (e.g. admin.order.status)"
          aria-label="Filter by action"
          className="w-full max-w-md rounded-xl px-4 py-2 text-sm"
          style={{ border: "1px solid rgba(123,103,82,0.22)", background: "rgba(255,255,255,0.6)" }}
        />
      </div>
      {loading ? (
        <p className="text-sm" style={{ color: "rgba(61,48,37,0.7)" }}>Loading audit log…</p>
      ) : error ? (
        <p className="text-sm text-red-700" role="alert">{error}</p>
      ) : rows.length === 0 ? (
        <AdminEmptyState title="No audit entries" description="Admin actions will appear here." icon={ScrollText} />
      ) : (
        <>
          <ul className="space-y-2">
            {rows.map((row, i) => (
              <li
                key={i}
                className="rounded-xl p-3 text-sm"
                style={{ border: "1px solid rgba(123,103,82,0.18)", background: "rgba(255,255,255,0.6)" }}
              >
                <span className="font-medium" style={{ color: "var(--gold-text)" }}>{row.action}</span>
                <span style={{ color: "rgba(61,48,37,0.7)" }}>
                  {" "}· {row.actorEmail} · {row.targetType}/{String(row.targetId ?? "").slice(0, 40)} ·{" "}
                  {row.createdAt ? new Date(row.createdAt).toLocaleString() : ""}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-xl px-4 py-2 text-sm disabled:opacity-40"
              style={{ border: "1px solid rgba(123,103,82,0.22)" }}
            >
              Prev
            </button>
            <span className="text-sm">Page {page} of {totalPages}</span>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-xl px-4 py-2 text-sm disabled:opacity-40"
              style={{ border: "1px solid rgba(123,103,82,0.22)" }}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
