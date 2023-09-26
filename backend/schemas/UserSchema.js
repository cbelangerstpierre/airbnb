const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  password: String,
  photo: String,
  userCreatedDate: Date,
  houses: [mongoose.Schema.Types.ObjectId]
});

const User = mongoose.model("User", userSchema);

module.exports = User;
