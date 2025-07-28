const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Creates user, response 201 upon success
exports.create_user = async (req, res, next) => {
  try {
    const email = req.body.email
    const username = req.body.username
    const password = req.body.password

    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    })

    if(user) {
      return res.status(400).json({ message: 'Email already exists.' });
    }

    const newUser = await prisma.user.create({
      data: { email, username, password },
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create user' });
  }
};