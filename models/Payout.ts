import { Schema, model, models } from "mongoose";

const payoutSchema = new Schema(
  {
    _id: { type: String, required: true },
    applicationId: { type: String, required: true, index: true },
    partnerUserId: { type: String, required: true, index: true },
    amount: { type: Number, required: true, min: 1 },
    currency: { type: String, default: "EGP" },
    status: {
      type: String,
      enum: ["requested", "approved", "paid", "rejected"],
      default: "requested",
      index: true,
    },
    orderIds: { type: [String], default: [] },
    adminNote: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now, index: true },
    decidedAt: { type: Date },
  },
  { minimize: false }
);

payoutSchema.index({ applicationId: 1, createdAt: -1 });

const Payout = models.Payout || model("Payout", payoutSchema);

export default Payout;
