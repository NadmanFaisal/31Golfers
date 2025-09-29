import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  scoreTableScroll: {
    marginTop: 6,
  },
  tableContainer: {
    borderRadius: 8,
    overflow: "hidden",
  },

  // Header
  headerRow: {
    flexDirection: "row",
    backgroundColor: "#f5f5f7",
  },
  nameHeaderCell: {
    width: 120,
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  holeHeaderCell: {
    width: 40,
    paddingVertical: 8,
    alignItems: "center",
    borderLeftWidth: 1,
    borderLeftColor: "#eee",
  },
  headerText: {
    fontWeight: "700",
    fontSize: 12,
    color: "#333",
  },

  // Rows
  rowBase: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  rowEven: {
    backgroundColor: "#fafafa",
  },
  rowOdd: {
    backgroundColor: "#fff",
  },

  // Cells
  nameCell: {
    width: 120,
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  holeCell: {
    width: 40,
    paddingVertical: 8,
    alignItems: "center",
    borderLeftWidth: 1,
    borderLeftColor: "#eee",
  },

  // Text
  playerText: {
    fontSize: 13,
    color: "#111",
  },
  cellText: {
    fontSize: 13,
    color: "#222",
  },
});

export default styles;
