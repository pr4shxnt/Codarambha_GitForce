const mongoose = require("mongoose");

const orgSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  registrationNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  establishedDate: {
    type: Date,
    required: true,
  },
  website: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  type: {
    type: String,
    enum: ["Orphanage", "OA home", "Hospital", "Other"],
  },
  linkedWards: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Ward" }],
    default: [],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  signature: {
    type: String,
    unique: true,
  },
});

module.exports = mongoose.model("Org", orgSchema);
