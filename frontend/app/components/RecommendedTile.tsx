import React from "react";
import { Text, View, Image } from "react-native";
import styles from "./RecommendedStyles";
import { CreateGameButton } from "./Buttons";

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
            source={require("../../assets/images/black_clock_icon.png")}
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

      {/* A create plus button on the recommended tile */}

      <View style={styles.createGameContainer}>
        <CreateGameButton
          height={50}
          width={50}
          color="#0FBE41"
          pressedColor="#0f6e41"
          onPress={() => console.log("Create button pressed")}
        />
      </View>
    </View>
  );
}
