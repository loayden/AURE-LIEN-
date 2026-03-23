"use client";

import { useState } from "react";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!file) return setError("Select a file first");
    setLoading(true);

    const reader = new FileReader();
    reader.onload = async () => {
      const data = reader.result as string;
      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ filename: file.name, data }),
        });
        const json = await res.json();
        if (json.url) setUrl(json.url);
        else setError(json.error || "Upload failed");
      } catch (err: any) {
        setError(err?.message ?? String(err));
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 pt-16 sm:px-6 sm:pt-24 md:px-10">
      <h1 className="mb-6 text-xl sm:text-2xl">Upload Image</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="min-h-[44px] min-w-[44px] text-base sm:text-sm"
        />

        <button
          type="submit"
          className="btn-gold min-h-[44px] min-w-[44px] px-6 py-3"
          disabled={loading}
        >
          {loading ? "Uploading…" : "Upload"}
        </button>
      </form>

      {error && <p className="text-red-400 mt-4">{error}</p>}

      {url && (
        <div className="mt-6">
          <p className="mb-2">Uploaded successfully — use this URL for product images:</p>
          <code className="block break-words bg-black/40 p-3 rounded">{url}</code>
          <img src={url} alt="uploaded" className="mt-4 max-w-full" />
        </div>
      )}
    </div>
  );
}
