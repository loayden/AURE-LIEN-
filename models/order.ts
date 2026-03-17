import { Schema, model, models } from "mongoose";

const orderSchema = new Schema({
  userId: { type: String, required: true },
  items: [{ productId: String, quantity: Number }],
  totalPrice: { type: Number, required: true },
  status: { type: String, default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

const Order = models.Order || model("Order", orderSchema);

export default Order;