import { useEffect, useState } from 'react';

function getCachedWeather(city: string) {
  const cached = localStorage.getItem(`weather_${city}`);
  if (!cached) return null;
  const { data, timestamp } = JSON.parse(cached);
  if (Date.now() - timestamp > 30 * 60 * 1000) return null;
  return data;
}

function setCachedWeather(city: string, data: any) {
  localStorage.setItem(
    `weather_${city}`,
    JSON.stringify({ data, timestamp: Date.now() })
  );
}

export function useWeather(city: string) {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchWeather() {
      setLoading(true);
      setError(null);
      const cached = getCachedWeather(city);
      if (cached) {
        setWeather(cached);
        setLoading(false);
        return;
      }
      try {
        const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
        const WEATHER_API_URL = import.meta.env.VITE_WEATHER_API_URL;
        const res = await fetch(
          `${WEATHER_API_URL}?q=${city}&appid=${API_KEY}&units=metric`
        );
        if (!res.ok) throw new Error('Failed to fetch weather');
        const data = await res.json();
        setWeather(data);
        setCachedWeather(city, data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchWeather();
  }, [city]);

  return { weather, loading, error };
}
