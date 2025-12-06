import React, { useState } from "react";
import {
  RefreshControl,
  ScrollView,
  Text,
  View,
  SafeAreaView,
} from "react-native";
import { router } from "expo-router";

import styles from "./gameStyles";
import { ROUTES } from "../../constants/routes";

import OngoingGameTile from "../components/features/OngoingGameTile";
import HistoryTiles from "../components/features/HistoryTiles";
import { HistoryScoreModal } from "../components/ui/modals/HistoryScoreModal";

import { useAuth } from "../hooks/useAuth";
import { useGames } from "../hooks/useGames";
import { LocalGame } from "../types/offline";

export default function GameScreen() {
  const { token, userID } = useAuth();
  const { currentOfflineGame, previousGames, refreshing, onRefresh } = useGames(
    userID,
    token,
  );

  const [scoreModalVisible, setScoreModalVisible] = useState(false);
  const [selectedGame, setSelectedGame] = useState<LocalGame | null>(null);

  const openScores = (game: LocalGame) => {
    setSelectedGame(game);
    setScoreModalVisible(true);
  };

  const gotoGameInfoScreen = () => {
    router.push(ROUTES.GAME_INFO);
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.mainContainer}>
        <ScrollView
          style={styles.scrollView}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.recomGameContainer}>
            <OngoingGameTile
              ongoingGame={currentOfflineGame}
              onPress={gotoGameInfoScreen}
            />
          </View>
          <View style={styles.historyContainer}>
            <View style={styles.historyLabelContainer}>
              <Text style={styles.label}>Previous Games: </Text>
            </View>
          </View>

          <HistoryTiles games={previousGames} onPress={(g) => openScores(g)} />
        </ScrollView>

        <HistoryScoreModal
          modalVisible={scoreModalVisible}
          setModalVisible={setScoreModalVisible}
          game={selectedGame}
        />
      </View>
    </SafeAreaView>
  );
}
