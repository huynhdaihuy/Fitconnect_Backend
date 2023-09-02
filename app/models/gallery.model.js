const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  list_course: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  list_rent_service: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RentService'
  }]
});

const Gallery = mongoose.model('Gallery', gallerySchema);

module.exports = Gallery;
