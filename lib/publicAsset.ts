// Bump this when replacing files in public/uploads without changing their names.
export const PUBLIC_ASSET_VERSION = "2026-04-03-1";

export function withPublicAssetVersion(path: string): string {
  if (!path) return path;
  if (/^(https?:)?\/\//.test(path) || path.startsWith("data:")) return path;
  if (!path.startsWith("/uploads/") && !path.startsWith("/images/")) return path;

  const [base, query = ""] = path.split("?");
  const params = new URLSearchParams(query);
  params.set("v", PUBLIC_ASSET_VERSION);

  return `${base}?${params.toString()}`;
}
