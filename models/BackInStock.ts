import { Schema, model, models } from "mongoose";

const backInStockSchema = new Schema(
  {
    productId: { type: String, required: true, index: true },
    email: { type: String, default: "" },
    userId: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now },
  },
  { minimize: false }
);

backInStockSchema.index({ productId: 1, email: 1 }, { unique: true, sparse: true });

const BackInStock = models.BackInStock || model("BackInStock", backInStockSchema);

export default BackInStock;
