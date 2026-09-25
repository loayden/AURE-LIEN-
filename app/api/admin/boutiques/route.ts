import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAuthFromRequest } from "@/lib/auth";
import { getClientIpFromHeaders, logAdminAction } from "@/lib/adminAudit";
import { getBoutiqueApplications, reviewBoutiqueApplication, updateBoutiqueTerms } from "@/lib/boutiqueApplications";
import { notifyPartnerApplicationDecision } from "@/lib/notifications";

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store, max-age=0",
};

export async function GET(req: NextRequest) {
  const auth = await getAuthFromRequest(req);
  if (!auth || auth.role !== "admin") {
    return NextResponse.json({ message: "Not authorized" }, { status: 403 });
  }

  const applications = (await getBoutiqueApplications()).filter((application) => application.status !== "draft");

  return NextResponse.json({ applications }, { headers: NO_STORE_HEADERS });
}

const reviewSchema = z.object({
  applicationId: z.string().min(1),
  action: z.enum(["approve", "decline", "reopen", "terms"]),
  reviewNote: z.string().max(1000).optional().default(""),
  commissionRate: z.number().min(0).max(30).optional(),
  monthlyFee: z.number().min(0).max(100000).optional(),
});

/** PATCH: approve or decline a boutique application (admin). */
export async function PATCH(req: NextRequest) {
  const auth = await getAuthFromRequest(req);
  if (!auth || auth.role !== "admin") {
    return NextResponse.json({ message: "Not authorized" }, { status: 403, headers: NO_STORE_HEADERS });
  }
  const body = await req.json().catch(() => ({}));
  const parsed = reviewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid request" }, { status: 400, headers: NO_STORE_HEADERS });
  }
  if (parsed.data.action === "terms") {
    const updated = await updateBoutiqueTerms(parsed.data.applicationId, {
      commissionRate: parsed.data.commissionRate,
      monthlyFee: parsed.data.monthlyFee,
    });
    if (!updated) {
      return NextResponse.json({ error: "Application not found" }, { status: 404, headers: NO_STORE_HEADERS });
    }
    await logAdminAction({
      action: "admin.boutique.terms",
      actorId: auth.userId,
      actorEmail: auth.email,
      targetType: "boutique-application",
      targetId: updated._id,
      detail: { commissionRate: updated.commissionRate, monthlyFee: updated.monthlyFee },
      ip: getClientIpFromHeaders(req.headers),
    });
    return NextResponse.json({ success: true, application: updated }, { headers: NO_STORE_HEADERS });
  }
  const application = await reviewBoutiqueApplication(parsed.data.applicationId, {
    status: parsed.data.action === "approve" ? "approved" : parsed.data.action === "reopen" ? "pending" : "declined",
    reviewNote: parsed.data.reviewNote,
  });
  if (!application) {
    return NextResponse.json({ error: "Application not found or transition not allowed" }, { status: 404, headers: NO_STORE_HEADERS });
  }
  await logAdminAction({
    action: `admin.boutique.${parsed.data.action}`,
    actorId: auth.userId,
    actorEmail: auth.email,
    targetType: "boutique-application",
    targetId: application._id,
    detail: { reviewNote: parsed.data.reviewNote },
    ip: getClientIpFromHeaders(req.headers),
  });
  try {
    if (parsed.data.action === "approve" || parsed.data.action === "decline") {
      notifyPartnerApplicationDecision(
        application,
        parsed.data.action === "approve" ? "approved" : "declined",
        parsed.data.reviewNote
      );
    }
  } catch {
    // notifications never fail the request
  }
  return NextResponse.json({ success: true, application }, { headers: NO_STORE_HEADERS });
}
