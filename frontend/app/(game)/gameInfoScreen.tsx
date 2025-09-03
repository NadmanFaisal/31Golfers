import { useCallback, useEffect, useState } from "react";
import { SafeAreaView, Text } from "react-native";
import { LocalGame } from "../types/offline";
import {
  getCurrentOfflineGame,
  completeOfflineGame,
} from "../database/offlineGameStore";
import { FinishGamenButton } from "../components/Buttons";
import { router, useFocusEffect } from "expo-router";
import * as SecureStore from "expo-secure-store";

export default function GameInfoScreen() {
  const [token, setToken] = useState("");
  const [currentOfflineGame, setCurrentOfflineGame] =
    useState<LocalGame | null>();

  const getToken = async () => {
    const fetchedToken = await SecureStore.getItemAsync("token");
    if (!fetchedToken) {
      router.dismissTo("/(auth)/login");
    } else {
      setToken(fetchedToken);
    }
    console.log("Token:", token);
  };

  const getGame = async () => {
    const fetchedGame = await getCurrentOfflineGame();
    if (!fetchedGame) return;
    setCurrentOfflineGame(fetchedGame);
    console.log("Fetched game: ", fetchedGame);
  };

  const finishGame = useCallback(async () => {
    if (!currentOfflineGame) return;
    try {
      await completeOfflineGame(currentOfflineGame.id, token); // await so we know it's done
      setCurrentOfflineGame(null); // reflect completion immediately
      alert("Game finished, We’ll sync it to the backend when online.");
      router.back(); // or router.replace("/home") etc.
    } catch (e: any) {
      alert(e?.message);
    }
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
        // console.log("Fetched game:", fetchedGame);
      })();
      return () => {
        active = false;
      };
    }, []),
  );

  return (
    <SafeAreaView>
      <Text>This is the game info screen</Text>
      <Text>Current game: {currentOfflineGame?.totalHoles}</Text>
      <FinishGamenButton
        height={50}
        width={175}
        text="Finish Game!"
        color="#0FBE41"
        pressedColor="#0f6e41"
        onPress={finishGame}
      />
    </SafeAreaView>
  );
}
