const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller'); // Path to your category controller file

// Route to create a new category
router.post('/', categoryController.createCategory);

// Route to get all categories
router.get('/', categoryController.getAllCategories);
router.put('/upload-image/:id', categoryController.uploadImageCategory);


module.exports = router;
