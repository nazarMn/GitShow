const mongoose = require('mongoose');

const cvSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  templateId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const CV = mongoose.model('CV', cvSchema);

module.exports = CV;
