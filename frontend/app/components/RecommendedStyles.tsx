import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  recommendedGameContainer: {
    display: "flex",
    flexDirection: "row",
    height: 100,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    padding: 10,
    backgroundColor: "rgba(202, 202, 202, 0.22)",
  },
  pictureContainer: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    width: "25%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    backgroundColor: "#0FBE41",
  },
  logoContainer: {
    height: "70%",
    width: "70%",
  },
  holeLabelContainer: {
    display: "flex",
    flexDirection: "column",
    height: "40%",
    width: "100%",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  holesLabel: {
    color: "#5e5e5eff",
    fontSize: 26,
    fontStyle: "normal",
    fontWeight: "500",
  },
  informationContainer: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    width: "60%",
    alignItems: "flex-start",
    justifyContent: "center",
    paddingLeft: 10,
  },
  informationLabelContainer: {
    display: "flex",
    flexDirection: "row",
    height: "30%",
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  informationPicture: {
    height: "100%",
    width: "6%",
  },
  gameInformationLabel: {
    color: "#5e5e5eff",
    fontSize: 13,
    fontStyle: "normal",
    fontWeight: "500",
    paddingLeft: 5,
  },
  createGameContainer: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    width: "15%",
    alignItems: "flex-start",
    justifyContent: "center",
  },
});

export default styles;
