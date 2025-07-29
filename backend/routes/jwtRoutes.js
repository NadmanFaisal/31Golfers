const express = require('express');
const router = express.Router();
const jwtController = require('../controllers/jwtController');

// Route: POST 
router.post('/', jwtController.generate_token);
router.get('/', jwtController.validate_token);

module.exports = router;