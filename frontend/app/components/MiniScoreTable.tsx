import { View, Text, ScrollView } from "react-native";
import styles from "./MiniScoreTableStyles";

type Player = { id: string; displayName: string };
type StrokesByPlayer = Record<string, Array<number | undefined>>;

export default function MiniScoreTable({
  players,
  totalHoles,
  strokesByPlayer,
}: {
  players: Player[];
  totalHoles: number;
  strokesByPlayer: StrokesByPlayer;
}) {
  const holes = Array.from({ length: totalHoles }, (_, i) => i + 1);

  return (
    <ScrollView
      horizontal
      style={styles.scoreTableScroll}
      showsHorizontalScrollIndicator
    >
      <View style={styles.tableContainer}>
        {/* Header row */}
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

        {/* One row per player */}
        {players.map((p, idx) => {
          const row = strokesByPlayer?.[p.id] ?? [];
          const rowStyle = idx % 2 ? styles.rowOdd : styles.rowEven;

          return (
            <View key={p.id} style={[styles.rowBase, rowStyle]}>
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
  );
}
