"use client";

import AdminBanner from "@/components/admin/AdminBanner";
import AdminEmptyState from "@/components/admin/AdminEmptyState";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminPanel from "@/components/admin/AdminPanel";
import { ProductCardSkeleton } from "@/components/Skeleton";
import { showToast } from "@/components/ToastProvider";
import { formatCategoryLabel, formatPrice, productImage, stockLabel } from "@/lib/commerce";
import type { Product } from "@/lib/types";
import { AlertTriangle, ChevronLeft, ChevronRight, Package, Search, Trash2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type AdminProduct = Product & { manageable?: boolean };

const PAGE_SIZE = 10;

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);
  const [pendingDelete, setPendingDelete] = useState<AdminProduct | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function loadProducts() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/products", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || data?.message || "Failed to load products");
      }
      setProducts(Array.isArray(data.products) ? data.products : []);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Failed to load products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadProducts();
  }, []);

  const categories = useMemo(() => {
    return Array.from(new Set(products.map((product) => product.category).filter(Boolean))).sort();
  }, [products]);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return products.filter((product) => {
      const matchesQuery =
        !normalizedQuery ||
        [product.name, product.category, product._id]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(normalizedQuery));
      const matchesCategory = category === "all" || product.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [category, products, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visibleProducts = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [category, query]);

  async function confirmDelete() {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      const response = await fetch(
        `/api/admin/products?productId=${encodeURIComponent(pendingDelete._id)}`,
        { method: "DELETE" }
      );
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.error || "Unable to delete product");
      }
      setProducts((current) => current.filter((product) => product._id !== pendingDelete._id));
      showToast("Product removed from the editable catalogue.", "success");
      setPendingDelete(null);
    } catch (requestError) {
      showToast(
        requestError instanceof Error ? requestError.message : "Unable to delete product",
        "error"
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div>
      <AdminPageHeader
        title="Product Library"
        description="Search, review stock and discount fields, and remove admin-added products with confirmation."
      />

      {error ? <AdminBanner message={error} /> : null}

      <AdminPanel className="p-4 sm:p-6">
        <div className="mb-5 grid gap-3 lg:grid-cols-[1fr_14rem_auto]">
          <label className="flex min-h-[44px] items-center gap-3 rounded-full border border-[rgba(123,103,82,0.16)] bg-[rgba(255,255,255,0.48)] px-4">
            <Search className="h-4 w-4 text-[#A87935]" strokeWidth={1.4} />
            <span className="sr-only">Search products</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search products, IDs, categories..."
              className="w-full border-0 bg-transparent text-sm text-[#3D3025] outline-none placeholder:text-[#6F6254]/70"
            />
          </label>

          <label className="sr-only" htmlFor="product-category-filter">
            Filter by category
          </label>
          <select
            id="product-category-filter"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="min-h-[44px] rounded-full border border-[rgba(123,103,82,0.16)] bg-[#FFF9EF] px-4 text-[11px] uppercase tracking-[0.18em] text-[#3D3025] outline-none"
          >
            <option value="all">All categories</option>
            {categories.map((item) => (
              <option key={item} value={item}>
                {formatCategoryLabel(item)}
              </option>
            ))}
          </select>

          <div className="flex min-h-[44px] items-center rounded-full border border-[#A87935]/25 px-4 text-[10px] uppercase tracking-[0.2em] text-[#A87935]">
            {filtered.length} products
          </div>
        </div>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        ) : visibleProducts.length === 0 ? (
          <AdminEmptyState
            title="No Matching Products"
            description="Adjust the search or category filter to find another part of the catalogue."
            icon={Package}
          />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-[rgba(123,103,82,0.16)]">
            <div className="hidden grid-cols-[5rem_1fr_9rem_7rem_7rem_4rem] gap-4 border-b border-[rgba(123,103,82,0.14)] bg-[rgba(255,255,255,0.42)] px-4 py-3 text-[10px] uppercase tracking-[0.2em] text-[#6F6254] lg:grid">
              <span>Image</span>
              <span>Product</span>
              <span>Category</span>
              <span>Stock</span>
              <span>Price</span>
              <span className="text-right">Action</span>
            </div>

            {visibleProducts.map((product) => (
              <div
                key={product._id}
                className="grid gap-4 border-b border-[rgba(123,103,82,0.12)] px-4 py-4 last:border-b-0 lg:grid-cols-[5rem_1fr_9rem_7rem_7rem_4rem] lg:items-center"
              >
                <div className="relative h-24 w-20 overflow-hidden rounded-xl bg-[#1D1915] lg:h-20 lg:w-16">
                  <Image
                    src={productImage(product)}
                    alt={product.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>

                <div>
                  <p className="text-base font-light leading-snug text-[#3D3025]">
                    {product.name}
                  </p>
                  <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-[#6F6254]">
                    {product._id}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.16em]">
                    <span className="rounded-full border border-[rgba(123,103,82,0.16)] bg-[rgba(255,249,239,0.58)] px-2 py-1 text-[#5B4E42]">
                      Sizes: {product.size?.length ? product.size.join(", ") : "Unset"}
                    </span>
                    <span className="rounded-full border border-[rgba(123,103,82,0.16)] bg-[rgba(255,249,239,0.58)] px-2 py-1 text-[#5B4E42]">
                      Discount: {typeof product.discount === "number" ? `${product.discount}%` : "None"}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] uppercase tracking-[0.18em] text-[#A87935]">
                  {formatCategoryLabel(product.category)}
                </p>

                <p className="text-[11px] uppercase tracking-[0.18em] text-[#5B4E42]">
                  {stockLabel(product)}
                </p>

                <p className="text-sm text-[#3D3025]">EGP {formatPrice(product.price)}</p>

                <button
                  type="button"
                  onClick={() => setPendingDelete(product)}
                  className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-[rgba(154,34,34,0.22)] bg-[rgba(154,34,34,0.08)] text-[#9A2222] transition-colors hover:bg-[rgba(154,34,34,0.12)] disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label={`Delete ${product.name}`}
                >
                  <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                </button>
              </div>
            ))}
          </div>
        )}

        {!loading && filtered.length > PAGE_SIZE ? (
          <div className="mt-5 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={page === 1}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[rgba(123,103,82,0.16)] bg-[rgba(255,255,255,0.42)] px-4 text-[10px] uppercase tracking-[0.18em] text-[#5B4E42] disabled:opacity-35"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#6F6254]">
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
              disabled={page === totalPages}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[rgba(123,103,82,0.16)] bg-[rgba(255,255,255,0.42)] px-4 text-[10px] uppercase tracking-[0.18em] text-[#5B4E42] disabled:opacity-35"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        ) : null}
      </AdminPanel>

      {pendingDelete ? (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-[rgba(123,103,82,0.18)] bg-[#FFF9EF] p-6 shadow-2xl">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(154,34,34,0.22)] bg-[rgba(154,34,34,0.08)] text-[#9A2222]">
              <AlertTriangle className="h-5 w-5" strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-3xl font-light text-[#3D3025]">Delete product?</h2>
            <p className="mt-3 text-sm leading-7 text-[#5B4E42]">
              This removes admin-added catalogue records. Built-in seed products are protected and the API will leave them in place.
            </p>
            <p className="mt-4 text-sm text-[#A87935]">{pendingDelete.name}</p>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setPendingDelete(null)}
                className="min-h-[44px] rounded-full border border-[rgba(123,103,82,0.16)] px-5 text-[10px] uppercase tracking-[0.2em] text-[#5B4E42]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleting}
                className="min-h-[44px] rounded-full border border-[rgba(154,34,34,0.28)] bg-[rgba(154,34,34,0.10)] px-5 text-[10px] uppercase tracking-[0.2em] text-[#9A2222] disabled:opacity-45"
              >
                {deleting ? "Deleting" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
