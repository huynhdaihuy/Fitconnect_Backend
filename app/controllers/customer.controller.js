const Customer = require("../models/customer.model");
const Exercise = require("../models/customer.model");

const { cloudinaryUploadImg } = require("../utils/cloudinary");

exports.createCustomer = async (req, res) => {
  const {
    username,
    email,
    name,
    gender,
    birthday,
    phone_number,
    password,
    address,
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
      if (!newpathImage) {
        res.status(500).json({ error: "Failed to upload image" });
      }

      url_image = newpathImage.url;
    }
    const newCustomer = await Customer.create({
      username,
      email,
      name,
      gender,
      birthday,
      phone_number,
      password,
      address,
      url_image,
    });
    res.status(201).json(newCustomer);
  } catch (error) {
    res.status(400).json(error);
  }
};

// Get all exercises
exports.getAllCustomer = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json(exercises);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch exercises" });
  }
};

// Get a single exercise by ID
exports.getCustomerById = async (req, res) => {
  const CustomerId = req.params.id;
  try {
    const customer = await Customer.findById(CustomerId);
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }
    res.status(200).json(Customer);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch exercise" });
  }
};

// Update an exercise by ID
exports.updateCustomerById = async (req, res) => {
  const customerId = req.params.id;

  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(
      customerId,
      req.body,
      {
        new: true,
      }
    );
    if (!updatedCustomer) {
      return res.status(404).json({ error: "Exercise not found" });
    }
    res.status(200).json(updatedCustomer);
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
