import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  mainContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "100%",
    padding: 10,
  },
  recomGameContainer: {
    display: "flex",
    flexDirection: "column",
    height: "30%",
    width: "100%",
    padding: 5,
  },
  historyContainer: {
    display: "flex",
    flexDirection: "column",
    height: "70%",
    width: "100%",
    padding: 5,
  },
  historyLabelContainer: {
    display: "flex",
    flexDirection: "column",
    height: "10%",
    width: "100%",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  label: {
    color: "#5e5e5eff",
    fontSize: 24,
    fontWeight: 500,
  },
  historyGameContainer: {
    display: "flex",
    flexDirection: "column",
    height: "90%",
    width: "100%",
  },
});

export default styles;
