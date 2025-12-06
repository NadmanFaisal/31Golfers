const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

/**
 * Registers a new user.
 * 
 * - Checks if the email is already in use
 * - Hashes the password securely with bcrypt
 * - Stores the user in the database
 * 
 * @param {Object} param0 The user data: email, username, password
 * @returns {Object} Newly created user and JWT token
 */
exports.registerUser = async ({ email, username, password }) => {
  // Check if user already exists in the database
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw { status: 400, message: 'Email already exists.' };

  // Securely hash the user's password before storing
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await prisma.user.create({
    data: { email, username, password: hashedPassword },
  });

  // Generate a JWT token for the new user
  const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET_KEY);

  return { user: newUser, token };
};

/**
 * Logs in an existing user.
 * 
 * - Verifies that the user exists by email
 * - Compares the input password with the hashed password in the DB
 * - If valid, generates a JWT token
 * 
 * @param {Object} param0 The login credentials: email and password
 * @returns {Object} User data and a valid JWT token
 */
exports.loginUser = async ({ email, password }) => {
  // Look up user by email
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw { status: 404, message: 'User not found.' };

  // Compare hashed password with submitted password
  const match = await bcrypt.compare(password, user.password);
  if (!match) throw { status: 401, message: 'Invalid password.' };

  // Generate a JWT token if credentials are valid
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, { expiresIn: '48h' });

  return { user, token };
};
