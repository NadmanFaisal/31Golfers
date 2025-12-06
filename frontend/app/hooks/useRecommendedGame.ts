import { useState, useCallback, useEffect } from "react";
import { getRecommendedGameSession } from "../api/game";

export function useRecommendedGame(
  token: string,
  location: string,
  teeOffDate: Date,
) {
  const [recommendedGame, setRecommendedGame] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendedGame = useCallback(async () => {
    if (!token || !location || !teeOffDate) return;

    setLoading(true);
    setError(null);
    try {
      console.log("Fetching recommended game for:", location, teeOffDate);
      // Hardcoded 18 holes and 13 handicap as per original implementation
      const response = await getRecommendedGameSession(
        token,
        location,
        teeOffDate,
        18,
        13,
      );

      setRecommendedGame(response);
      console.log("Recommended game fetched:", response);
    } catch (err: any) {
      console.error("Error in fetchRecommendedGame:", err);
      setError("Data not available for this date.");
      setRecommendedGame(null);
    } finally {
      setLoading(false);
    }
  }, [token, location, teeOffDate]);

  useEffect(() => {
    fetchRecommendedGame();
  }, [fetchRecommendedGame]);

  return {
    recommendedGame,
    loading,
    error,
    refreshRecommendedGame: fetchRecommendedGame,
  };
}
