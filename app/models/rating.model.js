const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  rating_point: {
    type: Number,
    required: true
  }
});

ratingSchema.statics.getAverageRating = async function (courseId) {
  
    const result = await this.aggregate([
      {
        $match: { course_id: mongoose.Types.ObjectId(courseId) }
      },
      {
        $group: {
          _id: "$course_id",
          averageRating: { $avg: "$rating_point" }
        }
      }
    ]);
    if (result.length > 0) {
      return result[0].averageRating;
    } else {
      return 0;
    }
  };
const Rating = mongoose.model('Rating', ratingSchema);

module.exports = Rating;
