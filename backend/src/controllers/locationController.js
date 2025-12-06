const locationService = require('../services/locationService');

/**
 * Controller for fetching all golf courses.
 * @function get_all_golfcourses
 * @param {Request} req Express request object.
 * @param {Response} res Express response object.
 * @returns {Promise<void>}
 */
exports.get_all_golfcourses = async (req, res) => {
  try {
    const response = await locationService.getAllGolfcourses()
    return res.status(200).json(response);
  } catch (err) {
    console.error(err);

    // Return error response with status/message
    res.status(err.status || 500).json({ error: err.message || 'Failed to fetch golfcourse data' });
  }
}
