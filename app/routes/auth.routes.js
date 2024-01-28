const { verifySignUp, authJwt } = require("../middleware/index");
const authController = require("../controllers/auth.controller");
const { isAdmin } = require("../middleware/authJwt");
const express = require("express");
const router = express.Router();
const {
  validateToken,
  verifyToken,
  generateAccessToken,
} = require("../middleware/authJwt");

router.route("/signup").post([
  // verifySignUp.checkDuplicateUsernameOrEmail,
  // verifySignUp.checkRolesExisted,
  authController.signup,
]);

router.post(
  "/signin",
  (req, res, next) => {
    res.set("Access-Control-Allow-Headers", " Origin, Content-Type, Accept");
    next();
  },
  authController.signin
);

router.post("/get-access-token", generateAccessToken);

module.exports = router;
