import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    _id: { type: String },
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    images: { type: [String], default: [] },
    size: { type: [String], default: [] },
    colors: { type: [String], default: [] },
    description: { type: String },
    material: { type: String },
    stock: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);