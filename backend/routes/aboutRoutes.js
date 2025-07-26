const express = require('express');
const router = express.Router();

const about_controller = require('../controllers/aboutController')

// Define the routes for this router
router.get('/', about_controller.about_list);

module.exports = router;