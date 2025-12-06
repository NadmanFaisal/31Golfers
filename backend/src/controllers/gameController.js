const { start } = require('repl');
const gameService = require('../services/gameService');
const { response } = require('express');

/**
 * Controller for calculating playable holes for a golf course.
 * @param {Request} req Express request object containing query parameters:
 *   - courseName {string} Name of the golf course
 *   - teeOffTime {string} Tee-off time in a valid date/time format
 *   - numHoles {number} Number of holes to play
 *   - pperHole {number} Average play time per hole
 * @param {Response} res Express response object.
 * @returns {Promise<void>}
 */
exports.get_playable_holes = async (req, res) => {
  try {
    const startTime = new Date(req.query.teeOffTime);
    const response = await gameService.calculatePlayableHoles(
      req.query.courseName, startTime, req.query.numHoles, req.query.pperHole
    )
    return res.status(200).json(response);
  } catch (err) {
    console.error(err);

    // Return error response with status/message
    res.status(err.status || 500).json({ error: err.message || 'Failed to fetch golfcourse data' });
  }
}

/**
 * Controller to handle finishing a game.
 * Receives game data in the request body, forwards it to the game service
 * for persistence, and returns the saved game response.
 *
 * @param {Request} req - Express request object containing the game data in `req.body`.
 * @param {Response} res - Express response object used to send back the result.
 * @returns {Promise<void>} Responds with JSON:
 */
exports.finish_game = async (req, res) => {
  try {
    const response = await gameService.saveGame(req.body);
    return res.status(200).json(response);
  } catch (err) {
    const status = err.statusCode || 500;
    console.error("finish_game error:", err);
    return res.status(status).json({
      error: err.message || "Internal error",
    });
  }
}

/**
 * Controller to handle returning a list of games.
 *
 * @param {Response} res - Express response object used to send back the result.
 * @returns {Promise<void>} Responds with JSON:
 */
exports.get_games = async (req, res) => {
  try {
    const userID = req.query.userID;
    const response = await gameService.getAllGames(userID);
    return res.status(200).json(response);
  } catch (err) {
    const status = err.statusCode || 500;
    console.error("finish_game error:", err);
    return res.status(status).json({
      error: err.message || "Internal error",
    });
  }
}
