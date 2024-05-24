import React from "react";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function FlightMap({ route }) {
  const indiaCenter = [20.5937, 78.9629]; // Coordinates for the center of India

  return (
    <div className="w-full rounded h-96">
      <MapContainer center={indiaCenter} zoom={5} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {route && (
          <>
            {route.map((position, index) => (
              <Marker key={index} position={position} />
            ))}
            <Polyline positions={route} color="blue" />
          </>
        )}
      </MapContainer>
    </div>
  );
}

export default FlightMap;
