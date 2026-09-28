"use client";

import AdminEmptyState from "@/components/admin/AdminEmptyState";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { Upload } from "lucide-react";
import { useState } from "react";

type Preview = {
  dryRun?: boolean;
  valid?: number;
  errors?: Array<{ row: number; error: string }>;
  preview?: Array<{ _id: string; name: string; category: string; price: number }>;
  saved?: number;
  success?: boolean;
};

export default function AdminImportPage() {
  const [csv, setCsv] = useState("");
  const [result, setResult] = useState<Preview | null>(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function run(dryRun: boolean) {
    if (!csv.trim() || busy) return;
    setBusy(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/products/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ csv, dryRun }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Import failed");
      setResult(data);
      setMessage(
        data.success
          ? `Imported ${data.saved} products${(data.errors ?? []).length > 0 ? ` with ${(data.errors ?? []).length} errors` : ""}.`
          : `Dry run: ${data.valid ?? 0} valid rows${(data.errors ?? []).length > 0 ? `, ${(data.errors ?? []).length} errors` : ""}.`
      );
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Import failed");
    } finally {
      setBusy(false);
    }
  }

  function onFile(file: File | undefined) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setCsv(String(reader.result ?? ""));
    reader.readAsText(file);
  }

  return (
    <div>
      <AdminPageHeader title="Import Products" description="CSV columns: name, category, price, stock, images (|), size (|), colors (|), description, material, discount. Always previews first." />
      {message ? <p className="mb-4 text-sm" role="status" style={{ color: "var(--gold-text)" }}>{message}</p> : null}
      <div className="mb-4 rounded-2xl p-4" style={{ border: "1px solid rgba(123,103,82,0.18)", background: "rgba(255,255,255,0.55)" }}>
        <label className="grid gap-2 text-[10px] uppercase tracking-[0.2em] text-[#6F6254]">
          CSV file
          <input
            type="file"
            accept=".csv,text/csv"
            onChange={(e) => onFile(e.target.files?.[0])}
            className="text-sm normal-case tracking-normal"
          />
        </label>
        <label className="mt-3 grid gap-2 text-[10px] uppercase tracking-[0.2em] text-[#6F6254]">
          Or paste CSV
          <textarea
            value={csv}
            onChange={(e) => setCsv(e.target.value)}
            rows={8}
            placeholder="name,category,price,stock,images,size,colors,description,material,discount"
            className="rounded-xl px-4 py-2.5 font-mono text-xs normal-case tracking-normal"
            style={{ border: "1px solid rgba(123,103,82,0.22)", background: "rgba(255,255,255,0.7)" }}
          />
        </label>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={busy || !csv.trim()}
            onClick={() => run(true)}
            className="inline-flex min-h-[48px] items-center rounded-full border px-6 text-[10px] uppercase tracking-[0.2em] disabled:opacity-50"
            style={{ borderColor: "rgba(168,121,53,0.4)", color: "var(--gold-text)" }}
          >
            {busy ? "Working…" : "Preview (Dry Run)"}
          </button>
          <button
            type="button"
            disabled={busy || !csv.trim()}
            onClick={() => run(false)}
            className="inline-flex min-h-[48px] items-center rounded-full px-6 text-[10px] uppercase tracking-[0.2em] text-white disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #4C3A26, #7D592B)" }}
          >
            {busy ? "Working…" : "Confirm Import"}
          </button>
        </div>
      </div>
      {result && (result.errors ?? []).length > 0 && (
        <div className="mb-4 rounded-2xl p-4" style={{ border: "1px solid rgba(154,34,34,0.25)", background: "rgba(154,34,34,0.05)" }}>
          <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-[#9A2222]">Row errors</p>
          <ul className="max-h-48 space-y-1 overflow-auto text-xs text-[#9A2222]">
            {(result.errors ?? []).slice(0, 50).map((e, i) => (
              <li key={i}>Row {e.row}: {e.error}</li>
            ))}
          </ul>
        </div>
      )}
      {result && (result.preview ?? []).length > 0 && (
        <div className="rounded-2xl p-4" style={{ border: "1px solid rgba(123,103,82,0.18)", background: "rgba(255,255,255,0.55)" }}>
          <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-[#6F6254]">Preview</p>
          <ul className="space-y-1 text-sm">
            {result.preview!.map((p) => (
              <li key={p._id}>{p.name} · {p.category} · EGP {p.price}</li>
            ))}
          </ul>
        </div>
      )}
      {!result && (
        <AdminEmptyState title="No import yet" description="Paste CSV or choose a file, then preview before importing." icon={Upload} />
      )}
    </div>
  );
}
