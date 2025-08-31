
// Open-Meteo types
export interface OMCurrentWeather {
    temperature: number;
    windspeed: number;
    winddirection: number;
    weathercode: number;
    pressure: number;
    precipitation: number;
    time: string;
}

export interface OMForecastDay {
    date: string;
    temperature_2m_max: number;
    temperature_2m_min: number;
    weathercode: number;
    pressure: number;
    precipitation: number;
}

export interface OMForecastResponse {
    daily: {
        time: string[];
        temperature_2m_max: number[];
        temperature_2m_min: number[];
        weathercode: number[];
        pressure: number[];
        precipitation: number[];
    };
}

export interface OMHistoryResponse {
    daily: {
        time: string[];
        temperature_2m_max: number[];
        temperature_2m_min: number[];
        weathercode: number[];
        pressure: number[];
        precipitation: number[];
    };
}

export interface OMCurrentResponse {
    current_weather: OMCurrentWeather;
}
