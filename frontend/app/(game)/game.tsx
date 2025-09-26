import React, { useCallback, useEffect, useState } from "react";
import {
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native";
import { getCurrentOfflineGame } from "../database/offlineGameStore";
import { LocalGame } from "../types/offline";
import { router, useFocusEffect } from "expo-router";
import * as SecureStore from "expo-secure-store";

import styles from "./gameStyles";

import OngoingGameTile from "../components/OngoingGameTile";
import HistoryTiles from "../components/HistoryTiles";
import { getAllGames } from "../api/game";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { HistoryScoreModal } from "../components/Modals";

export default function GameScreen() {
  const [currentOfflineGame, setCurrentOfflineGame] =
    useState<LocalGame | null>(null);

  const [token, setToken] = useState("");

  const [userID, setUserID] = useState("");

  const [refreshing, setRefreshing] = React.useState(false);

  const [previousGames, setPreviousGames] = useState<LocalGame[]>([]);

  const [scoreModalVisible, setScoreModalVisible] = useState(false);
  const [selectedGame, setSelectedGame] = useState<any | null>(null);

  const openScores = (game: any) => {
    setSelectedGame(game);
    setScoreModalVisible(true);
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    if (userID && token) {
      getPreviousGames();
    }
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, [token, userID]);

  const getToken = async () => {
    const fetchedToken = await SecureStore.getItemAsync("token");
    if (!fetchedToken) {
      router.dismissTo("/(auth)/login");
    } else {
      setToken(fetchedToken);
    }
  };

  const gotoGameInfoScreen = () => {
    router.push("/gameInfoScreen");
  };

  const getPreviousGames = async () => {
    console.log("Reached");
    try {
      const response = await getAllGames(userID, token);
      if (response.status === 200) {
        console.log("Previous games:", response.data);
        setPreviousGames(response.data);
      }
    } catch (err: any) {
      console.error("Error in getPreviousGames:", err);
    }
  };

  const getUserID = async () => {
    try {
      const id = await AsyncStorage.getItem("UserID");
      if (id) {
        console.log("UserID: ", id);
        setUserID(id);
      }
    } catch (err) {
      console.error("Error getting user id:", err);
    }
  };

  useEffect(() => {
    getUserID();
  }, []);

  useEffect(() => {
    getToken();
  }, []);

  useEffect(() => {
    if (!token || !userID) return;
    getPreviousGames();
  }, [token, userID]);

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

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.mainContainer}>
        <ScrollView
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            width: "100%",
          }}
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
