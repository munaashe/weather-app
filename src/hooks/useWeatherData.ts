import { useEffect, useState } from 'react';

import type { OMCurrentResponse, OMForecastResponse, OMHistoryResponse } from '../utils/types';

const BASE_URL = import.meta.env.VITE_WEATHER_API_URL;
const GEOCODING_URL = import.meta.env.VITE_GEOCODING_API_URL;

function useCurrentWeather(city: string) {
    const [data, setData] = useState<OMCurrentResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!city) return;
        setLoading(true);
        // Get lat/lon from city name using Open-Meteo geocoding
    fetch(`${GEOCODING_URL}?name=${encodeURIComponent(city)}`)
            .then(res => res.json())
            .then(geo => {
                if (geo && geo.results && geo.results.length > 0) {
                    const { latitude, longitude } = geo.results[0];
                    return fetch(`${BASE_URL}?latitude=${latitude}&longitude=${longitude}&current_weather=true&pressure=true&precipitation=true`)
                        .then(res => res.json());
                } else {
                    throw new Error('City not found');
                }
            })
            .then(setData)
            .catch(e => setError(e.message))
            .finally(() => setLoading(false));
    }, [city]);

    return { data, loading, error };
}

function useForecast(city: string, days: number = 3) {
    const [data, setData] = useState<OMForecastResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!city) return;
        setLoading(true);
        const start = new Date();
        const end = new Date();
        end.setDate(start.getDate() + days);
        const startStr = start.toISOString().slice(0, 10);
        const endStr = end.toISOString().slice(0, 10);
    fetch(`${GEOCODING_URL}?name=${encodeURIComponent(city)}`)
            .then(res => res.json())
            .then(geo => {
                if (geo && geo.results && geo.results.length > 0) {
                    const { latitude, longitude } = geo.results[0];
                    return fetch(`${BASE_URL}?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,weathercode,precipitation_sum&start_date=${startStr}&end_date=${endStr}`)
                        .then(res => res.json());
                } else {
                    throw new Error('City not found');
                }
            })
            .then(setData)
            .catch(e => setError(e.message))
            .finally(() => setLoading(false));
    }, [city, days]);

    return { data, loading, error };
}

function useHistory(city: string, start: string, end: string) {
    const [data, setData] = useState<OMHistoryResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!city || !start || !end) return;
        setLoading(true);
    fetch(`${GEOCODING_URL}?name=${encodeURIComponent(city)}`)
            .then(res => res.json())
            .then(geo => {
                if (geo && geo.results && geo.results.length > 0) {
                    const { latitude, longitude } = geo.results[0];
                    return fetch(`${BASE_URL}?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,weathercode,precipitation_sum&start_date=${start}&end_date=${end}`)
                        .then(res => res.json());
                } else {
                    throw new Error('City not found');
                }
            })
            .then(setData)
            .catch(e => setError(e.message))
            .finally(() => setLoading(false));
    }, [city, start, end]);

    return { data, loading, error };
}

export {
    useHistory,
    useForecast,
    useCurrentWeather
}