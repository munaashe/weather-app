import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import { vi } from 'vitest';

// Mock hooks and components
vi.mock('./hooks/useWeatherData', () => ({
  useCurrentWeather: () => ({ data: { current_weather: { temperature: 20, windspeed: 10, winddirection: 180, weathercode: 1, pressure: 1012, precipitation: 2 } }, loading: false, error: null }),
  useForecast: () => ({ data: { daily: { time: ['2025-08-31', '2025-09-01', '2025-09-02'], temperature_2m_max: [22, 23, 24], temperature_2m_min: [12, 13, 14], weathercode: [2, 3, 4], precipitation_sum: [1, 2, 3] } }, loading: false, error: null }),
  useHistory: () => ({ data: { daily: { time: ['2025-08-28', '2025-08-29', '2025-08-30'], temperature_2m_max: [18, 19, 20], temperature_2m_min: [8, 9, 10], weathercode: [5, 6, 7], precipitation_sum: [0, 1, 2] } }, loading: false, error: null })
}));

vi.mock('./components/WeatherIcon', () => ({
  default: () => <span data-testid="weather-icon" />
}));

vi.mock('./utils/getWeatherDescription', () => ({
  getWeatherDescription: () => 'Clear'
}));

describe('App', () => {
  it('renders without crashing and shows current weather', () => {
    render(<App />);
    expect(screen.getByText(/Midrand, South Africa/i)).toBeInTheDocument();
    expect(screen.getByText(/20°c/i)).toBeInTheDocument();
    expect(screen.getByText(/Wind: 10 kmph/i)).toBeInTheDocument();
    expect(screen.getByText(/Pressure: 1012 mb/i)).toBeInTheDocument();
    expect(screen.getByText(/Precip: 2 mm/i)).toBeInTheDocument();
  });

  it('renders forecast and history days', () => {
    render(<App />);
    expect(screen.getAllByTestId('weather-icon').length).toBeGreaterThan(1);
    expect(screen.getByText(/18°c/i)).toBeInTheDocument();
    expect(screen.getByText(/22°c/i)).toBeInTheDocument();
  });

  it('changes selected day when clicked', () => {
    render(<App />);
    const day = screen.getByText(/SAT/i); // Example: Saturday
    fireEvent.click(day);
    expect(screen.getByText(/19°c/i)).toBeInTheDocument();
  });
});
