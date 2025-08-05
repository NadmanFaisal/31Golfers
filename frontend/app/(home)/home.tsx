import React, { useEffect, useState } from "react";
import { Button, SafeAreaView, Text, View } from "react-native";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";

import styles from "./styles";
import { getHourlyWeatherData } from "../api/weather";

export default function HomeScreen() {
  // The array of weather data for today
  const [hourlyWeather, setHourlyWeather] = useState([]);

  interface HourlyForecast {
    courseName: string;
    dailyForecastId: string;
    humidity: number;
    id: string;
    precip_mm: number;
    temp_c: number;
    time: string;
    uv: number;
    wind_kph: number;
  }

  // Current hours weather
  const [currentWeather, setCurrentWeather] = useState<HourlyForecast | null>(
    null,
  );

  const date = new Date();
  const [trigger, setTrigger] = useState(0);

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

  const getWeather = async () => {
    try {
      console.log("Getting weather data");

      // API call to receive weather data
      const response = await getHourlyWeatherData(
        token,
        "Kurmitola Golf Club",
        date,
      );

      if (!response?.hourlyForecasts?.length) {
        console.warn("No hourly forecasts available");
        return;
      }

      setHourlyWeather(response.hourlyForecasts);
      console.log("Response in the frontend: ", response.hourlyForecasts);
    } catch (err) {
      console.error("Error in getWeather:", err);
    }
  };

  const getCurrentHourWeather = async () => {
    const now = new Date();
    const currentHour = now.getHours();

    const match = hourlyWeather.find((forecast: any) => {
      const forecastHour = new Date(forecast.time).getHours();
      return forecastHour === currentHour;
    });

    if (match) {
      setCurrentWeather(match);
      console.log("Current weather", match);
    } else {
      console.warn("No forecast found for current hour");
    }
  };

  // Fetch the token stored in SecureStore
  useEffect(() => {
    getToken();
  }, []);

  // Fetch weather data from the backend according to location and date
  useEffect(() => {
    if (!token) return;
    getWeather();
  }, [token]);

  useEffect(() => {
    if (!hourlyWeather?.length) return;

    const run = () => getCurrentHourWeather();

    // Run immediately
    run();

    // Time until next full hour
    const now = new Date();
    const msUntilNextHour =
      (60 - now.getMinutes()) * 60 * 1000 - now.getSeconds() * 1000;

    // Start interval at the next full hour
    const timeout = setTimeout(() => {
      run();
      const interval = setInterval(run, 60 * 60 * 1000); // every hour
      // Save interval id so we can clear it later
      cleanup.interval = interval;
    }, msUntilNextHour);

    // Cleanup
    const cleanup: any = {};
    return () => {
      clearTimeout(timeout);
      if (cleanup.interval) clearInterval(cleanup.interval);
    };
  }, [hourlyWeather]);

  return (
    <SafeAreaView>
      <View style={styles.mainContainer}>
        <View style={styles.weatherContainer}>
          <View style={styles.cloudContainer}>
            <Text>Cloud stuff</Text>
          </View>
          <View style={styles.verticleLine}></View>
          <View style={styles.temperatureContainer}>
            <Text>
              {currentWeather ? `${currentWeather.temp_c}°C` : "Loading..."}
            </Text>
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
