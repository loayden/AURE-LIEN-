import { Schema, model, models } from "mongoose";

const newsletterSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    source: { type: String, default: "storefront" },
    createdAt: { type: Date, default: Date.now },
  },
  { minimize: false }
);

const Newsletter = models.Newsletter || model("Newsletter", newsletterSchema);

export default Newsletter;
