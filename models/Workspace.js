const mongoose = require("mongoose");

const workspaceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  icon: {
    type: String,
    default: '💼'
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  CrBy: String,
  CrAt: Date,
  MoBy: String,
  MoAt: Date
});

// Index for faster queries
workspaceSchema.index({ userId: 1 });

module.exports = mongoose.model("Workspace", workspaceSchema);