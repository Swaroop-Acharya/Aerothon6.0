import React, { useState } from 'react';
import { Vega } from 'react-vega';

export default function WeatherDashboard() {
    const [city, setCity] = useState('');
    const [weatherData, setWeatherData] = useState(null);

    const getWeatherData = async () => {
        try {
            const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=1b210d1d620743888e4113504241805&q=${city}`);
            const data = await response.json();
            console.log(data)
            setWeatherData(data);
        } catch (error) {
            console.error('Error fetching weather data:', error);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        getWeatherData();
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Weather Dashboard</h1>
            <form onSubmit={handleSubmit} className="mb-4">
                <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Enter city name"
                    className="border border-gray-300 rounded px-3 py-2 mr-2"
                />
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                    Get Weather
                </button>
            </form>
            {weatherData && (
                <div className="grid grid-cols-2 gap-4">
                    <div className="border border-gray-300 rounded p-4">
                        <h2 className="text-xl font-semibold mb-2">{weatherData.location.name}</h2>
                        <p>Condition: {weatherData.current.condition.text}</p>
                        <p>Temperature: {weatherData.current.temp_c}°C / {weatherData.current.temp_f}°F</p>
                        <p>Wind: {weatherData.current.wind_kph} kph from {weatherData.current.wind_dir}</p>
                        <p>Humidity: {weatherData.current.humidity}%</p>
                        <p>Pressure: {weatherData.current.pressure_mb} mb</p>
                        <p>Visibility: {weatherData.current.vis_km} km</p>
                        <p>Last Updated: {weatherData.current.last_updated}</p>
                    </div>
                    <div className="border border-gray-300 rounded p-4">
                        <h2 className="text-xl font-semibold mb-2">Temperature Chart</h2>
                        <Vega spec={{
                            "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
                            "description": "Temperature Chart",
                            "data": {
                                "values": [
                                    { "type": "Celsius", "value": weatherData.current.temp_c },
                                    { "type": "Fahrenheit", "value": weatherData.current.temp_f }
                                ]
                            },
                            "mark": "bar",
                            "encoding": {
                                "x": { "field": "type", "type": "nominal" },
                                "y": { "field": "value", "type": "quantitative" }
                            }
                        }} />
                    </div>
                    <div className="border border-gray-300 rounded p-4">
                        <h2 className="text-xl font-semibold mb-2">Wind Speed Chart</h2>
                        <Vega spec={{
                            "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
                            "description": "Wind Speed Chart",
                            "data": {
                                "values": [
                                    { "speed": weatherData.current.wind_kph, "unit": "kph" },
                                    { "speed": weatherData.current.wind_mph, "unit": "mph" }
                                ]
                            },
                            "mark": "bar",
                            "encoding": {
                                "x": { "field": "unit", "type": "nominal" },
                                "y": { "field": "speed", "type": "quantitative" }
                            }
                        }} />
                    </div>
                    <div className="border border-gray-300 rounded p-4">
                        <h2 className="text-xl font-semibold mb-2">Humidity Chart</h2>
                        <Vega spec={{
                            "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
                            "description": "Humidity Chart",
                            "data": {
                                "values": [{ "humidity": weatherData.current.humidity }]
                            },
                            "mark": "bar",
                            "encoding": {
                                "x": { "field": "humidity", "type": "quantitative" }
                            }
                        }} />
                    </div>
                    <div className="border border-gray-300 rounded p-4">
                        <h2 className="text-xl font-semibold mb-2">Precipitation Chart</h2>
                        <Vega spec={{
                            "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
                            "description": "Precipitation Chart",
                            "data": {
                                "values": [{ "mm": weatherData.current.precip_mm, "inches": weatherData.current.precip_in }]
                            },
                            "mark": "bar",
                            "encoding": {
                                "x": { "field": "precip_mm", "type": "quantitative" },
                                "y": { "field": "precip_in", "type": "quantitative" }
                            }
                        }} />
                    </div>
                </div>
            )}
        </div>
    );
}
