const router = require("express").Router();
const walletController = require("../controllers/wallet.controller");
const { auth } = require("../middlewares/auth.middleware");

// Create wallet (will be called after user creation)
router.post("/create", auth, walletController.createWallet);

// Apply currency conversion middleware to all routes
router.use(walletController.withCurrencyConversion);

// Get wallet balance and details
router.get("/:walletId", auth, walletController.getWalletBalance);

// Get transaction history
router.get("/:walletId/transactions", auth, walletController.getTransactions);

// Deduct fare (with idempotency)
router.post("/:walletId/deduct", auth, walletController.deductFare);

module.exports = router;
