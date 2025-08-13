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
