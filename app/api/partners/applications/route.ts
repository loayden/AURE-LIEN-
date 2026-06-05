import { NextRequest, NextResponse } from "next/server";
import { getAuthFromRequest } from "@/lib/auth";
import { getBoutiqueApplications, type BoutiqueApplication } from "@/lib/boutiqueApplications";

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store, max-age=0",
};

function ownsApplication(application: BoutiqueApplication, auth: NonNullable<Awaited<ReturnType<typeof getAuthFromRequest>>>): boolean {
  if (auth.role === "admin") return true;
  if (application.partnerUserId && application.partnerUserId === auth.userId) return true;
  return Boolean(
    !application.partnerUserId &&
      application.email &&
      application.email.toLowerCase() === auth.email?.toLowerCase()
  );
}

export async function GET(req: NextRequest) {
  const auth = await getAuthFromRequest(req);
  if (!auth) {
    return NextResponse.json(
      { error: "Sign in with the partner account to manage boutique products." },
      { status: 401, headers: NO_STORE_HEADERS }
    );
  }

  const applications = (await getBoutiqueApplications())
    .filter((application) => ownsApplication(application, auth))
    .map((application) => ({
      _id: application._id,
      boutiqueName: application.boutiqueName,
      ownerName: application.ownerName,
      phone: application.phone,
      planName: application.planName,
      status: application.status,
      city: application.city,
      area: application.area,
      createdAt: application.createdAt,
      payoutStatus: application.payoutProfile?.status ?? "missing",
    }));

  return NextResponse.json({ applications }, { headers: NO_STORE_HEADERS });
}
