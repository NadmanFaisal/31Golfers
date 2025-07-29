const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')

dotenv.config()

const authenticateToken = (req, res, next) => {
    const token = req.header(process.env.TOKEN_HEADER_KEY)?.replace("Bearer ", "");

    if (!token) {
        return res.status(401).json({ message: "Access token missing" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};

module.exports = authenticateToken;