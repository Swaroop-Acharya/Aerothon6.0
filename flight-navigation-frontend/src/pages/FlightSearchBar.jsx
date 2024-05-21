import React, { useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import FlightForm from "./FlightForm";
import FlightMap from "./FlightMap";
import FlightInfo from "./FlightInfo";
import WeatherCard from "./WeatherCard";

export default function FlightSearchBar() {
  const [fromAirport, setFromAirport] = useState("");
  const [toAirport, setToAirport] = useState("");
  const [flightType, setFlightType] = useState("takeoff");
  const [route, setRoute] = useState(null);
  const [kilometers, setKilometers] = useState(null);
  const [fromAirportInfo, setFromAirportInfo] = useState(null);
  const [toAirportInfo, setToAirportInfo] = useState(null);
  const [weatherData, setWeatherData] = useState(null);

  function checkWeatherConditions(weatherData, location) {
    const minVisibility = 1.0;
    const maxWindSpeed = 20.0;

    if (!weatherData) {
      alert(
        `Cannot fetch weather data for ${location}. Flight status is unknown.`
      );
      return false;
    }

    let conditionMet = true;

    if (weatherData.visibility && weatherData.visibility.km < minVisibility) {
      alert(
        `Cannot fly because ${location} visibility is too low. Flight will be delayed.`
      );
      conditionMet = false;
    }

    if (weatherData.wind && weatherData.wind.speed > maxWindSpeed) {
      alert(
        `Cannot fly because ${location} wind speed is too high. Flight will be delayed.`
      );
      conditionMet = false;
    }

    return conditionMet;
  }

  function canOperateSafely(from_weatherData, to_weatherData) {
    const fromConditions = checkWeatherConditions(
      from_weatherData,
      "departure"
    );
    const toConditions = checkWeatherConditions(to_weatherData, "destination");

    if (fromConditions && toConditions) {
      alert(`Flight can operate safely.`);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://airportgap.com/api/airports/distance",
        new URLSearchParams({ from: fromAirport, to: toAirport })
      );

      const from_city = response.data.data.attributes.from_airport.city;
      const to_city = response.data.data.attributes.to_airport.city;

      const getWeatherResponse1 = await axios.post(
        "http://localhost:5000/api/getlocation",
        { location: from_city }
      );
      const getWeatherResponse2 = await axios.post(
        "http://localhost:5000/api/getlocation",
        { location: to_city }
      );
      const from_weatherData = getWeatherResponse1.data;
      const to_weatherData = getWeatherResponse2.data;

      console.log(from_weatherData);
      console.log(to_weatherData);
      canOperateSafely(from_weatherData, to_weatherData);

      const { from_airport, to_airport, kilometers } =
        response.data.data.attributes;
      const fromCoords = [
        parseFloat(from_airport.latitude),
        parseFloat(from_airport.longitude),
      ];
      const toCoords = [
        parseFloat(to_airport.latitude),
        parseFloat(to_airport.longitude),
      ];

      setFromAirportInfo(from_airport);
      setToAirportInfo(to_airport);
      setRoute([fromCoords, toCoords]);
      setKilometers(kilometers);
      setWeatherData(to_weatherData);
    } catch (error) {
      console.error("Error fetching the location data:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex">
        <div className="w-full ">
          <FlightForm
            fromAirport={fromAirport}
            setFromAirport={setFromAirport}
            toAirport={toAirport}
            setToAirport={setToAirport}
            flightType={flightType}
            setFlightType={setFlightType}
            handleSubmit={handleSubmit}
          />
        </div>
        {flightType === "landing" && weatherData && (
          <div className="w-full md:w-1/2">
            <WeatherCard weatherData={weatherData} />
          </div>
        )}
      </div>
      <div className="flex space-x-4">
        <div className="w-[300px] bg-gray-100 p-4 rounded shadow-md">
          <h2 className="text-xl font-bold mb-4">Flight Data</h2>
          <p>Dummy flight data here...</p>
        </div>
        <div className="w-full">
          <FlightMap route={route} />
        </div>
        <div className="w-1/3 bg-gray-100 p-4 rounded shadow-md">
          <FlightInfo
            fromAirportInfo={fromAirportInfo}
            toAirportInfo={toAirportInfo}
            kilometers={kilometers}
          />
        </div>
      </div>
    </div>
  );
}
