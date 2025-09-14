const router = require("express").Router();
const { auth } = require("../middlewares/auth.middleware");
const tripController = require("../controllers/trip.controller");

router.get("/", auth, tripController.listTrips);
router.post("/add", auth, tripController.addTrip);

module.exports = router;




