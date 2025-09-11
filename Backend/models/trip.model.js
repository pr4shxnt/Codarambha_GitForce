const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    route: { type: String, required: true },
    fareCents: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now },
    txnId: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Trip", tripSchema);


