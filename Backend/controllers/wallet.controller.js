const Wallet = require("../models/wallet.model");
const jwt = require("jsonwebtoken");

exports.getWalletBalance = async (req, res) => {
  try {
    const { token } = req.body;

    // uncomment this on prod
    jwt.verify(token, process.env.TRANSITPAY_TOKEN_GENERATION_SECRET);

    const decoded = jwt.decode(token);

    const userId = decoded._id;
    const userType = decoded._userType;

    const wallet = await Wallet.find({ userType, userId });

    if (!wallet) {
      res
        .status(404)
        .json({ message: "Error. The wallet requested doesn't exist" });
    }

    return res.status(201).json({ walletBalance: wallet.balance });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error." });
  }
};
