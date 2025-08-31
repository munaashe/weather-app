import './App.css';
import React, { useState } from 'react';
import { useCurrentWeather, useForecast, useHistory } from './hooks/useWeatherData';
import HistoricAndForecast from './components/historic-and-forecast';
import SelectedDayWeather from './components/selected-day-weather';
import WeatherIcon from './components/WeatherIcon';
import { getWeatherDescription } from './utils/getWeatherDescription';

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
  const [selectedDay, setSelectedDay] = useState<{
    type: 'history' | 'current' | 'forecast';
    date: string;
    data?: {
      temperature?: number;
      temperature_2m_max?: number;
      windspeed?: number;
      winddirection?: number;
      weathercode?: number;
      weatherDescription?: string;
      [key: string]: any;
    };
  } | null>({ type: 'current', date: getDateStr(0) });
  const [selectedLoading, setSelectedLoading] = useState(false);
  const [selectedError, setSelectedError] = useState<string | null>(null);

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
    const { time, temperature_2m_max, temperature_2m_min, weathercode, pressure, precipitation } = history.daily;
    time.forEach((date: string, i: number) => {
      days.push({
        type: 'history',
        date,
        data: {
          temperature_2m_max: temperature_2m_max[i],
          temperature_2m_min: temperature_2m_min[i],
          weathercode: weathercode[i],
          pressure: pressure ? pressure[i] : undefined,
          precip: precipitation ? precipitation[i] : undefined
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
        weathercode: current.current_weather.weathercode,
        pressure: current.current_weather.pressure,
        precip: current.current_weather.precipitation
      }
    });
  }
  // Forecast days
  if (forecast && forecast.daily) {
    const { time, temperature_2m_max, temperature_2m_min, weathercode, pressure, precipitation } = forecast.daily;
    time.forEach((date: string, i: number) => {
      days.push({
        type: 'forecast',
        date,
        data: {
          temperature_2m_max: temperature_2m_max[i],
          temperature_2m_min: temperature_2m_min[i],
          weathercode: weathercode[i],
          pressure: pressure ? pressure[i] : undefined,
          precip: precipitation ? precipitation[i] : undefined
        }
      });
    });
  }

  // Sort days by date
  days.sort((a, b) => a.date.localeCompare(b.date));

  // Selected day details
  const selected: {
    type: 'history' | 'current' | 'forecast';
    date: string;
    data: {
      temperature?: number;
      temperature_2m_max?: number;
      windspeed?: number;
      winddirection?: number;
      weathercode?: number;
      weatherDescription?: string;
      [key: string]: any;
    };
  } | null = selectedDay
      ? days.find(d => d.date === selectedDay.date && d.type === selectedDay.type) || null
      : days.find(d => d.type === 'current') || null;

  // Handle day selection and reload weather for that day
  const handleSelectDay = async (day: { type: 'history' | 'current' | 'forecast'; date: string }) => {
    setSelectedDay(day);
    setSelectedLoading(true);
    setSelectedError(null);
    try {
      // Simulate reload delay for skeleton
      await new Promise(res => setTimeout(res, 500));
    } catch (e: any) {
      setSelectedError(e.message || 'Failed to load weather');
    } finally {
      setSelectedLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-900">
      <div className="bg-slate-800 rounded-xl shadow-lg p-8 w-full max-w-lg text-white">
        {/* Location & Current Weather */}
        <SelectedDayWeather
          selected={selected}
          city={city}
          getWeatherDescription={getWeatherDescription}
          WeatherIcon={WeatherIcon}
          loading={selectedLoading || loadingCurrent || loadingForecast || loadingHistory}
          error={selectedError || errorCurrent || errorForecast || errorHistory}
        />
        {/* Forecast Row */}
        <HistoricAndForecast
          days={days}
          selectedDay={selectedDay as any}
          setSelectedDay={handleSelectDay as any}
          getWeatherDescription={getWeatherDescription}
          WeatherIcon={WeatherIcon}
          loading={loadingCurrent || loadingForecast || loadingHistory}
          error={errorCurrent || errorForecast || errorHistory}
        />
      </div>
    </div>
  );
}



export default App
