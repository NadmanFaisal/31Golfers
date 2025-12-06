import { useState, useEffect, useCallback } from "react";
import { getWeather } from "../api/weather";

export function useWeather(token: string, location: string, date: Date) {
  const [weather, setWeather] = useState<any>(null);
  const [currentWeather, setCurrentWeather] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchWeather = useCallback(async () => {
    if (!token || !location || !date) return;

    // Optimization: If we already have weather for this day, don't refetch
    // Note: This simple check assumes the user stays on the same course.
    // If location changes, 'weather' would be irrelevant anyway so we should fetch.
    if (weather) {
      const weatherDate = new Date(weather.date);
      const requestedDate = new Date(date);
      if (weatherDate.toDateString() === requestedDate.toDateString()) {
        return;
      }
    }

    if (token === "GUEST") {
      setWeather(null);
      return;
    }

    setLoading(true);
    try {
      const response = await getWeather(token, location, date);

      if (!response?.hourlyForecasts?.length) {
        console.warn("No hourly forecasts available");
        setWeather(null);
        return;
      }

      setWeather(response);
    } catch (err) {
      console.error("Error in fetchWeather:", err);
      // If error (e.g. data missing), we might want to clear old weather to show error state?
      // Or keep old data? Let's clear to be safe and show "Unavailable".
      setWeather(null);
    } finally {
      setLoading(false);
    }
  }, [token, location, date]); // Removed 'weather' from dep to avoid loops, handled logic inside

  const updateSelectedHourWeather = useCallback(() => {
    if (!weather?.hourlyForecasts?.length) {
      setCurrentWeather(null);
      return;
    }

    const selectedHour = new Date(date).getHours();

    const match = weather.hourlyForecasts.find((forecast: any) => {
      const forecastHour = new Date(forecast.time).getHours();
      return forecastHour === selectedHour;
    });

    if (match) {
      console.log(`[useWeather] Updated weather for selected hour ${selectedHour}: ${match.temp_c}°C`);
      setCurrentWeather(match);
    } else {
      console.warn(`[useWeather] No forecast found for selected hour ${selectedHour}`);
      setCurrentWeather(null);
    }
  }, [weather, date]);

  // Fetch weather when location, token, or DATE (day) changes
  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  // Update selected hour when weather data updates OR date (hour) changes
  useEffect(() => {
    updateSelectedHourWeather();
  }, [weather, updateSelectedHourWeather]);

  return {
    weather,
    currentWeather,
    loading,
    error: (token === "GUEST")
      ? "Sign up to view weather"
      : (weather ? null : "Data not available"),
    refreshWeather: fetchWeather,
  };
}
