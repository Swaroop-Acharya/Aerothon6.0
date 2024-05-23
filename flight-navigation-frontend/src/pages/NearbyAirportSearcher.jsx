// NearbyAirportSearcher.jsx
import React, { useState } from "react";

function NearbyAirportSearcher({ setNearbyRoute }) { // Accept setNearbyRoute as a prop
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
      console.log(data)
      // Update the nearby route using setNearbyRoute
      setNearbyRoute([
        [latitude,longitude],
        [parseFloat(data.nearestAirport.geoCode.latitude), parseFloat(data.nearestAirport.geoCode.longitude)],
      ]);
      setResult(data);
    } catch (error) {
      console.error("Error fetching nearby airport:", error);
    }
  };

  return (
    <div>
      <h3>Nearby Airport Search</h3>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={latitude}
          onChange={(e) => setLatitude(e.target.value)}
          placeholder="Latitude"
          required
        />
        <input
          type="text"
          value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
          placeholder="Longitude"
          required
        />
        <input
          type="text"
          value={radius}
          onChange={(e) => setRadius(e.target.value)}
          placeholder="Radius (km)"
          required
        />
        <button type="submit">Search</button>
      </form>
      {result && (
        <div>
          <h4>Search Result</h4>
          <p>Nearest Airport: {result.nearestAirport.name}</p>
          <p>Distance: {result.min} km</p>
        </div>
      )}
    </div>
  );
}

export default NearbyAirportSearcher;
