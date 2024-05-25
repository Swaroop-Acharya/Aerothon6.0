// NearbyAirportSearcher.jsx
import React, { useState } from "react";
import axios from "axios";

function NearbyAirportSearcher({ setNearbyRoute }) { 
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");
  const [radius, setRadius] = useState("");
  const [result, setResult] = useState(null);
  const [errors, setErrors] = useState({});

  const validateInputs = () => {
    let errors = {};
    if (!latitude) {
      errors.latitude = "Latitude is required.";
    }
    if (!longitude) {
      errors.longitude = "Longitude is required.";
    }
    if (!radius) {
      errors.radius = "Radius is required.";
    }
    return errors;
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    const validationErrors = validateInputs();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});

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
      console.log(result)
      await axios.post('http://localhost:5000/api/near', data);
      console.log(data);

      setNearbyRoute([
        [latitude, longitude],
        [parseFloat(data.nearestAirport.geoCode.latitude), parseFloat(data.nearestAirport.geoCode.longitude)],
      ]);
      setResult(data);
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
        {errors.latitude && <p className="text-red-500">{errors.latitude}</p>}
        <input
          type="text"
          value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
          placeholder="Longitude"
          required
        />
        {errors.longitude && <p className="text-red-500">{errors.longitude}</p>}
        <input
          type="text"
          value={radius}
          onChange={(e) => setRadius(e.target.value)}
          placeholder="Radius (km)"
          required
        />
        {errors.radius && <p className="text-red-500">{errors.radius}</p>}
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
