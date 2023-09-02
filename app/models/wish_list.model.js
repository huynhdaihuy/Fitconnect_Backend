const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  list_coach: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coach'
  }],
  list_course: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }]
});

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

module.exports = Wishlist;
