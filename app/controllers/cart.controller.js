const Cart = require("../models/cart.model");
const mongoose = require("mongoose");

exports.createCart = async (req, res) => {
  try {
    const newCart = new Cart(req.body);
    await newCart.save();
    await newCart.populate("recipes").populate("user").execPopulate();
    res.status(201).json(newCart);
  } catch (error) {
    console.error("Error creating cart:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAllCarts = async (req, res) => {
  try {
    const carts = await Cart.find().populate("recipes").populate("user");
    res.status(200).json(carts);
  } catch (error) {
    console.error("Error getting carts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getCartById = async (req, res) => {
  const { cartId } = req.params;
  try {
    const cart = await Cart.findById(cartId);

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    const cartData = await cart
      .populate("recipes")
      .populate("user")
      .execPopulate();

    const groupedRecipes = await mongoose.model("Recipe").aggregate([
      {
        $match: {
          _id: { $in: cart.recipes },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "author",
        },
      },
      {
        $unwind: "$author",
      },
      {
        $group: {
          _id: "$author",
          recipes: { $push: "$$ROOT" },
        },
      },
    ]);

    res.status(200).json({ groupedRecipes });
  } catch (error) {
    console.error("Error getting cart by ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.addRecipeToCart = async (req, res) => {
  const { recipeId, userId } = req.body;
  try {
    let cart = await Cart.find({ user: userId });

    if (cart.length === 0) {
      cart = new Cart({ user: userId });
      cart.recipes.push(new mongoose.Types.ObjectId(recipeId));

      const savedCart = await cart.save();
      await cart.populate("recipes").populate("user").execPopulate();
      return res.status(200).send(savedCart);
    }
    const isRecipeExist = cart[0].recipes.some(
      (recipe) => recipe._id == recipeId
    );
    if (isRecipeExist) {
      return res.status(400).json({ error: "Recipe is already in the cart" });
    }

    cart[0].recipes.push(recipeId);
    await cart[0].save();

    await cart[0].populate("recipes").execPopulate();

    res.status(200).json(cart[0]);
  } catch (error) {
    console.error("Error adding recipe to cart:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.updateCartById = async (req, res) => {
  const { cartId } = req.params;
  try {
    const updatedCart = await Cart.findByIdAndUpdate(cartId, req.body, {
      new: true,
    })
      .populate("recipes")
      .populate("user");
    if (!updatedCart) {
      return res.status(404).json({ error: "Cart not found" });
    }
    res.status(200).json(updatedCart);
  } catch (error) {
    console.error("Error updating cart by ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete a cart by ID
exports.deleteCartById = async (req, res) => {
  const { cartId } = req.params;
  try {
    const deletedCart = await Cart.findByIdAndDelete(cartId)
      .populate("recipes")
      .populate("user");
    if (!deletedCart) {
      return res.status(404).json({ error: "Cart not found" });
    }
    res.status(204).json();
  } catch (error) {
    console.error("Error deleting cart by ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
