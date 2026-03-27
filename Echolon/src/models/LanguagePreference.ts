import mongoose from 'mongoose';

const LanguagePreferenceSchema = new mongoose.Schema(
  {
    clientId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    preferredLanguage: {
      type: String,
      required: true,
      default: 'en',
    },
  },
  { timestamps: true }
);

export default mongoose.models.LanguagePreference ||
  mongoose.model('LanguagePreference', LanguagePreferenceSchema);
