import { Schema, model, models } from "mongoose";

const reviewSchema = new Schema(
  {
    productId: { type: String, required: true, index: true },
    userId: { type: String, required: true },
    userName: { type: String, default: "" },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, default: "" },
    body: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now, index: true },
  },
  { minimize: false }
);

reviewSchema.index({ productId: 1, createdAt: -1 });
reviewSchema.index({ productId: 1, userId: 1 }, { unique: true });

const Review = models.Review || model("Review", reviewSchema);

export default Review;
