const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkWeather() {
    try {
        const courseName = "Army Golf Club";
        console.log(`Checking weather for ${courseName}...`);

        // Get ALL forecasts for this course
        const allDaily = await prisma.dailyForecast.findMany({
            where: {
                courseName: courseName,
            },
            include: {
                hourlyForecasts: true
            }
        });

        if (allDaily.length === 0) {
            console.log("No daily forecasts found AT ALL for this course.");
            return;
        }

        console.log(`Found ${allDaily.length} daily forecasts.`);
        allDaily.forEach(daily => {
            console.log(`\n--- Date: ${daily.date} ---`);
            console.log(`Total hourly: ${daily.hourlyForecasts.length}`);
            // Show ALL samples for the first day only
            if (daily === allDaily[0]) {
                daily.hourlyForecasts.forEach(h => {
                    console.log(`Time: ${new Date(h.time).toISOString()} | Temp: ${h.temp_c}`);
                });
            }
        });
    } catch (error) {
        console.error("Error:", error);
    } finally {
        await prisma.$disconnect();
    }
}

checkWeather();
