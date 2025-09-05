import React, { useCallback, useEffect, useState } from "react";
import { Pressable, SafeAreaView, Text, View } from "react-native";
import { getCurrentOfflineGame } from "../database/offlineGameStore";
import { LocalGame } from "../types/offline";
import { router, useFocusEffect } from "expo-router";

import styles from "./gameStyles";

import OngoingGameTile from "../components/OngoingGameTile";

export default function GameScreen() {
  const [currentOfflineGame, setCurrentOfflineGame] =
    useState<LocalGame | null>(null);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        const g = await getCurrentOfflineGame();
        if (active) setCurrentOfflineGame(g);
        console.log("Current offline game:", g);
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
      <View style={styles.recomGameContainer}>
        <OngoingGameTile
          ongoingGame={currentOfflineGame}
          onPress={gotoGameInfoScreen}
        />
      </View>
      <View style={styles.historyContainer}>
        <Text>Hello</Text>
        <Pressable onPress={() => gotoGameInfoScreen()}>
          <Text>This is the game screen</Text>
          <Text>Game: {currentOfflineGame?.totalHoles}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
