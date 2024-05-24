import React from "react";

function FlightForm({
  fromAirport,
  setFromAirport,
  toAirport,
  setToAirport,
  flightType,
  setFlightType,
  aircraftData,
  selectedAircraftModel,
  setSelectedAircraftModel,
  handleSubmit,
}) {
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white gap-3 w-full flex flex-col items-center shadow-md rounded px-8 pt-6 pb-8 mb-4"
    >
      <div className="flex flex-wrap mb-4 w-full">
        <div className="w-full md:w-1/2 pr-2">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            From Airport:
          </label>
          <input
            type="text"
            value={fromAirport}
            onChange={(e) => setFromAirport(e.target.value)}
            placeholder="Enter departure airport IATA code"
            className=" appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="w-full md:w-1/2 pl-2">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            To Airport:
          </label>
          <input
            type="text"
            value={toAirport}
            onChange={(e) => setToAirport(e.target.value)}
            placeholder="Enter destination airport IATA code"
            className=" appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
      </div>
      <div className="flex flex-wrap mb-4 w-full">
        <div className="w-full md:w-1/2 pr-2">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Operation:
          </label>
          <select
            value={flightType}
            onChange={(e) => setFlightType(e.target.value)}
            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="takeoff">Takeoff</option>
            <option value="landing">Landing</option>
          </select>
        </div>
        <div className="w-full md:w-1/2 pl-2">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Aircraft Model:
          </label>
          <select
            value={selectedAircraftModel}
            onChange={(e) => setSelectedAircraftModel(e.target.value)}
            className=" appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="" disabled>
              Select an aircraft model
            </option>
            {Array.isArray(aircraftData) &&
              aircraftData.map((aircraft) => (
                <option key={aircraft.aircraftID} value={aircraft.model}>
                  {aircraft.model}
                </option>
              ))}
          </select>
        </div>
      </div>
      <div className="w-full">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Check Navigation Status
        </button>
      </div>
    </form>
  );
}

export default FlightForm;
