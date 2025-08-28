import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  centeredView: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%",
  },
  gameCreateCenteredView: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "center",
    height: "100%",
    width: "100%",
  },
  modalView: {
    display: "flex",
    flexDirection: "column",
    height: "30%",
    width: "85%",
    backgroundColor: "white",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  gameCreateModalView: {
    display: "flex",
    flexDirection: "column",
    height: "85%",
    width: "100%",
    backgroundColor: "white",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    height: "20%",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
  },
  gameCreateButtonContainer: {
    display: "flex",
    flexDirection: "row",
    height: "10%",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
  },

  confirmationButton: {
    display: "flex",
    flexDirection: "column",
    height: "90%",
    width: "20%",
    alignItems: "center",
    justifyContent: "center",
  },
  textStyle: {
    color: "#275b97ff",
    fontWeight: "bold",
    textAlign: "center",
  },
  holeSelectorContainer: {
    display: "flex",
    flexDirection: "column",
    height: "20%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default styles;
