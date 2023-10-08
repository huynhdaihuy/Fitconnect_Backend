const config = require("../config/index");
// const Role = db.role;
const Customer = require("../models/customer.model");
const Coach = require("../models/coach.model");

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  const customer = new Customer({
    username: req.body.username,
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    phone: req.body.phone,
    address: req.body.address,
  });
  customer.save((err, customer) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    // if (req.body.roles) {
    //   Role.find(
    //     {
    //       name: { $in: req.body.roles },
    //     },
    //     (err, roles) => {
    //       if (err) {
    //         res.status(500).send({ message: err });
    //         return;
    //       }

    //       user.roles = roles.map((role) => role._id);
    //       user.save((err) => {
    //         if (err) {
    //           res.status(500).send({ message: err });
    //           return;
    //         }
    //         res.send({ message: "User was registered successfully!" });
    //       });
    //     }
    //   );
    // } else {
    //   Role.findOne({ name: "user" }, (err, role) => {
    //     if (err) {
    //       res.status(500).send({ message: err });
    //       return;
    //     }

    //     user.roles = [role._id];
    customer.save((err) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      res.send({ message: "Customer was registered successfully!" });
    });
  });
};
//   });
// };

exports.signin = (req, res) => {
  Customer.findOne({
    username: req.body.username,
  })
    // .populate("roles")
    .exec(async (err, customer) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!customer) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        customer.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }
      var token = jwt.sign({ id: customer.id }, config.secretKey, {
        expiresIn: config.jwt.accessExpiresIn,
      });
      const refreshToken = jwt.sign({ id: customer.id }, config.jwt.refreshSecret, {
        expiresIn: config.jwt.refreshExpiresIn,
      });

      customer.refreshToken = refreshToken;
      await customer.save();

      res.set({
        "x-access-token": token,
      });
      //   var authorities = [];
      //   for (let i = 0; i < user.roles.length; i++) {
      //     authorities.push("ROLE_" + customer.roles[i].name.toUpperCase());
      //   }
      res.status(200).send({
        customer,
        accessToken: token,
      });
    });
};

// exports.signinCoach = (req, res) => {

//     User.findOne({
//             username: req.body.username
//         })
//         .populate("roles", "-__v")
//         .exec((err, coach) => {
//             if (err) {
//                 res.status(500).send({ message: err });
//                 return;
//             }

//             if (!coach) {
//                 return res.status(404).send({ message: "User Not found." });
//             }

//             var passwordIsValid = bcrypt.compareSync(
//                 req.body.password,
//                 coach.password
//             );

//             if (!passwordIsValid) {
//                 return res.status(401).send({
//                     accessToken: null,
//                     message: "Invalid Password!"
//                 });
//             }
//             Role.find({
//                     _id: { $in: user.roles }
//                 },
//                 (err, roles) => {
//                     if (err) {
//                         res.status(500).send({ message: err });
//                         return;
//                     }

//                     for (let i = 0; i < roles.length; i++) {
//                         if (roles[i].name === "admin") {
//                             var token = jwt.sign({ id: user.id }, config.secretKey, {
//                                 expiresIn: 86400 // 24 hours
//                             });
//                             res.set({
//                                 "x-access-token": token,
//                             });

//                             res.status(200).send({
//                                 coach,
//                                 accessToken: token
//                             });
//                             return;
//                         }
//                     }

//                     res.status(403).send({ message: "Require Admin Role!" });
//                     return;
//                 }
//             );

//         });
// };

exports.signinCoach = (req, res) => {
  User.findOne({
    username: req.body.username,
  }).exec((err, coach) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (!coach) {
      return res.status(404).send({ message: "Coach Not found." });
    }

    var passwordIsValid = bcrypt.compareSync(req.body.password, coach.password);

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Password!",
      });
    }
    var token = jwt.sign({ id: coach.id }, config.secretKey, {
      expiresIn: 86400, // 24 hours
    });
    res.set({
      "x-access-token": token,
    });

    res.status(200).send({
      coach,
      accessToken: token,
    });
    return;
  });
};
