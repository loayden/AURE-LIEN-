"use client";

import AdminEmptyState from "@/components/admin/AdminEmptyState";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { Ticket } from "lucide-react";
import { useEffect, useState } from "react";

type Coupon = {
  code: string;
  kind: "percent" | "fixed";
  value: number;
  minSubtotal?: number;
  maxUses?: number;
  usedCount?: number;
  active?: boolean;
  expiresAt?: string;
};

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ code: "", kind: "percent", value: "", minSubtotal: "", maxUses: "", expiresAt: "" });

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/coupons", { cache: "no-store" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || data.error || "Failed to load");
      setCoupons(Array.isArray(data.coupons) ? data.coupons : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const res = await fetch("/api/coupons", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: form.code,
          kind: form.kind,
          value: Number(form.value),
          minSubtotal: Number(form.minSubtotal || 0),
          maxUses: Number(form.maxUses || 0),
          expiresAt: form.expiresAt || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Save failed");
      setMessage(`Coupon ${data.coupon.code} saved.`);
      setForm({ code: "", kind: "percent", value: "", minSubtotal: "", maxUses: "", expiresAt: "" });
      await load();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  async function deactivate(code: string) {
    setBusy(true);
    try {
      const res = await fetch(`/api/coupons?code=${encodeURIComponent(code)}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Deactivate failed");
      setMessage(`${code} deactivated.`);
      await load();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Deactivate failed");
    } finally {
      setBusy(false);
    }
  }

  const input =
    "w-full rounded-xl px-4 py-2.5 text-sm";
  const inputStyle = { border: "1px solid rgba(123,103,82,0.22)", background: "rgba(255,255,255,0.7)" } as const;

  return (
    <div>
      <AdminPageHeader title="Coupons" description="Percent or fixed discounts for checkout." />
      {error ? <p className="mb-4 text-sm text-red-700" role="alert">{error}</p> : null}
      {message ? <p className="mb-4 text-sm" role="status" style={{ color: "var(--gold-text)" }}>{message}</p> : null}
      <form onSubmit={save} className="mb-6 rounded-2xl p-4 sm:p-5" style={{ border: "1px solid rgba(123,103,82,0.18)", background: "rgba(255,255,255,0.55)" }}>
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="block">
            <span className="mb-1 block text-[10px] uppercase tracking-[0.2em] text-[#6F6254]">Code</span>
            <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} required minLength={2} maxLength={32} placeholder="WELCOME10" className={input} style={inputStyle} />
          </label>
          <label className="block">
            <span className="mb-1 block text-[10px] uppercase tracking-[0.2em] text-[#6F6254]">Kind</span>
            <select value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value })} className={input} style={inputStyle}>
              <option value="percent">Percent %</option>
              <option value="fixed">Fixed EGP</option>
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-[10px] uppercase tracking-[0.2em] text-[#6F6254]">Value</span>
            <input value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} required type="number" min={0.01} step="any" placeholder="10" className={input} style={inputStyle} />
          </label>
          <label className="block">
            <span className="mb-1 block text-[10px] uppercase tracking-[0.2em] text-[#6F6254]">Min Subtotal</span>
            <input value={form.minSubtotal} onChange={(e) => setForm({ ...form, minSubtotal: e.target.value })} type="number" min={0} placeholder="0" className={input} style={inputStyle} />
          </label>
          <label className="block">
            <span className="mb-1 block text-[10px] uppercase tracking-[0.2em] text-[#6F6254]">Max Uses (0 = unlimited)</span>
            <input value={form.maxUses} onChange={(e) => setForm({ ...form, maxUses: e.target.value })} type="number" min={0} step={1} placeholder="0" className={input} style={inputStyle} />
          </label>
          <label className="block">
            <span className="mb-1 block text-[10px] uppercase tracking-[0.2em] text-[#6F6254]">Expires (optional)</span>
            <input value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} type="date" className={input} style={inputStyle} />
          </label>
        </div>
        <button
          type="submit"
          disabled={busy}
          className="mt-4 inline-flex min-h-[48px] items-center rounded-full px-6 text-[10px] uppercase tracking-[0.2em] text-white disabled:opacity-50"
          style={{ background: "linear-gradient(135deg, #4C3A26, #7D592B)" }}
        >
          {busy ? "Saving…" : "Save Coupon"}
        </button>
      </form>
      {loading ? (
        <p className="text-sm" style={{ color: "rgba(61,48,37,0.7)" }}>Loading coupons…</p>
      ) : coupons.length === 0 ? (
        <AdminEmptyState title="No coupons" description="Create the first coupon above." icon={Ticket} />
      ) : (
        <ul className="space-y-2">
          {coupons.map((c) => (
            <li key={c.code} className="flex flex-wrap items-center justify-between gap-3 rounded-xl p-3" style={{ border: "1px solid rgba(123,103,82,0.18)", background: "rgba(255,255,255,0.6)" }}>
              <div>
                <p className="text-sm font-medium">{c.code} <span style={{ color: "var(--gold-text)" }}>· {c.kind === "percent" ? `${c.value}%` : `EGP ${c.value}`}</span></p>
                <p className="text-xs" style={{ color: "rgba(61,48,37,0.65)" }}>
                  {c.active === false ? "Inactive" : "Active"} · used {c.usedCount ?? 0}{c.maxUses ? `/${c.maxUses}` : ""} · min EGP {c.minSubtotal ?? 0}
                  {c.expiresAt ? ` · expires ${new Date(c.expiresAt).toLocaleDateString()}` : ""}
                </p>
              </div>
              {c.active !== false && (
                <button type="button" disabled={busy} onClick={() => deactivate(c.code)} className="rounded-full px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-[#9A2222] disabled:opacity-50" style={{ border: "1px solid rgba(154,34,34,0.3)" }}>
                  Deactivate
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
