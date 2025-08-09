import { useEffect, useState } from 'react';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = import.meta.env.VITE_WEATHER_API_URL || 'https://api.weatherstack.com';

export function useCurrentWeather(coords: { lat: number; lon: number } | null) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!coords) return;
    setLoading(true);
    fetch(`${BASE_URL}/current?access_key=${API_KEY}&query=${coords.lat},${coords.lon}`, { method: 'GET' })
      .then(res => res.json())
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [coords]);

  return { data, loading, error };
}

export function useForecast(coords: { lat: number; lon: number } | null, days: number = 3) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!coords) return;
    setLoading(true);
    fetch(`${BASE_URL}/forecast?access_key=${API_KEY}&query=${coords.lat},${coords.lon}&forecast_days=${days}`, { method: 'GET' })
      .then(res => res.json())
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [coords, days]);

  return { data, loading, error };
}

export function useHistory(coords: { lat: number; lon: number } | null, start: string, end: string) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!coords || !start || !end) return;
    setLoading(true);
    fetch(`${BASE_URL}/historical?access_key=${API_KEY}&query=${coords.lat},${coords.lon}&historical_date_start=${start}&historical_date_end=${end}`, { method: 'GET' })
      .then(res => res.json())
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [coords, start, end]);

  return { data, loading, error };
}
