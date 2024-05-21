import React, { useState } from "react";

function NearbyAirportSearcher() {
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");
  const [radius, setRadius] = useState("");
  const [result, setResult] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/get-nearest-airport", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          latitude,
          longitude,
          radius,
          destinationIataCode: "BLR" // Example destination IATA code
        })
      });
      const data = await response.json();
      console.log(data)
      // setResult(data);
    } catch (error) {
      console.error("Error fetching nearest airport:", error);
    }
  };

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-xl font-bold mb-4">Nearby Airport Search</h2>
      <p>Since you cannot land in your destination airport, if you are willing to find nearby airports to land, provide the following details:</p>
      <form onSubmit={handleSearch}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Longitude:
          </label>
          <input
            type="text"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            placeholder="Enter longitude"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Latitude:
          </label>
          <input
            type="text"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            placeholder="Enter latitude"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Radius (km):
          </label>
          <input
            type="text"
            value={radius}
            onChange={(e) => setRadius(e.target.value)}
            placeholder="Enter radius in kilometers"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Search
          </button>
        </div>
      </form>
      {/* {result && (
        <div className="mt-4">
          <h3 className="text-lg font-bold">Nearest Airport</h3>
          <p><strong>Name:</strong> {result.nearestAirport.name}</p>
          <p><strong>IATA Code:</strong> {result.nearestAirport.iataCode}</p>
          <p><strong>Distance:</strong> {result.minDistance.toFixed(2)} km</p>
        </div>
      )} */}
    </div>
  );
}

export default NearbyAirportSearcher;
