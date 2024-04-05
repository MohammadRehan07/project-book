const express = require("express");
const router = express.Router();
const book = require("../controllers/book");
const middleware = require("../middleware/auth");
router.post("/createBook", middleware.authentication, book.bookCreation);
//router.post('/purchase/:bookId',middleware.authentication,book.purchaseBook)
router.get("/sendMail", book.sendBulkMail);
module.exports = router;