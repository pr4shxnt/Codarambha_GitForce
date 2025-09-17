const mongoose = require("mongoose");

const transportSchema = new mongoose.Schema({
  vehicleNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  driverName: {
    type: String,
    required: true,
    trim: true,
  },
  driverLicenseNumber: {
    type: String,
    required: true,

    unique: true,
    trim: true,
  },
  contactNumber: {
    type: String,
    required: true,
    trim: true,
  },
  route: {
    type: String,
    required: true,
    trim: true,
  },
  capacity: {
    type: Number,
    required: true,
    min: 1,
    max: 100,
  },
  driverPermitProof: {
    type: String,
    required: true,
    trim: true,
  },
  transportCompany: {
    type: String,
    required: true,
    trim: true,
  },
});

module.exports = mongoose.model("Transport", transportSchema);
