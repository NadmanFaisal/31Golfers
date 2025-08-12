import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { getAllLocations } from "../api/location";
import { getWeather } from "../api/weather";
import { View, Text, Image } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

import styles from "./WeatherStyles";

type WeatherProps = {
  token: string;
  golfCourses: any;
  currentWeather: any;
  weather: any;
  onLocationChange?: (location: string) => void;
};

export default function WeatherTile(props: WeatherProps) {
  // List of all the golf courses

  // Drop down menu's selections
  const [location, setLocation] = useState("");
  const [isFocus, setIsFocus] = useState(false);

  /**
   * Needed to  show the location in the dropdown selection when
   * the app loads for the first time.
   */
  const getCurrentLocation = async () => {
    const fetchedLocation = await AsyncStorage.getItem("Location");
    if (fetchedLocation) {
      setLocation(fetchedLocation);
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return (
    <View style={styles.weatherContainer}>
      <View style={styles.cloudContainer}>
        <View style={styles.topLocationContainer}>
          <Dropdown
            style={[styles.dropdown]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            itemTextStyle={styles.itemTextStyle}
            data={props.golfCourses}
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
              props.onLocationChange?.(item.label);
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
            {props.currentWeather
              ? `${props.currentWeather.temp_c} °C`
              : "Loading..."}
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
              {props.weather ? `${props.weather.chance_of_rain}% ` : "..."}
            </Text>
          </View>

          <View style={styles.weatherLabelContainer}>
            <Image
              style={styles.weatherLogo}
              source={require("../../assets/images/weather_logos/Humidity.png")}
              resizeMode="contain"
            />
            <Text style={styles.weatherLabel}>
              {props.weather ? `${props.weather.avghumidity} ` : "..."}
            </Text>
          </View>

          <View style={styles.weatherLabelContainer}>
            <Image
              style={styles.weatherLogo}
              source={require("../../assets/images/weather_logos/Wind_Speed.png")}
              resizeMode="contain"
            />
            <Text style={styles.weatherLabel}>
              {props.weather ? `${props.weather.maxwind_kph}kph ` : "..."}
            </Text>
          </View>

          <View style={styles.weatherLabelContainer}>
            <Image
              style={styles.weatherLogo}
              source={require("../../assets/images/weather_logos/UV.png")}
              resizeMode="contain"
            />
            <Text style={styles.weatherLabel}>
              {props.weather ? `${props.weather.uv} ` : "..."}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
