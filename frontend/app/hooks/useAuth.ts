import { useState, useEffect, useCallback } from "react";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { ROUTES } from "../../constants/routes";

export function useAuth() {
  const [token, setToken] = useState<string>("");
  const [userID, setUserID] = useState<string>("");
  const router = useRouter();

  const getToken = useCallback(async () => {
    try {
      const fetchedToken = await SecureStore.getItemAsync("token");
      if (!fetchedToken) {
        router.dismissTo(ROUTES.LOGIN);
      } else {
        setToken(fetchedToken);
      }
    } catch (e) {
      console.error("Failed to get token", e);
      router.dismissTo(ROUTES.LOGIN);
    }
  }, [router]);

  const getUserID = useCallback(async () => {
    try {
      const id = await AsyncStorage.getItem("UserID");
      if (id) {
        setUserID(id);
      }
    } catch (err) {
      console.error("Error getting user id:", err);
    }
  }, []);

  useEffect(() => {
    getToken();
    getUserID();
  }, [getToken, getUserID]);

  return { token, userID };
}
