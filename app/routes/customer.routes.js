const { authJwt } = require("../middleware");
const express = require('express');
const router = express.Router();
const controller = require("../controllers/customer.controller");

router.get("/", controller.getAllCustomer);

router.route('/avatar/:id')
    .put(controller.uploadAvatar)

router.route('/forgot-password/')
    .post(controller.forgotPassword)

router.put('/:id/password', controller.changePassword);

router.route('/:id')
    .get(controller.findOne)
    .put(controller.update)
    .delete(controller.delete);


module.exports = router;