import { Schema, model, models } from "mongoose";

const referralSchema = new Schema(
  {
    code: { type: String, required: true, unique: true, index: true },
    referrerUserId: { type: String, required: true, index: true },
    referredEmail: { type: String, default: "", index: true },
    referredUserId: { type: String, default: "" },
    status: { type: String, enum: ["issued", "converted"], default: "issued" },
    createdAt: { type: Date, default: Date.now },
  },
  { minimize: false }
);

const Referral = models.Referral || model("Referral", referralSchema);

export default Referral;
