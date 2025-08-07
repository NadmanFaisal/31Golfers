const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

exports.getAllGolfcourses = async () => {
  try {
    const golfcourses = await prisma.golfCourse.findMany({
      orderBy: { name: "asc" }
    });
    return golfcourses
  } catch (err) {
    console.error("Error fetching golf courses:", err);
    throw err;
  }
};
