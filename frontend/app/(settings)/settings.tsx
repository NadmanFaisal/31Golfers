import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React from "react";
import { Button, SafeAreaView } from "react-native";
import * as SecureStore from "expo-secure-store";

export default function SettingsScreem() {
  const handleLogout = async () => {
    // Deletes the token for new token to be stored
    SecureStore.deleteItemAsync("token");
    await AsyncStorage.removeItem("Location");
    router.dismissTo("/(auth)/login");
  };

  return (
    <SafeAreaView>
      <Button
        onPress={() => handleLogout()}
        title="Log out"
        color="#841584"
        accessibilityLabel="Sign up as a user!"
      />
    </SafeAreaView>
  );
}
