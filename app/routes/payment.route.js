const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller'); // Path to your category controller file

// Route to create a new category
router.post('/', paymentController.createPayment);

// Route to get all categories
router.get('/', paymentController.getAllPayment);

module.exports = router;
