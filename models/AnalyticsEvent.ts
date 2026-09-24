import { Schema, model, models } from "mongoose";

const analyticsEventSchema = new Schema(
  {
    event: { type: String, required: true, index: true },
    path: { type: String, default: "" },
    productId: { type: String, default: "" },
    userId: { type: String, default: "" },
    value: { type: Number, default: 0 },
    metadata: { type: Schema.Types.Mixed, default: {} },
    createdAt: { type: Date, default: Date.now, index: true },
  },
  { minimize: false }
);

analyticsEventSchema.index({ event: 1, createdAt: -1 });

const AnalyticsEvent =
  models.AnalyticsEvent || model("AnalyticsEvent", analyticsEventSchema);

export default AnalyticsEvent;
