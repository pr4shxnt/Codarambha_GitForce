const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema(
  {
    balance: {
      type: Number,
      required: true,
      default: 0,
    },
    userType: {
      type: String,
      enum: ["User", "Org", "Ward"],
      required: true,
    },
    // refPath must be the string name of the path holding the model name
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "userType",
      required: true,
    },
    history: [
      {
        title: {
          type: String,
        },
        amount: {
          type: Number,
        },
        uuid: {
          type: String,
        },
        date: {
          type: Date,
        },
        remarks: {
          type: String,
        },
      },
    ],
    currency: { type: String, default: "NPR" },
  },
  { timestamps: true }
);

// ensure unique wallet per owner
walletSchema.index({ userType: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model("Wallet", walletSchema);
