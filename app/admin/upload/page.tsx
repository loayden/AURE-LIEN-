"use client";

import AdminBanner from "@/components/admin/AdminBanner";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminPanel from "@/components/admin/AdminPanel";
import Image from "next/image";
import { useState } from "react";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setUrl("");

    if (!file) return setError("Select a file first");
    if (file.size > 8 * 1024 * 1024) {
      return setError("Use an image under 8 MB.");
    }

    setLoading(true);

    try {
      const payload = new FormData();
      payload.set("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: payload,
      });
      const json = await res.json();

      if (!res.ok || !json.url) {
        setError(json.error || "Upload failed");
        return;
      }

      setUrl(json.url);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <AdminPageHeader
        title="Upload Asset"
        description="Send imagery into the catalogue pipeline and keep the returned path ready for forms and lookbooks."
      />

      <AdminPanel className="p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="eyebrow mb-3 block">Image File</label>
            <input
              type="file"
              accept="image/*"
              disabled={loading}
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="min-h-[44px] min-w-[44px] text-base sm:text-sm"
            />
          </div>

          <button
            type="submit"
            className="btn-gold min-h-[44px] min-w-[44px] px-6 py-3"
            disabled={loading}
          >
            {loading ? "Uploading" : "Upload"}
          </button>
        </form>

        {error ? <div className="mt-5"><AdminBanner message={error} /></div> : null}

        {url ? (
          <div className="mt-6 space-y-4">
            <p className="eyebrow">Asset Ready</p>
            <div className="dark-panel p-4">
              <p className="body-copy mb-3">Use this returned path for product images and editorial sections.</p>
              <code className="block break-words text-[0.75rem] tracking-[0.08em] text-white/72">{url}</code>
            </div>

            <div className="relative overflow-hidden rounded-[1.3rem] border border-white/10 bg-white/[0.03] p-2">
              <div
                className="absolute inset-x-5 top-0 h-px pointer-events-none"
                style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.20), transparent)" }}
              />
              <div className="relative aspect-[4/3] overflow-hidden rounded-[1rem]">
                <Image src={url} alt="Uploaded asset preview" fill className="object-cover" sizes="(max-width: 768px) 100vw, 720px" />
              </div>
            </div>
          </div>
        ) : null}
      </AdminPanel>
    </div>
  );
}
