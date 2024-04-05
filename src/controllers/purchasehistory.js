const userModel = require("../models/user");
const bookModel = require("../models/book");
const purchaseModel = require("../models/purchasehistrory");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const purchaseDate = new Date().toDateString();
require("dotenv").config();

module.exports.addPuchaseHistory = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).send({ status: false, msg: "Unauthorized" });
    }
    const token = authHeader.substring(7);
    const decodedToken = jwt.verify(token, "bookstore123");
    const userIdFromToken = decodedToken.userId;
    console.log(userIdFromToken, "userIdFromToken");
    const currentYearMonth = new Date().toISOString().slice(0, 7);
    const lastPurchaseInMonth = await purchaseModel
      .findOne({
        purchaseId: { $regex: `^${currentYearMonth}` },
      })
      .sort({ purchaseId: -1 });
    let nextNumericId = 1;
    if (lastPurchaseInMonth) {
      const lastPurchaseNumericId = parseInt(
        lastPurchaseInMonth.purchaseId.split("-").pop()
      );
      nextNumericId = lastPurchaseNumericId + 1;
    }
    const purchaseId = `${currentYearMonth}-${nextNumericId}`;
    let bookData = await bookModel.findById(req.body.bookId);
    let data = await purchaseModel.create({
      ...req.body,
      userId: userIdFromToken,
      purchaseId,
      bookPrice: bookData.price,
    });
    let user = await userModel.findById(bookData.userId);
    user.totalRevenue = parseInt(user.totalRevenue) + parseInt(bookData.price);
    await user.save();
    let userPurchaseEmail = await userModel.findById(userIdFromToken);
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "saquibmohammad38@gmail.com",
        pass: process.env.passcode,
      },
    });
    let mailOptions = {
      from: "Book Store ",
      to: user.email,
      subject: "Book Purchased Successfully",
      text: `Dear ${user.fullName},\n\nYour book "${bookData.title}"\nPrice:INR${bookData.price}\n\npurchased by ${userPurchaseEmail.fullName}\n\ and your total revenue is INR${user.totalRevenue}`,
    };
    await transporter.sendMail(mailOptions);
    data.purchaseDate =
      data.createdAt.getFullYear() +
      "-" +
      (data.createdAt.getMonth() + 1) +
      "-" +
      data.createdAt.getDate();
    data.save();
    return res.status(201).send({ status: true, data: data });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};