import { Link } from "expo-router";
import { Text, View } from "react-native";
import SignupScreen from './(signup)/signup'

export default function Index() {
  return (
    // <View
    //   style={{
    //     flex: 1,
    //     justifyContent: "center",
    //     alignItems: "center",
    //   }}
    // >
    //   <Link href="/signup">View signup screen</Link>
    // </View>
    <SignupScreen />
  );
}
