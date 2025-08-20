import { Href, Stack, usePathname, useRouter, useSegments } from "expo-router";
import { useState } from "react";
import { View, Image, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function RootLayout() {
  // Responsible for not showing the footer in
  // login and signup screens
  const segments = useSegments();
  const showFooter = segments[0] !== "(auth)";

  return (
    <View style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)/signup" />
        <Stack.Screen name="(auth)/login" />
        <Stack.Screen name="(home)/home" />
        <Stack.Screen name="(game)/game" />
        <Stack.Screen name="settings" />
      </Stack>

      {showFooter && <Footer />}
    </View>
  );
}

function Footer() {
  // Keep track of current route to not re-enter the same screen
  // Set to home as this is the first screen after login/signup
  const [currentRoute, setCurrentRoute] = useState("/(home)/home");
  const router = useRouter();
  const pathname = usePathname();

  /**
   * Changes screen (ex: home -> settings)
   * @param path The destination screen path
   */
  const changeScreen = (path: Href) => {
    // Get the path from expo router, and
    // prevent re-entering to the same screen.
    // pathName helps to keep consistent if navigation
    // is done without the footer bar
    if (pathname !== path) {
      router.replace(path); // `path` stays typed as Href
    }
  };

  return (
    <View style={styles.footerContainer}>
      <TouchableOpacity
        onPress={() => changeScreen("/home")}
        style={styles.navButton}
      >
        <Image
          style={styles.navLogo}
          source={require("../assets/images/home_icon.png")}
          resizeMode="contain"
        />
        <Text style={styles.navText}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => changeScreen("/game")}
        style={styles.navButton}
      >
        <Image
          style={styles.navLogo}
          source={require("../assets/images/game_icon.png")}
          resizeMode="contain"
        />
        <Text style={styles.navText}>Game</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => changeScreen("/settings")}
        style={styles.navButton}
      >
        <Image
          style={styles.navLogo}
          source={require("../assets/images/settings_icon.png")}
          resizeMode="contain"
        />
        <Text style={styles.navText}>Settings</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  footerContainer: {
    display: "flex",
    flexDirection: "row",
    height: "10%",
    width: "100%",
    backgroundColor: "#0FBE41",
    justifyContent: "center",
    alignItems: "center",
  },
  navButton: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    width: "25%",
    justifyContent: "center",
    alignItems: "center",
  },
  navLogo: {
    height: "30%",
    width: "30%",
  },
  navText: {
    fontSize: 14,
    padding: 5,
    color: "white",
  },
  activeText: {
    fontWeight: "bold",
    opacity: 1,
  },
});
