import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  mainContainer: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    width: "100%",
    padding: 15,
    // paddingRight: 15,
    // paddingTop: 15,
  },
  weatherContainer: {
    display: "flex",
    flexDirection: "row",
    height: "25%",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectionContainer: {
    display: "flex",
    flexDirection: "column",
    height: "25%",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 5,
  },
  upperSelectionContainer: {
    display: "flex",
    flexDirection: "row",
    height: "50%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  lowerSelectionContainer: {
    display: "flex",
    flexDirection: "row",
    height: "50%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  gameRecommendationContainer: {
    display: "flex",
    flexDirection: "column",
    height: "25%",
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  recommendedTitleContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    height: 50,
    width: "100%",
  },
  recommendedTitleLabel: {
    color: "#5e5e5eff",
    fontSize: 24,
    fontWeight: 500,
  },
  footerNavigationContainer: {
    display: "flex",
    flexDirection: "column",
    height: "10%",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
  },
});

export default styles;
