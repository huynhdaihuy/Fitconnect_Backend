const mongoose = require("mongoose");

const orderStatusEnum = ["pending", "completed", "cancelled"];

const orderSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: orderStatusEnum,
      required: true,
    },
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    // list_rent_service: [{
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'RentService'
    // }],
    payment_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
    },
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },
    total_price: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
