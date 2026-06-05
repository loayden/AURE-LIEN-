import { Schema, model, models } from "mongoose";

const userSchema = new Schema({
  id: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["customer", "admin"], default: "customer" },
  accountIntent: { type: String, enum: ["buyer", "partner", "both"], default: "buyer" },
  phone: { type: String, default: "" },
  address: { type: String, default: "" },
  apartment: { type: String, default: "" },
  city: { type: String, default: "" },
  postalCode: { type: String, default: "" },
  country: { type: String, default: "" },
  deviceId: { type: String, default: "", index: true },
  deviceAccountWarning: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

const User = models.User || model("User", userSchema);
export default User;
