"use client";

import { useState } from "react";

const CATEGORIES = [
  "jackets-coats",
  "suits",
  "shirts",
  "knitwear",
  "bags-wallets",
  "belts",
  "sunglasses",
  "boots",
  "loafers",
  "lace-ups",
  "sneakers",
  "denim",
  "jeans",
  "korean",
];

export default function AdminAddProductPage() {
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    images: "",
    size: "",
    colors: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          category: form.category,
          price: Number(form.price) || 0,
          description: form.description || undefined,
          images: form.images ? form.images.split(",").map((s) => s.trim()).filter(Boolean) : [],
          size: form.size ? form.size.split(",").map((s) => s.trim()).filter(Boolean) : [],
          colors: form.colors ? form.colors.split(",").map((s) => s.trim()).filter(Boolean) : [],
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add product");
      setMessage({ type: "success", text: "Product added successfully" });
      setForm({ name: "", category: "", price: "", description: "", images: "", size: "", colors: "" });
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Failed to add product" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <h1 className="border-b border-brass/30 pb-4 text-xl font-serif font-light tracking-luxury-wide sm:text-2xl">
        Add Product
      </h1>

      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-brass/20 bg-charcoal-light/30 p-8 shadow-lg space-y-6"
      >
        <div>
          <label className="block text-xs uppercase tracking-widest text-brass mb-2">Product Name</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="min-h-[44px] min-w-[44px] w-full rounded-lg border border-brass/30 bg-charcoal px-4 py-2.5 text-base text-ivory focus:border-brass focus:outline-none sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-brass mb-2">Category</label>
          <select
            required
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            className="luxury-select min-h-[44px] min-w-[44px] w-full rounded-lg border border-brass/30 bg-charcoal px-4 py-2.5 text-base text-ivory focus:border-brass focus:outline-none sm:text-sm"
          >
            <option value="">Select category</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-brass mb-2">Price (EGP)</label>
          <input
            type="number"
            required
            min={0}
            value={form.price}
            onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
            className="min-h-[44px] min-w-[44px] w-full rounded-lg border border-brass/30 bg-charcoal px-4 py-2.5 text-base text-ivory focus:border-brass focus:outline-none sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-brass mb-2">Description</label>
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            className="min-h-[44px] min-w-[44px] w-full resize-none rounded-lg border border-brass/30 bg-charcoal px-4 py-2.5 text-base text-ivory focus:border-brass focus:outline-none sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-brass mb-2">Images (comma-separated URLs)</label>
          <input
            type="text"
            placeholder="/uploads/product.jpg"
            value={form.images}
            onChange={(e) => setForm((f) => ({ ...f, images: e.target.value }))}
            className="w-full px-4 py-2.5 bg-charcoal border border-brass/30 rounded-lg text-ivory placeholder:text-ivory-muted/50 focus:outline-none focus:border-brass"
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-brass mb-2">Sizes (comma-separated)</label>
          <input
            type="text"
            placeholder="S, M, L, XL"
            value={form.size}
            onChange={(e) => setForm((f) => ({ ...f, size: e.target.value }))}
            className="w-full px-4 py-2.5 bg-charcoal border border-brass/30 rounded-lg text-ivory placeholder:text-ivory-muted/50 focus:outline-none focus:border-brass"
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-brass mb-2">Colors (comma-separated)</label>
          <input
            type="text"
            placeholder="black, navy, gray"
            value={form.colors}
            onChange={(e) => setForm((f) => ({ ...f, colors: e.target.value }))}
            className="w-full px-4 py-2.5 bg-charcoal border border-brass/30 rounded-lg text-ivory placeholder:text-ivory-muted/50 focus:outline-none focus:border-brass"
          />
        </div>
        {message && (
          <p className={`text-sm ${message.type === "success" ? "text-brass" : "text-red-400"}`}>
            {message.text}
          </p>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 border border-brass text-brass font-serif tracking-widest uppercase text-sm hover:bg-brass hover:text-black transition-colors disabled:opacity-50"
        >
          {submitting ? "Adding..." : "Add Product"}
        </button>
      </form>
    </div>
  );
}
