import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
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
  topDetailsContainer: {
    display: "flex",
    flexDirection: "column",
    height: "20%",
    width: "100%",
    justifyContent: "center",
    alignItems: "flex-end",
    paddingRight: 10,
  },
  moreDetailsLabel: {
    color: "#9c9c9cff",
    fontSize: 10,
    fontStyle: "normal",
    fontWeight: "500",
  },
  middleTempContainer: {
    display: "flex",
    flexDirection: "column",
    height: "55%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  tempLabel: {
    color: "#666",
    fontSize: 35,
    fontStyle: "normal",
    fontWeight: "500",
  },
  bottomTempContainer: {
    display: "flex",
    flexDirection: "row",
    height: "25%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  weatherLabelContainer: {
    display: "flex",
    flexDirection: "row",
    height: "100%",
    width: "25%",
    alignItems: "center",
    justifyContent: "center",
  },
  weatherLabel: {
    color: "#666",
    fontSize: 10,
    fontStyle: "normal",
    fontWeight: 400,
  },
  weatherLogo: {
    height: "30%",
    width: "30%",
  },
});

export default styles;
