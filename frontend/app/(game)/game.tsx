import React, { useEffect, useState } from "react";
import { Pressable, SafeAreaView, Text } from "react-native";
import { getCurrentOfflineGame } from "../database/offlineGameStore";
import { LocalGame } from "../types/offline";
import { router } from "expo-router";

export default function GameScreen() {
  const [currentOfflineGame, setCurrentOfflineGame] =
    useState<LocalGame | null>();

  const getGame = async () => {
    const fetchedGame = await getCurrentOfflineGame();
    if (!fetchedGame) return;
    setCurrentOfflineGame(fetchedGame);
    console.log("Fetched game: ", fetchedGame);
  };

  const gotoGameInfoScreen = () => {
    router.push("/gameInfoScreen");
  };

  useEffect(() => {
    getGame();
  }, []);

  return (
    <SafeAreaView>
      <Pressable onPress={() => gotoGameInfoScreen()}>
        <Text>This is the game screen</Text>
        <Text>Game: {currentOfflineGame?.totalHoles}</Text>
      </Pressable>
    </SafeAreaView>
  );
}
