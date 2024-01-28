const jwt = require("jsonwebtoken");
const config = require("../config/index");
const User = require("../models/user.model");
const { jwtDecode } = require("jwt-decode");

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }
  jwt.verify(token, config.secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Token is expired!" });
    }
    req.user = decoded;
    next();
  });
};

isAdmin = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    Role.find(
      {
        _id: { $in: user.roles },
      },
      (err, roles) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "admin") {
            next();
            return;
          }
        }

        res.status(403).send({ message: "Require Admin Role!" });
        return;
      }
    );
  });
};

isModerator = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    Role.find(
      {
        _id: { $in: user.roles },
      },
      (err, roles) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "moderator") {
            next();
            return;
          }
        }

        res.status(403).send({ message: "Require Moderator Role!" });
        return;
      }
    );
  });
};

const generateAccessToken = (req, res, next) => {
  const user = req.body;
  const newAccessToken = jwt.sign({ user }, config.secretKey, {
    expiresIn: config.jwt.accessExpiresIn,
  });
  return res.status(200).json({ accessToken: newAccessToken });
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id, roles: user.roles },
    config.jwt.refreshSecret,
    {
      expiresIn: config.jwt.refreshExpiresIn,
    }
  );
};

const refreshToken = async (req, res, next) => {
  const refreshToken = req.body.refreshToken;
  if (!refreshToken) {
    return next(new ApiError(400, "Refresh token is required!"));
  }

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, config.jwt.refreshSecret);
  } catch (err) {
    return next(new ApiError(401, "Invalid refresh token!"));
  }

  const user = await User.findById(decoded.id).populate("roles");
  if (!user) {
    return next(new ApiError(404, "User not found!"));
  }

  const accessToken = generateAccessToken(user);
  const newRefreshToken = generateRefreshToken(user);

  user.refreshToken = newRefreshToken;
  await user.save();

  return res.json({
    accessToken: accessToken,
    refreshToken: newRefreshToken,
    expiresIn: config.jwt.expiresIn,
    roles: user.roles.map((role) => role.name),
  });
};

const authJwt = {
  verifyToken,
  isAdmin,
  isModerator,
  refreshToken,
  generateAccessToken,
};
module.exports = authJwt;
