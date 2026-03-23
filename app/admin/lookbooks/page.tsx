"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import productsData from "@/lib/productsData";

interface Hotspot {
  productId: string;
  x: number;
  y: number;
}

interface Section {
  title: string;
  image: string;
  slug: string;
  hotspots: Hotspot[];
}

interface Lookbook {
  _id: string;
  title: string;
  slug: string;
  sections: Section[];
  published: boolean;
}

export default function AdminLookbooksPage() {
  const [lookbooks, setLookbooks] = useState<Lookbook[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Lookbook | null>(null);
  const [form, setForm] = useState({ title: "", slug: "", sections: [] as Section[] });

  useEffect(() => {
    fetch("/api/lookbooks")
      .then((r) => r.json())
      .then(setLookbooks)
      .catch(() => setLookbooks([]))
      .finally(() => setLoading(false));
  }, []);

  async function addSection() {
    setForm((f) => ({
      ...f,
      sections: [
        ...f.sections,
        {
          title: "",
          image: "",
          slug: "",
          hotspots: [],
        },
      ],
    }));
  }

  async function saveNew() {
    if (!form.title || !form.slug) return;
    const res = await fetch("/api/lookbooks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const lb = await res.json();
      setLookbooks((prev) => [lb, ...prev]);
      setForm({ title: "", slug: "", sections: [] });
    }
  }

  async function updateLookbook(id: string, data: Partial<Lookbook>) {
    const res = await fetch(`/api/lookbooks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const lb = await res.json();
      setLookbooks((prev) => prev.map((l) => (l._id === id ? lb : l)));
      setEditing(null);
    }
  }

  async function deleteLookbook(id: string) {
    if (!confirm("Delete this lookbook?")) return;
    await fetch(`/api/lookbooks/${id}`, { method: "DELETE" });
    setLookbooks((prev) => prev.filter((l) => l._id !== id));
    setEditing(null);
  }

  if (loading) {
    return <p className="text-ivory-muted">Loading...</p>;
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-serif font-light tracking-luxury-wide sm:mb-8 md:mb-10 sm:text-3xl">
        Lookbooks
      </h1>

      <div className="mb-6 rounded-xl border border-brass/20 bg-charcoal-light/30 p-4 sm:mb-8 sm:p-6 md:mb-10">
        <h2 className="text-lg font-serif mb-4">Create Lookbook</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            className="min-h-[44px] min-w-[44px] rounded border border-brass/40 bg-charcoal px-4 py-2 text-base text-ivory sm:text-sm"
          />
          <input
            type="text"
            placeholder="Slug (e.g. autumn-2025)"
            value={form.slug}
            onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
            className="min-h-[44px] min-w-[44px] rounded border border-brass/40 bg-charcoal px-4 py-2 text-base text-ivory sm:text-sm"
          />
        </div>
        <div className="space-y-4 mb-4">
          {form.sections.map((s, i) => (
            <div key={i} className="p-4 border border-brass/20 rounded-lg space-y-2">
              <input
                type="text"
                placeholder="Section title"
                value={s.title}
                onChange={(e) => {
                  const s2 = [...form.sections];
                  s2[i] = { ...s, title: e.target.value };
                  setForm((f) => ({ ...f, sections: s2 }));
                }}
                className="w-full bg-charcoal border border-brass/40 text-ivory px-3 py-2 rounded text-sm"
              />
              <input
                type="text"
                placeholder="Image URL (e.g. /uploads/photo.jpg)"
                value={s.image}
                onChange={(e) => {
                  const s2 = [...form.sections];
                  s2[i] = { ...s, image: e.target.value };
                  setForm((f) => ({ ...f, sections: s2 }));
                }}
                className="w-full bg-charcoal border border-brass/40 text-ivory px-3 py-2 rounded text-sm"
              />
              <select
                value={s.hotspots[0]?.productId || ""}
                onChange={(e) => {
                  const pid = e.target.value;
                  const s2 = [...form.sections];
                  s2[i] = {
                    ...s,
                    hotspots: pid ? [{ productId: pid, x: 50, y: 50 }] : [],
                  };
                  setForm((f) => ({ ...f, sections: s2 }));
                }}
                className="bg-charcoal border border-brass/40 text-ivory px-3 py-2 rounded text-sm"
              >
                <option value="">No product hotspot</option>
                {productsData.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={addSection}
            className="px-4 py-2 border border-brass/50 text-brass text-sm hover:bg-brass/10 rounded"
          >
            Add section
          </button>
          <button
            type="button"
            onClick={saveNew}
            className="px-4 py-2 bg-brass text-black text-sm hover:opacity-90 rounded"
          >
            Create lookbook
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {lookbooks.map((lb) => (
          <motion.div
            key={lb._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 border border-brass/20 rounded-xl bg-charcoal-light/30 flex justify-between items-center"
          >
            <div>
              <h3 className="font-serif text-lg">{lb.title}</h3>
              <p className="text-silver text-sm">{lb.slug} • {lb.sections.length} sections</p>
              <span className={`text-xs ${lb.published ? "text-green-400" : "text-silver"}`}>
                {lb.published ? "Published" : "Draft"}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setEditing((e) => (e?._id === lb._id ? null : lb))}
                className="px-3 py-1 border border-brass/50 text-brass text-sm rounded"
              >
                {editing?._id === lb._id ? "Cancel" : "Edit"}
              </button>
              {editing?._id === lb._id && (
                <button
                  type="button"
                  onClick={() => updateLookbook(lb._id, { published: !lb.published })}
                  className="px-3 py-1 bg-brass text-black text-sm rounded"
                >
                  {lb.published ? "Unpublish" : "Publish"}
                </button>
              )}
              <button
                type="button"
                onClick={() => deleteLookbook(lb._id)}
                className="px-3 py-1 border border-red-500/50 text-red-400 text-sm rounded"
              >
                Delete
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {lookbooks.length === 0 && (
        <p className="text-silver">No lookbooks yet. Create one above.</p>
      )}
    </div>
  );
}
