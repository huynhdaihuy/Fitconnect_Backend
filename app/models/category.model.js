const mongoose = require('mongoose');

// Define the schema for the Category
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
});

// Create the Category model using the schema
const Category = mongoose.model('Category', categorySchema);

// Export the model
module.exports = Category;
