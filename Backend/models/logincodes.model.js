const mongoose = require("mongoose");

const loginCodeSchema = new mongoose.Schema(
  {
    transportId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transport",
      required: true,
      unique: true,
    },
    loginCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      length: 6,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("LoginCode", loginCodeSchema);
