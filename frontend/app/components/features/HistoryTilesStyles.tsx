import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  historyContainer: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "100%",
  },
  noGameTile: {
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
  noGameLabel: {
    color: "#5e5e5eff",
    fontSize: 26,
    fontStyle: "normal",
    fontWeight: "500",
  },
  historyGameContainer: {
    display: "flex",
    flexDirection: "column",
    height: 210,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "rgba(202, 202, 202, 0.22)",
  },
  labelContainer: {
    display: "flex",
    flexDirection: "row",
    height: "10%",
    width: "100%",
  },
  label: {
    color: "#5e5e5eff",
    fontSize: 16,
    fontWeight: 500,
  },
  scoreTable: {
    display: "flex",
    flexDirection: "row",
    height: "70%",
    width: "100%",
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: "20%",
    width: "100%",
  },
});

export default styles;
