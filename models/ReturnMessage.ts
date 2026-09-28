import { Schema, model, models } from "mongoose";

const returnMessageSchema = new Schema(
  {
    returnId: { type: String, required: true, index: true },
    authorRole: { type: String, enum: ["customer", "admin"], required: true },
    authorId: { type: String, default: "" },
    body: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, index: true },
  },
  { minimize: false }
);

returnMessageSchema.index({ returnId: 1, createdAt: 1 });

const ReturnMessage = models.ReturnMessage || model("ReturnMessage", returnMessageSchema);

export default ReturnMessage;
