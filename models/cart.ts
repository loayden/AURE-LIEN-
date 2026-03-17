// /models/Cart.ts
import { Schema, model, models } from "mongoose";

const cartSchema = new Schema({
  userId: { type: String, required: true },
  productId: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1 },
  addedAt: { type: Date, default: Date.now },
});

// هذا السطر يحمي من إعادة تعريف الموديل أثناء الـ hot reload في Next.js
const Cart = models.Cart || model("Cart", cartSchema);

export default Cart;