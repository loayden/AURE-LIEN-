import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyTokenEdge } from "@/lib/auth-edge";

const protectedPaths = ["/account", "/wishlist", "/orders"];
const adminPaths = ["/admin"];

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value;
  const payload = token ? await verifyTokenEdge(token) : null;
  const path = req.nextUrl.pathname;

  if (adminPaths.some((p) => path.startsWith(p))) {
    if (!payload) {
      const login = new URL("/login", req.url);
      login.searchParams.set("redirect", path);
      return NextResponse.redirect(login);
    }
    if (payload.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  if (protectedPaths.some((p) => path.startsWith(p))) {
    if (!payload) {
      const login = new URL("/login", req.url);
      login.searchParams.set("redirect", path);
      return NextResponse.redirect(login);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*", "/wishlist/:path*", "/orders/:path*", "/admin/:path*"],
};
