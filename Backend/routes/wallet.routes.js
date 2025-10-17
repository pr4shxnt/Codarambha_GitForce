const router = require("express").Router();
const walletController = require("../controllers/wallet.controller");
const { auth } = require("../middlewares/auth.middleware");

// create wallet (optional/admin)
// router.post("/", walletController.createWallet);

// get wallet by id (or by owner via auth)
router.get("/:walletId", auth, walletController.getWalletBalance);

// deduct
// router.post("/:walletId/deduct", auth, walletController.deductFare);

// topup stub
// router.post("/:walletId/topup", auth, walletController.topupStub);


// create all the controller before routing through this route. You are giving heart attacks to my deployment. 
module.exports = router;
