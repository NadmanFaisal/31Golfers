import api from "./api";

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

// export async function validateToken(token: string) {
//   try {
//     const response = await api.get('/protected', {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     return response.status === 200
//   } catch (error) {
//     console.error('Token validation failed:', error);
//     return false;
//   }
// }
