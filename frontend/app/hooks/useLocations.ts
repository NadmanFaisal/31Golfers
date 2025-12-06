import { useState, useCallback, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAllLocations } from "../api/location";

const COURSES_KEY = "GolfCourses";
const LOCATION_KEY = "Location";

export function useLocations(token: string) {
  const [location, setLocationState] = useState("");
  const [golfCourses, setGolfCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  /**
   * Updates the stored "Location" value in AsyncStorage and the local state.
   */
  const setLocation = useCallback(async (newLocation: string) => {
    await AsyncStorage.setItem(LOCATION_KEY, newLocation);
    setLocationState(newLocation);
  }, []);

  const fetchLocations = useCallback(async () => {
    if (!token) return;
    setLoading(true);

    // 1) Restore previously chosen location immediately (offline-first)
    const savedLocation = await AsyncStorage.getItem(LOCATION_KEY);
    if (savedLocation) setLocationState(savedLocation);

    try {
      // 2) Try online
      const response = await getAllLocations(token);
      const formatted = response.data.map((gc: any) => ({
        label: gc.name,
        value: gc.id,
        latitude: gc.latitude,
        longitude: gc.longitude,
      }));

      setGolfCourses(formatted);
      await AsyncStorage.setItem(COURSES_KEY, JSON.stringify(formatted));

      // 3) If we had no saved location, pick a default from the fresh list
      if (!savedLocation && formatted.length > 0) {
        await setLocation(formatted[0].label);
      }
    } catch (err) {
      console.error("Error in fetchLocations:", err);

      // 4) Offline fallback: use cached courses
      const cached = await AsyncStorage.getItem(COURSES_KEY);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          setGolfCourses(parsed);

          // 5) If we still don't have a location, pick first cached
          if (!savedLocation && parsed.length > 0) {
            await setLocation(parsed[0].label);
          }
        } catch (e) {
          console.warn("Failed to parse cached courses", e);
        }
      }
    } finally {
      setLoading(false);
    }
  }, [token, setLocation]);

  // Initial fetch when token is available
  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  return {
    location,
    setLocation,
    golfCourses,
    loading,
    refreshLocations: fetchLocations,
  };
}
