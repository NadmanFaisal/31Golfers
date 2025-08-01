const { api } = require('./api')
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const API_KEY = process.env.WEATHER_API_KEY

/**
 * Fetch 7 days weather forecasts from weatherAPI 
 * @param {number|string} lat Latitude of the location
 * @param {number|string} lon Longitude of the location
 * @param {Promise<Object>} days No.of days of forecasts required
 * @returns 
 */
exports.get_weather = async (lat, lon, days) => {

  try {
    const response = await api.get(
      `/forecast.json?key=${API_KEY}&q=${lat},${lon}&days=${days}`
    );
    return response
  } catch (error) {
    console.error(`Error fetching weather for ${locationName}:`, error.message);
  }
}