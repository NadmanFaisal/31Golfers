const authService = require('../services/authServices');

/**
 * Controller to handle user registration.
 * 
 * - Receives user data from the request body
 * - Calls the auth service to register the user
 * - Returns the created user and a JWT token on success
 */
exports.create_user = async (req, res) => {
  try {
    // User creation done in service layer
    const { user, token } = await authService.registerUser(req.body);

    // Responds with the new user and their JWT token
    res.status(201).json({ user, token });
  } catch (error) {
    console.error(error);

    // Return error response with status/message
    res.status(error.status || 500).json({ error: error.message || 'Failed to register' });
  }
};

/**
 * Controller to handle user login.
 * 
 * - Validates user credentials via the auth service
 * - If valid, returns the user and a signed JWT token
 * - If invalid or an error occurs, returns appropriate 
 *   message
 */
exports.login_user = async (req, res) => {
  console.log('login reached')
  try {
    // Login logic taken care by service layer
    const { user, token } = await authService.loginUser(req.body);

    // Respond with user data and a valid JWT token
    res.status(200).json({ user, token });
  } catch (error) {
    console.error(error);

    // Return error response
    res.status(error.status || 500).json({ error: error.message || 'Login failed' });
  }
};
