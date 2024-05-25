import React, { useState } from "react";
import axios from "axios";
import FlightMap from "./FlightMap"; // Ensure the correct path
import { Icon } from "leaflet";

export default function SearchAltRoute() {
  const [fromDestination, setFromDestination] = useState("");
  const [toDestination, setToDestination] = useState("");
  const [icao24, setIcao24] = useState("");
  const [loading, setLoading] = useState(false);
  const [coordinates, setCoordinates] = useState({});
  const [route, setRoute] = useState([]);
  const [airportDetails, setAirportDetails] = useState([]);
  const [distance, setDistance] = useState(null);
  const [altFuelInfo, setAltFuelInfo] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Call the airport-graphs API through the backend server
      const response = await axios.post(
        "http://localhost:5000/api/airport-graphs",
        {
          sourceIataCode: fromDestination,
          destinationIataCode: toDestination,
        }
      );

      const { path, distance } = response.data;
      setDistance(distance);

      const coordinatesPromises = path.map(async (iata) => {
        const options = {
          method: "GET",
          url: "https://airport-info.p.rapidapi.com/airport",
          params: { iata },
          headers: {
            "X-RapidAPI-Key": "6a299485a2msh69cfeee83a143e3p148bd3jsn43eeec00ee95",
            "X-RapidAPI-Host": "airport-info.p.rapidapi.com",
          },
        };

        const airportResponse = await axios.request(options);
        const { latitude, longitude, name } = airportResponse.data;

        return { iata, latitude, longitude, name };
      });

      const coordinatesArray = await Promise.all(coordinatesPromises);

      const coordinatesObject = coordinatesArray.reduce((acc, curr) => {
        acc[curr.iata] = [curr.latitude, curr.longitude];
        return acc;
      }, {});

      setCoordinates(coordinatesObject);

      // Extract the route as an array of [latitude, longitude] arrays
      const route = coordinatesArray.map((item) => [item.latitude, item.longitude]);
      setRoute(route);
      setAirportDetails(coordinatesArray);

      // Calculate fuel for the alternative path

      console.log(icao24)
      console.log(distance)
      const altFuelResponse = await axios.get(
        `http://localhost:5000/api/flight-fuel`,
        {
          params: {
            aircraft: icao24,
            distance: distance,
            gcd: true,
          }
        }
      );
      console.log(altFuelResponse.data);
     await axios.post('http://localhost:5000/api/insertFlightFuel', altFuelResponse.data[0]);
      const { fuel: altFuel, co2: altCo2 } = altFuelResponse.data[0];
      
      setAltFuelInfo({ distance, altFuel, altCo2 });

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl text-white font-bold mb-4">Search Alternative Route</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <div className="mb-4">
          <label
            htmlFor="fromDestination"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            From Destination:
          </label>
          <input
            type="text"
            id="fromDestination"
            value={fromDestination}
            onChange={(e) => setFromDestination(e.target.value)}
            placeholder="Enter from destination"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="toDestination"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            To Destination:
          </label>
          <input
            type="text"
            id="toDestination"
            value={toDestination}
            onChange={(e) => setToDestination(e.target.value)}
            placeholder="Enter to destination"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="icao24"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Aircraft ICAO24 Code:
          </label>
          <input
            type="text"
            id="icao24"
            value={icao24}
            onChange={(e) => setIcao24(e.target.value)}
            placeholder="Enter Aircraft ICAO24 Code"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </form>
      {airportDetails.length > 0 && (
        <div className="bg-white shadow-md rounded p-4 mt-4">
          <h2 className="text-2xl font-bold mb-2">Flight Route Details</h2>
          <p><strong>Source:</strong> {airportDetails[0].name} ({airportDetails[0].iata})</p>
          <p><strong>Destination:</strong> {airportDetails[airportDetails.length - 1].name} ({airportDetails[airportDetails.length - 1].iata})</p>
          {airportDetails.length > 2 && (
            <>
              <h3 className="text-xl font-bold mt-2">Intermediate Airports:</h3>
              <ul className="list-disc list-inside">
                {airportDetails.slice(1, -1).map((airport, index) => (
                  <li key={index}>{airport.name} ({airport.iata})</li>
                ))}
              </ul>
            </>
          )}
          {distance && (
            <p><strong>Total Distance:</strong> {distance} km</p>
          )}
          {altFuelInfo && (
            <>
              <p><strong>Fuel Required for Alternative Route:</strong> {altFuelInfo.altFuel} kg</p>
              <p><strong>CO2 Emissions for Alternative Route:</strong> {altFuelInfo.altCo2} kg</p>
            </>
          )}
        </div>
      )}
      <FlightMap route={route} />
    </div>
  );
}