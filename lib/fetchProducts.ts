const baseUrl = typeof window === "undefined" ? (process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000") : window.location.origin;

// lib/fetchProducts.ts

export async function fetchProducts(category?: string) {
  try {
    const normalizedCategory = category ? encodeURIComponent(category.trim().toLowerCase()) : "";

    const url = normalizedCategory
      ? `${baseUrl}/api/products?category=${normalizedCategory}`
      : `${baseUrl}/api/products`;

    const res = await fetch(url, { cache: "no-store" });

    if (!res.ok) {
      console.error("Fetch failed:", {
        url,
        status: res.status,
        statusText: res.statusText,
      });
      return [];
    }

    return await res.json();
  } catch (err) {
    console.error("Error fetching products:", err);
    return [];
  }
}