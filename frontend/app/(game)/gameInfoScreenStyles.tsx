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
});

export default styles;
