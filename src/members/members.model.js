const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  birthDate: { type: Date, required: true },
  subscribedBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
  borrowedBooks: [{
    borrowedBookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
    borrowedDate: { type: Date },
    returnDate: { type: Date }
  }],
  returnRate: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Member', memberSchema);