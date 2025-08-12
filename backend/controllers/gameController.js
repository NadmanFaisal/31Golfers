const { start } = require('repl');
const gameService = require('../services/gameService');

exports.get_playable_holes = async (req, res) => {
    try {
        const startTime = new Date(req.query.teeOffTime);
        const response = await gameService.calculatePlayableHoles(
            req.query.courseName, startTime, req.query.numHoles, req.query.pperHole
        )
        return res.status(200).json(response);
    } catch(err) {
        console.error(err);

        // Return error response with status/message
        res.status(err.status || 500).json({ error: err.message || 'Failed to fetch golfcourse data' });
    }
}