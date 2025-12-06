import { useState, useCallback, useEffect } from "react";
import { useFocusEffect } from "expo-router";
import { LocalGame } from "../types/offline";
import { getAllGames } from "../api/game";
import { getCurrentOfflineGame } from "../database/offlineGameStore";

export function useGames(userID: string, token: string) {
  const [currentOfflineGame, setCurrentOfflineGame] =
    useState<LocalGame | null>(null);
  const [previousGames, setPreviousGames] = useState<LocalGame[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const getPreviousGames = useCallback(async () => {
    if (!userID || !token) return;
    try {
      const response = await getAllGames(userID, token);
      if (response && response.status === 200) {
        const data = response.data;
        if (Array.isArray(data)) {
          setPreviousGames(data);
        } else if (data && Array.isArray((data as any).games)) {
          setPreviousGames((data as any).games);
        } else {
          console.warn("Unexpected response format for games:", data);
          setPreviousGames([]);
        }
      }
    } catch (err: any) {
      console.error("Error in getPreviousGames:", err);
    }
  }, [userID, token]);

  const refreshOfflineGame = useCallback(async () => {
    try {
      const g = await getCurrentOfflineGame();
      setCurrentOfflineGame(g);
    } catch (e) {
      console.error("Error fetching offline game", e);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        const g = await getCurrentOfflineGame();
        if (active) setCurrentOfflineGame(g);
      })();
      return () => {
        active = false;
      };
    }, []),
  );

  useEffect(() => {
    if (userID && token) {
      getPreviousGames();
    }
  }, [userID, token, getPreviousGames]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    Promise.all([getPreviousGames(), refreshOfflineGame()]).finally(() => {
      // Keep a small delay for better UX if needed, or just stop immediately
      setTimeout(() => setRefreshing(false), 2000);
    });
  }, [getPreviousGames, refreshOfflineGame]);

  return { currentOfflineGame, previousGames, refreshing, onRefresh };
}
