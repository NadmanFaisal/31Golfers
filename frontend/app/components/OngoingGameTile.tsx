import React from "react";
import { View, Text, ScrollView } from "react-native";

import styles from "./OngoingGameTileStyles";

import { NavigationButton } from "./Buttons";
import MiniScoreTable from "./MiniScoreTable";

type TileProp = {
  ongoingGame?: any;
  onPress?: () => void;
};

export default function OngoingGameTile(props: TileProp) {
  if (!props.ongoingGame) {
    return (
      <View style={styles.ongoingGameTile}>
        <Text style={styles.recommendedLabel}>No games right now.</Text>
      </View>
    );
  }

  const players = Array.isArray(props.ongoingGame?.players)
    ? props.ongoingGame.players
    : [];

  return (
    <View style={styles.ongoingGameTile}>
      <View style={styles.infoContainer}>
        <MiniScoreTable
          players={players}
          totalHoles={props.ongoingGame?.totalHoles ?? 0}
          strokesByPlayer={props.ongoingGame?.strokesByPlayer ?? {}}
        />
      </View>

      <View style={styles.navContainer}>
        <NavigationButton
          height={45}
          width={120}
          color="#349dff"
          pressedColor="#3337ff"
          text="View"
          onPress={props?.onPress}
        />
      </View>
    </View>
  );
}
