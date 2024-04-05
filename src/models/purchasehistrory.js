const mongoose = require("mongoose");
const purchaseSchema = new mongoose.Schema(
  {
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "book",
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      trim: true,
    },
    purchaseId: {
      type: String,
    },
    bookPrice: {
      type: Number,
    },
    purchaseDate: {
      type: String,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("purchase", purchaseSchema);