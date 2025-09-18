const router = require("express").Router();
const { createWard } = require("../controllers/ward.controller");

// Create a new ward
router.post("/create", createWard);

module.exports = router;
