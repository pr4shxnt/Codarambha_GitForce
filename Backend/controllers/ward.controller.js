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

    // 1. Find the ward
    const ward = await Ward.findById(wardId);
    if (!ward) {
      return res.status(404).json({ message: "Ward not found" });
    }

    // 2. Find the guardian linked to this ward
    const user = await User.findById(ward.guardian);
    if (!user) {
      return res.status(404).json({ message: "Guardian not found" });
    }

    // 3. Update guardian's linkedWard array (assuming it's an array of ObjectIds)
    if (!user.linkedWard.includes(ward._id)) {
      user.linkedWard.push(ward._id);
      await user.save();
    }

    // 4. Return response
    res.json({
      message: "User updated successfully",
      user: {
        id: user._id,
        email: user.email,
        linkedWard: user.linkedWard,
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
