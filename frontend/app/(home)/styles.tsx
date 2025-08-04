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
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(202, 202, 202, 0.22)",
  },
  cloudContainer: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    width: "48%",
    justifyContent: "center",
    alignItems: "center",
  },
  verticleLine: {
    height: "80%",
    width: 2,
    backgroundColor: "#ffffffff",
  },
  temperatureContainer: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    width: "48%",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default styles;
