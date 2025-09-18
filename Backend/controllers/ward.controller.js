const jwt = require("jsonwebtoken");
const Ward = require("../models/ward.model");
const Org = require("../models/org.model");
const User = require("../models/user.model");

exports.createWard = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      guardianType,
      guardian,
      age,
      role,
      nationalId,
      nationalIdNumber,
      dateOfBirth,
      gender,
      profileAvatar,
      signature,
      email,
      password,
      phoneNumber,
    } = req.body;

    // check if ward already exists by nationalIdNumber (since it's unique)
    const existing = await Ward.findOne({ nationalIdNumber });

    const checkGuardianExists = await (async () => {
      if (guardianType === "User") {
        return await User.findById(guardian);
      } else if (guardianType === "Org") {
        return await Org.findById(guardian);
      }
    })();

    if (!checkGuardianExists) {
      return res.status(400).json({ message: "Guardian not found" });
    }
    if (existing) {
      return res
        .status(409)
        .json({ message: "Ward already registered with this ID number" });
    }

    const newWard = new Ward({
      firstName,
      lastName,
      guardianType,
      guardian,
      age,
      role,
      nationalId,
      nationalIdNumber,
      dateOfBirth,
      gender,
      profileAvatar,
      signature,
      password,
      email,
      phoneNumber: phoneNumber ? phoneNumber : null,
    });

    await newWard.save();

    const token = jwt.sign(
      { id: newWard._id },
      process.env.JWT_SECRET || "dev_secret",
      { expiresIn: "7d" }
    );

    res.status(201).json({
      ward: {
        id: newWard._id,
        firstName: newWard.firstName,
        lastName: newWard.lastName,
        guardianType: newWard.guardianType,
        guardian: newWard.guardian,
        age: newWard.age,
        role: newWard.role,
        nationalId: newWard.nationalId,
        nationalIdNumber: newWard.nationalIdNumber,
        dateOfBirth: newWard.dateOfBirth,
        gender: newWard.gender,
        profileAvatar: newWard.profileAvatar,
        isVerified: newWard.isVerified,
      },
      token,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { wardId } = req.body;
    const updates = req.body;
    const user = await User.findByIdAndUpdate(userId, updates, { new: true });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      user: {
        linkedWard: user.linkedWard.append(wardId),
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
