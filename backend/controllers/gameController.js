const { start } = require('repl');
const gameService = require('../services/gameService');

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
