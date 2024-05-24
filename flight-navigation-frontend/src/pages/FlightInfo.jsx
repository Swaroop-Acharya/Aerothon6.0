import React from "react";

function FlightInfo({ AirportInfo, kilometers,path }) {
  console.log(AirportInfo)
  return (
    <div className=" mb-4">
      <h2 className="text-xl font-bold mb-4">{path} Information</h2>
      {AirportInfo && (
        <div className="bg-white p-3 rounded">

          <p className="font-semibold"> {AirportInfo.name}</p>
          <p>City: {AirportInfo.city}</p>
          <p>ICAO: {AirportInfo.icao}</p>
          <p>latitude: {AirportInfo.latitude}</p>
          <p>longitude: {AirportInfo.longitude}</p>
          <p>Altitude: {AirportInfo.altitude}</p>
        </div>
      )}
      
    </div>
  );
}

export default FlightInfo;
