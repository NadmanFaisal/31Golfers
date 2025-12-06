import React from "react";
import { Stack, useSegments } from "expo-router";
import { View, StyleSheet } from "react-native";
import Footer from "./components/layout/Footer";

export default function RootLayout() {
  // Responsible for not showing the footer in
  // login and signup screens
  const segments = useSegments();
  const showFooter = segments[0] !== "(auth)";

  return (
    <View style={styles.container}>
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
        <Stack.Screen name="(game)/gameInfoScreen" />
        <Stack.Screen name="settings" />
      </Stack>

      {showFooter && <Footer />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
