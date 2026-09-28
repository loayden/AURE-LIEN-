/**
 * Safe env presence checks — booleans only, never values.
 * Used by /api/health so Vercel misconfig shows up fast.
 */

function clean(value: unknown): string {
  return String(value ?? "").trim();
}

function has(value: unknown): boolean {
  return clean(value).length > 0;
}

export function getStripeMode(): "missing" | "test" | "live" {
  const key = clean(process.env.STRIPE_SECRET_KEY);
  if (!key) return "missing";
  if (key.startsWith("sk_test")) return "test";
  if (key.startsWith("sk_live")) return "live";
  return "test";
}

export function getEnvCheck() {
  const mongo =
    has(process.env.MONGO_URI) || has(process.env.MONGODB_URI) || has(process.env.DATABASE_URL);
  return {
    mongo,
    jwt: has(process.env.JWT_SECRET),
    redis: has(process.env.UPSTASH_REDIS_REST_URL) && has(process.env.UPSTASH_REDIS_REST_TOKEN),
    stripe: getStripeMode(),
    stripeWebhook: has(process.env.STRIPE_WEBHOOK_SECRET),
    paymob: has(process.env.PAYMOB_SECRET_KEY),
    paymobHmac: has(process.env.PAYMOB_HMAC_SECRET),
    adminBootstrap: has(process.env.ADMIN_EMAIL) && has(process.env.ADMIN_PASSWORD),
    email: has(process.env.EMAIL_USER) && has(process.env.EMAIL_PASS),
    publicUrl: clean(process.env.NEXT_PUBLIC_URL) || clean(process.env.VERCEL_URL),
    blob: has(process.env.BLOB_READ_WRITE_TOKEN),
  };
}
