const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    reviewId: {
      type: Number,
      required: true,
      unique: true
    },
    name: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      required: true
    },
    feedback: {
      type: String,
      required: true
    },
    approved: {
      type: Boolean,
      default: false
    },
  });
  

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
