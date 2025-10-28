const router = require("express").Router();
const { createWard, updateUser } = require("../controllers/ward.controller");

// Create a new ward
router.post("/create", createWard);
router.post("/ward-update", updateUser);

module.exports = router;
