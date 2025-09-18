const router = require("express").Router();
const userController = require("../controllers/user.controller");
const { auth } = require("../middlewares/auth.middleware");

// Create a new user
router.post("/create", userController.createUser);

// Login
router.post("/login", userController.login);

// Profile
router.get("/me/:userId", auth, userController.me);

module.exports = router;
