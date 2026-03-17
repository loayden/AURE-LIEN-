import { Schema, model, models } from "mongoose";

const productDataSchema = new Schema({
  _id: String,
  name: String,
  price: Number,
  images: [String],
  category: String,
}, { _id: false });

const wishlistSchema = new Schema({
  userId: { type: String, required: true },
  productId: { type: String, required: true },
  productData: { type: productDataSchema, default: null },
  createdAt: { type: Date, default: Date.now },
});

wishlistSchema.index({ userId: 1, productId: 1 }, { unique: true });

const Wishlist = models.Wishlist || model("Wishlist", wishlistSchema);
export default Wishlist;
