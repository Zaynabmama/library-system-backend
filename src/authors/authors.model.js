const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
  name: {
    en: { type: String, required: true },
    ar: { type: String, required: true }
  },
  email: { type: String, required: true,unique: true },
  biography: {
    en: { type: String },
    ar: { type: String }
  },
  profileImageUrl: { type: String },
  birthDate: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Author', authorSchema);