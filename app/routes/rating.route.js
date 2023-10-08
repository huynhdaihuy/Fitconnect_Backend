const express = require("express");
const router = express.Router();
const ratingController = require("../controllers/rating.controller");

router.post("", ratingController.createRating);

router.get("/average/:courseId", ratingController.getAverageRating);
router.get("/:courseId", ratingController.getRatingOfCourse);

module.exports = router;
