import connectDB, { hasConfiguredMongoUri } from "@/lib/connectDB";
import AdminAudit from "@/models/AdminAudit";

export type AdminAuditInput = {
  action: string;
  actorId?: string;
  actorEmail?: string;
  targetType?: string;
  targetId?: string;
  detail?: Record<string, unknown>;
  ip?: string;
};

/** Append-only audit log. Never throws — failures are logged only. */
export async function logAdminAction(input: AdminAuditInput): Promise<void> {
  try {
    if (!hasConfiguredMongoUri()) return;
    await connectDB();
    await AdminAudit.create({
      action: String(input.action).slice(0, 120),
      actorId: String(input.actorId ?? "").slice(0, 200),
      actorEmail: String(input.actorEmail ?? "").slice(0, 200),
      targetType: String(input.targetType ?? "").slice(0, 80),
      targetId: String(input.targetId ?? "").slice(0, 200),
      detail: input.detail ?? {},
      ip: String(input.ip ?? "").slice(0, 80),
    });
  } catch (error) {
    console.warn(
      "Admin audit log failed:",
      error instanceof Error ? error.message : String(error)
    );
  }
}

export function getClientIpFromHeaders(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim().slice(0, 80);
  return (headers.get("x-real-ip") ?? "").trim().slice(0, 80);
}
