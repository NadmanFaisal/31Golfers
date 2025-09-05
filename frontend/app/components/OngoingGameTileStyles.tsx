import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  ongoingGameTile: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    padding: 10,
    backgroundColor: "rgba(202, 202, 202, 0.22)",
  },
  recommendedLabel: {
    color: "#5e5e5eff",
    fontSize: 26,
    fontStyle: "normal",
    fontWeight: "500",
  },
  infoContainer: {
    display: "flex",
    flexDirection: "row",
    borderRadius: 15,
    height: "70%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f7",
  },
  navContainer: {
    display: "flex",
    flexDirection: "row",
    height: "30%",
    width: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  // New table/scorecard styles
  scoreTableScroll: {
    marginTop: 6,
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: "#eee",
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
