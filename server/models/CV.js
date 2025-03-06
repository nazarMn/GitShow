const mongoose = require('mongoose');

const cvSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  templateId: { type: String, required: true },
  name: { type: String, required: true },
  specialty: { type: String, required: true },
  summary: { type: String },
  phoneNumber: { type: String },
  location: { type: String },
  email: { type: String, required: true },
  references: [{ type: String }],
  skills: [{ type: String }],
  education: {
    university: { type: String },
    specialty: { type: String },
    startYear: { type: Number },
    endYear: { type: Number }
  },
  experience: [
    {
      name: { type: String },
      yearsAndPosition: { type: String },
      description: { type: String }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

const CV = mongoose.model('CV', cvSchema);

module.exports = CV;
