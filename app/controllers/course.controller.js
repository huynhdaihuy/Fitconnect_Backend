const Course = require("../models/course.model");
const { cloudinaryUploadImg } = require("../utils/cloudinary");
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
  console.log(req.body);

  const listExercisePerDay = [];
  let i = 0;
  let innerArray = [];

  while (req.body[`list_exercise_per_day.${i}.0`] !== undefined) {
    innerArray = [];
    let j = 0;

    while (req.body[`list_exercise_per_day.${i}.${j}`] !== undefined) {
      innerArray.push(req.body[`list_exercise_per_day.${i}.${j}`]);
      j++;
    }

    listExercisePerDay.push(innerArray);
    i++;
  }

  console.log(listExercisePerDay);
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
      if (!newpathImage) {
        res.status(500).json({ error: "Failed to upload image" });
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
      list_exercise_per_day: listExercisePerDay,
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
    const Courses = await Course.find().populate("coach_id");
    // var listCourse = Courses;
    // var listCoach = await Coach.find();
    // for (var i = 1; i < listCoach.length; i++) {
    //   for (var j = 0; j < listCourse.length; j++) {
    //     var  course = listCourse[j];
    //     course.coach_id = listCoach[i]._id;
    //     const  createCourse = await Course.create(course);
    //   }
    // }
    res.status(200).json(Courses);
  } catch (error) {
    console.log(
      "🚀 ~ file: course.controller.js:89 ~ exports.getAllCourses= ~ error:",
      error
    );
    res.status(500).json({ error: "Failed to fetch Courses" });
  }
};
// exports.postCopy = async (req, res) => {
//   console.log("In route copy");
//   try {
//     const Courses = await Course.find().populate("list_exercise_per_day");
//     var listCourse = Courses;
//     var listCoach = await Coach.find();
//     var list = [];
//     for (var i = 1; i < listCoach.length; i++) {
//       for (var j = 0; j < listCourse.length; j++) {
//         const course = new Course({
//           name: listCourse[j].name,
//           url_image: listCourse[j].url_image,
//           price: listCourse[j].price,
//           description: listCourse[j].description,
//           hardness: listCourse[j].hardness,
//           period: listCourse[j].period,
//           sold: listCourse[j].sold,
//           coach_id: listCoach[i]._id,
//           rating: listCourse[j].rating,
//           category_id: listCourse[j].category_id,
//           list_exercise_per_day: listCourse[j].list_exercise_per_day,
//         });
//         const createCourse = await course.save();
//         list.push(createCourse);
//       }
//     }
//     res.status(200).json(list);
//   } catch (error) {
//     console.log(
//       "🚀 ~ file: course.controller.js:89 ~ exports.getAllCourses= ~ error:",
//       error
//     );
//     res.status(500).json({ error: "Failed to fetch Courses" });
//   }
// };

// Get a single Course by ID
exports.getCourseById = async (req, res) => {
  const CourseId = req.params.id;
  try {
    const course = await Course.findById(CourseId).populate("coach_id");
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    res.status(200).json(course);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch Course" });
  }
};

exports.getCourseByCategoryId = async (req, res) => {
  const categoryId = req.params.categoryId;
  try {
    const courses = await Course.find({
      category_id: categoryId,
    });
    if (!courses) {
      return res.status(404).json({ error: "Course not found" });
    }
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Course" });
  }
};

exports.getCourseByCoachId = async (req, res) => {
  const coachId = req.params.coachId;
  try {
    const courses = await Course.find({
      coach_id: coachId,
    }).populate("coach_id");
    if (!courses) {
      return res.status(404).json({ error: "Course not found" });
    }
    res.status(200).json(courses);
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
