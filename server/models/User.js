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
});

module.exports = mongoose.model('User', UserSchema);
