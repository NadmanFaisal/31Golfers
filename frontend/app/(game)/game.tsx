import React, { useEffect, useState } from "react";
import { SafeAreaView, Text } from "react-native";
import { getCurrentOfflineGame } from "../database/offlineGameStore";
import { LocalGame } from "../types/offline";

export default function GameScreen() {
  const [game, setGame] = useState<LocalGame | null>();

  const getGame = async () => {
    const fetchedGame = await getCurrentOfflineGame();
    if (!fetchedGame) return;
    setGame(fetchedGame);
    console.log("Fetched game: ", fetchedGame);
  };

  useEffect(() => {
    getGame();
  }, []);

  return (
    <SafeAreaView>
      <Text>This is the game screen</Text>
      <Text>Game: {game?.totalHoles}</Text>
    </SafeAreaView>
  );
}
