import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Text, SafeAreaView, View } from "react-native";

import styles from "./styles";
import WeatherTile from "../components/features/WeatherTile";
import RecommendedTile from "../components/features/RecommendedTile";
import { StartGameButton } from "../components/ui/buttons/StartGameButton";
import { CreateGameCircleButton } from "../components/ui/buttons/CreateGameCircleButton";
import { TeeOffDateButton } from "../components/ui/buttons/TeeOffDateButton";
import { TeeOffTimeButton } from "../components/ui/buttons/TeeOffTimeButton";

import { useAuth } from "../hooks/useAuth";
import { useLocations } from "../hooks/useLocations";
import { useWeather } from "../hooks/useWeather";
import { useRecommendedGame } from "../hooks/useRecommendedGame";

export default function HomeScreen() {
  const [teeOffDate, setTeeOffDate] = useState<Date>(new Date());
  const [teeOffTime, setTeeOffTime] = useState<Date>(new Date());
  const [combinedTeeOff, setCombinedTeeOff] = useState<Date>(new Date());

  // The location (golfCourse) where the recommended game
  // is to be fetched
  // JWT Token for authorization
  const { token } = useAuth();

  // Custom hooks
  const { golfCourses, location, setLocation } = useLocations(token);
  const { weather, currentWeather, error: weatherError } = useWeather(token, location, combinedTeeOff);
  const { recommendedGame, error: recError } = useRecommendedGame(
    token,
    location,
    combinedTeeOff,
  );

  const handleTimeSelected = (t: Date) => {
    setTeeOffTime((prev) => {
      const next = new Date(t);
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

  // keep combined up to date on initial mount
  useEffect(() => {
    setCombinedTeeOff(combineDateAndTime(teeOffDate, teeOffTime));
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            onLocationChange={setLocation}
            error={weatherError}
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
            <StartGameButton
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
          <RecommendedTile
            recommendedGame={recommendedGame}
            error={recError}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
