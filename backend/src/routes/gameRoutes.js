const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');

// Route: get /getPlayableHoles
router.get('/getPlayableHoles', gameController.get_playable_holes);
// Route: post a complete game: post /complete
router.post('/complete', gameController.finish_game);
// Route: get a list of games: get /games?userID=...
router.get('/games', gameController.get_games);

module.exports = router;
