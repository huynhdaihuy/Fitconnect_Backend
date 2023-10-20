const express = require("express");
const router = express.Router();
const galleryController = require("../controllers/gallery.controller");

router.post("/", galleryController.createGallery);
router.get("/", galleryController.getAllGalleries);
router.get("/:id", galleryController.getGalleryById);
router.put("/customer/:customerId", galleryController.updateCourseGalleryByCustomerId);
router.put("/:id", galleryController.updateGallery);
router.delete("/:id", galleryController.deleteGallery);
router.get("/customer/:customerId", galleryController.getGalleryByCustomerId);

module.exports = router;
