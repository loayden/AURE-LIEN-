import { NextRequest, NextResponse } from "next/server";
import { getAuthFromRequest } from "@/lib/auth";
import { findUserById, updateUserProfile } from "@/lib/usersJson";
import { getEnvAdminUser, isEnvAdminIdentity } from "@/lib/adminAuth";

function publicUser(user: any) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    accountIntent: user.accountIntent ?? "buyer",
    createdAt: user.createdAt,
    phone: user.phone ?? "",
    address: user.address ?? "",
    apartment: user.apartment ?? "",
    city: user.city ?? "",
    postalCode: user.postalCode ?? "",
    country: user.country ?? "",
  };
}

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
    return NextResponse.json(publicUser(user));
  } catch {
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const auth = await getAuthFromRequest(req);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const updated = await updateUserProfile(auth.userId, {
      name: typeof body.name === "string" ? body.name : undefined,
      phone: typeof body.phone === "string" ? body.phone : undefined,
      address: typeof body.address === "string" ? body.address : undefined,
      apartment: typeof body.apartment === "string" ? body.apartment : undefined,
      city: typeof body.city === "string" ? body.city : undefined,
      postalCode: typeof body.postalCode === "string" ? body.postalCode : undefined,
      country: typeof body.country === "string" ? body.country : undefined,
      accountIntent: typeof body.accountIntent === "string" ? body.accountIntent : undefined,
    });

    if (!updated) {
      return NextResponse.json({ error: "Unable to update profile" }, { status: 400 });
    }

    return NextResponse.json(publicUser(updated));
  } catch {
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}
