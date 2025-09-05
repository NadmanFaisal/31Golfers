import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  mainContainer: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  scoreContainer: {
    display: "flex",
    flexDirection: "row",
    height: "90%",
    width: "100%",
    alignItems: "flex-start",
    justifyContent: "center",
    borderRadius: 15,
    backgroundColor: "rgba(202, 202, 202, 0.22)",
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    height: "10%",
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  tableWrap: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    flexGrow: 1,
  },
  headerRow: {
    flexDirection: "row",
    backgroundColor: "#f5f5f7",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderWidth: 1,
    borderColor: "#eee",
    overflow: "hidden",
  },
  headerCell: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderLeftWidth: 1,
    borderLeftColor: "#eee",
  },
  holeHeaderCell: {
    width: 56,
    borderLeftWidth: 0,
  },
  playerHeaderCell: {
    width: 112,
  },
  headerText: {
    fontWeight: "700",
    fontSize: 12,
    color: "#333",
  },
  bodyRow: {
    flexDirection: "row",
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
  },
  holeCell: {
    width: 56,
    paddingVertical: 8,
    paddingHorizontal: 8,
    justifyContent: "center",
  },
  scoreCell: {
    width: 112,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
    borderLeftWidth: 1,
    borderLeftColor: "#eee",
  },
  firstScoreCol: {},
  bodyText: {
    fontSize: 13,
    color: "#111",
  },
  cellInput: {
    width: "100%",
    textAlign: "center",
    fontSize: 14,
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
});

export default styles;
