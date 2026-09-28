import { createHmac, timingSafeEqual } from "crypto";

function clean(value: unknown): string {
  return String(value ?? "").trim();
}

/**
 * Verify Paymob webhook HMAC.
 * Paymob sends `hmac` computed over the payload with PAYMOB_HMAC_SECRET.
 * Supports: Authorization header, `hmac` body field, `x-paymob-hmac` header.
 * Fail-closed: returns false if secret missing or signature absent.
 */
export function verifyPaymobHmac(payload: Record<string, unknown>, signature: string): boolean {
  const secret = clean(process.env.PAYMOB_HMAC_SECRET);
  if (!secret || !signature) return false;
  try {
    // Canonical form: sorted keys joined as key=value&... (Paymob intention webhooks)
    const data = { ...payload };
    delete (data as Record<string, unknown>).hmac;
    const sorted = Object.keys(data)
      .sort()
      .map((k) => `${k}=${typeof data[k] === "object" ? JSON.stringify(data[k]) : String(data[k] ?? "")}`)
      .join("&");
    const expected = createHmac("sha512", secret).update(sorted).digest("hex");
    const a = new Uint8Array(Buffer.from(expected));
    const b = new Uint8Array(Buffer.from(clean(signature)));
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function getPaymobSignatureFromRequest(
  body: Record<string, unknown>,
  headers: Headers
): string {
  return (
    clean(headers.get("x-paymob-hmac")) ||
    clean(headers.get("hmac")) ||
    clean(body.hmac)
  );
}
