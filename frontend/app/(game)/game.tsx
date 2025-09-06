import React, { useCallback, useEffect, useState } from "react";
import {
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";
import { getCurrentOfflineGame } from "../database/offlineGameStore";
import { LocalGame } from "../types/offline";
import { router, useFocusEffect } from "expo-router";
import * as SecureStore from "expo-secure-store";

import styles from "./gameStyles";

import OngoingGameTile from "../components/OngoingGameTile";
import { getAllGames } from "../api/game";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function GameScreen() {
  const [currentOfflineGame, setCurrentOfflineGame] =
    useState<LocalGame | null>(null);

  const [token, setToken] = useState("");

  const [userID, setUserID] = useState("");

  const [refreshing, setRefreshing] = React.useState(false);

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
    <SafeAreaView>
      <ScrollView
        contentContainerStyle={styles.mainContainer}
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
          <View>
            <View style={styles.historyLabelContainer}>
              <Text style={styles.label}>Previous Games: </Text>
            </View>

            <ScrollView
              contentContainerStyle={styles.historyGameContainer}
            ></ScrollView>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
