const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: { type: [String], required: true, default: [] },
  link: { type: [String], required: true, default: [] },
  description: { type: [String], default: [] },
  imageUrl: { type: [String], default: [] },
  websiteUrl: { type: [String], default: [] },
  userId: { type: [mongoose.Schema.Types.ObjectId], ref: "User", required: true, default: [] },
  userAvatar: { type: [String], default: [] }
});

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;
