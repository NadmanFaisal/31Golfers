import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  mainContainer: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    width: "100%",
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 15,
  },
  weatherContainer: {
    display: "flex",
    flexDirection: "row",
    height: "20%",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
  },
});

export default styles;
