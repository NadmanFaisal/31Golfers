import React from "react";
import { Text, View, Image } from "react-native";
import styles from "./RecommendedStyles";

type RecommendedProps = {
  recommendedGame: any;
};

export default function RecommendedTile(props: RecommendedProps) {
  return props.recommendedGame ? (
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
            {props.recommendedGame.playableHoles} hole(s)
          </Text>
        </View>

        <View style={styles.informationLabelContainer}>
          <Image
            style={styles.informationPicture}
            source={require("../../assets/images/clock_icon.png")}
            resizeMode="contain"
          />
          <Text style={styles.gameInformationLabel}>
            {props.recommendedGame.gameTime} mins
          </Text>
        </View>

        <View style={styles.informationLabelContainer}>
          <Image
            style={styles.informationPicture}
            source={require("../../assets/images/location_icon.png")}
            resizeMode="contain"
          />
          <Text style={styles.gameInformationLabel}>
            {props.recommendedGame.courseName}
          </Text>
        </View>
      </View>

      <View style={styles.createGameContainer}></View>
    </View>
  ) : null;
}
