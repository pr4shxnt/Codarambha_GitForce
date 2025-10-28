const mongoose = require("mongoose");

const cardRequestSchema = new mongoose.Schema(
  {
    requesterType: {
      type: String,
      required: true,
      enum: ["User", "Org", "Ward"],
    },
    requesterId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "requesterType",
    },
    status: {
      type: String,
      required: true,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CardRequest", cardRequestSchema);
