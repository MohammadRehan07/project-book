const mongoose = require("mongoose");
const roleSchema = new mongoose.Schema(
  {
    role_Name: {
      type: String,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("role", roleSchema);