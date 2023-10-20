const db = require("../models");
const asyncHandler = require("express-async-handler");
const { ObjectId } = require("mongodb");
const Course = require("../models/course.model");
const Customer = require("../models/customer.model");

const Order = db.order;

const createOrder = async (req, res) => {
  try {
    const { status, courses, payment_id, customer_id, total_price } = req.body;
    for (const courseId of courses) {
      await Course.findByIdAndUpdate(courseId, { $inc: { sold: 1 } });
    }
    const newOrder = await Order.create({
      status,
      courses,
      payment_id,
      customer_id,
      total_price,
    });
    const idOrder = newOrder.id;
    const savedCourse = await Order.findById(idOrder)
      .populate("customer_id courses")
      .populate({
        path: "courses",
        populate: {
          path: "coach_id",
        },
      });
    res.status(201).json(savedCourse);
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

    const customer = await Customer.find({
      customer_id: customerId,
    });
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const orders = await Order.find({ customer_id: customerId })
      .populate("customer_id")
      .populate({
        path: "courses",
        model: "Course",
        populate: {
          path: "coach_id",
          model: "Coach",
        },
      });

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

const deleteAllOrder = async (req, res) => {
  try {
    const deletedOrder = await Order.deleteMany();
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
  deleteAllOrder,
};
