import { Schema, model, models } from "mongoose";

const reelSchema = new Schema(
  {
    _id: { type: String, required: true },
    title: { type: String, default: "" },
    videoUrl: { type: String, required: true },
    posterUrl: { type: String, default: "" },
    productIds: { type: [String], default: [] },
    active: { type: Boolean, default: true, index: true },
    createdAt: { type: Date, default: Date.now, index: true },
  },
  { minimize: false }
);

reelSchema.index({ active: 1, createdAt: -1 });

const Reel = models.Reel || model("Reel", reelSchema);

export default Reel;
