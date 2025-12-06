const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const moment = require('moment-timezone');

/**
 * Create or update a golf course in the database.
 * @param {string} name The golf course name (must be unique)
 * @param {string|number} lat Latitude
 * @param {string|number} lon Longitude
 * @param {string} timezone IANA timezone ID (e.g., "Asia/Dhaka")
 * @returns {Promise<Object>} The saved course record
 */
async function saveCourse(name, lat, lon, timezone = 'UTC') {
  // upsert() so it will insert if not found, otherwise update.
  return prisma.golfCourse.upsert({
    where: { name },
    // If records exist, update timezone just in case
    update: { timezone },
    create: {
      name,
      latitude: parseFloat(lat),
      longitude: parseFloat(lon),
      timezone
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
      chance_of_rain: forecastDay.day.daily_chance_of_rain,
      chance_of_snow: forecastDay.day.daily_chance_of_snow,
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
    // Use time_epoch (seconds) * 1000 for absolute UTC Date
    // This ignores the localized "time" string, ensuring global correctness
    time: new Date(hour.time_epoch * 1000),
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
 * Fetches given course's sunset time for a specific date
 * @param {String} courseName Name of the golf course
 * @param {Date} date The date to check
 * @returns {Promise<Date>} Date object representing sunset time
 */
/**
 * Fetches given course's sunset time for a specific date, accounting for timezone.
 * @param {String} courseName Name of the golf course
 * @param {Date} date The date to check (UTC or with specific TZ)
 * @returns {Promise<Date>} Date object representing sunset time (absolute UTC timestamp)
 */
async function getSunset(courseName, date) {
  // We need to query by the *day* in the course's timezone.
  // 1. Get the course to find its timezone
  const course = await prisma.golfCourse.findUnique({
    where: { name: courseName },
    select: { timezone: true }
  });

  const tz = course ? course.timezone : 'UTC';

  // 2. Convert the input date to the start of day in that timezone
  // This ensures we match the "Date" stored in DailyForecast which is usually midnight00:00
  // Actually, DailyForecast.date is stored as JS Date from the API's "YYYY-MM-DD" string.
  // The API returns "2025-12-06", which JS parses as UTC midnight? No, typically UTC.
  // Let's assume DailyForecast.date matches the date string provided by API.

  // We need to find the DailyForecast that corresponds to the target date.
  // The safest way is to range query around the target date.
  const targetMoment = moment(date).tz(tz);
  const targetDateStr = targetMoment.format('YYYY-MM-DD');

  const startOfDay = new Date(targetDateStr); // UTC midnight of that string
  const endOfDay = new Date(startOfDay);
  endOfDay.setDate(endOfDay.getDate() + 1);

  const daily = await prisma.dailyForecast.findFirst({
    where: {
      courseName,
      date: {
        gte: startOfDay,
        lt: endOfDay
      }
    },
    select: { sunset: true }
  });

  if (!daily) throw new Error(`No sunset data found for ${courseName} on ${targetDateStr}`);

  // 3. Parse the localized sunset string ("05:12 PM") combined with the date string into a moment in the correct TZ
  // e.g. "2025-12-06 05:12 PM" in "Asia/Dhaka" context
  const sunsetTimeString = `${targetDateStr} ${daily.sunset}`;
  // moment format for "05:12 PM" is "hh:mm A"
  const sunsetMoment = moment.tz(sunsetTimeString, "YYYY-MM-DD hh:mm A", tz);

  return sunsetMoment.toDate(); // Return native JS Date (UTC)
}

/**
 * Fetches given course's sunrise time for a specific date, accounting for timezone.
 * @param {String} courseName Name of the golf course
 * @param {Date} date The date to check
 * @returns {Promise<Date>} Date object representing sunrise time (absolute UTC timestamp)
 */
async function getSunrise(courseName, date) {
  const course = await prisma.golfCourse.findUnique({
    where: { name: courseName },
    select: { timezone: true }
  });

  const tz = course ? course.timezone : 'UTC';
  const targetMoment = moment(date).tz(tz);
  const targetDateStr = targetMoment.format('YYYY-MM-DD');

  const startOfDay = new Date(targetDateStr);
  const endOfDay = new Date(startOfDay);
  endOfDay.setDate(endOfDay.getDate() + 1);

  const daily = await prisma.dailyForecast.findFirst({
    where: {
      courseName,
      date: {
        gte: startOfDay,
        lt: endOfDay
      }
    },
    select: { sunrise: true }
  });

  if (!daily) throw new Error(`No sunrise data found for ${courseName} on ${targetDateStr}`);

  const sunriseTimeString = `${targetDateStr} ${daily.sunrise}`;
  const sunriseMoment = moment.tz(sunriseTimeString, "YYYY-MM-DD hh:mm A", tz);

  return sunriseMoment.toDate();
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
 * Get the date range filter for today, tomorrow, or a specific date.
 * @param {string} dayParam - "today", "tomorrow", or "YYYY-MM-DD"
 * @returns {{gte: Date, lt: Date}} MongoDB-compatible date range
 */
function getDateUpperAndLowerRange(dayParam) {
  let date;

  if (dayParam === "today") {
    date = new Date();
  } else if (dayParam === "tomorrow") {
    date = new Date();
    date.setDate(date.getDate() + 1);
  } else {
    // Parse YYYY-MM-DD format
    date = new Date(dayParam);
    if (isNaN(date.getTime())) {
      throw new Error("Invalid date format. Use 'today', 'tomorrow', or 'YYYY-MM-DD'.");
    }
  }

  const start = new Date(date.setHours(0, 0, 0, 0));
  const end = new Date(start);
  end.setDate(start.getDate() + 1);

  return { gte: start, lt: end };
}

/**
 * Fetch weather for a given golf course and day.
 * @param {string} golfCourse - Name of the golf course
 * @param {string} day - "today", "tomorrow", or "YYYY-MM-DD"
 * @returns {Promise<Object>} The daily forecast with hourly forecasts
 */
async function getWeather(golfCourse, day) {
  console.log("In get weather")
  if (!golfCourse) throw new Error("golfCourse parameter is required");

  const dateRange = getDateUpperAndLowerRange(day);

  const daily = await prisma.dailyForecast.findFirst({
    where: {
      courseName: golfCourse,
      date: dateRange
    },
    include: {
      hourlyForecasts: true
    }
  });

  if (!daily) {
    throw new Error(`No forecast found for ${golfCourse} on ${day}`);
  }

  console.log(daily)
  return daily;
}

module.exports = {
  saveCourse,
  saveDailyForecast,
  saveHourlyForecasts,
  getSunset,
  getHourlyPrecip,
  getSunrise,
  getWeather
};
