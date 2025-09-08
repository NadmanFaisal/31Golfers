import React from "react";
import styles from "./HistoryTilesStyles";
import { View, Text } from "react-native";

type TileProp = {
  games?: any;
  onPress?: () => void;
};

export default function HistoryTiles(props: TileProp) {
  if (!props.games) {
    return (
      <View>
        <Text>No games right now.</Text>
      </View>
    );
  }
  return (
    <View>
      <Text>Hello</Text>
    </View>
  );
}
