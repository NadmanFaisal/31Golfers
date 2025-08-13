const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
  * Method to return all the golf courses from the DB, 
  * ordered by ascending. 
  */
exports.getAllGolfcourses = async () => {
  try {
    // Finds all the golf courses from the 
    const golfcourses = await prisma.golfCourse.findMany({
      orderBy: { name: "asc" }
    });
    return golfcourses
  } catch (err) {
    console.error("Error fetching golf courses:", err);
    throw err;
  }
};
