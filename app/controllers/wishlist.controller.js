const Wishlist = require("../models/wish_list.model");

// Create a new wishlist
const createWishlist = async (req, res) => {
  const { customer_id } = req.body;

  try {
    // Check if a wishlist already exists for the given customer_id
    const existingWishlist = await Wishlist.findOne({ customer_id });

    if (existingWishlist) {
      // If it exists, remove the existing wishlist
      await Wishlist.findByIdAndRemove(existingWishlist._id);
    }

    // Create the new wishlist
    const wishlist = await Wishlist.create(req.body);
    res.status(201).json(wishlist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a wishlist by ID
const updateWishlist = async (req, res) => {
  console.log(req.params.id);
  const { list_course, list_coach } = req.body;
  const data = { ...req.body };
  console.log(
    "🚀 ~ file: wishlist.controller.js:29 ~ updateWishlist ~ data:",
    data
  );
  console.log(
    "🚀 ~ file: wishlist.controller.js:28 ~ updateWishlist ~ list_coach:",
    list_coach
  );
  console.log(
    "🚀 ~ file: wishlist.controller.js:28 ~ updateWishlist ~ list_course:",
    list_course
  );
  try {
    const updatedWishlist = await Wishlist.findOneAndUpdate(
      { customer_id: req.params.id },
      { list_coach, list_course },
      { new: true }
    )
      .populate("list_coach")
      .populate({
        path: "list_course",
        populate: {
          path: "coach_id",
        },
      });
    if (!updatedWishlist) {
      return res.status(404).json({ error: "Wishlist not found" });
    }
    res.json(updatedWishlist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a wishlist by ID
const deleteWishlist = async (req, res) => {
  try {
    const deletedWishlist = await Wishlist.findByIdAndDelete(req.params.id);
    if (!deletedWishlist) {
      return res.status(404).json({ error: "Wishlist not found" });
    }
    res.json({ message: "Wishlist deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all wishlists
const getAllWishlists = async (req, res) => {
  try {
    const wishlists = await Wishlist.find().populate("list_coach list_course");
    res.json(wishlists);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get wishlist by customer_id
const getWishlistByCustomer = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({
      customer_id: req.params.customer_id,
    })
      .populate("list_coach")
      .populate({
        path: "list_course",
        populate: {
          path: "coach_id",
        },
      });

    if (!wishlist) {
      wishlist = await Wishlist.create({ customer_id: req.params.customer_id });
    }

    wishlist = await Wishlist.findOne({
      customer_id: req.params.customer_id,
    })
      .populate({
        path: "list_course",
        populate: {
          path: "coach_id",
        },
      })
      .populate("list_coach");

    res.json(wishlist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const addCourseToWishlist = async (req, res) => {
  const { customerId, courseId } = req.body;
  try {
    let wishlist = await Wishlist.findOne({ customer_id: customerId });

    if (!wishlist) {
      wishlist = await Wishlist.create({ customer_id: customerId });
    }

    wishlist.list_course.push(courseId);
    await wishlist.save();

    wishlist = await Wishlist.findById(wishlist._id).populate(
      "list_course list_coach"
    );

    res.json(wishlist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const addCoachToWishlist = async (req, res) => {
  const { customerId, coachId } = req.body;

  try {
    let wishlist = await Wishlist.findOne({ customer_id: customerId });

    if (!wishlist) {
      wishlist = await Wishlist.create({ customer_id: customerId });
    }

    wishlist.list_coach.push(coachId);
    await wishlist.save();

    wishlist = await Wishlist.findById(wishlist._id).populate(
      "list_course list_coach"
    );

    res.json(wishlist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createWishlist,
  updateWishlist,
  deleteWishlist,
  getAllWishlists,
  getWishlistByCustomer,
  addCourseToWishlist,
  addCoachToWishlist,
};
