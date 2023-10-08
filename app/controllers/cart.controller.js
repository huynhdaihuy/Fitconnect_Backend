const Cart = require("../models/cart.model");

exports.createCart = async (req, res) => {
  try {
    const { orderBy, courses, cartTotal } = req.body;
    const existingCart = await Cart.findOne({ orderBy: orderBy });
    if (existingCart) {
      existingCart.courses = req.body.courses;
      existingCart.cartTotal = req.body.cartTotal;
      await existingCart.save();
      res.json(existingCart);
    } else {
      const newCart = new Cart({
        courses,
        cartTotal,
        orderBy,
      });

      const savedCart = await newCart.save();
      res.json(savedCart);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getCartByIdCustomer = async (req, res) => {
  const { customerId } = req.params;
  try {
    const cart = await Cart.findOne({ orderBy: customerId })
      .populate({
        path: "courses",
        populate: {
          path: "coach_id",
          model: "Coach" // Replace "Coach" with the actual model name for coaches
        }
      })
      .populate("orderBy");
    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


exports.getCartById = async (req, res) => {
  const { cartId } = req.params;
  try {
    const cart = await Cart.findById(cartId)
      .populate("courses")
      .populate("orderBy");

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateCartById = async (req, res) => {
  const { cartId } = req.params;
  const updateData = req.body;

  try {
    const cart = await Cart.findByIdAndUpdate(cartId, updateData, {
      new: true,
    });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteCart = async (req, res) => {
  const { cartId } = req.params;

  try {
    const cart = await Cart.findByIdAndDelete(cartId);

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.json({ message: "Cart deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
