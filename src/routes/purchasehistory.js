const express = require("express");
const router = express.Router();
const purchase = require("../controllers/purchasehistory");
const middleware = require("../middleware/auth");
router.post("/create", middleware.authentication, purchase.addPuchaseHistory);

module.exports = router;