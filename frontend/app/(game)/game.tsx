import React, { useCallback, useEffect, useState } from "react";
import { Pressable, SafeAreaView, Text } from "react-native";
import { getCurrentOfflineGame } from "../database/offlineGameStore";
import { LocalGame } from "../types/offline";
import { router, useFocusEffect } from "expo-router";

export default function GameScreen() {
  const [currentOfflineGame, setCurrentOfflineGame] =
    useState<LocalGame | null>(null);

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

  const gotoGameInfoScreen = () => {
    router.push("/gameInfoScreen");
  };

  return (
    <SafeAreaView>
      <Pressable onPress={() => gotoGameInfoScreen()}>
        <Text>This is the game screen</Text>
        <Text>Game: {currentOfflineGame?.totalHoles}</Text>
      </Pressable>
    </SafeAreaView>
  );
}
