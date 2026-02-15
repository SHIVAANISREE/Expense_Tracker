const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  workspaceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workspace',
    required: true
  },
  titleId:     { type: mongoose.Schema.Types.ObjectId, ref: "Title" },
  title: String,
  amount: Number,
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',  // ← ADD THIS LINE if missing
    required: true
  },  // Still links to Category (Food, Transport, etc.)
  type: String, // "Income" or "Expense"
  date: String,
  month: String,
  year: String,
  CrBy: String,
  CrAt: Date,
  MoBy: String,
  MoAt: Date
});

// Indexes for faster workspace-specific queries
expenseSchema.index({ userId: 1, workspaceId: 1 });
expenseSchema.index({ userId: 1, workspaceId: 1, date: 1 });
expenseSchema.index({ userId: 1, workspaceId: 1, month: 1 });
expenseSchema.index({ userId: 1, workspaceId: 1, year: 1 });

module.exports = mongoose.model("Expense", expenseSchema);