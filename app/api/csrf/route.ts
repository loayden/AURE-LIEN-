import { NextRequest, NextResponse } from "next/server";
import { generateCsrfToken, getCsrfToken, setCsrfCookie } from "@/lib/csrf";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const existingToken = getCsrfToken(req);
  const token = existingToken ?? generateCsrfToken();
  const response = NextResponse.json(
    { token },
    { headers: { "Cache-Control": "no-store, max-age=0" } }
  );

  if (!existingToken) setCsrfCookie(response, token);
  return response;
}
