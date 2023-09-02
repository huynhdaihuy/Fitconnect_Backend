const Payment = require("../models/payment.model"); // Path to the Category model file

// Controller function to create a new category
exports.createPayment = async (req, res) => {
  try {
    const { name } = req.body;
    const existingName = await Payment.findOne({ name });
    if (existingName) {
      res.status(500).send({ message: "Payment type already exists." });
      return;
    }
    const newPayment = new Payment({ name });
    const savedPayment = await newPayment.save();
    res.status(200).json(savedPayment);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while creating the payment." });
  }
};

// Controller function to retrieve all categories
exports.getAllPayment = async (req, res) => {
  try {
    const payments = await Payment.find();
    res.json(payments);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching categories." });
  }
};
