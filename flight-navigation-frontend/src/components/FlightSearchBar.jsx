import React, { useState } from "react";
import axios from "axios";

export default function FlightSearchBar() {
  const [fromAirport, setFromAirport] = useState("");
  const [toAirport, setToAirport] = useState("");
  const [flightType, setFlightType] = useState("takeoff");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const location = flightType === "takeoff" ? fromAirport : toAirport;

    try {
      const response = await axios.post(
        "http://localhost:5000/api/getlocation",
        { location }
      );
      console.log(response.data.text);
    } catch (error) {
      console.error("Error fetching the location data:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          From Airport:
          <input
            type="text"
            value={fromAirport}
            onChange={(e) => setFromAirport(e.target.value)}
            placeholder="Enter departure airport"
          />
        </label>
      </div>
      <div>
        <label>
          To Airport:
          <input
            type="text"
            value={toAirport}
            onChange={(e) => setToAirport(e.target.value)}
            placeholder="Enter destination airport"
          />
        </label>
      </div>
      <div>
        <label>
          Flight Type:
          <select
            value={flightType}
            onChange={(e) => setFlightType(e.target.value)}
          >
            <option value="takeoff">Takeoff</option>
            <option value="landing">Landing</option>
          </select>
        </label>
      </div>
      <div>
        <button type="submit">Submit</button>
      </div>
    </form>
  );
}
