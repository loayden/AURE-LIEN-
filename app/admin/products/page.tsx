"use client";

import AdminBanner from "@/components/admin/AdminBanner";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminPanel from "@/components/admin/AdminPanel";
import { Check, Lock, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

type AdminProduct = {
  _id: string;
  name: string;
  category: string;
  price: number;
  description?: string;
  images?: string[];
  size?: string[];
  colors?: string[];
  stock?: number;
  managed?: boolean;
};

type ProductDraft = {
  name: string;
  category: string;
  price: string;
  description: string;
  images: string;
  size: string;
  colors: string;
  stock: string;
};

function toDraft(product: AdminProduct): ProductDraft {
  return {
    name: product.name ?? "",
    category: product.category ?? "",
    price: String(product.price ?? 0),
    description: product.description ?? "",
    images: Array.isArray(product.images) ? product.images.join(", ") : "",
    size: Array.isArray(product.size) ? product.size.join(", ") : "",
    colors: Array.isArray(product.colors) ? product.colors.join(", ") : "",
    stock: typeof product.stock === "number" ? String(product.stock) : "",
  };
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<ProductDraft | null>(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<AdminProduct | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/products", { cache: "no-store" });
      const data = await res.json();

      if (!res.ok || !Array.isArray(data?.products)) {
        throw new Error(data?.error || data?.message || "Failed to load products");
      }

      setProducts(data.products);
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : "Failed to load products" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  const startEditing = (product: AdminProduct) => {
    setEditingId(product._id);
    setDraft(toDraft(product));
    setMessage(null);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setDraft(null);
  };

  const saveProduct = async (productId: string) => {
    if (!draft) return;
    setSavingId(productId);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: productId, ...draft, price: Number(draft.price), stock: draft.stock ? Number(draft.stock) : undefined }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || data?.message || "Failed to update product");
      }

      setMessage({ type: "success", text: "Product updated" });
      cancelEditing();
      await loadProducts();
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : "Failed to update product" });
    } finally {
      setSavingId(null);
    }
  };

  const deleteProduct = async (productId: string) => {
    setSavingId(productId);
    setMessage(null);

    try {
      const res = await fetch(`/api/admin/products?id=${encodeURIComponent(productId)}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || data?.message || "Failed to delete product");
      }

      setMessage({ type: "success", text: "Product deleted" });
      await loadProducts();
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : "Failed to delete product" });
    } finally {
      setSavingId(null);
    }
  };

  const updateDraft = (key: keyof ProductDraft, value: string) => {
    setDraft((current) => current ? { ...current, [key]: value } : current);
  };

  const categories = useMemo(
    () => Array.from(new Set(products.map((product) => product.category).filter(Boolean))).sort(),
    [products]
  );

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    return products.filter((product) => {
      if (categoryFilter !== "all" && product.category !== categoryFilter) return false;
      if (!query) return true;
      return `${product.name} ${product.category} ${product._id}`.toLowerCase().includes(query);
    });
  }, [categoryFilter, products, search]);

  const pageSize = 12;
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const visibleProducts = filteredProducts.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    setPage(1);
  }, [categoryFilter, search]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Product Library"
        description="Manage JSON and Mongo catalogue entries. Built-in code products are listed for visibility and locked from destructive changes."
        action={
          <Link href="/admin/add-product" className="btn-gold min-h-[44px]">
            <Plus className="h-4 w-4" />
            Add Product
          </Link>
        }
      />

      {message ? <AdminBanner message={message.text} tone={message.type} /> : null}

      <AdminPanel className="p-4 sm:p-5">
        <div className="grid gap-3 lg:grid-cols-[1fr_240px_auto] lg:items-center">
          <label className="flex min-h-[48px] items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.035] px-4">
            <Search className="h-4 w-4 text-white/35" />
            <span className="sr-only">Search products</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search product, category, id"
              className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/28"
            />
          </label>
          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            className="glass-input min-h-[48px]"
          >
            <option value="all">All categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <span className="count-pill justify-center">
            {filteredProducts.length} products
          </span>
        </div>
      </AdminPanel>

      <AdminPanel className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead>
              <tr className="border-b border-white/10 text-[9px] uppercase tracking-[0.28em] text-white/40">
                <th className="px-5 py-4 font-light">Product</th>
                <th className="px-5 py-4 font-light">Category</th>
                <th className="px-5 py-4 font-light">Price</th>
                <th className="px-5 py-4 font-light">Stock</th>
                <th className="px-5 py-4 font-light">Variants</th>
                <th className="px-5 py-4 font-light text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-[10px] uppercase tracking-[0.3em] text-white/40">
                    Loading products
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-[10px] uppercase tracking-[0.3em] text-white/40">
                    No products found
                  </td>
                </tr>
              ) : (
                visibleProducts.map((product) => {
                  const editing = editingId === product._id && draft;
                  const locked = !product.managed;
                  const busy = savingId === product._id;

                  return (
                    <tr key={product._id} className="align-top text-sm text-white/70">
                      <td className="px-5 py-4">
                        {editing ? (
                          <div className="space-y-2">
                            <input value={draft.name} onChange={(event) => updateDraft("name", event.target.value)} />
                            <textarea
                              value={draft.description}
                              onChange={(event) => updateDraft("description", event.target.value)}
                              rows={2}
                              placeholder="Description"
                            />
                            <input value={draft.images} onChange={(event) => updateDraft("images", event.target.value)} placeholder="/uploads/product.jpg" />
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <div className="relative h-14 w-12 flex-shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white/[0.04]">
                              <Image
                                src={product.images?.[0] || "/images/placeholder.svg"}
                                alt={product.name}
                                fill
                                sizes="48px"
                                className="object-cover"
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="truncate font-light text-white">{product.name}</p>
                              <p className="mt-1 text-[10px] tracking-[0.18em] text-white/35">{product._id}</p>
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        {editing ? (
                          <input value={draft.category} onChange={(event) => updateDraft("category", event.target.value)} />
                        ) : (
                          <span className="text-[11px] uppercase tracking-[0.18em] text-white/50">{product.category}</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        {editing ? (
                          <input type="number" min={0} value={draft.price} onChange={(event) => updateDraft("price", event.target.value)} />
                        ) : (
                          <span>EGP {Number(product.price ?? 0).toLocaleString()}</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        {editing ? (
                          <input type="number" min={0} value={draft.stock} onChange={(event) => updateDraft("stock", event.target.value)} placeholder="Unset" />
                        ) : (
                          <span>{typeof product.stock === "number" ? product.stock : "Unset"}</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        {editing ? (
                          <div className="space-y-2">
                            <input value={draft.size} onChange={(event) => updateDraft("size", event.target.value)} placeholder="S, M, L" />
                            <input value={draft.colors} onChange={(event) => updateDraft("colors", event.target.value)} placeholder="black, navy" />
                          </div>
                        ) : (
                          <div className="space-y-1 text-xs text-white/45">
                            <p>Sizes: {product.size?.length ? product.size.join(", ") : "None"}</p>
                            <p>Colors: {product.colors?.length ? product.colors.join(", ") : "None"}</p>
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          {editing ? (
                            <>
                              <button
                                type="button"
                                onClick={() => void saveProduct(product._id)}
                                disabled={busy}
                                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-brass/40 px-3 text-brass disabled:opacity-50"
                                aria-label="Save product"
                              >
                                <Check className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                onClick={cancelEditing}
                                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-white/15 px-3 text-white/60"
                                aria-label="Cancel editing"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() => startEditing(product)}
                                disabled={locked}
                                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-white/15 px-3 text-white/60 disabled:cursor-not-allowed disabled:opacity-35"
                                aria-label={locked ? "Built-in product locked" : "Edit product"}
                              >
                                {locked ? <Lock className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeleteTarget(product)}
                                disabled={locked || busy}
                                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-red-300/20 px-3 text-red-200/70 disabled:cursor-not-allowed disabled:opacity-35"
                                aria-label={locked ? "Built-in product locked" : "Delete product"}
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        {!loading && filteredProducts.length > pageSize ? (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 px-5 py-4">
            <p className="text-[10px] uppercase tracking-[0.24em] text-white/35">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={page === 1}
                className="btn-ghost min-h-[44px] justify-center disabled:opacity-40"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                disabled={page === totalPages}
                className="btn-ghost min-h-[44px] justify-center disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        ) : null}
      </AdminPanel>

      {deleteTarget ? (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/65 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Delete product confirmation">
          <div className="w-full max-w-md rounded-[28px] border border-white/10 bg-[#14110F] p-6 shadow-2xl">
            <p className="eyebrow mb-4">Confirm Delete</p>
            <h2 className="font-serif text-3xl font-light text-white">Delete product?</h2>
            <p className="body-copy mt-4">
              This removes the managed product record for {deleteTarget.name}. Built-in locked products cannot be deleted here.
            </p>
            <div className="mt-7 grid grid-cols-2 gap-3">
              <button type="button" onClick={() => setDeleteTarget(null)} className="btn-ghost justify-center">
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  const targetId = deleteTarget._id;
                  setDeleteTarget(null);
                  await deleteProduct(targetId);
                }}
                className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-red-300/25 bg-red-400/10 px-5 text-[10px] uppercase tracking-[0.24em] text-red-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
