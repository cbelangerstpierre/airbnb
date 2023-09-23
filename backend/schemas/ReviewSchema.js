const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  name: String,
  houseId: mongoose.Schema.Types.ObjectId,
  date: Date,
  text: String,
  stars: { type: Number, min: 1, max: 5 }
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;