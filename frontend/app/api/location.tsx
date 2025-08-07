import api from "./api";

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
