import { useCallback, useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { LocalGame } from "../types/offline";
import {
  getCurrentOfflineGame,
  completeOfflineGame,
  setStrokeOffline,
  getOfflineGame,
} from "../database/offlineGameStore";
import { FinishGamenButton } from "../components/Buttons";
import { router, useFocusEffect } from "expo-router";
import * as SecureStore from "expo-secure-store";

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
              const game = await completeOfflineGame(
                currentOfflineGame.id,
                token,
              );
              if (!game) {
                Alert.alert("Game could not be completed. Please try again.");
                return;
              }
              setCurrentOfflineGame(null);
              Alert.alert(
                "Game finished. We’ll sync it to the backend when online.",
              );
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
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator
            contentContainerStyle={styles.tableWrap}
            style={{ flex: 1 }}
          >
            <View>
              {/* Header row */}
              <View style={styles.headerRow}>
                <View style={[styles.holeHeaderCell, styles.headerCell]}>
                  <Text style={styles.headerText}>Hole</Text>
                </View>
                {(currentOfflineGame?.players ?? []).map((p) => (
                  <View
                    key={p.id}
                    style={[styles.playerHeaderCell, styles.headerCell]}
                  >
                    <Text style={styles.headerText} numberOfLines={1}>
                      {p.displayName}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Body rows, one row per hole */}
              {Array.from(
                { length: currentOfflineGame?.totalHoles || 0 },
                (_, i) => i + 1,
              ).map((hole) => (
                <View key={`row-${hole}`} style={styles.bodyRow}>
                  {/* Hole index */}
                  <View style={styles.holeCell}>
                    <Text style={styles.bodyText}>{hole}</Text>
                  </View>

                  {/* One score cell per player, with inline editable */}
                  {(currentOfflineGame?.players ?? []).map((p, colIdx) => {
                    const strokes =
                      currentOfflineGame?.strokesByPlayer?.[p.id] || [];
                    const val = strokes[hole - 1];
                    const isEditing =
                      editingCell?.playerId === p.id &&
                      editingCell?.hole === hole;

                    if (isEditing) {
                      return (
                        <View
                          key={`${p.id}-${hole}`}
                          style={[
                            styles.scoreCell,
                            colIdx === 0 ? styles.firstScoreCol : undefined,
                          ]}
                        >
                          <TextInput
                            autoFocus
                            value={inputValue}
                            onChangeText={setInputValue}
                            keyboardType="number-pad"
                            returnKeyType="done"
                            onSubmitEditing={commitEdit}
                            onBlur={commitEdit}
                            style={styles.cellInput}
                            placeholder="–"
                            placeholderTextColor="#999"
                            maxLength={2}
                          />
                        </View>
                      );
                    }

                    return (
                      <TouchableOpacity
                        key={`${p.id}-${hole}`}
                        activeOpacity={0.6}
                        onPress={() => startEdit(p.id, hole, val)}
                        style={[
                          styles.scoreCell,
                          colIdx === 0 ? styles.firstScoreCol : undefined,
                        ]}
                      >
                        <Text style={styles.bodyText}>
                          {typeof val === "number" ? String(val) : "–"}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        <View style={styles.buttonContainer}>
          <FinishGamenButton
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
