import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#fff'
  },
  mainContainer: {
    display: 'flex',
    height: '100%',
    width: '100%',
    flexDirection: 'column',
    backgroundColor: '#fff'
  },
  logoContainer: {
    display: 'flex',
    width: '100%',
    height: '40%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  logo: {
    height: '70%',
    width: '70%'
  },
  inputFieldContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '25%',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '20%'
  },
  choiceText: {
    color: '#A0A0A0',
    margin: 6
  }
});

export default styles;