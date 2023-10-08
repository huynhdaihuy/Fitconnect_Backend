const Rating = require('../models/rating.model');

exports.createRating = async (req, res) => {
  try {
    const { course_id, customer_id, content, rating_point } = req.body;
    
    const rating = new Rating({
      course_id,
      customer_id,
      content,
      rating_point,
    });

    await rating.save();
    res.status(201).json({ message: 'Rating created successfully', rating });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while creating the rating' });
  }
};

exports.getAverageRating = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const averageRating = await Rating.getAverageRating(courseId);
    
    res.status(200).json({ averageRating });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching the average rating' });
  }
};exports.getRatingOfCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const allRatingofCourse = await Rating.find({course_id : courseId}).populate();
    
    res.status(200).json({ allRatingofCourse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching the average rating' });
  }
};

