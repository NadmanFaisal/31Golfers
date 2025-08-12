import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import { Text, Button, SafeAreaView, View } from "react-native";

import styles from "./styles";
import WeatherTile from "../components/WeatherTile";
import { getAllLocations } from "../api/location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getWeather } from "../api/weather";
import { getRecommendedGameSession } from "../api/game";

export default function HomeScreen() {
  const [location, setLocation] = useState("");

  // JWT Token for authorization
  const [token, setToken] = useState("");

  const [golfCourses, setGolfCourses] = useState([]);

  // The whole weather obj fetched from the backend
  const [weather, setWeather] = useState<any>(null);
  // Current hour's weather
  const [currentWeather, setCurrentWeather] = useState<any>(null);

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

  const handleLogout = () => {
    // Deletes the token for new token to be stored
    SecureStore.deleteItemAsync("token");
    router.dismissTo("/(auth)/login");
  };

  const getAllLocationsObjects = async () => {
    try {
      const response = await getAllLocations(token);
      const formattedData = response.data.map((gc: any) => ({
        label: gc.name,
        value: gc.id,
        latitude: gc.latitude,
        longitude: gc.longitude,
      }));

      setGolfCourses(formattedData);

      const loc = await AsyncStorage.getItem("Location");
      if (loc) {
        setLocation(loc); // <-- set state when we already have a saved value
      } else if (formattedData.length > 0) {
        const defaultLocation = formattedData[0].label;
        await setNewLocation(defaultLocation); // sets AsyncStorage + state
      }

      console.log("Dropdown-ready locations: ", formattedData);
    } catch (err) {
      console.error("Error in getAllLocationsObject:", err);
    }
  };

  const setNewLocation = async (location: string) => {
    await AsyncStorage.removeItem("Location");
    await AsyncStorage.setItem("Location", location);
    setLocation(location);
  };

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

  const getRecommendedGame = async () => {
    try {
      const teeOffTime = new Date();
      console.log("Tee off time: ", teeOffTime);
      const response = await getRecommendedGameSession(
        token,
        location,
        teeOffTime,
        18,
        13,
      );

      setRecommendedGame(response);
    } catch (err: any) {
      console.error("Error in getRecommendedGame:", err);
    }
  };

  useEffect(() => {
    if (!token || !location) return;
    getRecommendedGame();
  }, [token, location]);

  // Fetch weather data from the backend according to location and date
  useEffect(() => {
    if (!token || !location) return;
    getWeatherObjects();
  }, [token, location]);

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
            onLocationChange={setNewLocation}
          />
        </View>

        {/* ///////////////////////  End of weather tile stuff, look above ///////////////////////  */}

        <Text>Location: {location}</Text>
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
