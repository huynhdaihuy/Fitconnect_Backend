const express = require("express");
const cors = require("cors");
var bodyParser = require("body-parser");
require("dotenv").config();
const mongoose = require("mongoose");
const ApiError = require("./app/api-error");
const app = express();
const config = require("./app/config");
const fileUpload = require("express-fileupload");

mongoose
  .connect(`mongodb://127.0.0.1:27017/recipe`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connect to Mongoose.");
    const PORT = config.app.port;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Connection error", err);
    process.exit();
  });
mongoose.set("autoIndex", false);
mongoose.set("useFindAndModify", false);
app.use(
  fileUpload({
    limits: { fileSize: 1024 * 1024 * 1024 },
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
const authRouter = require("./app/routes/auth.routes");
const userRouter = require("./app/routes/user.route");
const recipeRouter = require("./app/routes/recipe.route");
const cartRouter = require("./app/routes/cart.route");
const ratingRouter = require("./app/routes/rating.route");

var corsOptions = {
  origin: "*",
};

app.use(cors(corsOptions));
const dotenv = require("dotenv");
dotenv.config();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/recipe", recipeRouter);
app.use("/api/cart", cartRouter);
app.use("/api/rating", ratingRouter);

app.use((req, res, next) => {
  return next(new ApiError(404, "Resource not found"));
});
app.use((err, req, res, next) => {
  return res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
  });
});
module.exports = app;
