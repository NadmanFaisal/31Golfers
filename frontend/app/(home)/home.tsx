import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import { Button, SafeAreaView, View } from "react-native";

import styles from "./styles";

import WeatherTile from "../components/mainComponents/WeatherTile";

export default function HomeScreen() {
  // JWT Token for authorization
  const [token, setToken] = useState("");

  const getToken = async () => {
    const fetchedToken = await SecureStore.getItem("token");
    if (!fetchedToken) {
      router.dismissTo("/(auth)/login");
    } else {
      setToken(fetchedToken);
    }
    console.log("Token:", token);
  };

  const handleLogout = () => {
    // Deletes the token for new token to be stored
    SecureStore.deleteItemAsync("token");
    router.dismissTo("/(auth)/login");
  };

  // Fetch the token stored in SecureStore
  useEffect(() => {
    getToken();
  }, []);

  return (
    <SafeAreaView>
      <View style={styles.mainContainer}>
        <WeatherTile token={token} />
        <Button
          onPress={() => handleLogout()}
          title="Log out"
          color="#841584"
          accessibilityLabel="Sign up as a user!"
        />
      </View>
    </SafeAreaView>
  );
}
