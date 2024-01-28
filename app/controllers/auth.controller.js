const config = require("../config/index");
// const Role = db.role;
const User = require("../models/user.model");

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  const user = new User({
    username: req.body.username,
    name: req.body.name,
    email: req.body.email,
    gender: req.body.gender,
    password: req.body.password,
    phone_number: req.body.phone_number,
    role: req.body.role,
  });

  user.save((err) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    res.send({ message: "User was registered successfully!" });
  });
};

exports.signin = (req, res) => {
  User.findOne({
    username: req.body.username,
  }).exec(async (err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Password!",
      });
    }
    const token = jwt.sign({ user }, config.secretKey, {
      expiresIn: config.jwt.accessExpiresIn,
    });
    const refreshToken = jwt.sign({ user }, config.jwt.refreshSecret, {
      expiresIn: config.jwt.refreshExpiresIn,
    });

    user.refreshToken = refreshToken;
    await user.save();

    res.set({
      "x-access-token": `${token}`,
    });
    res.status(200).send({
      user,
      accessToken: token,
    });
  });
};
