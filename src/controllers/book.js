const userModel = require("../models/user");
const bookModel = require("../models/book");
const Role = require("../models/roles");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require("dotenv").config();

module.exports.bookCreation = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).send({ status: false, msg: "Unauthorized" });
    }
    const token = authHeader.substring(7);

    const decodedToken = jwt.verify(token, "bookstore123");
    const userIdFromToken = decodedToken.userId;
    console.log(userIdFromToken, "userIdFromToken");
    const user = await userModel.findById(userIdFromToken).populate("roleId");
    let userId = userIdFromToken;
    if (user.roleId.role_Name == "Author" || user.roleId.role_Name == "Admin") {
      const bookDetails = await bookModel.create({
        ...req.body,
        userId: userId,
      });

      return res.status(201).send({
        status: true,
        msg: "Book created successfully",
        data: bookDetails,
      });
    } else {
      return res.status(403).send({
        status: false,
        message: "you are not authorized to create books",
      });
    }
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

module.exports.purchaseBook = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ status: false, msg: "Unauthorized" });
    }
    const token = authHeader.substring(7);
    const decodedToken = jwt.verify(token, "bookstore123");
    const userIdFromToken = decodedToken.userId;
    const user = await userModel.findById(userIdFromToken);
    if (!user) {
      return res.status(404).json({ status: false, msg: "User not found" });
    }

    const { bookId } = req.params;
    const book = await bookModel.findById(bookId);
    if (!book) {
      return res.status(404).json({ status: false, msg: "Book not found" });
    }
    user.purchaseHistory.push({
      bookId: book._id,
      title: book.title,
      price: book.price,
    });
    await user.save();
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "saquibmohammad38@gmail.com",
        pass: "kunzdxuilhirmsqm",
      },
    });
    let mailOptions = {
      from: "Book Store ",
      to: user.email,
      subject: "Book Purchased Successfully",
      text: `Dear ${user.fullName},\n\nYou have successfully purchased the book "${book.title}".\n\nThank you for shopping with us!\n\nRegards,\nThe Bookstore Team`,
    };
    await transporter.sendMail(mailOptions);
    return res
      .status(200)
      .json({ status: true, msg: "Book purchased successfully", data: book });
  } catch (err) {
    return res.status(500).json({ status: false, msg: err.message });
  }
};

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: "saquibmohammad38@gmail.com",
//     pass: "kunzdxuilhirmsqm",
//   }
// });

// //API Endpoint for Sending Bulk Emails
// module.exports.sendBulkMail=async (req, res) => {
//   try {
//       const users = await userModel.find().limit(100); // Fetch 100 users
//       const emails = users.map(userModel => userModel.email);

//       // Send emails
//       const mailOptions = {
//           from: 'saquibmohammad38@gmail.com',
//           to: emails.join(', '),
//           subject: 'New Book Releases',
//           text: 'Check out our latest book releases!'
//       };

//       await transporter.sendMail(mailOptions);
//       res.send('Emails sent successfully!');
//   } catch (error) {
//       console.error('Error sending emails:', error);
//       res.status(500).send('Error sending emails');
//   }
// };

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "saquibmohammad38@gmail.com",
    pass:process.env.passcode,
  },
});

async function sendEmailsInBatch(offset, batchSize) {
  try {
    const users = await userModel.find().skip(offset).limit(batchSize);
    const emails = users.map((user) => user.email);

    // Send emails
    const mailOptions = {
      from: "saquibmohammad38@gmail.com",
      to: emails.join(", "),
      subject: "New Book Releases",
      text: "Check out our latest book releases!",
    };

    await transporter.sendMail(mailOptions);
    console.log(
      `Emails sent to ${offset + 1}-${offset + batchSize} users successfully!`
    );
  } catch (error) {
    console.error("Error sending emails:", error);
  }
}

module.exports.sendBulkMail = async () => {
  try {
    const totalUsers = await userModel.countDocuments();
    const batchSize = 100;
    let offset = 0;

    const sendBatch = async () => {
      if (offset < totalUsers) {
        await sendEmailsInBatch(offset, batchSize);
        offset += batchSize;
      } else {
        clearInterval(interval);
        console.log("All emails sent successfully!");
      }
    };

    sendBatch();

    const interval = setInterval(sendBatch, 60000);
  } catch (error) {
    console.error("Error sending emails:", error);
  }
};