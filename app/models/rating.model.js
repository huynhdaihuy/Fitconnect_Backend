const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    rating_point: Number,
    comment: String,
  },
  { timestamps: true }
);

const Rating = mongoose.model("Rating", ratingSchema);

module.exports = Rating;
