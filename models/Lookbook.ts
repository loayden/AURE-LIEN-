import { Schema, model, models } from "mongoose";

const hotspotSchema = new Schema({
  productId: { type: String, required: true },
  x: { type: Number, required: true },
  y: { type: Number, required: true },
});

const sectionSchema = new Schema({
  title: { type: String, required: true },
  image: { type: String, required: true },
  slug: { type: String, required: true },
  hotspots: { type: [hotspotSchema], default: [] },
});

const lookbookSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  sections: { type: [sectionSchema], default: [] },
  published: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Lookbook = models.Lookbook || model("Lookbook", lookbookSchema);
export default Lookbook;
