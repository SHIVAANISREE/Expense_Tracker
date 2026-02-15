const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  workspaceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workspace',
    required: true
  },
  name: { type: String, required: true },  // "Food", "Transport", etc.
  CrBy: String,
  CrAt: Date,
  MoBy: String,
  MoAt: Date
});

// Index for faster workspace-specific queries
categorySchema.index({ userId: 1, workspaceId: 1 });

module.exports = mongoose.model("Category", categorySchema);