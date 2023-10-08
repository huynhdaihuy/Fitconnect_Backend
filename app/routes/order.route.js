const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrderById,
  getOrdersByCustomerId,
  updateOrderById,
  deleteOrderById,
} = require("../controllers/order.controller");

// router.get("/", getAllOrders);

// router.get("/best-selling-product", getBestSellingProduct);

router.post("/", createOrder);

// Get by id of customer
router.get("/customer/:customerId", getOrdersByCustomerId);

// Get by id of order
router.get("/:id", getOrderById);

// Update by id of order

router.put("/:id", updateOrderById);

router.delete("/:id", deleteOrderById);

module.exports = router;
