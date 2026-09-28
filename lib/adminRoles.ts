import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getAuthFromRequest, type JWTPayload } from "@/lib/auth";

export type AdminScope = "orders" | "returns";

/**
 * Role gate for admin APIs.
 * - `admin`: full access everywhere.
 * - `support`: read-only, plus status updates in the `orders`/`returns` scopes.
 * Env bootstrap accounts stay admin-only; assign `support` to DB users.
 */
export async function requireAdmin(
  req: NextRequest
): Promise<{ auth: JWTPayload } | { response: NextResponse }> {
  const auth = await getAuthFromRequest(req);
  if (!auth || (auth.role !== "admin" && auth.role !== "support")) {
    return { response: NextResponse.json({ message: "Not authorized" }, { status: 403 }) };
  }
  return { auth };
}

export async function requireAdminWrite(
  req: NextRequest,
  scope?: AdminScope
): Promise<{ auth: JWTPayload } | { response: NextResponse }> {
  const auth = await getAuthFromRequest(req);
  if (!auth) {
    return { response: NextResponse.json({ message: "Not authorized" }, { status: 403 }) };
  }
  if (auth.role === "admin") return { auth };
  if (auth.role === "support" && (scope === "orders" || scope === "returns")) return { auth };
  return { response: NextResponse.json({ message: "Not authorized" }, { status: 403 }) };
}
