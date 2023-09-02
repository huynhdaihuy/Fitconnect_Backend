const mongoose = require("mongoose");
const hardnessEnum = ["beginner", "immediately", "advance", "professional"];
const planSchema = new mongoose.Schema({
  description: {
    type: String,
    // required: true,
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
  list_exercise_per_day: [
    [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Exercise",
      },
    ],
  ],
});

const Plan = mongoose.model("Plan", planSchema);

module.exports = Plan;
