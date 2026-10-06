import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  link: { type: String, required: true },
  description: { type: String },
  imageUrl: { type: String },
  websiteUrl: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userAvatar: { type: String },
});

const Project = mongoose.models.Project ?? mongoose.model('Project', projectSchema);

export default Project;
