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
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<{ type: 'current' | 'forecast' | 'history'; date: string } | null>(null);

  // Get date strings for history and forecast
  const today = getDateStr(0);
  const historyStart = getDateStr(-3);
  const historyEnd = getDateStr(-1);
  const forecastDays = 3;

  // Hooks
  const { data: current, loading: loadingCurrent, error: errorCurrent } = useCurrentWeather(coords);
  const { data: forecast, loading: loadingForecast, error: errorForecast } = useForecast(coords, forecastDays);
  const { data: history, loading: loadingHistory, error: errorHistory } = useHistory(coords, historyStart, historyEnd);

  // Location
  React.useEffect(() => {
    if (!coords) {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          pos => {
            setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude });
          },
          () => {
            setLocationError('Location permission denied or unavailable.');
          }
        );
      } else {
        setLocationError('Geolocation not supported.');
      }
    }
  }, [coords]);

  // Helper to get all days
  const days: Array<{ type: 'history' | 'current' | 'forecast'; date: string; data: any }> = [];
  if (history && history.historical) {
    Object.entries(history.historical).forEach(([date, data]) => {
      days.push({ type: 'history', date, data });
    });
  }
  if (current && current.location && current.current) {
    days.push({ type: 'current', date: today, data: { ...current.current, location: current.location } });
  }
  if (forecast && forecast.forecast) {
    Object.entries(forecast.forecast).forEach(([date, data]) => {
      days.push({ type: 'forecast', date, data });
    });
  }

  // Sort days by date
  days.sort((a, b) => a.date.localeCompare(b.date));

  // Selected day details
  const selected = selectedDay
    ? days.find(d => d.date === selectedDay.date && d.type === selectedDay.type)
    : days.find(d => d.type === 'current');

  return (
    <div className="App text-slate-700 p-4 rounded-lg">
      <h1>Weather App</h1>
      {locationError && <p style={{ color: 'orange' }}>{locationError}</p>}
      {(loadingCurrent || loadingForecast || loadingHistory) && <p>Loading...</p>}
      {(errorCurrent || errorForecast || errorHistory) && <p style={{ color: 'red' }}>{errorCurrent || errorForecast || errorHistory}</p>}
      <div className="grid grid-cols-3 gap-4 my-4">
        {days.map(day => (
          <div
            key={day.type + day.date}
            className={`cursor-pointer border rounded p-2 ${selectedDay && selectedDay.date === day.date && selectedDay.type === day.type ? 'bg-blue-100' : ''}`}
            onClick={() => setSelectedDay({ type: day.type, date: day.date })}
          >
            <div className="font-bold">{day.date}</div>
            <div>{day.data.weather_descriptions ? day.data.weather_descriptions[0] : day.data.weather?.[0]?.description}</div>
            <div>Temp: {day.data.temperature ?? day.data.temp ?? day.data.avgtemp}°C</div>
          </div>
        ))}
      </div>
      {selected && (
        <div className="mt-4 border rounded p-4 bg-white">
          <h2 className="font-bold text-lg">Details for {selected.date}</h2>
          <div>{selected.data.weather_descriptions ? selected.data.weather_descriptions[0] : selected.data.weather?.[0]?.description}</div>
          <div>Temperature: {selected.data.temperature ?? selected.data.temp ?? selected.data.avgtemp}°C</div>
          <div>Humidity: {selected.data.humidity ?? selected.data.main?.humidity}%</div>
          <div>Wind: {selected.data.wind_speed ?? selected.data.wind_speed} km/h</div>
          {selected.data.weather_icons && (
            <img src={selected.data.weather_icons[0]} alt="icon" />
          )}
        </div>
      )}
    </div>
  );
}

export default App
