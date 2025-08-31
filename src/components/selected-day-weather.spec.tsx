import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import SelectedDayWeather from './selected-day-weather';
import { vi } from 'vitest';

const WeatherIcon = vi.fn(() => <span data-testid="weather-icon" />);
const getWeatherDescription = vi.fn(() => 'Clear');

const baseProps = {
  city: 'Midrand, South Africa',
  getWeatherDescription,
  WeatherIcon,
};

describe('SelectedDayWeather', () => {
  it('renders loading skeleton', () => {
    render(
      <SelectedDayWeather
        {...baseProps}
        loading
        selected={{
          type: 'current',
          date: '2025-08-31',
          data: {
            temperature: 20,
            windspeed: 10,
            pressure: 1012,
            precip: 2,
            weathercode: 1,
          },
        }}
      />
    );
    expect(screen.getByText(/Midrand, South Africa/i)).toBeInTheDocument();
  });

  it('renders error message', () => {
    render(
      <SelectedDayWeather
        {...baseProps}
        error="Error!"
        selected={{
          type: 'current',
          date: '2025-08-31',
          data: {
            temperature: 20,
            windspeed: 10,
            pressure: 1012,
            precip: 2,
            weathercode: 1,
          },
        }}
      />
    );
    expect(screen.getByText(/Error!/i)).toBeInTheDocument();
  });

  it('renders weather data', () => {
    render(
      <SelectedDayWeather
        {...baseProps}
        selected={{
          type: 'current',
          date: '2025-08-31',
          data: {
            temperature: 20,
            windspeed: 10,
            pressure: 1012,
            precip: 2,
            weathercode: 1,
          },
        }}
      />
    );
    expect(screen.getByText(/20°c/i)).toBeInTheDocument();
    expect(screen.getByText(/Wind: 10 kmph/i)).toBeInTheDocument();
    expect(screen.getByText(/Pressure: 1012 mb/i)).toBeInTheDocument();
    expect(screen.getByText(/Precip: 2 mm/i)).toBeInTheDocument();
  });
});
