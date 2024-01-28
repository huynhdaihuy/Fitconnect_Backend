const express = require("express");
const router = express.Router();
const ratingController = require("../controllers/rating.controller");

router.get("/", ratingController.getAllRatings);
router.get("/:ratingId", ratingController.getRatingById);
router.post("/", ratingController.createRating);
// router.put("/:ratingId", ratingController.updateCartById);
router.delete("/:ratingId", ratingController.deleteRatingById);

module.exports = router;
