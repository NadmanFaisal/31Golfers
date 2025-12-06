import React, { useCallback, useEffect, useState } from "react";
import { SafeAreaView, Text, View, Alert } from "react-native";
import { LocalGame } from "../types/offline";
import {
  getCurrentOfflineGame,
  completeOfflineGame,
  setStrokeOffline,
  getOfflineGame,
} from "../database/offlineGameStore";
import { router, useFocusEffect } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { FinishGameButton } from "../components/ui/buttons/FinishGameButton";
import ScoreTable from "../components/features/ScoreTable";

import styles from "./gameInfoScreenStyles";


export default function GameInfoScreen() {
  const [token, setToken] = useState("");
  const [currentOfflineGame, setCurrentOfflineGame] =
    useState<LocalGame | null>();

  // Inline editing state
  const [editingCell, setEditingCell] = useState<{
    playerId: string;
    hole: number;
  } | null>(null);
  const [inputValue, setInputValue] = useState("");

  const startEdit = (
    playerId: string,
    hole: number,
    current?: number | null,
  ) => {
    setEditingCell({ playerId, hole });
    setInputValue(typeof current === "number" ? String(current) : "");
  };

  // Edit the values of the score cells
  const commitEdit = useCallback(async () => {
    if (!currentOfflineGame || !editingCell) return;

    if (inputValue.trim() === "") {
      setEditingCell(null);
      return;
    }

    const n = Number(inputValue);
    if (!Number.isFinite(n) || n <= 0) {
      Alert.alert("Enter a positive number");
      return;
    }

    try {
      await setStrokeOffline({
        gameId: currentOfflineGame.id,
        playerId: editingCell.playerId,
        holeNumber: editingCell.hole,
        strokes: n,
      });
      const refreshed = await getOfflineGame(currentOfflineGame.id);
      setCurrentOfflineGame(refreshed ?? null);
    } catch (e: any) {
      Alert.alert(e?.message ?? "Failed to save");
    } finally {
      setEditingCell(null);
    }
  }, [currentOfflineGame, editingCell, inputValue]);

  const finishGame = useCallback(() => {
    if (!currentOfflineGame) return;

    Alert.alert(
      "Finish Game?",
      "Are you sure you want to finish the game?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          style: "destructive", // iOS red button
          onPress: async () => {
            try {
              const result = await completeOfflineGame(
                currentOfflineGame.id,
                token,
              );

              if (!result || !result.game) {
                Alert.alert("Game could not be completed. Please try again.");
                return;
              }

              const { synced } = result;

              setCurrentOfflineGame(null);

              // 1. Guest Case:
              if (token === "GUEST") {
                Alert.alert(
                  "Game Finished locally",
                  "This game is local and will not be synced. Please join or log in to sync next games."
                );
              }
              // 2. Server Offline / Sync Failed Case:
              else if (!synced) {
                Alert.alert(
                  "Game Finished offline",
                  "You are offline or the server is unreachable. Game will be synced when online."
                );
              }
              // 3. Online & Synced Case:
              else {
                Alert.alert("Game finished! It has been synced to your history.");
              }

              router.dismissTo("/game");
            } catch (e: any) {
              Alert.alert(e?.message);
            }
          },
        },
      ],
      { cancelable: true },
    );
  }, [currentOfflineGame, token]);

  // Refetch token + game whenever this screen gains focus
  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        const fetchedToken = await SecureStore.getItemAsync("token");
        if (!fetchedToken) {
          router.dismissTo("/(auth)/login");
          return;
        }
        if (!active) return;
        setToken(fetchedToken);

        const fetchedGame = await getCurrentOfflineGame();
        if (!active) return;
        setCurrentOfflineGame(fetchedGame ?? null);
      })();
      return () => {
        active = false;
      };
    }, []),
  );

  return (
    <SafeAreaView>
      <View style={styles.mainContainer}>
        <View style={styles.scoreContainer}>
          <ScoreTable
            game={currentOfflineGame}
            editingCell={editingCell}
            inputValue={inputValue}
            setInputValue={setInputValue}
            commitEdit={commitEdit}
            startEdit={startEdit}
            isEditing={true}
          />
        </View>

        <View style={styles.buttonContainer}>
          <FinishGameButton
            height={50}
            width={175}
            text="Finish Game!"
            color="#0FBE41"
            pressedColor="#0f6e41"
            onPress={finishGame}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
