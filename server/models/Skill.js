const mongoose = require("mongoose");

const SkillSchema = new mongoose.Schema({
  name: { type: [String], required: true, default: [] },
  description: { type: [String], required: true, default: [] },
  userId: { type: [mongoose.Schema.Types.ObjectId], ref: "User", required: true, default: [] }
});

module.exports = mongoose.model("Skill", SkillSchema);
