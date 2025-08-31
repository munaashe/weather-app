import './App.css'
import React, { useState } from 'react';
import { useCurrentWeather, useForecast, useHistory } from './hooks/useWeatherData';

function getDateStr(offset: number) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
}

function App() {
  // Register service worker
  React.useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js');
    }
  }, []);
  // Use city name for weather hooks
  const city = 'Midrand, South Africa';
  const [selectedDay, setSelectedDay] = useState<{ type: 'current' | 'forecast' | 'history'; date: string } | null>(null);

  // Get date strings for history and forecast
  const today = getDateStr(0);
  const historyStart = getDateStr(-3);
  const historyEnd = getDateStr(-1);
  const forecastDays = 3;

  // Hooks
  const { data: current, loading: loadingCurrent, error: errorCurrent } = useCurrentWeather(city);
  const { data: forecast, loading: loadingForecast, error: errorForecast } = useForecast(city, forecastDays);
  const { data: history, loading: loadingHistory, error: errorHistory } = useHistory(city, historyStart, historyEnd);

  // Location
  // No geolocation logic needed

  // Helper to get all days
  const days: Array<{ type: 'history' | 'current' | 'forecast'; date: string; data: any }> = [];
  // History days
  if (history && history.daily) {
    const { time, temperature_2m_max, temperature_2m_min, weathercode } = history.daily;
    time.forEach((date: string, i: number) => {
      days.push({
        type: 'history',
        date,
        data: {
          temperature_2m_max: temperature_2m_max[i],
          temperature_2m_min: temperature_2m_min[i],
          weathercode: weathercode[i]
        }
      });
    });
  }
  // Current day
  if (current && current.current_weather) {
    days.push({
      type: 'current',
      date: today,
      data: {
        temperature: current.current_weather.temperature,
        windspeed: current.current_weather.windspeed,
        winddirection: current.current_weather.winddirection,
        weathercode: current.current_weather.weathercode
      }
    });
  }
  // Forecast days
  if (forecast && forecast.daily) {
    const { time, temperature_2m_max, temperature_2m_min, weathercode } = forecast.daily;
    time.forEach((date: string, i: number) => {
      days.push({
        type: 'forecast',
        date,
        data: {
          temperature_2m_max: temperature_2m_max[i],
          temperature_2m_min: temperature_2m_min[i],
          weathercode: weathercode[i]
        }
      });
    });
  }

  // Sort days by date
  days.sort((a, b) => a.date.localeCompare(b.date));

  // Selected day details
  const selected = selectedDay
    ? days.find(d => d.date === selectedDay.date && d.type === selectedDay.type)
    : days.find(d => d.type === 'current');

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-900">
      <div className="bg-slate-800 rounded-xl shadow-lg p-8 w-full max-w-md text-white">
        {/* Location & Current Weather */}
        <div className="mb-6 text-center">
          <div className="text-lg font-semibold mb-1">
            {city}
          </div>
          {selected && selected.type === 'current' && (
            <>
              <div className="flex flex-col items-center mb-2">
                <WeatherIcon code={selected.data.weathercode} size={48} />
                <div className="text-4xl font-bold">{selected.data.temperature}°c</div>
                <div className="text-lg">{getWeatherDescription(selected.data.weathercode)}</div>
              </div>
              <div className="flex justify-center gap-6 text-sm mt-2">
                <div>Wind: {selected.data.windspeed ?? '-'} kmph</div>
                <div>Pressure: {selected.data.pressure ?? '-'} mb</div>
                <div>Precip: {selected.data.precip ?? '0'} mm</div>
              </div>
            </>
          )}
        </div>
        {/* Forecast Row */}
        <div className="flex justify-between items-center bg-slate-700 rounded-lg p-3 mb-4">
          {days.filter(day => day.type !== 'current').map(day => (
            <div
              key={day.type + day.date}
              className={`flex flex-col items-center cursor-pointer px-2 ${selectedDay && selectedDay.date === day.date && selectedDay.type === day.type ? 'bg-blue-600 rounded-lg' : ''}`}
              onClick={() => setSelectedDay({ type: day.type, date: day.date })}
            >
              <div className="text-xs font-bold mb-1">{new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()}</div>
              <WeatherIcon code={day.data.weathercode} size={28} />
              <div className="mt-1 text-sm font-semibold">{day.data.temperature_2m_max ?? day.data.temperature ?? '-'}°c</div>
            </div>
          ))}
        </div>
        {/* Selected Day Details */}
        {selected && (
          <div className="bg-slate-700 rounded-lg p-4 mt-2">
            <div className="text-lg font-bold mb-2">{new Date(selected.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</div>
            <div className="flex items-center gap-3 mb-2">
              <WeatherIcon code={selected.data.weathercode} size={32} />
              <span className="text-xl font-bold">{selected.type === 'current' ? selected.data.temperature : selected.data.temperature_2m_max}°c</span>
              <span className="text-base">{getWeatherDescription(selected.data.weathercode)}</span>
            </div>
            {selected.data.windspeed && (
              <div>Wind: {selected.data.windspeed} kmph</div>
            )}
            {selected.data.winddirection && (
              <div>Wind Direction: {selected.data.winddirection}°</div>
            )}
          </div>
        )}
    {/* Errors & Loading */}
    {(loadingCurrent || loadingForecast || loadingHistory) && <p className="text-blue-300 mt-2">Loading...</p>}
    {(errorCurrent || errorForecast || errorHistory) && <p className="text-red-400 mt-2">{errorCurrent || errorForecast || errorHistory}</p>}
      </div>
    </div>
  );
}


// Helper for Open-Meteo weather codes
function getWeatherDescription(code: number | undefined): string {
  if (code === undefined) return '';
  const codes: Record<number, string> = {
    0: 'Sunny',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    56: 'Light freezing drizzle',
    57: 'Dense freezing drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    66: 'Light freezing rain',
    67: 'Heavy freezing rain',
    71: 'Slight snow fall',
    73: 'Moderate snow fall',
    75: 'Heavy snow fall',
    77: 'Snow grains',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    85: 'Slight snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail'
  };
  return codes[code] || 'Unknown';
}

// Weather icon component
function WeatherIcon({ code, size }: { code?: number; size?: number }) {
  // Simple SVGs for demo; you can replace with better icons or images
  if (code === 0) {
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="10" fill="#FFD700" /></svg>
    );
  }
  if (code === 2 || code === 3) {
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none"><ellipse cx="16" cy="20" rx="10" ry="6" fill="#B0C4DE" /><circle cx="12" cy="14" r="6" fill="#FFD700" /></svg>
    );
  }
  if (code === 45 || code === 48) {
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none"><ellipse cx="16" cy="20" rx="10" ry="6" fill="#B0C4DE" /><rect x="6" y="24" width="20" height="4" fill="#A9A9A9" /></svg>
    );
  }
  if (code === 61 || code === 63 || code === 65 || code === 80 || code === 81 || code === 82) {
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none"><ellipse cx="16" cy="20" rx="10" ry="6" fill="#B0C4DE" /><line x1="10" y1="28" x2="10" y2="32" stroke="#00BFFF" strokeWidth="2" /><line x1="22" y1="28" x2="22" y2="32" stroke="#00BFFF" strokeWidth="2" /></svg>
    );
  }
  if (code === 71 || code === 73 || code === 75 || code === 77 || code === 85 || code === 86) {
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none"><ellipse cx="16" cy="20" rx="10" ry="6" fill="#B0C4DE" /><circle cx="10" cy="28" r="2" fill="#ADD8E6" /><circle cx="22" cy="28" r="2" fill="#ADD8E6" /></svg>
    );
  }
  if (code === 95 || code === 96 || code === 99) {
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none"><ellipse cx="16" cy="20" rx="10" ry="6" fill="#B0C4DE" /><polygon points="16,24 18,28 14,28" fill="#FFD700" /><line x1="16" y1="28" x2="16" y2="32" stroke="#FFD700" strokeWidth="2" /></svg>
    );
  }
  // Default: cloud
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none"><ellipse cx="16" cy="20" rx="10" ry="6" fill="#B0C4DE" /></svg>
  );
}

export default App
