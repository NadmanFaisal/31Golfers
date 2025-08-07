const express = require('express');
const dotenv = require('dotenv')
const cron = require('node-cron')

const authRoutes = require('./routes/authRoutes')
const weatherRoutes = require("./routes/weatherRoutes")
const locationRoutes = require("./routes/locationRoutes")
const authenticateToken = require('./middleware/authMiddleware');

const weatherapi = require('./api/weather')
const { saveCourse, saveDailyForecast, saveHourlyForecasts, calculatePlayableHoles } = require('./services/weatherService');

// Global env configuration
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Mount user-related routes at /signup endpoint
app.use('/', authRoutes);

// Mount protected route group
app.use('/protected', authenticateToken)
app.use('/weather', authenticateToken, weatherRoutes)
app.use('/location', authenticateToken, locationRoutes)

/**
 * List of golf course locations, stored as a 
 * dictionary for the time being
 */
const locations = {
  'Army Golf Club': ['23.819077865220255', '90.41398771473996'],
  'Bangladesh Ordnance Factory Golf Club': ['24.0347943579793', '90.41460480992527'],
  'Bhatiary Golf and Country': ['22.42653547564263', '91.76631932523291'],
  'Bogra Golf Club': ['24.767497978715515', '89.3825549252833'],
  'Ghatail Golf Club': ['24.499120491192368', '89.99708652134241'],
  'Jessore Golf & Country Club': ['23.178229462110743', '89.16758981175471'],
  'Kurmitola Golf Club': ['23.799540125030667', '90.39626172526172'],
  'Mainamati Golf and Country Club': ['23.465426851934993', '91.12131861545646'],
  'Rangpur Golf Club': ['25.76368042808472', '89.22773867738677'],
  'Savar Golf Club': ['23.90823681902289', '90.26263391177037'],
};

// Function to fetch & save weather
async function fetchAndSaveWeather() {
  for (const locationName in locations) {
    const [lat, lon] = locations[locationName];
    try {
      const course = await saveCourse(locationName, lat, lon);

      const response = await weatherapi.get_weather(lat, lon, 7);
      console.log("Weathers: ", response.data.forecast.forecastday);
      const forecastDays = response.data.forecast.forecastday;

      for (const day of forecastDays) {
        const dailyForecast = await saveDailyForecast(locationName, course.id, day);
        await saveHourlyForecasts(dailyForecast.id, locationName, day.hour);
      }

      console.log(`Saved weather for ${locationName}`);
    } catch (error) {
      console.error(`Error saving weather for ${locationName}:`, error.message);
    }
  }
}

/**
 * Runs the fetchAndSaveWeather function at midnight 
 * everyday. 
 */

cron.schedule('0 0 0 * * *', fetchAndSaveWeather);

app.listen(PORT, (error) =>{
    if(!error) {
        console.log("Server is Successfully Running, and App is listening on port "+ PORT);
        // (async () => {
        //   const teeOffTime = new Date("2025-08-03T15:30:00");
        //   const result = await calculatePlayableHoles("Kurmitola Golf Club", teeOffTime, 18, 13);
        //   console.log(result);
        // })();
    }
    else 
        console.log("Error occurred, server can't start", error);
    }
);