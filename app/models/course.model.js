const mongoose = require("mongoose");
const hardnessEnum = ["beginner", "immediately", "advance", "professional"];

const courseSchema = new mongoose.Schema(
  {
    url_image: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    hardness: {
      type: String,
      enum: hardnessEnum,
      required: true,
    },
    period: {
      type: Number,
      required: true,
    },
    sold: {
      type: Number,
      default: 0,
    },
    coach_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coach",
    },
    rating: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rating",
    },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    list_exercise_per_day: [
      [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Exercise",
        },
      ],
    ],
  },
  { timestamps: true }
);

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
