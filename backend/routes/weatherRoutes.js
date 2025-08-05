const express = require('express');
const router = express.Router();

const weather_controller = require("../controllers/weatherController")

// Route: get /wether?golfCourse&day
router.get('/', weather_controller.get_weather_data)

module.exports = router;