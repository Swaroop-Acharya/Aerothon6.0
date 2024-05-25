import React from 'react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Import your custom marker image
import customMarkerIcon from '/maker.png';

// Create a custom icon instance without the shadow
const customIcon = L.icon({
  iconUrl: customMarkerIcon,
  iconSize: [25, 41], // size of the icon
  iconAnchor: [12, 41], // point of the icon which will correspond to marker's location
  popupAnchor: [1, -34], // point from which the popup should open relative to the iconAnchor
});

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
              <Marker key={index} position={position} icon={customIcon} />
            ))}
            <Polyline positions={route} color="blue" />
          </>
        )}
      </MapContainer>
    </div>
  );
}

export default FlightMap;
