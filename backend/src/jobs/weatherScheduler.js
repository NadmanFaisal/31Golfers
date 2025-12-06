const cron = require('node-cron');
const locations = require('../config/locations');
const { saveCourse, saveDailyForecast, saveHourlyForecasts, getWeather } = require('../services/weatherService');
const weatherapi = require('../api/weather');

// Function to fetch & save weather
async function fetchAndSaveWeather() {
    console.log("Starting scheduled weather fetch...");
    for (const locationName in locations) {
        const [lat, lon] = locations[locationName];
        try {
            // optimization: check if we already have weather for today
            // actually, maybe we want to fetch for the next few days anyway?
            // For now, let's keep the logic simple but add a check if needed.
            // The requirement says "weather api fetching is limited per month, so use accordingly".
            // So we SHOULD check if we have data today before fetching.

            const today = new Date();
            const todayStr = today.toISOString().split('T')[0];

            // Check if we have data for 2 days from now (API only returns 3 days: Today, +1, +2)
            // If we check +3, it will never exist, causing infinite refetches.
            const futureDate = new Date(today);
            futureDate.setDate(today.getDate() + 2);
            const futureDateStr = futureDate.toISOString().split('T')[0];

            let shouldFetch = false;

            // Check Today
            try {
                await getWeather(locationName, todayStr);
            } catch (e) {
                console.log(`Missing weather for ${locationName} today. Will fetch.`);
                shouldFetch = true;
            }

            // Check Future (Day + 2) only if we have today
            if (!shouldFetch) {
                try {
                    await getWeather(locationName, futureDateStr);
                    console.log(`Weather for ${locationName} exists for today and ${futureDateStr}. Skipping fetch.`);
                } catch (e) {
                    console.log(`Missing weather for ${locationName} on ${futureDateStr}. Will fetch to maintain buffer.`);
                    shouldFetch = true;
                }
            }

            if (!shouldFetch) continue;

            // Fetch 3 days as verified by API capability
            const response = await weatherapi.get_weather(lat, lon, 3);
            // console.log("Weathers: ", response.data.forecast.forecastday);
            const forecastDays = response.data.forecast.forecastday;
            const timezone = response.data.location.tz_id;

            // Updated saveCourse to include timezone
            const course = await saveCourse(locationName, lat, lon, timezone);

            for (const day of forecastDays) {
                const dailyForecast = await saveDailyForecast(locationName, course.id, day);
                await saveHourlyForecasts(dailyForecast.id, locationName, day.hour);
            }

            console.log(`Saved weather for ${locationName}`);
        } catch (error) {
            console.error(`Error saving weather for ${locationName}:`, error.stack || error);
        }
    }
}

/**
 * Initializes the weather scheduler.
 * Runs at midnight every day.
 */
function initScheduler() {
    // Run immediately on startup to ensure data availability
    console.log("Running initial weather check...");
    fetchAndSaveWeather();

    // Schedule task to run at 00:00 (midnight)
    cron.schedule('0 0 0 * * *', fetchAndSaveWeather, { timezone: "Asia/Dhaka" });
    console.log("Weather scheduler initialized.");
}

module.exports = { initScheduler, fetchAndSaveWeather };
