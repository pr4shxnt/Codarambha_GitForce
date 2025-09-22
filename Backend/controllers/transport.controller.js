const Transport = require("../models/transport.model");
const bcrypt = require("bcryptjs");

exports.registerTransport = async (req, res) => {
  try {
    const {
      vehicleNumber,
      driverName,
      driverLicenseNumber,
      contactNumber,
      route,
      capacity,
      driverPermitProof,
      transportCompany,
    } = req.body;

    // Basic validation
    if (
      !vehicleNumber ||
      !driverName ||
      !driverLicenseNumber ||
      !contactNumber ||
      !route ||
      !capacity ||
      !driverPermitProof ||
      !transportCompany
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }
    if (capacity < 1 || capacity > 100) {
      return res
        .status(400)
        .json({ message: "Capacity must be between 1 and 100." });
    }
    // Check for existing transport with same vehicle number or login code
    const existingTransport = await Transport.findOne({
      $or: [{ vehicleNumber }],
    });
    if (existingTransport) {
      return res.status(400).json({
        message: "The transport exists. Use your login code to login.",
      });
    }

    const getLoginCode = () => {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      return code;
    };

    const code = getLoginCode();

    const cryptedCode = await bcrypt.hash(code, 10);

    // Create new transport
    const newTransport = new Transport({
      vehicleNumber,
      driverName,
      driverLicenseNumber,
      contactNumber,
      route,
      capacity,
      driverPermitProof,
      transportCompany,
      loginCode: cryptedCode,
    });

    await newTransport.save();
    res.status(201).json({
      message: "Transport registered successfully.",
      transport: newTransport,
    });
  } catch (error) {
    console.error("Error registering transport:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};
