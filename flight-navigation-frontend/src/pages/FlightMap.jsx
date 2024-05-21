import React from "react";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function FlightMap({ route }) {
  return (
    <div className="w-full h-96">
      <MapContainer center={[51.505, -0.09]} zoom={2} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {route && (
          <>
            <Marker position={route[0]} />
            <Marker position={route[1]} />
            <Polyline positions={route} color="blue" />
          </>
        )}
      </MapContainer>
    </div>
  );
}

export default FlightMap;
