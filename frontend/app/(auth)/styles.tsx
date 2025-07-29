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
    height: '50%',
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
    height: '30%'
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '20%'
  }
});

export default styles;