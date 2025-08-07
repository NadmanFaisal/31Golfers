import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import { Text, Button, SafeAreaView, View, Image } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import AsyncStorage from "@react-native-async-storage/async-storage";

import styles from "./styles";
import { getWeather } from "../api/weather";
import { getAllLocations } from "../api/location";

const data = [
  { label: "Item 1", value: "1" },
  { label: "Item 2", value: "2" },
  { label: "Item 3", value: "3" },
  { label: "Item 4", value: "4" },
  { label: "Item 5", value: "5" },
  { label: "Item 6", value: "6" },
  { label: "Item 7", value: "7" },
  { label: "Item 8", value: "8" },
];

export default function HomeScreen() {
  // List of all the golf courses
  const [golfCourses, setGolfCourses] = useState([]);

  // Drop down menu's selections
  const [location, setLocation] = useState("");
  const [isFocus, setIsFocus] = useState(false);

  // The whole weather obj fetched from the backend
  const [weather, setWeather] = useState<any>(null);
  // Current hour's weather
  const [currentWeather, setCurrentWeather] = useState<any>(null);

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

  const getWeatherObject = async () => {
    try {
      const loc = await AsyncStorage.getItem("Location");
      if (!loc) {
        return;
      }
      setLocation(loc);
      const date = new Date();
      console.log("Location: ", location);
      console.log("Date: ", date);

      // API call to receive weather data
      const response = await getWeather(token, loc, date);

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
      if (!loc) {
        const defaultLocation = formattedData[0].label;

        setLocation(defaultLocation);
        await AsyncStorage.removeItem("Location");
        await AsyncStorage.setItem("Location", defaultLocation);
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

  useEffect(() => {
    if (!token) return;
    getAllLocationsObjects();
  }, [token]);

  // Fetch weather data from the backend according to location and date
  useEffect(() => {
    if (!token) return;
    getWeatherObject();
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

  // Fetch the token stored in SecureStore
  useEffect(() => {
    getToken();
  }, []);

  return (
    <SafeAreaView>
      <View style={styles.mainContainer}>
        {/* /////////////////////// Weather Tile Stuff down here ///////////////////////  */}

        <View style={styles.weatherContainer}>
          <View style={styles.cloudContainer}>
            <View style={styles.topLocationContainer}>
              <Dropdown
                style={[styles.dropdown]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                itemTextStyle={styles.itemTextStyle}
                data={golfCourses}
                search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={location ? location : "Select location"}
                searchPlaceholder="Search..."
                value={location}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={(item) => {
                  setNewLocation(item.label);
                  setIsFocus(false);
                }}
              />
            </View>

            <View style={styles.middleCloudContainer}>
              <Text>Cloud stuff</Text>
            </View>

            <View style={styles.bottomCloudContainer}></View>
          </View>
          <View style={styles.verticleLine}></View>

          <View style={styles.temperatureContainer}>
            <View style={styles.topDetailsContainer}>
              <Text style={styles.moreDetailsLabel}>More details &gt;</Text>
            </View>
            <View style={styles.middleTempContainer}>
              <Text style={styles.tempLabel}>
                {currentWeather ? `${currentWeather.temp_c} °C` : "Loading..."}
              </Text>
            </View>

            <View style={styles.bottomTempContainer}>
              <View style={styles.weatherLabelContainer}>
                <Image
                  style={styles.weatherLogo}
                  source={require("../../assets/images/weather_logos/Rain.png")}
                  resizeMode="contain"
                />
                <Text style={styles.weatherLabel}>
                  {weather ? `${weather.chance_of_rain}% ` : "..."}
                </Text>
              </View>

              <View style={styles.weatherLabelContainer}>
                <Image
                  style={styles.weatherLogo}
                  source={require("../../assets/images/weather_logos/Humidity.png")}
                  resizeMode="contain"
                />
                <Text style={styles.weatherLabel}>
                  {weather ? `${weather.avghumidity} ` : "..."}
                </Text>
              </View>

              <View style={styles.weatherLabelContainer}>
                <Image
                  style={styles.weatherLogo}
                  source={require("../../assets/images/weather_logos/Wind_Speed.png")}
                  resizeMode="contain"
                />
                <Text style={styles.weatherLabel}>
                  {weather ? `${weather.maxwind_kph}kph ` : "..."}
                </Text>
              </View>

              <View style={styles.weatherLabelContainer}>
                <Image
                  style={styles.weatherLogo}
                  source={require("../../assets/images/weather_logos/UV.png")}
                  resizeMode="contain"
                />
                <Text style={styles.weatherLabel}>
                  {weather ? `${weather.uv} ` : "..."}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* ///////////////////////  End of weather tile stuff, look above ///////////////////////  */}

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
