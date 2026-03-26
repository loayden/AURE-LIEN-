"use client";

import AdminBanner from "@/components/admin/AdminBanner";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminPanel from "@/components/admin/AdminPanel";
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
    <div className="max-w-3xl space-y-8">
      <AdminPageHeader
        title="Add Product"
        description="Create a new catalogue entry without leaving the Liquid Glass control surface."
      />

      <AdminPanel className="p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="eyebrow mb-3 block">Product Name</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="min-h-[44px] min-w-[44px] w-full rounded-lg border border-brass/30 bg-charcoal px-4 py-2.5 text-base text-ivory focus:border-brass focus:outline-none sm:text-sm"
          />
        </div>
        <div>
          <label className="eyebrow mb-3 block">Category</label>
          <select
            required
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            className="luxury-select"
          >
            <option value="">Select category</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="eyebrow mb-3 block">Price (EGP)</label>
          <input
            type="number"
            required
            min={0}
            value={form.price}
            onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
          />
        </div>
        <div>
          <label className="eyebrow mb-3 block">Description</label>
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            className="min-h-[120px] resize-none"
          />
        </div>
        <div>
          <label className="eyebrow mb-3 block">Images (comma-separated URLs)</label>
          <input
            type="text"
            placeholder="/uploads/product.jpg"
            value={form.images}
            onChange={(e) => setForm((f) => ({ ...f, images: e.target.value }))}
          />
        </div>
        <div>
          <label className="eyebrow mb-3 block">Sizes (comma-separated)</label>
          <input
            type="text"
            placeholder="S, M, L, XL"
            value={form.size}
            onChange={(e) => setForm((f) => ({ ...f, size: e.target.value }))}
          />
        </div>
        <div>
          <label className="eyebrow mb-3 block">Colors (comma-separated)</label>
          <input
            type="text"
            placeholder="black, navy, gray"
            value={form.colors}
            onChange={(e) => setForm((f) => ({ ...f, colors: e.target.value }))}
          />
        </div>
          {message ? <AdminBanner message={message.text} tone={message.type} /> : null}
          <button type="submit" disabled={submitting} className="btn-gold w-full justify-center">
            {submitting ? "Adding Product" : "Add Product"}
          </button>
        </form>
      </AdminPanel>
    </div>
  );
}
