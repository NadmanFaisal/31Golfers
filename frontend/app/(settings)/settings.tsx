import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { useAuth } from "../hooks/useAuth";

export default function SettingsScreen() {
  const router = useRouter(); // Added useRouter hook
  const { token, userID } = useAuth(); // Destructure token and userID from useAuth
  const [username, setUsername] = useState(""); // Changed initial state to empty string
  const [email, setEmail] = useState(""); // Changed initial state to empty string

  useEffect(() => {
    const loadUserData = async () => {
      // The token is now managed by useAuth, so we don't set it here.
      // We can still check SecureStore if useAuth's token might be delayed or for a fallback.
      const storedToken = await SecureStore.getItemAsync("token"); // Still fetching from SecureStore for consistency check or initial load

      // Use the token from useAuth if available, otherwise fallback to storedToken
      const currentToken = token || storedToken;

      if (token && token !== "GUEST") {
        const storedUsername = await AsyncStorage.getItem("Username");
        const storedEmail = await AsyncStorage.getItem("Email");
        if (storedUsername) setUsername(storedUsername);
        if (storedEmail) setEmail(storedEmail);
      }
    };
    loadUserData();
  }, [token]);

  const handleLogout = async () => {
    // Deletes the token for new token to be stored
    SecureStore.deleteItemAsync("token");
    await AsyncStorage.removeItem("Location");
    await AsyncStorage.removeItem("Email");
    await AsyncStorage.removeItem("Username");
    await AsyncStorage.removeItem("UserID");
    router.dismissTo("/(auth)/login");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 50 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>

          {token === "GUEST" ? (
            <>
              <Text style={[styles.sectionItemText, { marginBottom: 15, color: '#666' }]}>
                You are currently using Guest Mode. Login or Sign Up to save your data to the cloud and access features like Weather Prediction.
              </Text>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: '#3B82F6', marginBottom: 10 }]}
                onPress={handleLogout} // Handle logout effectively clears guest token and goes to login
              >
                <Text style={styles.buttonText}>Log In / Sign Up</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View style={styles.itemRow}>
                <Text style={styles.sectionItemText}>Username</Text>
                <Text style={styles.valueText}>{username || "User"}</Text>
              </View>
              <View style={styles.separator} />
              <View style={styles.itemRow}>
                <Text style={styles.sectionItemText}>Email</Text>
                <Text style={styles.valueText}>{email || "user@example.com"}</Text>
              </View>

              <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutText}>Log Out</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.itemRow}>
            <Text style={styles.sectionItemText}>Version</Text>
            <Text style={styles.valueText}>1.0.0</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7", // iOS system gray
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  backButton: {
    padding: 5,
  },
  backButtonText: {
    fontSize: 16,
    color: "#007AFF",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  content: {
    padding: 20,
  },
  section: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#8E8E93",
    textTransform: "uppercase",
    marginBottom: 10,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  sectionItemText: {
    fontSize: 16,
    color: "#000",
  },
  valueText: {
    fontSize: 16,
    color: "#8E8E93",
  },
  separator: {
    height: 1,
    backgroundColor: "#E5E5EA",
    marginVertical: 5,
  },
  logoutButton: {
    marginTop: 15,
    alignItems: "center",
    paddingVertical: 10,
  },
  logoutText: {
    color: "#FF3B30", // System Red
    fontSize: 16,
    fontWeight: "600",
  },
  button: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16
  }
});
