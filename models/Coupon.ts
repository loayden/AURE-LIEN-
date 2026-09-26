import { Schema, model, models } from "mongoose";

const couponSchema = new Schema(
  {
    code: { type: String, required: true, unique: true, index: true },
    kind: { type: String, enum: ["percent", "fixed"], required: true },
    value: { type: Number, required: true, min: 0 },
    minSubtotal: { type: Number, default: 0 },
    maxUses: { type: Number, default: 0 },
    usedCount: { type: Number, default: 0 },
    active: { type: Boolean, default: true, index: true },
    expiresAt: { type: Date },
    createdAt: { type: Date, default: Date.now },
  },
  { minimize: false }
);

const Coupon = models.Coupon || model("Coupon", couponSchema);

export default Coupon;
