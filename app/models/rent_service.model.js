const mongoose = require('mongoose');

const rentServiceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  list_exercise: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exercise'
  }],
  coach_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coach'
  }
});

const RentService = mongoose.model('RentService', rentServiceSchema);

module.exports = RentService;
