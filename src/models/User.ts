import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  phoneNumber: {
    type: String,
    unique: true,
    sparse: true,
  },
  preferredLanguage: {
    type: String,
    default: 'en',
  },
  smsAlertsEnabled: {
    type: Boolean,
    default: false,
  },
  alertCategories: {
    type: [String],
    default: [],
  },
  role: {
    type: String,
    enum: ["farmer", "admin"],
    default: "farmer",
  },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", UserSchema);