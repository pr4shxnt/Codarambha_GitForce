const router = require("express").Router();
const { auth } = require("../middlewares/auth.middleware");
const walletController = require("../controllers/wallet.controller");

router.get("/", auth, walletController.getWallet);
router.post("/topup", auth, walletController.topUp);
router.post("/deduct", auth, walletController.deduct);

module.exports = router;




