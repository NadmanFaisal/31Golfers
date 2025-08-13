import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import { Text, Button, SafeAreaView, View } from "react-native";

import styles from "./styles";
import WeatherTile from "../components/WeatherTile";
import RecommendedTile from "../components/RecommendedTile";
import { TeeOffButton } from "../components/Buttons";

import { getAllLocations } from "../api/location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getWeather } from "../api/weather";
import { getRecommendedGameSession } from "../api/game";

export default function HomeScreen() {
  // The start time for getting recommended game
  const [teeOffTime, setTeeOffTime] = useState<Date>(new Date());

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
  const handleTimeSelected = (d: Date) => {
    setTeeOffTime(d);
  };

  const handleLogout = () => {
    // Deletes the token for new token to be stored
    SecureStore.deleteItemAsync("token");
    router.dismissTo("/(auth)/login");
  };

  const getAllLocationsObjects = async () => {
    try {
      const response = await getAllLocations(token);
      const formatted = response.data.map((gc: any) => ({
        label: gc.name,
        value: gc.id,
        latitude: gc.latitude,
        longitude: gc.longitude,
      }));
      setGolfCourses(formatted);

      // restore last chosen location or set default
      const saved = await AsyncStorage.getItem("Location");
      if (saved) {
        setLocation(saved);
      } else if (formatted.length > 0) {
        await setNewLocation(formatted[0].label);
      }

      console.log("Dropdown-ready locations: ", formatted);
    } catch (err) {
      console.error("Error in getAllLocationsObject:", err);
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
    await AsyncStorage.removeItem("Location");
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
      if (!teeOffTime) return;

      console.log("Tee off time: ", teeOffTime);
      const response = await getRecommendedGameSession(
        token,
        location,
        teeOffTime,
        18,
        13,
      );

      setRecommendedGame(response);
      console.log("Recommended game: ", response);
    } catch (err: any) {
      console.error("Error in getRecommendedGame:", err);
    }
  };

  useEffect(() => {
    if (!token || !location) return;
    getRecommendedGame();
  }, [token, location, teeOffTime]);

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
    <SafeAreaView>
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
            <TeeOffButton
              height={75}
              width={350}
              color="#ff8e31ff"
              pressedColor="#e46600ff"
              text="Set Tee Off time"
              onTimeSelected={handleTimeSelected}
            />
          </View>
          <View style={styles.lowerSelectionContainer}></View>
        </View>

        <View style={styles.gameRecommendationContainer}>
          <View style={styles.recommendedTitleContainer}>
            <Text style={styles.recommendedTitleLabel}>Recommended</Text>
            {/* <Text>Location: {location}</Text>
            <Text>Time: {teeOffTime?.toString()}</Text> */}
          </View>
          <RecommendedTile recommendedGame={recommendedGame} />

          <Button
            onPress={() => handleLogout()}
            title="Log out"
            color="#841584"
            accessibilityLabel="Sign up as a user!"
          />
        </View>

        <View style={styles.footerNavigationContainer}></View>
      </View>
    </SafeAreaView>
  );
}
