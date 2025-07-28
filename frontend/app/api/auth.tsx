import api from "./api";

export async function signupUser(email: string, username: string, password: string) {
    try {
        const response = await api.post('/user', {
            email, username, password, 
        })
        return response
    } catch (error: any) {
        const message =
          error?.response?.data?.message ||
          error?.message ||
          'Signup failed due to an unknown error.';
        throw new Error(message);
    }
}