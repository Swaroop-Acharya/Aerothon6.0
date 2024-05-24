// NearbyAirportSearcher.jsx
import React, { useState } from "react";
import axios from "axios";
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
      await axios.post('http://localhost:5000/api/near', data);
      console.log(data)
      
      // Update the nearby route using setNearbyRoute
      setNearbyRoute([
        [latitude,longitude],
        [parseFloat(data.nearestAirport.geoCode.latitude), parseFloat(data.nearestAirport.geoCode.longitude)],
      ]);
      setResult(data);
      console.log(result)
    } catch (error) {
      console.error("Error fetching nearby airport:", error);
    }
  };

  return (
    <div>
     
      <form className="flex gap-2 flex-col" onSubmit={handleSearch}>
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
        <button className="text-white rounded p-1 bg-cyan-700" type="submit">Search</button>
      </form>
      {result && (
        <div className="bg-slate-300 rounded p-2 mt-2">
          <h4 className="font-semibold">Search Result</h4>
          <p>Nearest Airport: {result.nearestAirport.name}</p>
          <p>Iata Code: {result.nearestAirport.iataCode}</p>
          <p>Distance: {result.minDistance} km</p>
        </div>
      )}
    </div>
  );
}

export default NearbyAirportSearcher;
