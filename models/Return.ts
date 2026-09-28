import { Schema, model, models } from "mongoose";

const returnSchema = new Schema(
  {
    _id: { type: String, required: true },
    orderId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },
    reason: { type: String, required: true },
    status: {
      type: String,
      enum: ["requested", "approved", "rejected", "completed"],
      default: "requested",
      index: true,
    },
    adminNote: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now, index: true },
    updatedAt: { type: Date, default: Date.now },
  },
  { minimize: false }
);

returnSchema.index({ userId: 1, createdAt: -1 });

const ReturnRequest = models.ReturnRequest || model("ReturnRequest", returnSchema);

export default ReturnRequest;
