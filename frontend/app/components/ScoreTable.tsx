import React from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";

import styles from "./ScoreTableStyles";

type tableProps = {
  game: any;
  editingCell: any;
  inputValue: any;
  setInputValue: (text: string) => void;
  commitEdit?: () => void;
  startEdit?: (playerId: string, hole: number, current?: number | null) => void;
  isEditing: boolean;
};

export default function ScoreTable(props: tableProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator
      contentContainerStyle={styles.tableWrap}
      style={{ flex: 1 }}
    >
      <View>
        {/* Header row */}
        <View style={styles.headerRow}>
          <View style={[styles.holeHeaderCell, styles.headerCell]}>
            <Text style={styles.headerText}>Hole</Text>
          </View>
          {(props.game?.players ?? []).map((p: any) => (
            <View
              key={p.id}
              style={[styles.playerHeaderCell, styles.headerCell]}
            >
              <Text style={styles.headerText} numberOfLines={1}>
                {p.displayName}
              </Text>
            </View>
          ))}
        </View>

        {/* Body rows, one row per hole */}
        {Array.from(
          { length: props.game?.totalHoles || 0 },
          (_, i) => i + 1,
        ).map((hole) => (
          <View key={`row-${hole}`} style={styles.bodyRow}>
            {/* Hole index */}
            <View style={styles.holeCell}>
              <Text style={styles.bodyText}>{hole}</Text>
            </View>

            {/* One score cell per player, with inline editable */}
            {(props.game?.players ?? []).map((p: any, colIdx: any) => {
              const strokes = props.game?.strokesByPlayer?.[p.id] || [];
              const val = strokes[hole - 1];

              // Necessary for getting WHICH cell to edit.
              const isEditing =
                props.editingCell?.playerId === p.id &&
                props.editingCell?.hole === hole;

              // Itterates through all the cells and checks whether
              // it is eligible for editing
              if (props.isEditing && isEditing) {
                return (
                  <View
                    key={`${p.id}-${hole}`}
                    style={[
                      styles.scoreCell,
                      colIdx === 0 ? styles.firstScoreCol : undefined,
                    ]}
                  >
                    <TextInput
                      autoFocus
                      value={props.inputValue}
                      onChangeText={props.setInputValue}
                      keyboardType="number-pad"
                      returnKeyType="done"
                      onSubmitEditing={props.commitEdit}
                      onBlur={props.commitEdit}
                      style={styles.cellInput}
                      placeholder="–"
                      placeholderTextColor="#999"
                      maxLength={2}
                    />
                  </View>
                );
              }

              return (
                <TouchableOpacity
                  key={`${p.id}-${hole}`}
                  activeOpacity={0.6}
                  onPress={() => props.startEdit?.(p.id, hole, val)}
                  style={[
                    styles.scoreCell,
                    colIdx === 0 ? styles.firstScoreCol : undefined,
                  ]}
                >
                  <Text style={styles.bodyText}>
                    {typeof val === "number" ? String(val) : "–"}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
