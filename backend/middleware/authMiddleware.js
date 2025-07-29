const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')

dotenv.config()

/**
 * Middleware to authenticate JWT tokens from incoming API requests.
 * 
 * - Extracts the token from the request header (e.g., "Authorization: Bearer <token>")
 * - Verifies the token using the secret key
 * - Attaches the decoded payload to req.user
 * - Forwards the request to the next middleware or controller
 */
const authenticateToken = (req, res, next) => {
    const token = req.header(process.env.TOKEN_HEADER_KEY)?.replace("Bearer ", "");

    if (!token) {
        return res.status(401).json({ message: "Access token missing" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decoded;

        // forwards control to the next middleware/controllers
        next();
    } catch (error) {
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};

module.exports = authenticateToken;