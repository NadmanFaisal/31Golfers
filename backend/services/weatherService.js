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

module.exports = {
  saveCourse,
  saveDailyForecast,
  saveHourlyForecasts,
};
