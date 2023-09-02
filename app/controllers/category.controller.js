const Category = require('../models/category.model'); // Path to the Category model file

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
    res.status(500).json({ error: 'An error occurred while creating the category.' });
  }
};

// Controller function to retrieve all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching categories.' });
  }
};
