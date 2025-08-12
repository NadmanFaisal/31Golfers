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
    height: "30%",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectionContainer: {
    display: "flex",
    flexDirection: "row",
    height: "15%",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
  },
  gameRecommendationContainer: {
    display: "flex",
    flexDirection: "column",
    height: "45%",
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
