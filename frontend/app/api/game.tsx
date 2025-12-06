import { LocalGame } from "../types/offline";
import api from "./api";

/**
 * Fetches a recommended game session based on course and player details.
 * @param {string} token Bearer authentication token for the API request.
 * @param {string} courseName Name of the golf course.
 * @param {Date} teeOffTime Tee-off time for the game.
 * @param {number} numHoles Number of holes to play.
 * @param {number} pperHole Average play time per hole (in minutes).
 * @returns {Promise<Object>} The recommended game session data from the API.
 * @throws {Error} If the request fails, throws an error with a descriptive message.
 */
export const getRecommendedGameSession = async (
  token: string,
  courseName: string,
  teeOffTime: Date,
  numHoles: number,
  pperHole: number,
) => {
  try {
    const response = await api.get("/game/getPlayableHoles", {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        courseName,
        teeOffTime,
        numHoles,
        pperHole,
      },
    });
    return response.data;
  } catch (err: any) {
    const message =
      err?.response?.data?.message ||
      err?.message ||
      "Getting recommended game failed.";
    throw new Error(message);
  }
};

/**
 * Sends a completed game to the backend API for persistence.
 * - Makes a POST request to `/game/complete` with the game payload.
 * - Returns the API response if successful.
 * - Throws an error with a descriptive message if the request fails.
 * @param {LocalGame} game - The completed game object to be sent to the server.
 * @param {string} token - JWT or auth token for request authorization.
 * @returns {Promise} The Axios response from the backend API.
 * @throws {Error} Will throw if the request fails, with the error message from the server or a fallback message.
 */
export const postCompletedGame = async (game: LocalGame, token: string) => {
  try {
    console.log("Game: ", game);
    const response = await api.post("/game/complete", game, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response;
  } catch (err: any) {
    const message =
      err?.response?.data?.message ||
      err?.message ||
      "Getting recommended game failed.";
    throw new Error(message);
  }
};

/**
 * Sends a request to get a list of games to the backend.
 * - Makes a GET request to `/game/games`.
 * - Returns the API response if successful.
 * - Throws an error with a descriptive message if the request fails.
 * @param {string} token - JWT or auth token for request authorization.
 * @returns {Promise} The Axios response from the backend API.
 * @throws {Error} Will throw if the request fails, with the error message from the server or a fallback message.
 */
export const getAllGames = async (userID: string, token: string) => {
  try {
    const response = await api.get("/game/games", {
      params: { userID },
      headers: { Authorization: `Bearer ${token}` },
    });
    return response;
  } catch (err: any) {
    const message =
      err?.response?.data?.message || err?.message || "Getting games failed.";
    throw new Error(message);
  }
};
