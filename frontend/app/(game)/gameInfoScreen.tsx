import { useEffect, useState } from "react";
import { SafeAreaView, Text } from "react-native";
import { LocalGame } from "../types/offline";
import { getCurrentOfflineGame } from "../database/offlineGameStore";
import { FinishGamenButton } from "../components/Buttons";
import { completeOfflineGame } from "../database/offlineGameStore";

export default function GameInfoScreen() {
  const [currentOfflineGame, setCurrentOfflineGame] =
    useState<LocalGame | null>();

  const getGame = async () => {
    const fetchedGame = await getCurrentOfflineGame();
    if (!fetchedGame) return;
    setCurrentOfflineGame(fetchedGame);
    console.log("Fetched game: ", fetchedGame);
  };

  const finishGame = () => {
    if (!currentOfflineGame) return;
    completeOfflineGame(currentOfflineGame?.id);
  };

  useEffect(() => {
    getGame();
  }, []);

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
