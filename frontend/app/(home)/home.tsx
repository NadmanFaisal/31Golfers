import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import { Text, SafeAreaView, View } from "react-native";

import styles from "./styles";
import WeatherTile from "../components/WeatherTile";
import RecommendedTile from "../components/RecommendedTile";
import {
  StartGamenButton,
  TeeOffDateButton,
  TeeOffTimeButton,
} from "../components/Buttons";

import { getAllLocations } from "../api/location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getWeather } from "../api/weather";
import { getRecommendedGameSession } from "../api/game";

export default function HomeScreen() {
  const [teeOffDate, setTeeOffDate] = useState<Date>(new Date());
  const [teeOffTime, setTeeOffTime] = useState<Date>(new Date());
  const [combinedTeeOff, setCombinedTeeOff] = useState<Date>(new Date());

  // The location (golfCourse) where the recommended game
  // is to be fetched
  const [location, setLocation] = useState("");

  // JWT Token for authorization
  const [token, setToken] = useState("");

  const [golfCourses, setGolfCourses] = useState([]);

  // The whole weather obj fetched from the backend
  const [weather, setWeather] = useState<any>(null);

  // Current hour's weather
  const [currentWeather, setCurrentWeather] = useState<any>(null);

  // Variable to keep track of recommended game, fetched from the backend
  const [recommendedGame, setRecommendedGame] = useState<any>(null);

  const getToken = async () => {
    const fetchedToken = await SecureStore.getItemAsync("token");
    if (!fetchedToken) {
      router.dismissTo("/(auth)/login");
    } else {
      setToken(fetchedToken);
    }
    console.log("Token:", token);
  };

  // Updates the time variable from the child component
  const handleTimeSelected = (t: Date) => {
    setTeeOffTime((prev) => {
      const next = new Date(t);
      // also update the combined value your effects depend on:
      const combined = combineDateAndTime(teeOffDate, next);
      setCombinedTeeOff(combined);
      return next;
    });
  };

  const handleDateSelected = (d: Date) => {
    setTeeOffDate((prev) => {
      const next = new Date(d);
      const combined = combineDateAndTime(next, teeOffTime);
      setCombinedTeeOff(combined);
      return next;
    });
  };

  const combineDateAndTime = (date: Date, time: Date) => {
    const combined = new Date(date);
    combined.setHours(
      time.getHours(),
      time.getMinutes(),
      time.getSeconds(),
      time.getMilliseconds(),
    );
    return combined;
  };

  const getAllLocationsObjects = async () => {
    // 1) Restore previously chosen location immediately (offline-first)
    const COURSES_KEY = "GolfCourses";
    const LOCATION_KEY = "Location";
    const savedLocation = await AsyncStorage.getItem(LOCATION_KEY);
    if (savedLocation) setLocation(savedLocation);

    try {
      // 2) Try online
      const response = await getAllLocations(token);
      const formatted = response.data.map((gc: any) => ({
        label: gc.name,
        value: gc.id,
        latitude: gc.latitude,
        longitude: gc.longitude,
      }));

      setGolfCourses(formatted);
      await AsyncStorage.setItem(COURSES_KEY, JSON.stringify(formatted));

      // 3) If we had no saved location, pick a default from the fresh list
      if (!savedLocation && formatted.length > 0) {
        await setNewLocation(formatted[0].label);
      }

      console.log("Dropdown-ready locations: ", formatted);
    } catch (err) {
      console.error("Error in getAllLocationsObjects:", err);

      // 4) Offline fallback: use cached courses (if any)
      const cached = await AsyncStorage.getItem(COURSES_KEY);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          setGolfCourses(parsed);
        } catch {}
      }

      // 5) If we still don't have a location, pick first cached (if present)
      if (!savedLocation && cached) {
        const parsed = JSON.parse(cached);
        if (parsed.length > 0) await setNewLocation(parsed[0].label);
      }
    }
  };

  /**
   * Updates the stored "Location" value in AsyncStorage and the local state.
   * Removes the existing "Location" entry (optional, as setItem overwrites)
   * and sets the new location string.
   * Also updates the `location` state variable, which is used by other hooks/components.
   * @param {string} location The new location value.
   */
  const setNewLocation = async (location: string) => {
    await AsyncStorage.setItem("Location", location);
    setLocation(location);
  };

  /**
   * Fetches weather data for the stored location and updates
   * local state.
   */
  const getWeatherObjects = async () => {
    try {
      const fetchedLocation = await AsyncStorage.getItem("Location");
      if (!fetchedLocation) {
        return;
      }

      setLocation(fetchedLocation);

      const date = new Date();

      // API call to receive weather data
      const response = await getWeather(token, fetchedLocation, date);

      if (!response?.hourlyForecasts?.length) {
        console.warn("No hourly forecasts available");
        return;
      }

      setWeather(response);
      console.log("Response in the frontend: ", response.hourlyForecasts);
    } catch (err) {
      console.error("Error in getWeatherObject:", err);
    }
  };

  /**
   * Retrieves the weather forecast for the current hour from the stored weather data.
   * @function getCurrentHourWeather
   * @returns {void}
   *
   */
  const getCurrentHourWeather = () => {
    if (!weather?.hourlyForecasts?.length) return;

    const now = new Date();
    const currentHour = now.getHours();

    const match = weather.hourlyForecasts.find((forecast: any) => {
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
  /**
   * Fetches a recommended game session from the API and updates local state.
   * @function getRecommendedGame
   * @returns {Promise<void>}
   *
   */
  const getRecommendedGame = async () => {
    try {
      if (!combinedTeeOff) return;

      console.log("Tee off time: ", combinedTeeOff);
      const response = await getRecommendedGameSession(
        token,
        location,
        combinedTeeOff,
        18,
        13,
      );

      setRecommendedGame(response);
      console.log("Recommended game: ", response);
    } catch (err: any) {
      console.error("Error in getRecommendedGame:", err);
    }
  };

  // keep combined up to date on initial mount
  useEffect(() => {
    setCombinedTeeOff(combineDateAndTime(teeOffDate, teeOffTime));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!token || !location) return;
    getRecommendedGame();
  }, [token, location, combinedTeeOff]);

  // Fetch weather data from the backend according to location and date
  useEffect(() => {
    if (!token || !location) return;
    getWeatherObjects();
  }, [token, location]);

  // Runs every hour to get weather data
  useEffect(() => {
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
  }, [weather]);

  useEffect(() => {
    if (!token) return;
    getAllLocationsObjects();
  }, [token]);

  // Fetch the token stored in SecureStore
  useEffect(() => {
    getToken();
  }, []);

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.mainContainer}>
        {/* /////////////////////// Weather Tile Stuff down here ///////////////////////  */}

        <View style={styles.weatherContainer}>
          <WeatherTile
            golfCourses={golfCourses}
            currentWeather={currentWeather}
            weather={weather}
            token={token}
            location={location}
            onLocationChange={setNewLocation}
          />
        </View>

        {/* ///////////////////////  End of weather tile stuff, look above ///////////////////////  */}

        <View style={styles.selectionContainer}>
          <View style={styles.upperSelectionContainer}>
            <TeeOffDateButton
              height={75}
              width={170}
              fontSize={15}
              color="#3B82F6"
              pressedColor="#1E40AF"
              text="Set Tee Off date"
              onDateSelected={handleDateSelected}
            />
            <TeeOffTimeButton
              height={75}
              width={170}
              fontSize={15}
              color="#ff8e31ff"
              pressedColor="#e46600ff"
              text="Set Tee Off time"
              onTimeSelected={handleTimeSelected}
            />
          </View>
          <View style={styles.lowerSelectionContainer}>
            <StartGamenButton
              text="Start a Game!"
              height={75}
              width={350}
              color="#0FBE41"
              pressedColor="#0f6e41"
              recommendedGame={recommendedGame}
              location={location}
            />
          </View>
        </View>

        <View style={styles.gameRecommendationContainer}>
          <View style={styles.recommendedTitleContainer}>
            <Text style={styles.recommendedTitleLabel}>Recommended</Text>
            {/*<Text>Location: {location}</Text>
            <Text>Time: {combinedeeOff?.toString()}</Text>*/}
          </View>
          <RecommendedTile recommendedGame={recommendedGame} />
        </View>
      </View>
    </SafeAreaView>
  );
}
