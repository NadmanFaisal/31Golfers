const express = require('express');
const router = express.Router();
const authenticateMiddleware = require('../middleware/authMiddleware');

// Route: GET /protected
router.get('/', authenticateToken, (req, res) => {
  res.status(200).json({
    message: 'Token is valid!',
    user: req.user,
  });
});

module.exports = router;