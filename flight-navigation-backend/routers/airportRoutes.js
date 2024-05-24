const express = require("express");
const { getNearestAirport, getAirportGraph ,getGraph} = require("../controllers/airportController");
const { authMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/get-nearest-airport", getNearestAirport);
router.post("/airport-graphs", getGraph);

module.exports = router;
