const mongoose = require('mongoose');
const crypto = require('crypto');

// Оновлена схема для моделі CV
const cvSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  templateId: { type: String, required: true },
  name: { type: String, required: false }, 
  avatarUrl: { type: String, required: true },
  specialty: { type: String, default: '' },
  summary: { type: String, default: '' },
  phoneNumber: { type: String, default: '' },
  location: { type: String, default: '' },
  email: { type: String, default: '' },
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
      description: { type: String, default: '' },
      descriptions: [{ type: String }]
    }
  ],
  shareableLink: { type: String, unique: true, default: () => crypto.randomBytes(16).toString('hex') },
  createdAt: { type: Date, default: Date.now }
});

async function updateExistingCVs() {
  const cvs = await CV.find({ shareableLink: { $exists: false } });
  console.log(`Found ${cvs.length} CVs without shareableLink, updating...`);
  
  for (const cv of cvs) {
    cv.shareableLink = crypto.randomBytes(16).toString('hex');
    await cv.save();
  }
  
  console.log('Update completed');
}


const CV = mongoose.model('CV', cvSchema);
module.exports = CV;