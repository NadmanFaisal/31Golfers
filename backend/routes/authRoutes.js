const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticateToken = require('../middleware/authMiddleware');

// Route: POST /signup
router.post('/signup', authController.create_user);

// Route: POST /login
router.post('/login', authController.login_user)

// Route: GET /protected
router.get('/', authenticateToken, (req, res) => {
  res.status(200).json({
    message: 'Token is valid!',
    user: req.user,
  });
});

module.exports = router;