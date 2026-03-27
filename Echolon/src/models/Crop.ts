import mongoose from "mongoose";

const CropSchema = new mongoose.Schema({
  name: String,
  season: String,
  expectedYield: Number,
  pricePerTon: Number,
}, { timestamps: true });

export default mongoose.models.Crop || mongoose.model("Crop", CropSchema);