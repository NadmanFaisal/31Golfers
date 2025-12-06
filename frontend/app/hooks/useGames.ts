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
        // If guest or offline, or just in general, we might want to mix offline pending games
        // into the list so the user sees them.
        let pending: LocalGame[] = [];
        try {
            const { getPendingGames } = require("../database/offlineGameStore");
            pending = await getPendingGames();
        } catch (e) {
            console.warn("Failed to load pending games", e);
        }

        if (!userID || !token || token === "GUEST") {
            setPreviousGames(pending);
            return;
        }

        // If Authenticated, try to sync pending games before fetching history
        if (userID && token && token !== "GUEST") {
            try {
                const { retrySyncPendingGames } = require("../database/offlineGameStore");
                // Run in background so we don't block the UI fetch completely? 
                // Or await it to ensure list is up to date?
                // Awaiting it is safer to show the newly synced game in the list.
                await retrySyncPendingGames(token, userID);
            } catch (e) {
                console.warn("Auto-sync failed in useGames", e);
            }
        }

        try {
            const response = await getAllGames(userID, token);
            if (response && response.status === 200) {
                const data = response.data;
                let onlineGames: LocalGame[] = [];
                if (Array.isArray(data)) {
                    onlineGames = data;
                } else if (data && Array.isArray((data as any).games)) {
                    onlineGames = (data as any).games;
                } else {
                    console.warn("Unexpected response format for games:", data);
                }

                // If we synced successfully, pending list *should* be empty or smaller.
                // We should re-read pending list just in case some failed.
                let remainingPending: LocalGame[] = [];
                try {
                    const { getPendingGames } = require("../database/offlineGameStore");
                    remainingPending = await getPendingGames();
                } catch (e) { }

                // Merge (deduping might be needed if sync happened but ID is same? 
                // Usually synced games are removed from pending).
                setPreviousGames([...remainingPending, ...onlineGames]);
            }
        } catch (err: any) {
            console.error("Error in getPreviousGames:", err);
            // If offline, at least show pending
            setPreviousGames(pending);
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
