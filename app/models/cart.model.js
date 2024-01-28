const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    recipes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Recipe",
        default: [],
      },
    ],
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    total: { type: Number, default: 0 },
  },
  { timestamps: true }
);
cartSchema.pre("save", async function (next) {
  try {
    let totalPrice = 0;

    const recipes = await mongoose
      .model("Recipe")
      .find({ _id: { $in: this.recipes } });
    for (const recipe of recipes) {
      totalPrice += recipe.price || 0;
    }

    this.total = totalPrice;
    next();
  } catch (error) {
    next(error);
  }
});
const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
