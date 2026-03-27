import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
<<<<<<< HEAD
=======
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
>>>>>>> 723cd574cea17f27ddc7f730aa69a1b7c17cf1c5
  role: {
    type: String,
    enum: ["farmer", "admin"],
    default: "farmer",
  },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", UserSchema);