import { Schema, model, models } from "mongoose";

const adminAuditSchema = new Schema(
  {
    action: { type: String, required: true, index: true },
    actorId: { type: String, default: "" },
    actorEmail: { type: String, default: "" },
    targetType: { type: String, default: "" },
    targetId: { type: String, default: "" },
    detail: { type: Schema.Types.Mixed, default: {} },
    ip: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now, index: true },
  },
  { minimize: false }
);

adminAuditSchema.index({ createdAt: -1 });
adminAuditSchema.index({ action: 1, createdAt: -1 });

const AdminAudit = models.AdminAudit || model("AdminAudit", adminAuditSchema);

export default AdminAudit;
