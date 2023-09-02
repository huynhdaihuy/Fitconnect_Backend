const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const genderEnum = ["male", "female", "other"];

const CoachSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
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
    match: [/0[35789]\d{8}$/, "Format of phone is invalid!"],
  },
  address: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  url_avatar: {
    type: String,
  },
  list_major: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Major",
    },
  ],
  list_certification: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Certification",
    },
  ],
});
CoachSchema.methods.comparePassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    console.error(error);
    throw new Error("An error occurred while comparing passwords");
  }
};
CoachSchema.pre("save", async function (next) {
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

CoachSchema.set("validateBeforeSave", true);
const Coach = mongoose.model("Coach", CoachSchema);

module.exports = Coach;
