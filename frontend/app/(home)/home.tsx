import React, { useEffect, useState } from "react";
import { Button, SafeAreaView, Text, View } from "react-native";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";

import styles from "./styles";
import { getTodayWeather } from "../api/weather";

export default function HomeScreen() {
  const [todayWeather, setTodayWeather] = useState([]);
  const date = new Date();

  // JWT Token for authorization
  const [token, setToken] = useState("");

  // Fetch the token stored in SecureStore
  useEffect(() => {
    const getToken = async () => {
      const fetchedToken = await SecureStore.getItem("token");
      if (!fetchedToken) {
        router.dismissTo("/(auth)/login");
      } else {
        setToken(fetchedToken);
      }
      console.log("Token:", token);
    };
    getToken();
  }, []);

  const handleLogout = () => {
    // Deletes the token for new token to be stored
    SecureStore.deleteItemAsync("token");
    router.dismissTo("/(auth)/login");
  };

  // Fetch weather data from the backend according to location and date
  useEffect(() => {
    const getWeather = async () => {
      // Returns if there is no token
      if (!token) return;

      try {
        console.log("Getting weather data");

        // API call to receive weather data
        const response = await getTodayWeather(
          token,
          "Kurmitola Golf Club",
          date,
        );

        // Map the weather data according to local time
        if (response?.hourlyForecasts) {
          const localHourly = response.hourlyForecasts.map((hour: any) => ({
            ...hour,
            localTime: new Date(hour.time).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          }));

          console.log("Local Hourly Forecasts:", localHourly);
          setTodayWeather(localHourly);
        }

        console.log("Response:", response);
      } catch (err) {
        console.error("Error in getWeather:", err);
      }
    };
    getWeather();
  }, [token]);

  return (
    <SafeAreaView>
      <View style={styles.mainContainer}>
        <View style={styles.weatherContainer}>
          <View style={styles.cloudContainer}>
            <Text>Cloud stuff</Text>
          </View>
          <View style={styles.verticleLine}></View>
          <View style={styles.temperatureContainer}>
            <Text>Temperature stuff</Text>
          </View>
        </View>
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
