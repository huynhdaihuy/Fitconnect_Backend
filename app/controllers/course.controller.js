const Course = require("../models/course.model"); // Adjust the path to the Course model
const {
  cloudinaryUploadImg,
} = require("../utils/cloudinary");
// Create a new course
exports.createCourse = async (req, res) => {
  const {
    name,
    price,
    description,
    hardness,
    period,
    coach_id,
    category_id,
    list_exercise_per_day,
  } = req.body;

  var url_image;
  try {
    let uploaderImage = (path) => cloudinaryUploadImg(path, "images");
    const files = req.files;
    if (!files) {
      console.log("Can not receive file");
      res.status(401).json({ error: "Can not receive file" });
      return;
    }
    if (files) {
      console.log("Received file");
      const files = req.files;
      const pathImage = files.image.tempFilePath;

      let newpathImage = await uploaderImage(pathImage);
      if (!newpathImage){
        res.status(500).json({error:'Failed to upload image'});
      }
      url_image = newpathImage.url;
    }
    const newCourse = await Course.create({
      name,
      price,
      description,
      hardness,
      period,
      coach_id,
      category_id,
      list_exercise_per_day,
      url_image,
    });
    res.status(201).json(newCourse);
  } catch (error) {
    res.status(400).json(error);
  }
};

// Get all Courses
exports.getAllCourses = async (req, res) => {
  try {
    const Courses = await Course.find();
    res.status(200).json(Courses);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Courses" });
  }
};

// Get a single Course by ID
exports.getCourseById = async (req, res) => {
  const CourseId = req.params.id;

  try {
    const Course = await Course.findById(CourseId);
    if (!Course) {
      return res.status(404).json({ error: "Course not found" });
    }
    res.status(200).json(Course);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Course" });
  }
};

// Update an Course by ID
exports.updateCourseById = async (req, res) => {
  const CourseId = req.params.id;

  try {
    const updatedCourse = await Course.findByIdAndUpdate(CourseId, req.body, {
      new: true,
    });
    if (!updatedCourse) {
      return res.status(404).json({ error: "Course not found" });
    }
    res.status(200).json(updatedCourse);
  } catch (error) {
    res.status(500).json({ error: "Failed to update Course" });
  }
};

// Delete an Course by ID
exports.deleteCourseById = async (req, res) => {
  const CourseId = req.params.id;

  try {
    const deletedCourse = await Course.findByIdAndDelete(CourseId);
    if (!deletedCourse) {
      return res.status(404).json({ error: "Course not found" });
    }
    res.status(204).json();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete Course" });
  }
};
