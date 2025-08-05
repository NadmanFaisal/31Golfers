import { useEffect, useState } from "react";
import { Image, Text, View } from "react-native";
import styles from "./WeatherTileStyles";

import { getWeather } from "../../api/weather";

type WeatherProp = {
  token: string;
};

export default function WeatherTile(props: WeatherProp) {
  // The whole weather obj fetched from the backend
  const [weather, setWeather] = useState<any>(null);
  // Current hour's weather
  const [currentWeather, setCurrentWeather] = useState<any>(null);

  const date = new Date();

  const getWeatherObject = async () => {
    try {
      console.log("Getting weather data");

      // API call to receive weather data
      const response = await getWeather(
        props.token,
        "Kurmitola Golf Club",
        date,
      );

      if (!response?.hourlyForecasts?.length) {
        console.warn("No hourly forecasts available");
        return;
      }

      setWeather(response);
      console.log("Response in the frontend: ", response.hourlyForecasts);
    } catch (err) {
      console.error("Error in getWeather:", err);
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

  // Fetch weather data from the backend according to location and date
  useEffect(() => {
    if (!props.token) return;
    getWeatherObject();
  }, [props.token]);

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

  return (
    <View style={styles.weatherContainer}>
      <View style={styles.cloudContainer}>
        <Text>Cloud stuff</Text>
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
              source={require("../../../assets/images/weather_logos/Rain.png")}
              resizeMode="contain"
            />
            <Text style={styles.weatherLabel}>
              {weather ? `${weather.chance_of_rain}% ` : "..."}
            </Text>
          </View>

          <View style={styles.weatherLabelContainer}>
            <Image
              style={styles.weatherLogo}
              source={require("../../../assets/images/weather_logos/Humidity.png")}
              resizeMode="contain"
            />
            <Text style={styles.weatherLabel}>
              {weather ? `${weather.avghumidity} ` : "..."}
            </Text>
          </View>

          <View style={styles.weatherLabelContainer}>
            <Image
              style={styles.weatherLogo}
              source={require("../../../assets/images/weather_logos/Wind_Speed.png")}
              resizeMode="contain"
            />
            <Text style={styles.weatherLabel}>
              {weather ? `${weather.maxwind_kph}kph ` : "..."}
            </Text>
          </View>

          <View style={styles.weatherLabelContainer}>
            <Image
              style={styles.weatherLogo}
              source={require("../../../assets/images/weather_logos/UV.png")}
              resizeMode="contain"
            />
            <Text style={styles.weatherLabel}>
              {weather ? `${weather.uv} ` : "..."}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
