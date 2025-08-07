const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');
const authenticateToken = require('../middleware/authMiddleware');

// Route: POST /signup
router.get('/golfcourses', locationController.get_all_golfcourses);

module.exports = router;