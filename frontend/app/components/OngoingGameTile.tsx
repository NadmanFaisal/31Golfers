import React from "react";
import { View, Text, ScrollView } from "react-native";

import styles from "./OngoingGameTileStyles";

import { NavigationButton } from "./Buttons";

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

  const holes = Array.from(
    { length: props.ongoingGame?.totalHoles || 0 },
    (_, i) => i + 1,
  );
  const players = Array.isArray(props.ongoingGame?.players)
    ? props.ongoingGame.players
    : [];

  return (
    <View style={styles.ongoingGameTile}>
      <View style={styles.infoContainer}>
        <ScrollView
          horizontal
          style={styles.scoreTableScroll}
          showsHorizontalScrollIndicator
        >
          <View style={styles.tableContainer}>
            {/* Header */}
            <View style={styles.headerRow}>
              <View style={styles.nameHeaderCell}>
                <Text style={styles.headerText}>Player</Text>
              </View>
              {holes.map((n) => (
                <View key={`h-${n}`} style={styles.holeHeaderCell}>
                  <Text style={styles.headerText}>{n}</Text>
                </View>
              ))}
            </View>

            {/* Rows */}
            {players.map((p: any, idx: number) => {
              const row = props.ongoingGame.strokesByPlayer?.[p.id] || [];
              const rowStyle = idx % 2 ? styles.rowOdd : styles.rowEven;

              return (
                <View
                  key={p.id || `p-${idx}`}
                  style={[styles.rowBase, rowStyle]}
                >
                  <View style={styles.nameCell}>
                    <Text numberOfLines={1} style={styles.playerText}>
                      {p.displayName}
                    </Text>
                  </View>
                  {holes.map((n) => {
                    const v = row[n - 1];
                    return (
                      <View key={`${p.id}-${n}`} style={styles.holeCell}>
                        <Text style={styles.cellText}>
                          {typeof v === "number" ? String(v) : "–"}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              );
            })}
          </View>
        </ScrollView>
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
