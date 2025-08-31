# Weather App

## Overview
This is a modern weather application built with React, TypeScript (TSX), and Tailwind CSS. It fetches weather data from the Open-Meteo API and provides users with current, historical, and forecast weather information in a beautiful, responsive UI.

## Tech Stack & Justification

- **TypeScript (TSX):**
  - Ensures type safety and reduces runtime errors.
  - Improves code maintainability and developer experience.
  - TSX allows for strongly-typed React components, making the codebase robust and scalable.

- **Tailwind CSS:**
  - Utility-first CSS framework for rapid UI development.
  - Enables consistent, responsive, and modern design with minimal custom CSS.
  - Great for prototyping and production-ready styling.

- **Open-Meteo API:**
  - Free, fast, and reliable weather data source.
  - Provides endpoints for current, historical, and forecast weather.
  - No API key required, making integration simple and accessible.

## Features
- Current weather, historical data, and multi-day forecast.
- Loading and error states with skeleton UI.
- Clickable days to view detailed weather.
- Responsive and accessible design.

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Run the app locally:**
   ```bash
   npm run dev
   ```
3. **Run tests (Vitest):**
   ```bash
   npm run test
   ```

## Project Structure

- `src/App.tsx` — Main app logic and layout
- `src/components/selected-day-weather.tsx` — Detailed weather for selected day
- `src/components/historic-and-forecast.tsx` — Historic and forecast weather row
- `src/hooks/useWeatherData.ts` — Data fetching hooks
- `src/utils/types.ts` — TypeScript types

## API Reference

Uses [Open-Meteo API](https://open-meteo.com/) for weather data. No API key required.

## License

MIT
