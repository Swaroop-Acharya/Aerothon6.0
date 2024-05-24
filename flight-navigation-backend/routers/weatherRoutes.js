const express = require("express");
const { getLocation } = require("../controllers/weatherController");
const { authMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/getlocation", getLocation);

module.exports = router;
