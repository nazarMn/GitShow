import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  university: { type: String, default: '' },
  description: { type: String, default: '' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const Resume = mongoose.models.Resume ?? mongoose.model('Resume', resumeSchema);

export default Resume;
