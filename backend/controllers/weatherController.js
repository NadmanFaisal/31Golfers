const weatherService = require('../services/weatherService');

/**
 * Controller for fetching weather data for a given golf course and day.
 * @function get_weather
 * @param {Request} req Express request object.
 * @param {Response} res  Express response object.
 * @returns {Promise<void>}
 */
exports.get_hourly_weather_data = async (req, res) => {
    const golfCourse = req.query.golfCourse;
    const day = req.query.day;
    try {
        const response = await weatherService.getHourlyWeather(golfCourse, day)
        return res.status(200).json(response);
    } catch(err) {
        console.error(err);

        // Return error response with status/message
        res.status(err.status || 500).json({ error: error.message || 'Failed to fetch weather data' });
    }
}