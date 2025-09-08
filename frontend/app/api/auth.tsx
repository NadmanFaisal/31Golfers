import api from "./api";

/**
 * Sends a signup request to the API with the provided user details.
 * @param {string} email User's email address.
 * @param {string} username Desired username for the account.
 * @param {string} password User's chosen password.
 * @returns {Promise<Object>} API response object.
 * @throws {Error} If signup fails, throws an error with a descriptive message.
 */
export async function signupUser(
  email: string,
  username: string,
  password: string,
) {
  try {
    const response = await api.post("/signup", {
      email,
      username,
      password,
    });
    return response;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Signup failed due to an unknown error.";
    throw new Error(message);
  }
}

/**
 * Sends a login request to the API with the provided credentials.
 * @param {string} email User's email address.
 * @param {string} password User's account password.
 * @returns {Promise<Object>} API response object.
 * @throws {Error} If login fails, throws an error with a descriptive message.
 */
export async function loginUser(email: string, password: string) {
  try {
    const response = await api.post("/login", {
      email,
      password,
    });
    return response;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Login failed due to an unknown error.";
    throw new Error(message);
  }
}
