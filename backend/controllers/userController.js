const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const prisma = new PrismaClient();


/**
 * Creates a new user and returns a JWT token upon successful registration.
 * 
 *  - Checks if the email is already registered
 *  - Creates a new user in the database
 *  - Signs a JWT with the new user's ID
 *  - Returns the new user and the token in the response
 * 
 * @param {object} req Express request object
 * @param {object} res Express response object
 * @returns {Response} JSON containing the new user and JWT token
 */
exports.create_user = async (req, res) => {
  try {
    const email = req.body.email
    const username = req.body.username
    const password = req.body.password

    /**
     * Queries to find if user with the same email
     * exists. 
     */
    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    })

    if(user) {
      return res.status(400).json({ message: 'Email already exists.' });
    }

    // Hashes the password using bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await prisma.user.create({
      data: { 
        email: email, 
        username: username, 
        password: hashedPassword },
    });

    // Creates the JWT token for the user with userID
    const payload = { userId: newUser.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '48h' });
    
    res.status(201).json({newUser, token});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create user' });
  }
};