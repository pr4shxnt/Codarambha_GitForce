const Trip = require("../models/trip.model");
const { nanoid } = require("nanoid");

exports.listTrips = async (req, res) => {
  const trips = await Trip.find({ user: req.userId }).sort({ timestamp: -1 }).limit(50);
  res.json(trips);
};

exports.addTrip = async (req, res) => {
  const { route, fareCents } = req.body;
  if (!route || !fareCents) return res.status(400).json({ message: "Missing route or fare" });
  const trip = await Trip.create({ user: req.userId, route, fareCents, txnId: nanoid() });
  res.status(201).json(trip);
};




