"use client";

import AdminBanner from "@/components/admin/AdminBanner";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminPanel from "@/components/admin/AdminPanel";
import { Check, Lock, Pencil, Plus, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

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
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-[10px] uppercase tracking-[0.3em] text-white/40">
                    No products found
                  </td>
                </tr>
              ) : (
                products.map((product) => {
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
                          <div>
                            <p className="font-light text-white">{product.name}</p>
                            <p className="mt-1 text-[10px] tracking-[0.18em] text-white/35">{product._id}</p>
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
                                onClick={() => void deleteProduct(product._id)}
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
      </AdminPanel>
    </div>
  );
}
