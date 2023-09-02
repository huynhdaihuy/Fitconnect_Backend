const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  url_image: {
    type: String,
    required: false
  },
  url_video: {
    type: String,
    required: false
  },
  duration: {
    type: Number,
    required: true
  },
  quantity_rep_per_set: {
    type: Number,
    required: true
  },
  quantity_set: {
    type: Number,
    required: true
  }
});

const Exercise = mongoose.model('Exercise', exerciseSchema);

module.exports = Exercise;
