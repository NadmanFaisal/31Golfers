const dotenv = require('dotenv');
const jwt = require('jsonwebtoken')

dotenv.config();

exports.generate_token = async (req, res, next) => {
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    let data = {
        time: Date(),
        userId: 12,
    }

    const token = jwt.sign(data, jwtSecretKey);

    res.send(token)
}

exports.validate_token = async (req, res, next) => {
    let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
    let jwtSecretKey = process.env.JWT_SECRET_KEY;

    try {
        const token = req.header(tokenHeaderKey)?.replace("Bearer ", "");

        const verified = jwt.verify(token, jwtSecretKey);
        if (verified) {
            return res.send("Successfully Verified");
        } else {
            return res.status(401).send(error);
        }
    } catch (error) {
        return res.status(401).send(error);
    }
}