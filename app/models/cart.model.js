const mongoose = require("mongoose");

const Cart = new mongoose.model(
  "Cart",
  mongoose.Schema(
    {
      courses: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Course",
        },
      ],
      cartTotal: Number,
      orderBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
      },
      // isUsedCoupon: {
      //   status: {
      //     type: Boolean,
      //     default: false,
      //   },
      //   couponTnfo: {
      //     type: mongoose.Schema.Types.ObjectId,
      //     ref: "Coupon",
      //     default: null,
      //   },
      // },
    },
    { timestamps: true }
  )
);

module.exports = Cart;
