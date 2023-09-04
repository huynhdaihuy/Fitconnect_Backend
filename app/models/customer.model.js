const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const genderEnum = ["male", "female", "other"];

const CustomerSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      minLength: 8,
    },
    email: {
      type: String,
      required: true,
      unique: [true, "User's email required"],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Format of email is invalid!",
      ],
    },
    name: {
      type: String,
      required: [true, "User's name required"],
      maxLength: 30,
    },
    gender: {
      type: String,
      enum: genderEnum,
      required: true,
    },
    birthday: {
      type: Date,
      required: true,
    },
    phone_number: {
      type: String,
      required: true,
      unique: [true, "User's phone number required"],
      maxLength: 10,
      // match: [/0[35789]\d{8}$/, "Format of phone is invalid!"],
    },
    password: {
      type: String,
      required: [true, "User's password required"],
      minLength: 8,
    },
    address: {
      type: String,
      maxLength: 200,
    },
    height: {
      type: Number,
      // required: true,
    },
    weight: {
      type: Number,
      // required: true,
    },
    url_avatar: {
      type: String,
    },
    refreshToken: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);
CustomerSchema.methods.comparePassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    console.error(error);
    throw new Error("An error occurred while comparing passwords");
  }
};
CustomerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(8);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (error) {
    return next(error);
  }
});

CustomerSchema.set("validateBeforeSave", true);

const Customer = mongoose.model("Customer", CustomerSchema);

module.exports = Customer;
