const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  githubId: { type: [String], default: [] },
  username: { type: [String], default: [] },
  name: { type: [String], default: [] },
  profileUrl: { type: [String], default: [] },
  avatarUrl: { type: [String], default: [] },
  apiKey: { type: [String], default: [] },
  location: { type: [String], default: [] },
  bio: { type: [String], default: [] },
  company: { type: [String], default: [] },
  email: { type: [String], default: [] }, // Масив email
  instagram: { type: [String], default: [] },
  twitter: { type: [String], default: [] },
  facebook: { type: [String], default: [] },
  YearsOfExperience: { type: [Number], default: [] }, // Масив чисел
  contributions: { type: Array, default: [] },
  bookmarkedProjects: { type: [mongoose.Schema.Types.ObjectId], ref: 'Project', default: [] }
});


module.exports = mongoose.model('User', UserSchema);
