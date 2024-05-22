import React from "react";

function FlightInfo({ fromAirportInfo, toAirportInfo, kilometers }) {
  return (
    <div className=" mb-4">
      <h2 className="text-xl font-bold mb-4">Flight Information</h2>
      {fromAirportInfo && (
        <>
          <h3 className="font-bold">From Airport:</h3>
          <p>Name: {fromAirportInfo.name}</p>
          <p>City: {fromAirportInfo.city}</p>
          <p>Country: {fromAirportInfo.country}</p>
        </>
      )}
      {toAirportInfo && (
        <>
          <h3 className="font-bold">To Airport:</h3>
          <p>Name: {toAirportInfo.name}</p>
          <p>City: {toAirportInfo.city}</p>
          <p>Country: {toAirportInfo.country}</p>
        </>
      )}
      {kilometers && (
        <>
          <h3 className="font-bold">Distance:</h3>
          <p>{kilometers} km</p>
        </>
      )}
    </div>
  );
}

export default FlightInfo;
