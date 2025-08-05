import api from "./api";

/**
 * Fetch weather data from the backend
 * @param token JWT token
 * @param golfCourse Name of the golf course
 * @param day Day's weather that is needed
 * @returns {Promise<any>} Resolves with the weather data object returned from the backend.
 */
export async function getHourlyWeatherData(
  token: string,
  golfCourse: string,
  day: Date,
) {
  console.log("Token:", token);
  try {
    const response = await api.get("/weather/hourlyweather", {
      headers: { Authorization: `Bearer ${token}` },
      params: { golfCourse, day },
    });
    return response.data;
  } catch (err: any) {
    if (err.response) {
      console.error(
        "Backend responded with error:",
        err.response.status,
        err.response.data,
      );
    } else {
      console.error("Network or Axios error:", err.message);
    }
    throw err;
  }
}
