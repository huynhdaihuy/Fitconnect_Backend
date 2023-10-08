const Exercise = require("../models/exercise.model"); 
const Course = require("../models/course.model"); 
const {
  cloudinaryUploadImg,
  cloudinaryUploadVideo,
} = require("../utils/cloudinary");
// Create a new exercise
exports.createExercise = async (req, res) => {
  const {
    name,
    description,
    duration,
    quantity_rep_per_set,
    quantity_set,
    coach_id,
  } = req.body;

  var url_image;
  var url_video;
  try {
    let uploaderImage = (path) => cloudinaryUploadImg(path, "images");
    let uploaderVideo = (path) => cloudinaryUploadVideo(path);
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
      const pathVideo = files.video.tempFilePath;

      let newpathImage = await uploaderImage(pathImage);
      if (!newpathImage) {
        res.status(500).json({ error: "Failed to upload image" });
      }
      let newpathVideo = await uploaderVideo(pathVideo);
      if (!newpathVideo) {
        res.status(500).json({ error: "Failed to upload video" });
      }
      url_image = newpathImage.url;
      url_video = newpathVideo.url;
    }
    const newExercise = await Exercise.create({
      name,
      description,
      url_image,
      url_video,
      duration,
      quantity_rep_per_set,
      quantity_set,
      coach_id,
    });
    res.status(201).json(newExercise);
  } catch (error) {
    console.log(
      "🚀 ~ file: exercise.controller.js:57 ~ exports.createExercise= ~ error:",
      error
    );
    res.status(400).json(error);
  }
};

// Get all exercises
exports.getAllExercises = async (req, res) => {
  try {
    const exercises = await Exercise.find();
    res.status(200).json(exercises);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch exercises" });
  }
};

exports.getExerciseById = async (req, res) => {
  const exerciseId = req.params.id;

  try {
    const exercise = await Exercise.findById(exerciseId);
    if (!exercise) {
      return res.status(404).json({ error: "Exercise not found" });
    }
    res.status(200).json(exercise);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch exercise" });
  }
};

exports.getExerciseByCourseIdAndDay = async (req, res) => {
  const courseId = req.params.courseId;
  const dayIndex = req.params.dayIndex;

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Exercise not found" });
    }
    const ExerciseDayIndex = course.list_exercise_per_day[dayIndex];
    const listExerciseDayIndex = [];
    for (let index = 0; index < ExerciseDayIndex.length; index++) {
    const data = await Exercise.findById(ExerciseDayIndex[index]);
    listExerciseDayIndex.push(data);
    }
    res.status(200).json(listExerciseDayIndex);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch exercise" });
  }
};

exports.updateExerciseById = async (req, res) => {
  const exerciseId = req.params.id;
  try {
    const updatedExercise = await Exercise.findByIdAndUpdate(
      exerciseId,
      req.body,
      {
        new: true,
      }
    );
    if (!updatedExercise) {
      return res.status(404).json({ error: "Exercise not found" });
    }
    res.status(200).json(updatedExercise);
  } catch (error) {
    res.status(500).json({ error: "Failed to update exercise" });
  }
};

exports.deleteExerciseById = async (req, res) => {
  const exerciseId = req.params.id;

  try {
    const deletedExercise = await Exercise.findByIdAndDelete(exerciseId);
    if (!deletedExercise) {
      return res.status(404).json({ error: "Exercise not found" });
    }
    res.status(204).json();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete exercise" });
  }
};
