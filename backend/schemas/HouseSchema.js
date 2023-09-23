const mongoose = require('mongoose');

const houseSchema = new mongoose.Schema({
  title: String,
  description: String,
  hostId: mongoose.Schema.Types.ObjectId,
  photos: [String],
  availabilities: [Date],
  pricePerNight: Number,
  guests: Number,
  bedrooms: Number,
  beds: Number,
  baths: Number,
  reviews: [mongoose.Schema.Types.ObjectId],
  address: String,
  city: String,
  province: String
});

const House = mongoose.model('House', houseSchema);

module.exports = House;
