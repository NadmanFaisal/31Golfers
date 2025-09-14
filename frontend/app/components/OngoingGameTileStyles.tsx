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
  },
  navContainer: {
    display: "flex",
    flexDirection: "row",
    height: "30%",
    width: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
  },
});

export default styles;
