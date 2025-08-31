import React from 'react';

interface SelectedDayWeatherProps {
    selected:
    | {
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
    }
    | null;
    city?: string;
    getWeatherDescription: (code: number | undefined) => string;
    WeatherIcon: React.FC<{ code?: number; size?: number }>;
    loading?: boolean;
    error?: string | null;
}

const SelectedDayWeather: React.FC<SelectedDayWeatherProps> = ({
    selected,
    city,
    getWeatherDescription,
    WeatherIcon,
    loading,
    error
}) => {
    if (loading) {
        // Skeleton loader with fixed dimensions
        return (
            <div className="mb-6 text-center">
                <div className="text-2xl font-semibold mb-6">
                    <span className="inline-block h-8 w-32 bg-slate-700 rounded animate-pulse" />
                </div>
                <div className='w-full flex items-center justify-between'>
                    <div className="flex flex-col items-center mb-2">
                        <span className="h-12 w-12 bg-slate-700 rounded-full mb-2 animate-pulse" />
                        <span className="h-6 w-24 bg-slate-700 rounded animate-pulse" />
                    </div>
                    <span className="h-10 w-20 bg-slate-700 rounded animate-pulse" />
                    <div className="flex flex-col items-start">
                        <span className="h-4 w-24 bg-slate-700 rounded mb-1 animate-pulse" />
                        <span className="h-4 w-24 bg-slate-700 rounded mb-1 animate-pulse" />
                        <span className="h-4 w-24 bg-slate-700 rounded animate-pulse" />
                    </div>
                </div>
            </div>
        );
    }
    if (error) {
        return <div className="mb-6 text-center text-red-400">{error}</div>;
    }
    if (!selected) return null;
    return (
        <div className="mb-6 text-center">
            <div className="text-2xl font-semibold mb-6">
                {city}
            </div>
            <div className='w-full flex items-center justify-between'>
                <div className="flex flex-col items-center mb-2">
                    <WeatherIcon code={selected.data.weathercode} size={48} />
                    <div className="text-lg">{getWeatherDescription(selected.data.weathercode)}</div>
                </div>
                <div className="text-4xl font-bold">{selected.data.temperature ?? selected.data.temperature_2m_max ?? '-'}°c</div>
                <div className="flex flex-col items-start">
                    <div>Wind: {selected.data.windspeed ?? '-'} kmph</div>
                    <div>Pressure: {selected.data.pressure ?? '-'} mb</div>
                    <div>Precip: {selected.data.precip ?? selected.data.precipitation ?? '0'} mm</div>
                </div>
            </div>
        </div>
    );
};

export default SelectedDayWeather;
