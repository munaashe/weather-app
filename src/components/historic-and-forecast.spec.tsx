import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import HistoricAndForecast from './historic-and-forecast';
import { vi } from 'vitest';

const WeatherIcon = vi.fn(() => <span data-testid="weather-icon" />);
const getWeatherDescription = vi.fn(() => 'Clear');

const days = [
  { type: "history" as const, date: "2025-08-28", data: { temperature_2m_max: 18, weathercode: 5 } },
  { type: "history" as const, date: "2025-08-29", data: { temperature_2m_max: 19, weathercode: 6 } },
  { type: "forecast" as const, date: "2025-09-01", data: { temperature_2m_max: 22, weathercode: 2 } },
];

describe('HistoricAndForecast', () => {
  it('renders loading skeleton', () => {
    render(<HistoricAndForecast days={days} loading WeatherIcon={WeatherIcon} getWeatherDescription={getWeatherDescription} selectedDay={null} setSelectedDay={() => {}} />);
    expect(screen.getAllByText(/Clear/i).length).toBe(0);
  });

  it('renders error message', () => {
    render(<HistoricAndForecast days={days} error="Error!" WeatherIcon={WeatherIcon} getWeatherDescription={getWeatherDescription} selectedDay={null} setSelectedDay={() => {}} />);
    expect(screen.getByText(/Error!/i)).toBeInTheDocument();
  });

  it('renders days and highlights selected', () => {
    render(<HistoricAndForecast days={days} WeatherIcon={WeatherIcon} getWeatherDescription={getWeatherDescription} selectedDay={days[1]} setSelectedDay={() => {}} />);
    expect(screen.getAllByTestId('weather-icon').length).toBe(3);
    expect(screen.getByText(/FRI/i)).toBeInTheDocument();
  });

  it('calls setSelectedDay when a day is clicked', () => {
    const setSelectedDay = vi.fn();
    render(<HistoricAndForecast days={days} WeatherIcon={WeatherIcon} getWeatherDescription={getWeatherDescription} selectedDay={null} setSelectedDay={setSelectedDay} />);
    fireEvent.click(screen.getByText(/FRI/i));
    expect(setSelectedDay).toHaveBeenCalled();
  });
});
