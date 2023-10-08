const db = require("../models");
const asyncHandler = require("express-async-handler");
const { ObjectId } = require("mongodb");
const Course = require("../models/course.model");

const Cart = db.cart;
const Order = db.order;

const createOrder = async (req, res) => {
  try {
    const { status, courses, payment_id, customer_id, total_price } = req.body;

    for (const courseId of courses) {
      await Course.findByIdAndUpdate(courseId, { $inc: { sold: 1 } });
    }

    const newOrder = new Order({
      status,
      courses,
      payment_id,
      customer_id,
      total_price,
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate({
        path: "courses",
        model: "Course",
        populate: {
          path: "coach_id",
          model: "Coach",
        },
      })
      .populate("payment_id")
      .populate("customer_id");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const getOrdersByCustomerId = async (req, res) => {
  try {
    const customerId = req.params.customerId;

    // First, check if the customer exists
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Fetch all orders associated with the customer
    const orders = await Order.find({ customer_id: customerId })
      .populate({
        path: "courses",
        model: "Course",
        populate: {
          path: "coach_id",
          model: "Coach",
        },
      })
      .populate("payment_id")
      .populate("customer_id");

    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateOrderById = async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete an order by ID
const deleteOrderById = async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndRemove(req.params.id);
    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
module.exports = {
  createOrder,
  getOrderById,
  updateOrderById,
  deleteOrderById,
  getOrdersByCustomerId,
};
