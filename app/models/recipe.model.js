const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema(
  {
    time: Number,
    title: String,
    method: String,
    hardness: String,
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      default: 0,
    },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    ingredients: [String],
    instructions: String,
    url_image: String,
    url_video: String,
    ratings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Rating" }],
  },
  { timestamps: true }
);

const Recipe = mongoose.model("Recipe", recipeSchema);

module.exports = Recipe;
