const mongoose = require("mongoose");
const CardRequest = require("../models/card.request.model");
const User = require("../models/user.model");
const Org = require("../models/org.model");
const Ward = require("../models/ward.model");

// Create a new card request
exports.createCardRequest = async (req, res) => {
  try {
    const { requesterType, username, password, fullName, dateOfBirth } =
      req.body;

    if (!requesterType || !username || !password) {
      return res.status(400).json({
        message: "Requester type, username, and password are required",
      });
    }

    if (!["User", "Org", "Ward"].includes(requesterType)) {
      return res.status(400).json({ message: "Invalid requester type" });
    }

    let requester;

    const firstName = fullName?.split(" ")[0];
    const lastName = fullName?.split(" ")[1] || "";

    // ✅ Lookup logic based on type
    if (requesterType === "User") {
      requester = await User.findOne({
        username,
        password,
        firstName,
        lastName,
        dateOfBirth,
      });
    } else if (requesterType === "Org") {
      requester = await Org.findOne({ username, password, name: fullName });
    } else if (requesterType === "Ward") {
      requester = await Ward.findOne({ username, password, name: fullName });
    }

    if (!requester) {
      return res.status(404).json({ message: `${requesterType} not found` });
    }

    if (!requester.isVerified) {
      return res
        .status(403)
        .json({ message: `Your KYC is still under verification.` });
    }

    const requesterId = requester._id;

    // Prevent duplicate pending requests
    const existingRequest = await CardRequest.findOne({
      requesterType,
      requesterId,
      status: "Pending",
    });
    if (existingRequest) {
      return res
        .status(400)
        .json({ message: "A pending request already exists" });
    }

    // Save new request
    const newRequest = new CardRequest({ requesterType, requesterId });
    await newRequest.save();

    res.status(201).json(newRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
