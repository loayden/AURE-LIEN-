"use client";

import AdminEmptyState from "@/components/admin/AdminEmptyState";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { RotateCcw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

type ReturnRow = {
  _id: string;
  orderId: string;
  userId: string;
  reason: string;
  status: "requested" | "approved" | "rejected" | "completed";
  adminNote?: string;
  createdAt?: string;
  updatedAt?: string;
};

const STATUS_STYLES: Record<ReturnRow["status"], { label: string; color: string; border: string }> = {
  requested: { label: "Requested", color: "#8A6A2F", border: "rgba(168,121,53,0.35)" },
  approved: { label: "Approved", color: "#2F6B45", border: "rgba(47,107,69,0.35)" },
  rejected: { label: "Rejected", color: "#9A2222", border: "rgba(154,34,34,0.35)" },
  completed: { label: "Completed", color: "#3D3025", border: "rgba(61,48,37,0.25)" },
};

export default function AdminReturnsPage() {
  const [returns, setReturns] = useState<ReturnRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [notes, setNotes] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const qs = statusFilter ? `?status=${encodeURIComponent(statusFilter)}` : "";
      const res = await fetch(`/api/admin/returns${qs}`, { cache: "no-store" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || data.error || "Failed to load");
      setReturns(Array.isArray(data.returns) ? data.returns : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    load();
  }, [load]);

  async function updateStatus(id: string, status: ReturnRow["status"]) {
    setBusy(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/returns", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status, adminNote: notes[id] ?? "" }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || data.message || "Update failed");
      setMessage(`Return ${id.slice(0, 12)} marked ${status}.`);
      await load();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Update failed");
    } finally {
      setBusy(false);
    }
  }

  const inputStyle = { border: "1px solid rgba(123,103,82,0.22)", background: "rgba(255,255,255,0.7)" } as const;

  return (
    <div>
      <AdminPageHeader title="Returns" description="Review customer return requests and update their status." />
      {error ? <p className="mb-4 text-sm text-red-700" role="alert">{error}</p> : null}
      {message ? <p className="mb-4 text-sm" role="status" style={{ color: "var(--gold-text)" }}>{message}</p> : null}

      <div className="mb-5 flex items-center gap-3">
        <label className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#6F6254]">
          Status
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl px-3 py-2 text-sm normal-case tracking-normal"
            style={inputStyle}
          >
            <option value="">All</option>
            <option value="requested">Requested</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="completed">Completed</option>
          </select>
        </label>
      </div>

      {loading ? (
        <p className="text-sm" style={{ color: "rgba(61,48,37,0.7)" }}>Loading returns…</p>
      ) : returns.length === 0 ? (
        <AdminEmptyState title="No returns" description={statusFilter ? "No returns match this filter." : "Customer return requests will appear here."} icon={RotateCcw} />
      ) : (
        <ul className="space-y-3">
          {returns.map((r) => {
            const badge = STATUS_STYLES[r.status] ?? STATUS_STYLES.requested;
            return (
              <li key={r._id} className="rounded-2xl p-4" style={{ border: "1px solid rgba(123,103,82,0.18)", background: "rgba(255,255,255,0.6)" }}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium">
                      Order {r.orderId}{" "}
                      <span
                        className="ml-1 rounded-full px-2 py-0.5 text-[10px] uppercase tracking-[0.16em]"
                        style={{ color: badge.color, border: `1px solid ${badge.border}` }}
                      >
                        {badge.label}
                      </span>
                    </p>
                    <p className="mt-1 text-xs" style={{ color: "rgba(61,48,37,0.65)" }}>
                      Customer {r.userId} · {r.createdAt ? new Date(r.createdAt).toLocaleString() : "—"}
                    </p>
                    <p className="mt-2 text-sm" style={{ color: "#3D3025" }}>{r.reason}</p>
                    {r.adminNote ? (
                      <p className="mt-1 text-xs italic" style={{ color: "rgba(61,48,37,0.55)" }}>Note: {r.adminNote}</p>
                    ) : null}
                  </div>
                  {r.status !== "completed" && r.status !== "rejected" ? (
                    <div className="flex shrink-0 flex-wrap items-center gap-2">
                      <input
                        value={notes[r._id] ?? r.adminNote ?? ""}
                        onChange={(e) => setNotes({ ...notes, [r._id]: e.target.value })}
                        placeholder="Admin note (optional)"
                        className="w-44 rounded-xl px-3 py-2 text-xs"
                        style={inputStyle}
                      />
                      {r.status === "requested" ? (
                        <>
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => updateStatus(r._id, "approved")}
                            className="rounded-full px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-[#2F6B45] disabled:opacity-50"
                            style={{ border: "1px solid rgba(47,107,69,0.35)" }}
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => updateStatus(r._id, "rejected")}
                            className="rounded-full px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-[#9A2222] disabled:opacity-50"
                            style={{ border: "1px solid rgba(154,34,34,0.3)" }}
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => updateStatus(r._id, "completed")}
                          className="rounded-full px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-white disabled:opacity-50"
                          style={{ background: "linear-gradient(135deg, #4C3A26, #7D592B)" }}
                        >
                          Mark Completed
                        </button>
                      )}
                    </div>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
