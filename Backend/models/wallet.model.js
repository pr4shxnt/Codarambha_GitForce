const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    balanceCents: { type: Number, default: 0 },
    transactions: [
      {
        id: { type: String, required: true },
        type: { type: String, enum: ["topup", "deduct"], required: true },
        amountCents: { type: Number, required: true },
        note: { type: String },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Wallet", walletSchema);




