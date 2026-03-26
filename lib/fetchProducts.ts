function getBaseUrl() {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  const configuredBaseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.VERCEL_URL ||
    "";

  if (!configuredBaseUrl) {
    return "";
  }

  return configuredBaseUrl.startsWith("http")
    ? configuredBaseUrl
    : `https://${configuredBaseUrl}`;
}

export async function fetchProducts(category?: string) {
  try {
    const normalizedCategory = category ? encodeURIComponent(category.trim().toLowerCase()) : "";
    const baseUrl = getBaseUrl();

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
