const Gallery = require("../models/gallery.model");

// Create a new gallery
async function createGallery(req, res) {
  try {
    const gallery = new Gallery(req.body);
    await gallery.save();
    res.status(201).json(gallery);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Get all galleries
async function getAllGalleries(req, res) {
  try {
    const galleries = await Gallery.find()
      .populate("list_course")
      .populate({
        path: "list_course",
        populate: {
          path: "coach_id",
        },
      });
    res.status(200).json(galleries);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Get gallery by ID
async function getGalleryById(req, res) {
  try {
    const gallery = await Gallery.findById(req.params.id)
      .populate("list_course")
      .populate({
        path: "list_course",
        populate: {
          path: "coach_id",
        },
      });
    if (!gallery) {
      return res.status(404).json({ error: "Gallery not found" });
    }
    res.status(200).json(gallery);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Update gallery by ID
async function updateGallery(req, res) {
  try {
    const gallery = await Gallery.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
      .populate("list_course")
      .populate({
        path: "list_course",
        populate: {
          path: "coach_id",
        },
      });
    if (!gallery) {
      return res.status(404).json({ error: "Gallery not found" });
    }
    res.status(200).json(gallery);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Delete gallery by ID
async function deleteGallery(req, res) {
  try {
    const gallery = await Gallery.findByIdAndRemove(req.params.id);
    if (!gallery) {
      return res.status(404).json({ error: "Gallery not found" });
    }
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Get galleries by customer ID
async function getGalleryByCustomerId(req, res) {
  try {
    const galleries = await Gallery.findOne({
      customer_id: req.params.customerId,
    })
      .populate("list_course")
      .populate({
        path: "list_course",
        populate: {
          path: "coach_id",
        },
      });
    res.status(200).json(galleries);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}
async function updateCourseGalleryByCustomerId(req, res) {
  try {
    var gallery = await Gallery.findOne({
      customer_id: req.params.customerId,
    });

    if (!gallery) {
      gallery = await Gallery.create({
        customer_id: req.params.customerId,
      });
    }

    const listCourse = req.body.listCourse;
    listCourse.forEach((courseId) => {
      if (!gallery.list_course.includes(courseId)) {
        gallery.list_course.push(courseId);
      }
    });

    await gallery.save();
    var gallerySaved = await Gallery.findOne({
      customer_id: req.params.customerId,
    })
      .populate("list_course")
      .populate({
        path: "list_course",
        populate: {
          path: "coach_id",
        },
      });
    res.status(200).json(gallerySaved);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
module.exports = {
  createGallery,
  getAllGalleries,
  getGalleryById,
  updateGallery,
  deleteGallery,
  getGalleryByCustomerId,
  updateCourseGalleryByCustomerId,
};
