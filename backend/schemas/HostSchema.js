const mongoose = require("mongoose");

const hostSchema = new mongoose.Schema({
  name: String,
  photo: String,
  yearsHosting: {
    type: Number,
    min: 0,
    validate: {
      validator: Number.isInteger,
      message: "{VALUE} is not an integer value",
    },
  },
});

const Host = mongoose.model("Host", hostSchema);

module.exports = Host;
