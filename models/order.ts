import { Schema, model, models } from "mongoose";

const orderItemSchema = new Schema(
  {
    productId: { type: String, required: true },
    name: { type: String, default: "" },
    price: { type: Number, default: 0 },
    quantity: { type: Number, default: 1 },
    image: { type: String, default: "" },
    size: { type: String, default: null },
    color: { type: String, default: null },
  },
  { _id: false }
);

const legacyProductSchema = new Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, default: "" },
    price: { type: Number, default: 0 },
    quantity: { type: Number, default: 1 },
    image: { type: String, default: "" },
    size: { type: String, default: null },
    color: { type: String, default: null },
  },
  { _id: false }
);

const customerSchema = new Schema(
  {
    dataCleared: { type: Boolean, default: false },
    email: { type: String, default: "" },
    firstName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    name: { type: String, default: "" },
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    apartment: { type: String, default: "" },
    city: { type: String, default: "" },
    postalCode: { type: String, default: "" },
    country: { type: String, default: "" },
    newsletter: { type: Boolean, default: false },
    shippingMethod: { type: String, default: "" },
    shippingCost: { type: Number, default: 0 },
  },
  { _id: false }
);

const orderSchema = new Schema(
  {
    _id: { type: String, required: true },
    id: { type: String, required: true },
    userId: { type: String, required: true, index: true },
    items: { type: [orderItemSchema], default: [] },
    products: { type: [legacyProductSchema], default: [] },
    totalPrice: { type: Number, required: true, default: 0 },
    total: { type: Number, required: true, default: 0 },
    status: { type: String, default: "pending" },
    paymentStatus: { type: String, default: "pending" },
    paymentMethod: { type: String, default: "" },
    customerDataCleared: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    customer: { type: customerSchema, default: {} },
  },
  {
    minimize: false,
  }
);

const Order = models.Order || model("Order", orderSchema);

export default Order;
