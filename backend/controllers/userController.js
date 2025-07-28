const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Creates user, response 201 upon success
exports.create_user = async (req, res, next) => {
  try {
    const email = req.body.email
    const name = req.body.name

    const user = await prisma.user.create({
      data: { email, name },
    });

    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create user' });
  }
};