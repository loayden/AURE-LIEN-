import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAuthFromRequest } from "@/lib/auth";
import { getClientIpFromHeaders, logAdminAction } from "@/lib/adminAudit";
import { getBoutiqueApplications, reviewBoutiqueApplication, updateBoutiqueTerms, verifyBoutiqueShop } from "@/lib/boutiqueApplications";
import { notifyPartnerApplicationDecision } from "@/lib/notifications";
import { getVerificationEmailHtml } from "@/lib/email/templates/transactional";
import { sendEmailAsync } from "@/lib/email/sender";

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
  action: z.enum(["approve", "decline", "reopen", "terms", "verify", "unverify"]),
  reviewNote: z.string().max(1000).optional().default(""),
  commissionRate: z.number().min(0).max(30).optional(),
  monthlyFee: z.number().min(0).max(100000).optional(),
  categoryCommissions: z.record(z.string(), z.number().min(0).max(30)).optional(),
  checklist: z.object({
    photosMatchMap: z.boolean(),
    signageVisible: z.boolean(),
    detailsConfirmed: z.boolean(),
  }).optional(),
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
      categoryCommissions: parsed.data.categoryCommissions,
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
  if (parsed.data.action === "verify" || parsed.data.action === "unverify") {
    const verified = parsed.data.action === "verify";
    const checklist = parsed.data.checklist ?? { photosMatchMap: false, signageVisible: false, detailsConfirmed: false };
    const result = await verifyBoutiqueShop(parsed.data.applicationId, {
      verified,
      checklist,
      verifiedBy: auth.email,
    });
    if (!result) {
      return NextResponse.json(
        { error: verified ? "Application not found, or confirm all three checklist items" : "Application not found" },
        { status: verified ? 400 : 404, headers: NO_STORE_HEADERS }
      );
    }
    await logAdminAction({
      action: verified ? "admin.boutique.verify" : "admin.boutique.unverify",
      actorId: auth.userId,
      actorEmail: auth.email,
      targetType: "boutique-application",
      targetId: result._id,
      ip: getClientIpFromHeaders(req.headers),
    });
    try {
      const base = (process.env.NEXT_PUBLIC_URL || "").replace(/\/+$/, "");
      sendEmailAsync({
        to: result.email,
        subject: verified ? `BOUT verified ${result.boutiqueName}` : `BOUT verification update · ${result.boutiqueName}`,
        html: getVerificationEmailHtml({
          ownerName: result.ownerName,
          boutiqueName: result.boutiqueName,
          applicationId: result._id,
          verified,
          storefrontUrl: verified && result.storefrontSlug && base ? `${base}/boutiques/${encodeURIComponent(result.storefrontSlug)}` : undefined,
        }),
      });
    } catch {
      // notifications never fail the request
    }
    return NextResponse.json({ success: true, application: result }, { headers: NO_STORE_HEADERS });
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
