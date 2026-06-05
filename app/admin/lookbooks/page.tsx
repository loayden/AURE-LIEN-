"use client";

import AdminBanner from "@/components/admin/AdminBanner";
import AdminEmptyState from "@/components/admin/AdminEmptyState";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminPanel from "@/components/admin/AdminPanel";
import { BookOpen } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
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
  const [error, setError] = useState("");
  const [sort, setSort] = useState("title");
  const [form, setForm] = useState({ title: "", slug: "", sections: [] as Section[] });

  useEffect(() => {
    const controller = new AbortController();

    async function loadLookbooks() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch("/api/lookbooks", { signal: controller.signal });
        const data = await response.json();

        if (!response.ok) {
          throw new Error("Unable to load lookbooks");
        }

        setLookbooks(Array.isArray(data) ? data : []);
      } catch (err) {
        if ((err as Error).name === "AbortError") {
          return;
        }

        setLookbooks([]);
        setError("Unable to load lookbooks");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadLookbooks();

    return () => {
      controller.abort();
    };
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
      setError("");
    } else {
      setError("Unable to create lookbook");
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
      setError("");
    } else {
      setError("Unable to update lookbook");
    }
  }

  async function deleteLookbook(id: string) {
    if (!confirm("Delete this lookbook?")) return;
    const res = await fetch(`/api/lookbooks/${id}`, { method: "DELETE" });
    if (res.ok) {
      setLookbooks((prev) => prev.filter((l) => l._id !== id));
      setEditing(null);
      setError("");
    } else {
      setError("Unable to delete lookbook");
    }
  }

  const sortedLookbooks = useMemo(() => {
    return [...lookbooks].sort((a, b) => {
      if (sort === "published") return Number(b.published) - Number(a.published);
      if (sort === "drafts") return Number(a.published) - Number(b.published);
      if (sort === "sections") return Number(b.sections?.length ?? 0) - Number(a.sections?.length ?? 0);
      if (sort === "slug") return String(a.slug ?? "").localeCompare(String(b.slug ?? ""));
      return String(a.title ?? "").localeCompare(String(b.title ?? ""));
    });
  }, [lookbooks, sort]);

  if (loading) {
    return <p className="eyebrow">Loading Lookbooks</p>;
  }

  return (
    <div>
      <AdminPageHeader
        title="Editorial Lookbooks"
        description="Compose campaign narratives, assign imagery, and control publishing without leaving the shared glass environment."
      />

      {error ? <AdminBanner message={error} /> : null}

      {lookbooks.length > 0 ? (
        <div className="mb-6 flex justify-end sm:mb-8">
          <label className="sr-only" htmlFor="lookbook-sort">
            Sort lookbooks
          </label>
          <select
            id="lookbook-sort"
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            className="luxury-select w-full sm:max-w-xs"
          >
            <option value="title">Title A-Z</option>
            <option value="published">Published first</option>
            <option value="drafts">Drafts first</option>
            <option value="sections">Most sections</option>
            <option value="slug">Slug A-Z</option>
          </select>
        </div>
      ) : null}

      <AdminPanel className="mb-6 p-4 sm:mb-8 sm:p-6 md:mb-10">
        <h2 className="title-display mb-6 text-[2rem]">Create <em className="gold-italic">Lookbook</em></h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          />
          <input
            type="text"
            placeholder="Slug (e.g. autumn-2025)"
            value={form.slug}
            onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
          />
        </div>
        <div className="space-y-4 mb-4">
          {form.sections.map((s, i) => (
            <div key={i} className="rounded-[1.2rem] border border-white/10 bg-white/[0.03] p-4 space-y-3">
              <input
                type="text"
                placeholder="Section title"
                value={s.title}
                onChange={(e) => {
                  const s2 = [...form.sections];
                  s2[i] = { ...s, title: e.target.value };
                  setForm((f) => ({ ...f, sections: s2 }));
                }}
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
                className="luxury-select"
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
            className="btn-ghost"
          >
            Add Section
          </button>
          <button
            type="button"
            onClick={saveNew}
            className="btn-gold"
          >
            Create Lookbook
          </button>
        </div>
      </AdminPanel>

      <div className="space-y-6">
        {sortedLookbooks.map((lb) => (
          <div
            key={lb._id}
            className="glass-panel flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <h3 className="title-display text-[1.65rem]">{lb.title}</h3>
              <p className="body-copy mt-2">{lb.slug} • {lb.sections.length} sections</p>
              <span className={`eyebrow mt-3 inline-block ${lb.published ? "text-[#A87935]" : "text-white/35"}`}>
                {lb.published ? "Published" : "Draft"}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setEditing((e) => (e?._id === lb._id ? null : lb))}
                className="btn-ghost px-4"
              >
                {editing?._id === lb._id ? "Cancel" : "Edit"}
              </button>
              {editing?._id === lb._id && (
                <button
                  type="button"
                  onClick={() => updateLookbook(lb._id, { published: !lb.published })}
                  className="btn-gold px-4"
                >
                  {lb.published ? "Unpublish" : "Publish"}
                </button>
              )}
              <button
                type="button"
                onClick={() => deleteLookbook(lb._id)}
                className="btn-ghost px-4"
                style={{ color: "#9A2222", borderColor: "rgba(154,34,34,0.22)" }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {lookbooks.length === 0 && (
        <AdminPanel className="p-6 sm:p-8">
          <AdminEmptyState
            title="No Lookbooks Yet"
            description="Create the first editorial sequence above and it will appear here with publish controls."
            icon={BookOpen}
          />
        </AdminPanel>
      )}
    </div>
  );
}
