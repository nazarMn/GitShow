const mongoose = require('mongoose');

const cvSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  templateId: { type: String, required: true },
  name: { type: String, default: '' },  // Не обов’язково
  specialty: { type: String, default: '' },  // Не обов’язково
  summary: { type: String, default: '' },
  phoneNumber: { type: String, default: '' },
  location: { type: String, default: '' },
  email: { type: String, default: '' },  // Можливо, потрібно зробити не обов’язковим?
  references: [{ type: String, default: [] }],
  skills: [{ type: String, default: [] }],
  education: {
    university: { type: String, default: '' },
    specialty: { type: String, default: '' },
    startYear: { type: Number, default: null },
    endYear: { type: Number, default: null }
  },
  experience: [
    {
      name: { type: String, default: '' },
      yearsAndPosition: { type: String, default: '' },
      description: { type: String, default: '' }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

const CV = mongoose.model('CV', cvSchema);
module.exports = CV;
