const { authJwt } = require("../middleware");
const express = require("express");
const router = express.Router();
const controller = require("../controllers/user.controller");

router.get("/", controller.getAllUser);
router.post("/", controller.createUser);
router.get("/:id", controller.getUserById);
router.put("/:id", controller.updateUserById);
// router.route('/avatar/:id')
//     .put(controller.uploadAvatar)

// router.route('/forgot-password/')
//     .post(controller.forgotPassword)

// router.put('/:id/password', controller.changePassword);
// router.put("/upload-image/:id", controller.uploadAvatar);

module.exports = router;
