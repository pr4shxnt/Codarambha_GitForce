const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema(
  {
    transportId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transport",
      required: true,
    },
    passengerType: {
      type: String,
      required: true,
      enum: ["User", "Org", "Ward"],
    },
    passengerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "passengerType",
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    fare: {
      type: Number,
      required: true,
      min: 0,
    },
    startingStation: {
      type: String,
      required: true,
      trim: true,
    },
    destinationStation: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Trip", tripSchema);
