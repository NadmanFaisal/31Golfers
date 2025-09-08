const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const { getTodaySunset, getHourlyPrecip, getTodaySunrise } = require("./weatherService");

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

  // Step 1: Get sunset and sunrise data for today
  const sunset = await getTodaySunset(courseName);
  const sunrise = await getTodaySunrise(courseName);

  // If the start time is at or after sunset, then there is no recommendation
  if (teeOffTime >= sunset || teeOffTime <= sunrise || sunrise >= sunset) {
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

/**
 * Saves a completed game into the database.
 *
 * - Validates the incoming payload for required fields.
 * - Normalizes players into Prisma-compatible composite `Player` objects.
 * - Derives the `ownerUserId` from the player marked as owner.
 * - Uses Prisma's `upsert` to either create a new game or update an existing one.
 * @param {Object} payload - Game data from the frontend.
 * @throws {Error} Will throw an error with statusCode `400` if the payload is invalid or missing required fields.
 * @returns {Promise<Object>} The saved game record from Prisma, containing all persisted fields.
 */
async function saveGame(payload) {
  console.log(payload);
  if (!payload || !payload.id || !payload.totalHoles || !payload.startedAt) {
   const err = new Error("Invalid payload: id, totalHoles, startedAt are required");
    err.statusCode = 400;
    throw err;
  }

  const startedAt = new Date(payload.startedAt);
  const endedAt   = new Date(payload.endedAt);
  const teeTime   = new Date(payload.teeTime);
  if (!startedAt) {
    const err = new Error("Invalid startedAt");
    err.statusCode = 400;
    throw err;
  }

  // Normalize players to Prisma composite `Player`
  const players = Array.isArray(payload.players) ? payload.players : [];
  const normalizedPlayers = players.map((p) => ({
    // ID of the player given by nanoid from frontend
    id: String(p.id),
    displayName: String(p.displayName ?? ""),
    // ID of the owner given by nanoid from frontend
    userId: p.userId ?? undefined,
    order: Number(p.order ?? 0),
    isOwner: p.isOwner ?? undefined,
  }));

  // The id of the player who created the game
  const ownerUserId =
    players.find((p) => p && p.isOwner && p.userId)?.userId ?? undefined;

    const strokesByPlayer =
    payload.strokesByPlayer && typeof payload.strokesByPlayer === "object"
      ? payload.strokesByPlayer
      : {};

  // Will update game if it already exists, else creates a new game in the DB
  const saved = await prisma.completedGame.upsert({
    // ID of the game
    where: { id: payload.id },
    create: {
      // ID of the game
      id: payload.id,
      totalHoles: Number(payload.totalHoles),
      startedAt,
      endedAt: endedAt ?? undefined,
      teeTime: teeTime ?? undefined,
      courseName: payload.courseName ?? undefined,
      players: normalizedPlayers,
      strokesByPlayer,
      ownerUserId,
    },
    update: {
      totalHoles: Number(payload.totalHoles),
      startedAt,
      endedAt: endedAt ?? undefined,
      teeTime: teeTime ?? undefined,
      courseName: payload.courseName ?? undefined,
      players: normalizedPlayers,
      strokesByPlayer,
      ownerUserId,
    },
  });

  return saved;
}

/**
 * Fetch all games (optionally filtered by userID)
 * @param {string=} userID - only return games that include this user
 */
async function getAllGames(userID) {
  
  // To find games where the user is owner, or one 
  // of the players 
  const where = userID
    ? {
        OR: [
          { ownerUserId: userID },
          { players: { some: { userId: userID } } }
        ],
      }
    : {};

  const games = await prisma.completedGame.findMany({
    where,
    orderBy: { startedAt: 'desc' },
    include: {
      players: {
        select: {
          id: true,
          displayName: true,
          userId: true,
        },
      },
    },
  });

  return games;
}

module.exports = {
  saveGame,
  calculatePlayableHoles,
  getAllGames,
}
