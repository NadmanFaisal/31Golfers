const { PrismaClient } = require('@prisma/client');
require('dotenv').config();
const prisma = new PrismaClient();

async function checkDB() {
    console.log("Checking DB counts...");
    const courseCount = await prisma.golfCourse.count();
    const forecastCount = await prisma.dailyForecast.count();

    console.log(`GolfCourses: ${courseCount}`);
    console.log(`DailyForecasts: ${forecastCount}`);

    if (courseCount > 0) {
        const courses = await prisma.golfCourse.findMany({ select: { name: true } });
        console.log("Courses:", courses.map(c => c.name));
    }

    if (forecastCount > 0) {
        const sample = await prisma.dailyForecast.findFirst();
        console.log("Sample Forecast:", JSON.stringify(sample, null, 2));
    }
}

checkDB()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
