import api from "./api";

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
