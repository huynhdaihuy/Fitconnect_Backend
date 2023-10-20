const express = require("express");
const router = express.Router();
const wishlistController = require("../controllers/wishlist.controller");

router.get("/", wishlistController.getAllWishlists);

router.post("/", wishlistController.createWishlist);

router.put("/customer/:id", wishlistController.updateWishlist);

router.delete("/:id", wishlistController.deleteWishlist);

router.post("/addCourse/", wishlistController.addCourseToWishlist);

router.post("/addCoach/", wishlistController.addCoachToWishlist);

router.get("/customer/:customer_id", wishlistController.getWishlistByCustomer);

module.exports = router;
