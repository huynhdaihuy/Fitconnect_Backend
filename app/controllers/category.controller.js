const Category = require("../models/category.model"); // Path to the Category model file
const { cloudinaryUploadImg } = require("../utils/cloudinary");

// Controller function to create a new category
exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const existingName = await Category.findOne({ name });
    if (existingName) {
      res.status(500).send({ message: "Category already exists." });
      return;
    }
    const newCategory = new Category({ name });
    const savedCategory = await newCategory.save();
    res.status(200).json(savedCategory);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while creating the category." });
  }
};

// Controller function to retrieve all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching categories." });
  }
};

exports.uploadImageCategory = async (req, res) => {
  const categoryId = req.params.id;
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
    const updateCategory = await Category.findByIdAndUpdate(categoryId, {
      url_image,
    });
    res.status(200).send(updateCategory);
  } catch (e) {
    res.status(500).send(e);
  }
};
