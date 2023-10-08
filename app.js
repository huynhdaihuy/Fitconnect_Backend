const express = require("express");
const cors = require("cors");
var bodyParser = require("body-parser");
const http = require("http"); // Import the http module
const socketIo = require("socket.io"); //
require("dotenv").config();
const mongoose = require("mongoose");
const ApiError = require("./app/api-error");
const app = express();

const config = require("./app/config");

const db = require("./app/models");
const Role = db.role;

 db.mongoose
  .connect(
    `mongodb+srv://huynhdaihuybank3:UmDSkY4KujpcsERs@cluster0.vdbdbvn.mongodb.net/fitconnect`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Successfully connect to Mongoose.");
    const PORT = config.app.port;
    // app.listen(PORT, () => {
    //     console.log(`Server is running on port ${PORT}`);
    // })
  })
  .catch((err) => {
    console.error("Connection error", err);
    process.exit();
  });

const server = http.createServer(app);
server.listen(8080, () => {
  console.log("SocketIO  on :8080");
});
const io = socketIo(server);
io.on("connection", (socket) => {
  const userId = socket.handshake.query.username;
  console.log("🚀 ~ file: app.js:22 ~ io.on ~ userId:", userId);

  console.log("A user connected");
  socket.on("message", (data) => {
    const message = {
      content: data.content,
      sender_id: data.sender_id,
      receiver_id: data.coach_id,
      createdAt: new Date().toISOString(),
    };
    console.log("🚀 ~ file: app.js:32 ~ socket.on ~ message:", message);
    io.emit("messageResponse", message);
  });
  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});
// try {

//     admin.initializeApp({
//       credential: admin.credential.cert(serviceAccount),
//       databaseURL: "https://fitconnect-chat-default-rtdb.firebaseio.com"
//     })
//     console.log('Connected Firebase');
// } catch (error) {
//     console.log(e);
//     process.exit();
// }

const productRouter = require("./app/routes/product.route");
const authRouter = require("./app/routes/auth.routes");
const userRouter = require("./app/routes/customer.route");
const cartRouter = require("./app/routes/cart.route");
const orderRouter = require("./app/routes/order.route");
const uploadRouter = require("./app/routes/upload.route");
const couponRouter = require("./app/routes/coupon.route");
const majorRouter = require("./app/routes/major.route");
const coachRouter = require("./app/routes/coach.route");
const categoryRouter = require("./app/routes/category.route");
const paymentRouter = require("./app/routes/payment.route");
const certificationRouter = require("./app/routes/certification.route");
const exerciseRouter = require("./app/routes/exercise.route");
const planRouter = require("./app/routes/plan.route");
const customerRouter = require("./app/routes/customer.route");
const messageRouter = require("./app/routes/message.route");
const courseRouter = require("./app/routes/course.route");
const appointmentRouter = require("./app/routes/appointment.route");
const ratingRouter = require("./app/routes/rating.route");

const fileUpload = require("express-fileupload");

mongoose.set("useFindAndModify", false);

var corsOptions = {
  origin: "http://localhost:3000",
};

app.use(cors(corsOptions));
const dotenv = require("dotenv");
const { urlencoded } = require("body-parser");

dotenv.config();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  fileUpload({
    limits: { fileSize: 1024 * 1024 * 1024 },
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

app.use(
  "/api/test",
  (req, res, next) => {
    res.set(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  },
  userRouter
);

app.use("/api/upload", uploadRouter);
// app.use('/api/coupon', couponRouter);
// app.use('/api/user', userRouter);
app.use("/api/order", orderRouter);
app.use("/api/auth", authRouter);
app.use("/api/cart", cartRouter);
app.use("/api/products", productRouter);
app.use("/api/major", majorRouter);
app.use("/api/coach", coachRouter);
app.use("/api/category", categoryRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/certification", certificationRouter);
app.use("/api/exercise", exerciseRouter);
app.use("/api/plan", planRouter);
app.use("/api/customer", customerRouter);
app.use("/api/message", messageRouter);
app.use("/api/course", courseRouter);
app.use("/api/appointment", appointmentRouter);
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
