const Rating = require("../models/rating.model");

exports.createRating = async (req, res) => {
  try {
    const newRating = new Rating(req.body);
    const savedRating = await newRating.save();
    res.status(201).json(savedRating);
  } catch (error) {
    console.error("Error creating rating:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAllRatings = async (req, res) => {
  try {
    const ratings = await Rating.find();
    res.status(200).json(ratings);
  } catch (error) {
    console.error("Error getting ratings:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getRatingById = async (req, res) => {
  const { ratingId } = req.params;
  try {
    const rating = await Rating.findById(ratingId);
    if (!rating) {
      return res.status(404).json({ error: "Rating not found" });
    }
    res.status(200).json(rating);
  } catch (error) {
    console.error("Error getting rating by ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateRatingById = async (req, res) => {
  const { ratingId } = req.params;
  try {
    const updatedRating = await Rating.findByIdAndUpdate(ratingId, req.body, {
      new: true,
    });
    if (!updatedRating) {
      return res.status(404).json({ error: "Rating not found" });
    }
    res.status(200).json(updatedRating);
  } catch (error) {
    console.error("Error updating rating by ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteRatingById = async (req, res) => {
  const { ratingId } = req.params;
  try {
    const deletedRating = await Rating.findByIdAndDelete(ratingId);
    if (!deletedRating) {
      return res.status(404).json({ error: "Rating not found" });
    }
    res.status(204).json();
  } catch (error) {
    console.error("Error deleting rating by ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
