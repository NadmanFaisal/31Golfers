const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Route: POST /signup
router.post('/signup', userController.create_user);

// Route: POST /login
router.post('/login', userController.login_user)

module.exports = router;