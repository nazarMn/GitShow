import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
  titleSkill: { type: String, default: '' },
  descriptionSkill: { type: String, default: '' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

// Keep the existing collection/model name used by app.js so stored records remain compatible.
const Skills = mongoose.models.Skills ?? mongoose.model('Skills', skillSchema);

export default Skills;
