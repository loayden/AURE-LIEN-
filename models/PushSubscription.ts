import { Schema, model, models } from "mongoose";

const pushSubscriptionSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    endpoint: { type: String, required: true, unique: true },
    p256dh: { type: String, required: true },
    auth: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { minimize: false }
);

const PushSubscription =
  models.PushSubscription || model("PushSubscription", pushSubscriptionSchema);

export default PushSubscription;
