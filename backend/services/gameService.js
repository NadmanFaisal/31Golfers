const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const { getTodaySunset, getHourlyPrecip } = require("./weatherService");


/**
 * Calculates the playable hours in a course given the 
 * start tee off time, and the number of holes the 
 * player wishes to play
 * @param {String} courseName Name of the golf course
 * @param {Date} teeOffTime Start time of the game
 * @param {Number} numHoles Number of holes to be played
 * @param {Number} pperHole Time taken to play per hole
 * @returns 
 */
async function calculatePlayableHoles(courseName, teeOffTime, numHoles, pperHole) {
  const pacePerHole = pperHole; // minutes per hole

  // Step 1: Get sunset for today
  const sunset = await getTodaySunset(courseName);

  // If the start time is at or after sunset, then there is no recommendation
  if (teeOffTime >= sunset) {
    return {
      courseName,
      teeOffTime,
      playableHoles: 0,
      finishTime: teeOffTime,
      gameTime: 0
    };
  }

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
  
  // Filter relevant hours again (safety)
  const relevantHours = hourlyPrecipData.filter(h =>
    h.time >= teeOffTime && h.time <= sunset
  );

  // Step 5: Find the worst precipitation in that window
  const maxPrecip = Math.max(...relevantHours.map(h => h.precip_mm), 0);

  let delayFactor = 1.0;
  if (maxPrecip > 5) delayFactor = 1.5;
  else if (maxPrecip > 0) delayFactor = 1.1;

  // Step 6: Calculate adjusted finish
  const adjustedMinutes = numHoles * pacePerHole * delayFactor;
  const adjustedFinish = new Date(teeOffTime.getTime() + adjustedMinutes * 60000);
  
  if (adjustedFinish <= sunset) {
    const durationOfGame = (adjustedFinish.getTime() - teeOffTime.getTime()) / 60000;
    return { coursename: courseName, teeofftime: teeOffTime, playableHoles: numHoles, finishTime: adjustedFinish, gameTime: durationOfGame };
  } else {
    const durationOfGame = (sunset.getTime() - teeOffTime.getTime()) / 60000;
    const availableMinutes = (sunset - teeOffTime) / 60000;
    const playableHoles = Math.floor(availableMinutes / (pacePerHole * delayFactor));
    return { coursename: courseName, teeofftime: teeOffTime, playableHoles, finishTime: sunset, gameTime: durationOfGame };
  }
}

module.exports = {
  calculatePlayableHoles
}