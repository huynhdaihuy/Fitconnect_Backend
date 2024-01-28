const User = require("../models/user.model");

const { cloudinaryUploadImg } = require("../utils/cloudinary");

exports.createUser = async (req, res) => {
  const {
    username,
    email,
    name,
    gender,
    birthday,
    phone_number,
    password,
    address,
    role,
  } = req.body;

  var url_avatar;
  try {
    let uploaderImage = (path) => cloudinaryUploadImg(path, "images");
    const files = req.files;
    if (!files) {
      console.log("Can not receive file");
      res.status(401).json({ error: "Can not receive file" });
      return;
    }
    if (files) {
      console.log("Received file");
      const files = req.files;
      const pathImage = files.image.tempFilePath;

      let newpathImage = await uploaderImage(pathImage);
      if (!newpathImage) {
        res.status(500).json({ error: "Failed to upload image" });
      }

      url_avatar = newpathImage.url;
      const newUser = await User.create({
        username,
        email,
        name,
        gender,
        birthday,
        phone_number,
        password,
        address,
        url_avatar,
        role,
      });
      res.status(201).json(newUser);
    }
  } catch (error) {
    res.status(400).json(error);
  }
};

exports.getAllUser = async (req, res) => {
  try {
    const Users = await User.find();
    res.status(200).json(Users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch exercises" });
  }
};

exports.getUserById = async (req, res) => {
  const UserId = req.params.id;
  try {
    const User = await User.findById(UserId);
    if (!User) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(User);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch exercise" });
  }
};

exports.updateUserById = async (req, res) => {
  const UserId = req.params.id;

  try {
    const updatedUser = await User.findByIdAndUpdate(UserId, req.body, {
      new: true,
    });
    if (!updatedUser) {
      return res.status(404).json({ error: "Exercise not found" });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Failed to update exercise" });
  }
};

exports.uploadAvatar = async (req, res) => {
  const UserId = req.params.id;
  var url_avatar;
  try {
    let uploaderImage = (path) => cloudinaryUploadImg(path, "images");
    const files = req.files;
    if (!files) {
      console.log("Can not receive file");
      res.status(401).json({ error: "Can not receive file" });
      return;
    }
    if (files) {
      console.log("Received file avatar");
      const files = req.files;
      const pathImage = files.image.tempFilePath;

      let newpathImage = await uploaderImage(pathImage);
      if (!newpathImage) {
        res.status(500).json({ error: "Failed to upload image" });
      }
      url_avatar = newpathImage.url;
    }
    const updateUser = await User.findByIdAndUpdate(UserId, {
      url_avatar,
    });
    res.status(200).send(url_avatar);
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.forgotPassword = async (req, res) => {
  const { email, username } = req.body;
  const user = await User.findOne({ email, username });
  if (!user) {
    return res
      .status(400)
      .json({ error: "User with that email and username does not exist" });
  }
  const newPassword = Math.random().toString(36).slice(-8);
  const password = bcrypt.hashSync(newPassword, 8);
  const userUpdated = await User.findOneAndUpdate(
    { email, username },
    { password },
    { new: true }
  );
  if (!userUpdated)
    return res.status(500).json({ error: "User can not update!" });

  let configMail = {
    service: "gmail.com",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  };
  const transport = nodemailer.createTransport(configMail);

  const mailOptions = {
    from: "Blackism <huynhdaihuybank6@gmail.com>",
    to: email,
    subject: "Reset Password",
    text: `Your new password is: ${newPassword}`,
  };

  transport.sendMail(mailOptions, (err, info) => {
    if (err) {
      return res.status(500).json({ error: "Failed to send email" });
    }

    res.status(200).json({
      message:
        "Password reset successful. Check your email for the new password.",
    });
  });
};
