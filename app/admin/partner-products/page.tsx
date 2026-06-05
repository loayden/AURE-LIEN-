"use client";

import AdminBanner from "@/components/admin/AdminBanner";
import AdminEmptyState from "@/components/admin/AdminEmptyState";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminPanel from "@/components/admin/AdminPanel";
import { ProductCardSkeleton } from "@/components/Skeleton";
import { formatPrice } from "@/lib/commerce";
import type { PartnerProductDraft } from "@/lib/partnerProducts";
import { CheckCircle2, PackageCheck, RefreshCw, Store, XCircle } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

const STATUS_OPTIONS = [
  { value: "", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

export default function AdminPartnerProductsPage() {
  const [products, setProducts] = useState<PartnerProductDraft[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("newest");
  const [error, setError] = useState("");

  async function loadProducts() {
    setLoading(true);
    setError("");
    try {
      const query = status ? `?status=${encodeURIComponent(status)}` : "";
      const response = await fetch(`/api/admin/partner-products${query}`, { cache: "no-store" });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data?.error || data?.message || "Failed to load partner products");
      setProducts(Array.isArray(data.products) ? data.products : []);
    } catch (requestError) {
      setProducts([]);
      setError(requestError instanceof Error ? requestError.message : "Failed to load partner products");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  async function review(productId: string, action: "approve" | "reject") {
    setBusyId(productId);
    setError("");
    try {
      const response = await fetch("/api/admin/partner-products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, action }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data?.error || "Unable to review product");
      await loadProducts();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to review product");
    } finally {
      setBusyId(null);
    }
  }

  const counts = useMemo(() => {
    return {
      pending: products.filter((product) => product.status === "pending").length,
      approved: products.filter((product) => product.status === "approved").length,
      rejected: products.filter((product) => product.status === "rejected").length,
    };
  }, [products]);

  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => {
      if (sort === "price-high") return Number(b.price ?? 0) - Number(a.price ?? 0);
      if (sort === "price-low") return Number(a.price ?? 0) - Number(b.price ?? 0);
      if (sort === "boutique") return String(a.boutiqueName ?? "").localeCompare(String(b.boutiqueName ?? ""));
      if (sort === "status") return String(a.status ?? "").localeCompare(String(b.status ?? ""));
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });
  }, [products, sort]);

  return (
    <div className="space-y-5 sm:space-y-8">
      <AdminPageHeader
        title="Partner Product Review"
        description="Approve boutique partner product drafts before they become visible in Shop and product detail pages."
      />

      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        {[
          { label: "Pending", value: counts.pending },
          { label: "Approved", value: counts.approved },
          { label: "Rejected", value: counts.rejected },
        ].map((item) => (
          <AdminPanel key={item.label} className="p-3 sm:p-5">
            <p className="eyebrow mb-2 sm:mb-4">{item.label}</p>
            <p className="title-display text-[1.25rem] leading-none sm:text-[2.35rem]">{item.value}</p>
          </AdminPanel>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="sr-only" htmlFor="partner-product-status">
            Filter partner products by status
          </label>
          <select
            id="partner-product-status"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="luxury-select sm:max-w-xs"
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <label className="sr-only" htmlFor="partner-product-sort">
            Sort partner products
          </label>
          <select
            id="partner-product-sort"
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            className="luxury-select sm:max-w-xs"
          >
            <option value="newest">Newest first</option>
            <option value="price-high">Highest price</option>
            <option value="price-low">Lowest price</option>
            <option value="boutique">Boutique A-Z</option>
            <option value="status">Status A-Z</option>
          </select>
        </div>
        <button type="button" onClick={loadProducts} className="btn-ghost justify-center">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {error ? <AdminBanner message={error} /> : null}

      {loading ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <AdminEmptyState
          title="No Partner Products"
          description="Submitted boutique products will wait here until an admin approves or rejects them."
          icon={PackageCheck}
        />
      ) : (
        <div className="grid gap-3 sm:gap-4 xl:grid-cols-2">
          {sortedProducts.map((product) => (
            <AdminPanel key={product._id} className="overflow-hidden p-0">
              <div className="grid gap-0 sm:grid-cols-[10rem_1fr]">
                <div className="relative min-h-[11rem] bg-[#F5F1E8] sm:min-h-[16rem]">
                  <Image
                    src={product.images[0] || "/images/placeholder.svg"}
                    alt={product.name}
                    fill
                    sizes="12rem"
                    className="object-cover"
                  />
                </div>
                <div className="p-4 sm:p-5">
                  <div className="mb-3 flex flex-wrap items-start justify-between gap-2 sm:mb-4 sm:gap-3">
                    <div>
                      <p className="eyebrow mb-2 sm:mb-3">{product.status}</p>
                      <h2 className="title-display text-[1.55rem] leading-none sm:text-[2rem]">{product.name}</h2>
                    </div>
                    <span className="rounded-full border border-[rgba(168,121,53,0.22)] bg-[rgba(168,121,53,0.08)] px-3 py-1.5 text-[9px] uppercase tracking-[0.16em] text-[#A87935] sm:py-2 sm:text-[10px] sm:tracking-[0.2em]">
                      EGP {formatPrice(product.price)}
                    </span>
                  </div>

                  <div className="grid gap-1.5 text-xs leading-6 text-[#6F6254] sm:gap-2 sm:text-sm sm:leading-7">
                    <p>
                      <span className="text-[#3D3025]">Boutique:</span> {product.boutiqueName}
                    </p>
                    <p>
                      <span className="text-[#3D3025]">Partner:</span> {product.partnerName} · {product.phone}
                    </p>
                    <p>
                      <span className="text-[#3D3025]">Category:</span> {product.category}
                    </p>
                    {product.description ? <p>{product.description}</p> : null}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-1.5 sm:mt-5 sm:gap-2">
                    {product.size.map((size) => (
                      <span key={size} className="rounded-full border border-[rgba(123,103,82,0.14)] px-2.5 py-1 text-[11px] text-[#6F6254] sm:px-3 sm:text-xs">
                        {size}
                      </span>
                    ))}
                    {product.colors.map((color) => (
                      <span key={color} className="rounded-full border border-[rgba(123,103,82,0.14)] px-2.5 py-1 text-[11px] text-[#6F6254] sm:px-3 sm:text-xs">
                        {color}
                      </span>
                    ))}
                  </div>

                  <div className="mt-5 flex flex-col gap-2 sm:mt-6 sm:flex-row sm:gap-3">
                    <button
                      type="button"
                      onClick={() => review(product._id, "approve")}
                      disabled={busyId === product._id}
                      className="btn-gold justify-center disabled:opacity-45"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      {product.status === "approved" ? "Republish" : "Approve"}
                    </button>
                    <button
                      type="button"
                      onClick={() => review(product._id, "reject")}
                      disabled={busyId === product._id || product.status === "rejected"}
                      className="btn-ghost justify-center disabled:opacity-45"
                    >
                      <XCircle className="h-4 w-4" />
                      Reject
                    </button>
                    {product.status === "approved" ? (
                      <a href={`/product/${encodeURIComponent(product.productId)}`} className="btn-ghost justify-center">
                        <Store className="h-4 w-4" />
                        View Live
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>
            </AdminPanel>
          ))}
        </div>
      )}
    </div>
  );
}
