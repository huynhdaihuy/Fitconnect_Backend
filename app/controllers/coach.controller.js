const bcrypt = require("bcrypt");
const Coach = require("../models/coach.model");
const {
  cloudinaryUploadImg,
  cloudinaryDeleteImg,
} = require("../utils/cloudinary");

exports.createCoach = async (req, res) => {
  const coachData = req.body;
  try {
    let uploader = (path) => cloudinaryUploadImg(path, "images");
    const urls = [];
    const files = req.files;
    if (files) {
      const files = req.files;
      const path = files.image.tempFilePath;
      const newpath = await uploader(path);
      urls.push(newpath.url);
    }
    // if (coachData.images) {
    //   delete coachData.images;
    // }
    const { username, email, phone_number, ...otherData } = coachData;

    const url_avatar = urls[0];

    // Check if username, email, and phone_number already exist
    const existingUsername = await Coach.findOne({ username });
    if (existingUsername) {
      res.status(500).send({ message: "Username already exists." });
      return;
    }

    const existingEmail = await Coach.findOne({ email });
    if (existingEmail) {
      res.status(500).send({ message: "Email already exists." });
      return;
    }

    const existingPhoneNumber = await Coach.findOne({ phone_number });
    if (existingPhoneNumber) {
      res.status(500).send({ message: "Phone number already exists." });
      return;
    }

    // Create the coach
    const coach = new Coach({
      username,
      email,
      phone_number,
      url_avatar,
      ...otherData,
    });
    console.log(
      "🚀 ~ file: coach.controller.js:63 ~ exports.createCoach= ~ coach:",
      coach
    );
    await coach.save();
    res.status(200).send({ message: "Coach updated successfully.", coach });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal server error occurred." });
  }
};

exports.updateCoach = async (coachId, newData) => {
  try {
    const { username, email, phone_number, ...otherData } = newData;

    // Check if username, email, and phone_number already exist
    const existingUsername = await Coach.findOne({ username });
    if (existingUsername && existingUsername._id.toString() !== coachId) {
      throw new Error("Username already exists.");
    }

    const existingEmail = await Coach.findOne({ email });
    if (existingEmail && existingEmail._id.toString() !== coachId) {
      throw new Error("Email already exists.");
    }

    const existingPhoneNumber = await Coach.findOne({ phone_number });
    if (existingPhoneNumber && existingPhoneNumber._id.toString() !== coachId) {
      throw new Error("Phone number already exists.");
    }

    // Update the coach
    const coach = await Coach.findByIdAndUpdate(coachId, otherData, {
      new: true,
    });
    if (!coach) {
      throw new Error("Coach not found.");
    }
    return coach;
  } catch (error) {
    throw new Error("An error occurred while updating the coach.");
  }
};

exports.deleteCoach = async (coachId) => {
  try {
    const coach = await Coach.findByIdAndDelete(coachId);
    if (!coach) {
      throw new Error("Coach not found.");
    }
    return { message: "Coach deleted successfully." };
  } catch (error) {
    throw new Error("An error occurred while deleting the coach.");
  }
};

exports.deleteAllCoaches = async () => {
  try {
    await Coach.deleteMany({});
    return { message: "All coaches deleted successfully." };
  } catch (error) {
    throw new Error("An error occurred while deleting all coaches.");
  }
};

exports.getCoachById = async (coachId) => {
  try {
    const coach = await Coach.findById(coachId).populate(
      "list_major list_certification"
    );
    if (!coach) {
      throw new Error("Coach not found.");
    }
    return coach;
  } catch (error) {
    throw new Error("An error occurred while fetching the coach.");
  }
};

exports.getCoaches = async () => {
  try {
    const coaches = await Coach.find().populate(
      "list_major list_certification"
    );
    return coaches;
  } catch (error) {
    throw new Error("An error occurred while fetching coaches.");
  }
};

exports.compareCoachPassword = async (coachId, password) => {
  try {
    const coach = await Coach.findById(coachId);
    if (!coach) {
      throw new Error("Coach not found.");
    }
    const isMatch = await coach.comparePassword(password);
    return isMatch;
  } catch (error) {
    throw new Error("An error occurred while comparing passwords.");
  }
};
