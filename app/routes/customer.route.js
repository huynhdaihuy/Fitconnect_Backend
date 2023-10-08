// const { authJwt } = require("../middleware");
const express = require("express");
const router = express.Router();
const controller = require("../controllers/customer.controller");

router.get("/", controller.getAllCustomer);
router.post("/", controller.createCustomer);

// router.route('/avatar/:id')
//     .put(controller.uploadAvatar)

// router.route('/forgot-password/')
//     .post(controller.forgotPassword)

// router.put('/:id/password', controller.changePassword);
router.put('/upload-image/:id', controller.uploadAvatar);

router
  .route("/:id")
  .get(controller.getCustomerById)
  .put(controller.updateCustomerById)
  .delete(controller.deleteExerciseById);

module.exports = router;
