import React, { useState } from "react";
import axios from "axios";

export default function SearchAltRoute() {
  const [fromDestination, setFromDestination] = useState("");
  const [toDestination, setToDestination] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/airport-graphs",
        {
          sourceIataCode: fromDestination,
          destinationIataCode: toDestination,
        }
      );
      //

      console.log(response)
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Search Alternative Route</h1>
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
    </div>
  );
}
