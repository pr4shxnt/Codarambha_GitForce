const router = require("express").Router();

const { createCardRequest } = require("../controllers/card.request.controller");

router.post("/", createCardRequest);

module.exports = router;
