import api from "./api";

/**
 * Fetches all golf course locations from the API.
 * @param {string} token Bearer authentication token for the API request.
 * @returns {Promise<Object>} API response containing the list of golf course locations.
 * @throws {Error} If the request fails, throws an error with a descriptive message.
 */
export const getAllLocations = async (token: string) => {
  try {
    const response = await api.get("/location/golfcourses", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response;
  } catch (err: any) {
    const message =
      err?.response?.data?.message ||
      err?.message ||
      "Getting location failed.";
    throw new Error(message);
  }
};
