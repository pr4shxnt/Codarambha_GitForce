const mongoose = require("mongoose");

const wardSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  guardianType: {
    type: String,
    required: true,
    enum: ["User", "Org"],
  },
  guardian: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "guardianType",
  },
  age: {
    type: Number,
    required: true,
  },
  role: {
    type: String,
    enum: ["Minor", "Senior", "Disabled"],
  },
  nationalId: {
    type: String,
    required: true,
    enum: [
      "Citizenship",
      "Birth Certificate",
      "Senior citizen ID",
      "Disability ID",
      "Adoption Certificate",
    ],
  },
  nationalIdNumber: {
    type: String,
    required: true,
    unique: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    enum: ["male", "female", "others"],
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  profileAvatar: {
    type: String,
  },
  signature: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  phoneNumber: {
    type: String,
    unique: true,
    sparse: true,
  },
  password: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Ward", wardSchema);
