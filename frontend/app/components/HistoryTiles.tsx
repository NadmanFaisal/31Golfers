import React from "react";
import styles from "./HistoryTilesStyles";
import { View, Text, ScrollView } from "react-native";
import MiniScoreTable from "./MiniScoreTable";
import { NavigationButton } from "./Buttons";

type TileProp = {
  games?: any;
  onPress?: () => void;
};

export default function HistoryTiles(props: TileProp) {
  if (!props.games) {
    return (
      <View style={styles.noGameTile}>
        <Text style={styles.noGameLabel}>No games right now.</Text>
      </View>
    );
  }

  return (
    <View style={styles.historyContainer}>
      {props.games.map((game: any) => (
        <View key={String(game.id)} style={styles.historyGameContainer}>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>{game.courseName}</Text>
          </View>
          <ScrollView style={styles.scoreTable}>
            <MiniScoreTable
              players={game.players ?? []}
              totalHoles={game.totalHoles ?? 0}
              strokesByPlayer={game.strokesByPlayer ?? {}}
            />
          </ScrollView>
          <View style={styles.buttonContainer}>
            <Text style={styles.label}>
              {new Date(game.createdAt).toLocaleDateString("en-US", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </Text>
            <NavigationButton
              text={"View"}
              height={30}
              width={75}
              color="#349dff"
              pressedColor="#3337ff"
            />
          </View>
        </View>
      ))}
    </View>
  );
}
