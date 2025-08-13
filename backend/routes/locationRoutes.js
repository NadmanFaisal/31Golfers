const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');

// Route: POST /golfcourses
router.get('/golfcourses', locationController.get_all_golfcourses);

module.exports = router;
