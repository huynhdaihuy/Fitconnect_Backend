const asyncHandler = require("express-async-handler");
const { ObjectId } = require("mongodb");
const db = require("../models");
const Customer = db.customer;
var bcrypt = require("bcryptjs");
var nodemailer = require("nodemailer");


const {
    cloudinaryUploadImg,
    cloudinaryDeleteImg,
} = require("../utils/cloudinary");


exports.getAllCustomer = asyncHandler(async(req, res) => {
    try {
        const queryObj = {...req.query };
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(regex)\b/g, (match) => {
            return `$${match}`
        })
        let customers = await Customer.find(JSON.parse(queryStr));
        res.json(customer);
    } catch (error) {
        throw new Error(error);
    }
});

exports.findOne = asyncHandler(async(req, res) => {
    if (!ObjectId.isValid(req.params.id))
        res.send("Invalid Id!");
    else
        try {
            const customer = await Customer.find({ _id: req.params.id });
            res.json(customer);
        } catch (error) {
            throw new Error(error);
        }
});

exports.update = asyncHandler(async(req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        res.status(400).send("Invalid Id!");
        return;
    } else
        try {
            const customer = await Customer.findOneAndUpdate({ _id: req.params.id }, req.query, { returnDocument: "after", new: true });
            console.log("🚀 ~ file: user.controller.js:63 ~ exports.update=asyncHandler ~ customer:", customer)
            res.json(customer);
        } catch (error) {
            throw new Error(error);
        }
});
exports.uploadAvatar = asyncHandler(async(req, res) => {
    if (!ObjectId.isValid(req.params.id))
        res.send("Invalid Id!");
    try {
        let uploader = (path) => cloudinaryUploadImg(path, "images");
        const urlImg = [];
        const files = req.files;
        const { id } = req.params;
        if (files) {
            const path = files.images.tempFilePath;
            const newpath = await uploader(path);
            urlImg.push(newpath);
        }
        const customerUpdated = await Customer.findByIdAndUpdate(id, { avatar: urlImg[0].url }, { new: true });
        res.json(customerUpdated);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error occurred.' });
    }
});
exports.delete = asyncHandler(async(req, res) => {
    if (!ObjectId.isValid(req.params.id))
        res.send("Invalid Id!");
    else
        try {
            const customer = await Customer.deleteOne({ _id: req.params.id });
            res.json(customer);
        } catch (error) {
            throw new Error(error);
        }
});
exports.changePassword = async(req, res) => {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    try {
        const customer = await Customer.findById(id);
        const isMatch = await customer.comparePassword(currentPassword);

        if (!isMatch) {
            return res.status(401).send({ message: 'Current password is incorrect' });
        }
        customer.password = newPassword;
        await customer.save()
        res.status(200).send({ message: 'Password changed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'An error occurred while changing the password' });
    }
}
exports.forgotPassword = async(req, res) => {
    const { email, username } = req.body;
    const customer = await Customer.findOne({ email, username });
    if (!customer) {
        return res.status(400).json({ error: 'Customer with that email and username does not exist' });
    }
    const newPassword = Math.random().toString(36).slice(-8);
    const password = bcrypt.hashSync(newPassword, 8);
    const customerUpdated = await Customer.findOneAndUpdate({ email, username }, { password }, { new: true });
    if (!customerUpdated)
        return res.status(500).json({ error: 'User can not update!' });

    let configMail = {
        service: 'gmail.com',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },

    }
    const transport = nodemailer.createTransport(configMail);

    const mailOptions = {
        from: 'Blackism <huynhdaihuybank6@gmail.com>',
        to: email,
        subject: 'Reset Password',
        text: `Your new password is: ${newPassword}`
    };

    transport.sendMail(mailOptions, (err, info) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to send email' });
        }
        res.status(200).json({ message: 'Password reset successful. Check your email for the new password.' });
    });
}