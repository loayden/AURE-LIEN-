import { NextRequest, NextResponse } from "next/server";
import { getAuthFromRequest } from "@/lib/auth";
import { findUserById } from "@/lib/usersJson";
import { getEnvAdminUser, isEnvAdminIdentity } from "@/lib/adminAuth";

export async function GET(req: NextRequest) {
  const auth = await getAuthFromRequest(req);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const user = await findUserById(auth.userId);
    if (!user && auth.role === "admin" && isEnvAdminIdentity(auth.userId, auth.email)) {
      const envAdmin = getEnvAdminUser();
      if (envAdmin) {
        return NextResponse.json(envAdmin);
      }
    }
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      phone: user.phone ?? "",
      address: user.address ?? "",
      apartment: user.apartment ?? "",
      city: user.city ?? "",
      postalCode: user.postalCode ?? "",
      country: user.country ?? "",
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}
