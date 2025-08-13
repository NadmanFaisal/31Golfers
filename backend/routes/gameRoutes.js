const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');

// Route: get /getPlayableHoles
router.get('/getPlayableHoles', gameController.get_playable_holes);

module.exports = router;
