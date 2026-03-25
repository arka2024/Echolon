import mongoose from "mongoose";

const FarmerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  location: String,
  landSize: Number,
  soilType: String,
}, { timestamps: true });

export default mongoose.models.Farmer || mongoose.model("Farmer", FarmerSchema);