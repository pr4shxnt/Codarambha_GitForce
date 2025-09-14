const Wallet = require("../models/wallet.model");
const { nanoid } = require("nanoid");

exports.getWallet = async (req, res) => {
  const wallet = await Wallet.findOne({ user: req.userId });
  if (!wallet) return res.json({ balanceCents: 0, transactions: [] });
  res.json({ balanceCents: wallet.balanceCents, transactions: wallet.transactions.slice(-50).reverse() });
};

exports.topUp = async (req, res) => {
  const { amountCents, note } = req.body;
  if (!amountCents || amountCents <= 0) return res.status(400).json({ message: "Invalid amount" });
  const wallet = await Wallet.findOneAndUpdate(
    { user: req.userId },
    { $inc: { balanceCents: amountCents } },
    { upsert: true, new: true }
  );
  wallet.transactions.push({ id: nanoid(), type: "topup", amountCents, note });
  await wallet.save();
  res.json({ balanceCents: wallet.balanceCents });
};

exports.deduct = async (req, res) => {
  const { amountCents, note } = req.body;
  if (!amountCents || amountCents <= 0) return res.status(400).json({ message: "Invalid amount" });
  const wallet = await Wallet.findOne({ user: req.userId });
  if (!wallet || wallet.balanceCents < amountCents) return res.status(400).json({ message: "Insufficient balance" });
  wallet.balanceCents -= amountCents;
  wallet.transactions.push({ id: nanoid(), type: "deduct", amountCents, note });
  await wallet.save();
  res.json({ balanceCents: wallet.balanceCents });
};




