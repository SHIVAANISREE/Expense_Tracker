// models/Title.js
const mongoose = require("mongoose");

const titleSchema = new mongoose.Schema({
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  userId:     { type: mongoose.Schema.Types.ObjectId, required: true },
  name:       { type: String, required: true },
  email:      { type: String },
  CrBy:       { type: String },
  CrAt:       { type: Date },
  MoBy:       { type: String },
  MoAt:       { type: Date },
});

module.exports = mongoose.model("Title", titleSchema);