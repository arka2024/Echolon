import mongoose from "mongoose";

const AdvisorySchema = new mongoose.Schema({
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Farmer",
  },
  cropId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Crop",
  },
  advice: String,
  weather: String,
}, { timestamps: true });

export default mongoose.models.Advisory || mongoose.model("Advisory", AdvisorySchema);