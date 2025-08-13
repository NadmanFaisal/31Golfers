import React from "react";
import { Text, View, Image } from "react-native";
import styles from "./RecommendedStyles";

type RecommendedProps = {
  recommendedGame: any;
};

export default function RecommendedTile(props: RecommendedProps) {
  if (!props.recommendedGame) return null;

  if (
    props.recommendedGame.playableHoles === 0 ||
    props.recommendedGame.gameTime === 0
  ) {
    return (
      <View style={styles.recommendedGameContainer}>
        <Text style={styles.holesLabel}>No recommendation</Text>
      </View>
    );
  }

  return (
    <View style={styles.recommendedGameContainer}>
      <View style={styles.pictureContainer}>
        <Image
          style={styles.logoContainer}
          source={require("../../assets/images/golf_cart.png")}
          resizeMode="contain"
        />
      </View>
      <View style={styles.informationContainer}>
        <View style={styles.holeLabelContainer}>
          <Text style={styles.holesLabel}>
            {props.recommendedGame.playableHoles ?? "Loading..."} hole(s)
          </Text>
        </View>

        <View style={styles.informationLabelContainer}>
          <Image
            style={styles.informationPicture}
            source={require("../../assets/images/clock_icon.png")}
            resizeMode="contain"
          />
          <Text style={styles.gameInformationLabel}>
            {props.recommendedGame.gameTime ?? "Loading..."} mins
          </Text>
        </View>

        <View style={styles.informationLabelContainer}>
          <Image
            style={styles.informationPicture}
            source={require("../../assets/images/location_icon.png")}
            resizeMode="contain"
          />
          <Text style={styles.gameInformationLabel}>
            {props.recommendedGame.coursename ?? "Loading..."}
          </Text>
        </View>
      </View>

      <View style={styles.createGameContainer}></View>
    </View>
  );
}
