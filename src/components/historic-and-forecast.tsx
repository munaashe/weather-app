import React from 'react';

interface HistoricAndForecastProps {
    days: Array<{ type: 'history' | 'current' | 'forecast'; date: string; data: any }>;
    selectedDay: { type: 'history' | 'current' | 'forecast'; date: string } | null;
    setSelectedDay: React.Dispatch<React.SetStateAction<{ type: 'history' | 'current' | 'forecast'; date: string } | null>>;
    getWeatherDescription: (code: number | undefined) => string;
    WeatherIcon: React.FC<{ code?: number; size?: number }>;
    loading?: boolean;
    error?: string | null;
}

const HistoricAndForecast: React.FC<HistoricAndForecastProps> = ({ days, selectedDay, setSelectedDay, WeatherIcon, loading, error }) => {
    // Skeleton loader for 3 days
    const skeletons = Array(3).fill(0);
    return (
        <div className="flex justify-between items-center rounded-lg mb-4 w-full">
            {loading ? (
                skeletons.map((_, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center px-2 animate-pulse">
                        <div className="h-4 w-10 bg-slate-700 rounded mb-1" />
                        <div className="h-7 w-7 bg-slate-700 rounded-full mb-1" />
                        <div className="h-4 w-12 bg-slate-700 rounded mb-1" />
                        <div className="h-3 w-16 bg-slate-700 rounded" />
                    </div>
                ))
            ) : error ? (
                <div className="w-full text-center text-red-400 py-4">{error}</div>
            ) : (
                days.filter(day => day.type !== 'current').map(day => (
                    <div
                        key={day.type + day.date}
                        className={`flex-1 flex flex-col items-center cursor-pointer px-2 transition-all duration-150 ${selectedDay && selectedDay.date === day.date && selectedDay.type === day.type ? 'bg-slate-600 ring-1 ring-slate-400 rounded-lg scale-105' : ''}`}
                        onClick={() => setSelectedDay({ type: day.type, date: day.date })}
                    >
                        <div className="text-xs font-bold mb-1">{new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()}</div>
                        <WeatherIcon code={day.data.weathercode} size={28} />
                        <div className="mt-1 text-sm font-semibold">{day.data.temperature_2m_max ?? day.data.temperature ?? '-'}°c</div>
                    </div>
                ))
            )}
        </div>
    );
};

export default HistoricAndForecast;
