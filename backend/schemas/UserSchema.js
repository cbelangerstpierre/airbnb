const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  photo: String,
  userCreated: Date,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
