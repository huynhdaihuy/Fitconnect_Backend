const mongoose = require("mongoose");
const typeEnum = ["education", "work", "language", "other"];

const certificationSchema = new mongoose.Schema({
  issued_place: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: typeEnum,
    required: true,
  },
  issue_date: {
    type: Date,
    required: true,
  },
  expiration_date: {
    type: Date,
    // required: true,
  },
  major: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Major",
    required: true,
  },
  coach_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Coach",
    required: true,
  },
});

const Certification = mongoose.model("Certification", certificationSchema);

module.exports = Certification;
