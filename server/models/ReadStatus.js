const mongoose = require('mongoose');

const readStatusSchema = new mongoose.Schema({
  chatId: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  lastReadAt: { type: Date, default: new Date(0) }, 
});

readStatusSchema.index({ chatId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('ReadStatus', readStatusSchema);
