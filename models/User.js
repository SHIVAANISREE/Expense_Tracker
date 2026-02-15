const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: {type:String, unique:true},
  password: String,
  CrBy: String,
  CrAt: Date,
  MoBy: String,
  MoAt: Date
});

module.exports = mongoose.model("User", userSchema);
