const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
app.use(express.json());
app.use("/uploads", express.static("uploads"));
const roles = require("./routes/roles");
const user = require("./routes/user");
const book = require("./routes/book");
const purchase = require("./routes/purchasehistory");
app.use("/roles", roles);
app.use("/user", user);
app.use("/book", book);
app.use("/purchasehistory", purchase);
const cors = require("cors");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
app.use(cors());
mongoose.set("strictQuery", false);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.log(err));
const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Express app running on port " + port);
});