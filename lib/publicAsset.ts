// Bump this when replacing files in public/uploads without changing their names.
export const PUBLIC_ASSET_VERSION = "2026-07-02-1";

export function withPublicAssetVersion(path: string): string {
  if (!path) return path;
  if (/^(https?:)?\/\//.test(path) || path.startsWith("data:")) return path;
  if (!path.startsWith("/uploads/") && !path.startsWith("/images/")) return path;

  const [base, query = ""] = path.split("?");
  // Encode each segment so filenames with & ? # ( ) spaces survive next/image.
  const encoded = base
    .split("/")
    .map((segment) => {
      try {
        return encodeURIComponent(decodeURIComponent(segment));
      } catch {
        return encodeURIComponent(segment);
      }
    })
    .join("/");
  const params = new URLSearchParams(query);
  params.set("v", PUBLIC_ASSET_VERSION);

  return `${encoded}?${params.toString()}`;
}
