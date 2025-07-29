const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Route: POST /user
router.post('/', userController.create_user);

module.exports = router;