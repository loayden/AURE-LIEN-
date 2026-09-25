import { Schema, model, models } from "mongoose";

const loyaltyLedgerSchema = new Schema(
  {
    _id: { type: String, required: true },
    userId: { type: String, required: true, index: true },
    orderId: { type: String, default: "", index: true },
    points: { type: Number, required: true },
    kind: { type: String, enum: ["redeem", "bonus"], required: true },
    note: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now, index: true },
  },
  { minimize: false }
);

loyaltyLedgerSchema.index({ userId: 1, kind: 1 });
loyaltyLedgerSchema.index({ orderId: 1 }, { unique: true, sparse: true });

const LoyaltyLedger = models.LoyaltyLedger || model("LoyaltyLedger", loyaltyLedgerSchema);

export default LoyaltyLedger;
