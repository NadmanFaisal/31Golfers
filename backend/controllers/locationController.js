const locationService = require('../services/locationService');

exports.get_all_golfcourses = async (req, res) => {
    try {
        const response = await locationService.getAllGolfcourses()
        return res.status(200).json(response);
    } catch(err) {
        console.error(err);

        // Return error response with status/message
        res.status(err.status || 500).json({ error: err.message || 'Failed to fetch golfcourse data' });
    }
}