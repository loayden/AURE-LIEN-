/**
 * Shared Mongo connection-string resolution.
 * Reads real production keys without changing them:
 * MONGO_URI (primary) -> MONGODB_URI -> DATABASE_URL (Atlas on Vercel).
 * Never falls back to localhost in production.
 */

function clean(value: unknown): string {
  return String(value ?? "").trim();
}

export function isValidMongoUri(uri: string): boolean {
  return uri.startsWith("mongodb://") || uri.startsWith("mongodb+srv://");
}

export function getConfiguredMongoUri(): string | null {
  const candidates = [
    process.env.MONGO_URI,
    process.env.MONGODB_URI,
    process.env.DATABASE_URL,
  ];
  for (const candidate of candidates) {
    const uri = clean(candidate);
    if (!uri) continue;
    if (isValidMongoUri(uri)) return uri;
    throw new Error(
      'Invalid MongoDB connection string. Expected it to start with "mongodb://" or "mongodb+srv://".'
    );
  }
  return null;
}

export function hasConfiguredMongoUri(): boolean {
  return Boolean(getConfiguredMongoUri());
}

export function useMongoStorage(): boolean {
  return hasConfiguredMongoUri();
}

/**
 * When `BOUT_MONGO_ONLY=1` the app skips all JSON-snapshot / Blob / Redis
 * persistence layers and reads/writes exclusively through MongoDB.
 * Enable this once you have a stable Mongo connection in production
 * so you eliminate the triple-write overhead.
 */
export function mongoOnly(): boolean {
  const raw = String(process.env.BOUT_MONGO_ONLY ?? "").trim().toLowerCase();
  return hasConfiguredMongoUri() && ["1", "true", "yes"].includes(raw);
}

export function requireMongoUri(): string {
  const uri = getConfiguredMongoUri();
  if (uri) return uri;
  if (process.env.NODE_ENV !== "production") {
    return "mongodb://127.0.0.1:27017/luxuryshop";
  }
  throw new Error("Missing MongoDB connection string. Set MONGO_URI, MONGODB_URI, or DATABASE_URL.");
}
