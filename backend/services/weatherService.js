const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Create or update a golf course in the database.
 * @param {string} name The golf course name (must be unique)
 * @param {string|number} lat Latitude
 * @param {string|number} lon Longitude
 * @returns {Promise<Object>} The saved course record
 */
async function saveCourse(name, lat, lon) {
  // upsert() so it will insert if not found, otherwise update.
  return prisma.golfCourse.upsert({
    where: { name },
    // If records exist, don't update
    update: {},
    create: {
      name,
      latitude: parseFloat(lat),
      longitude: parseFloat(lon),
    },
  });
}

/**
 * Save a single day's forecast for a golf course.
 * @param {string} courseName - Name of the golf course
 * @param {string} courseId - ID of the course (MongoDB ObjectId)
 * @param {Object} forecastDay - Forecast object from Weather API
 * @returns {Promise<Object>} - The saved daily forecast record
 */
async function saveDailyForecast(courseName, courseId, forecastDay) {
  return prisma.dailyForecast.create({
    data: {
      date: new Date(forecastDay.date),
      sunrise: forecastDay.astro.sunrise,
      sunset: forecastDay.astro.sunset,
      courseName,
      avgtemp_c: forecastDay.day.avgtemp_c,
      maxwind_kph: forecastDay.day.maxwind_kph,
      totalprecip_mm: forecastDay.day.totalprecip_mm,
      avghumidity: forecastDay.day.avghumidity,
      uv: forecastDay.day.uv,

      // Link forecast to the course
      course: { connect: { id: courseId } },
    },
  });
}

/**
 * Save all hourly forecasts for a specific day.
 * @param {string} dailyForecastId ID of the related daily forecast
 * @param {string} courseName Name of the golf course
 * @param {Array} hourlyData Array of hourly forecast objects from Weather API
 */
async function saveHourlyForecasts(dailyForecastId, courseName, hourlyData) {
  const hourlyForecasts = hourlyData.map(hour => ({
    time: new Date(hour.time),
    temp_c: hour.temp_c,
    courseName,
    wind_kph: hour.wind_kph,
    precip_mm: hour.precip_mm,
    humidity: hour.humidity,
    uv: hour.uv,

    // Foreign key link to daily forecast
    dailyForecastId,
  }));

  // createMany() for bulk insert to improve performance.
  await prisma.hourlyForecast.createMany({ data: hourlyForecasts });
}

/**
 * Fetches given course's current sunset time
 * @param {String} courseName Name of the golf course
 * @returns {Promise<Date>} Date object representing today's sunset time for the given course
 */
async function getTodaySunset(courseName) {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // midnight

  // Fetches the first instance of the day
  const daily = await prisma.dailyForecast.findFirst({

    // Queries based on course name and date
    where: {
      courseName,
      date: {
        gte: today,
        lt: new Date(today.getTime() + 24*60*60*1000)
      }
    },
    select: { sunset: true }
  });

  if (!daily) throw new Error(`No daily forecast found for ${courseName} today`);

  // Converts sunset data to Date
  const sunsetParts = daily.sunset.split(/[: ]/); // ["6", "32", "PM"]
  let sunsetHour = parseInt(sunsetParts[0], 10);
  const sunsetMinute = parseInt(sunsetParts[1], 10);
  const ampm = sunsetParts[2];

  if (ampm === "PM" && sunsetHour !== 12) sunsetHour += 12;
  if (ampm === "AM" && sunsetHour === 12) sunsetHour = 0;

  const sunsetDate = new Date(today);
  sunsetDate.setHours(sunsetHour, sunsetMinute, 0, 0);

  return sunsetDate;
}

/**
 * Fetches the hourly precipitation from a given start time 
 * to a given end time
 * @param {String} courseName Name of the golf course
 * @param {Date} teeOffTime Start time for playing
 * @param {Date} finishEstimate Estimated finish time
 * @returns 
 */
async function getHourlyPrecip(courseName, teeOffTime, finishEstimate) {
  const hourly = await prisma.hourlyForecast.findMany({
    where: {
      courseName,
      time: {
        gte: teeOffTime,
        lte: finishEstimate
      }
    },
    select: { time: true, precip_mm: true }
  });

  return hourly;
}

/**
 * Calculates the playable hours in a course given the 
 * start tee off time, and the number of holes the 
 * player wishes to play
 * @param {String} courseName Name of the golf course
 * @param {Date} teeOffTime Start time of the game
 * @param {Number} numHoles Number of holes to be played
 * @param {Number} pacePerHole Time taken to play per hole
 * @returns 
 */
async function calculatePlayableHoles(courseName, teeOffTime, numHoles, pacePerHole) {
  const pacePerHole = pacePerHole; // minutes per hole

  // Step 1: Get sunset for today
  const sunset = await getTodaySunset(courseName);

  // Step 2: Get baseline finish time (no weather)
  const baselineMinutes = numHoles * pacePerHole;
  const baselineFinish = new Date(teeOffTime.getTime() + baselineMinutes * 60000);

  // Step 3: Get hourly precip data only in that play window
  const hourlyPrecipData = await getHourlyPrecip(
    courseName,
    teeOffTime,
    baselineFinish < sunset ? baselineFinish : sunset
  );

  // Step 4: Run our playable holes estimate
  return estimatePlayableHoles(
    teeOffTime,
    numHoles,
    pacePerHole,
    sunset,
    hourlyPrecipData
  );
}

/**
 * Estimates how many holes the player can play 
 * given relevant weather data of that particular course 
 * and Date
 * @param {Date} teeOffTime Start time of the game
 * @param {Number} numHoles Number of holes the player wishes to play
 * @param {Number} pacePerHole Time taken per hole
 * @param {Date} sunset Time of sunset
 * @param {Array<{time: Date, precip_mm: number}>} hourlyPrecipData Hourly precipitation data for the tee-off to finish time window
 * @returns 
 */
function estimatePlayableHoles(teeOffTime, numHoles, pacePerHole, sunset, hourlyPrecipData) {
  // Filter relevant hours again (safety)
  const relevantHours = hourlyPrecipData.filter(h =>
    h.time >= teeOffTime && h.time <= sunset
  );

  // Find the worst precipitation in that window
  const maxPrecip = Math.max(...relevantHours.map(h => h.precip_mm), 0);

  let delayFactor = 1.0;
  if (maxPrecip > 5) delayFactor = 1.5;
  else if (maxPrecip > 0) delayFactor = 1.1;

  // Calculate adjusted finish
  const adjustedMinutes = numHoles * pacePerHole * delayFactor;
  const adjustedFinish = new Date(teeOffTime.getTime() + adjustedMinutes * 60000);

  if (adjustedFinish <= sunset) {
    return { playableHoles: numHoles, finishTime: adjustedFinish };
  } else {
    const availableMinutes = (sunset - teeOffTime) / 60000;
    const playableHoles = Math.floor(availableMinutes / (pacePerHole * delayFactor));
    return { playableHoles, finishTime: sunset };
  }
}

module.exports = {
  saveCourse,
  saveDailyForecast,
  saveHourlyForecasts,
  estimatePlayableHoles,
  getTodaySunset,
  getHourlyPrecip,
  calculatePlayableHoles
};
