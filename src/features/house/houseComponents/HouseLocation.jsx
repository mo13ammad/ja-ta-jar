// HouseLocation.jsx

import React from 'react';
import { MapContainer, TileLayer, Circle, ZoomControl } from 'react-leaflet';
import L from 'leaflet';

function HouseLocation({ cords }) {
  if (!cords) {
    return null; // Handle the case when coordinates are not provided
  }

  const position = [cords.latitude, cords.longitude]; // [lat, lng]

  return (
    <div style={{ width: '100%', height: '250px', borderRadius: '24px' }}>
      <MapContainer
        center={position}
        zoom={13}
        style={{ width: '100%', height: '100%', borderRadius: '24px' }}
        zoomControl={false} // Disable default zoom control
        scrollWheelZoom={false} // Disable scroll wheel zoom if desired
      >
        {/* Custom Zoom Control */}
        <ZoomControl position="bottomright" />

        {/* Map Tiles */}
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Circle with 10 km Radius */}
        <Circle
          center={position}
          radius={400} // Radius in meters (10 km)
          pathOptions={{
            color: '#801D14', // Primary color (Tailwind's indigo-500)
            fillColor: '#801D14',
            fillOpacity: 0.2, // Low opacity
          }}
        />
      </MapContainer>
    </div>
  );
}

export default HouseLocation;
