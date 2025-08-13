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
        lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
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
  getTodaySunset,
  getHourlyPrecip,
  getWeather
};
