const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  githubId: { type: String, required: true },
  username: { type: String, required: true },
  name: { type: String },
  profileUrl: { type: String },
  avatarUrl: { type: String },
  apiKey: { type: String },
  location: { type: String },
  bio: { type: String },
  company: { type: String },
  email: { type: String }, // Додано email
  instagram: { type: String },
  twitter: { type: String },
  facebook: { type: String },
  YearsOfExperience: { type: Number },
  contributions: { type: Array, default: [] },
  bookmarkedProjects: { type: Array, default: [] } 
});


module.exports = mongoose.model('User', UserSchema);
