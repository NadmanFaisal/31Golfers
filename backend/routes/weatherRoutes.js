const express = require('express');
const router = express.Router();

const weather_controller = require("../controllers/weatherController")

// Route: get /wether?golfCourse&day
router.get('/hourlyweather', weather_controller.get_hourly_weather_data)

module.exports = router;