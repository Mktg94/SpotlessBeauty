import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  ingredients?: string;
  usage?: string;
  skinType?: string[];
  price: number;
  discountPrice?: number;
  images: string[];
  category: mongoose.Types.ObjectId;
  brand?: string;
  stock: number;
  isFeatured: boolean;
  rating: number;
  numReviews: number;
  tags?: string[];
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    ingredients: { type: String },
    usage: { type: String },
    skinType: [{ type: String, enum: ["all", "dry", "oily", "combination", "sensitive", "normal"] }],
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, min: 0 },
    images: [{ type: String }],
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    brand: { type: String, trim: true },
    stock: { type: Number, default: 0, min: 0 },
    isFeatured: { type: Boolean, default: false },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    numReviews: { type: Number, default: 0 },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

// Full-text search index
ProductSchema.index({ name: "text", description: "text", brand: "text", tags: "text" });

const Product: Model<IProduct> =
  mongoose.models.Product ??
  mongoose.model<IProduct>("Product", ProductSchema);

export default Product;

