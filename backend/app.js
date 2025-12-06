const express = require('express');
const dotenv = require('dotenv');

// Global env configuration
dotenv.config();

const { initScheduler } = require('./src/jobs/weatherScheduler');

// Import Routes
const authRoutes = require('./src/routes/authRoutes');
const weatherRoutes = require("./src/routes/weatherRoutes");
const locationRoutes = require("./src/routes/locationRoutes");
const gameRoutes = require("./src/routes/gameRoutes");

const authenticateToken = require('./src/middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Mount user-related routes at /signup endpoint
app.use('/', authRoutes);

// Mount protected route group
app.use('/protected', authenticateToken);
app.use('/weather', authenticateToken, weatherRoutes);
app.use('/location', authenticateToken, locationRoutes);
app.use('/game', authenticateToken, gameRoutes);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// Initialize Cron Jobs
initScheduler();

app.listen(PORT, (error) => {
  if (!error) {
    console.log("Server is Successfully Running, and App is listening on port " + PORT);
  } else {
    console.log("Error occurred, server can't start", error);
  }
});
