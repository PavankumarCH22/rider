import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
  backdropFilter: 'blur(8px)',
};

// Default centre – Bangalore, India (demo location)
const defaultCenter = { lat: 12.9716, lng: 77.5946 };

/**
 * ProviderMap
 * Props:
 *   providers: Array<{ key: string, label: string }>
 *   apiKey: string – Google Maps API key (from env VITE_GOOGLE_MAPS_API_KEY)
 *   origin: string (optional) – pickup address
 *   destination: string (optional) – drop‑off address
 */
export default function ProviderMap({ providers, apiKey, origin, destination, userLocation }) {
  // If no API key, render nothing to avoid runtime errors
  if (!apiKey) return null;
  const [directions, setDirections] = useState(null);

  const handleDirectionsCallback = (result) => {
    if (result.status === 'OK') {
      setDirections(result);
    } else {
      console.error('Directions request failed:', result);
    }
  };

  // For demo we place all provider markers at the centre with a slight offset.
  const getOffset = (index) => ({
    lat: defaultCenter.lat + 0.001 * index,
    lng: defaultCenter.lng + 0.001 * index,
  });

  const shouldRenderDirections = origin && destination;

  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={defaultCenter}
        zoom={13}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
          gestureHandling: 'greedy',
        }}
      >
        {/* Provider markers */}
        {providers.map((p, i) => (
          <Marker key={p.key} position={getOffset(i)} title={p.label} />
        ))}
        {userLocation && <Marker position={userLocation} title="You are here" />}
        {/* Route rendering */}
        {shouldRenderDirections && (
          <DirectionsService
            options={{
              destination: destination,
              origin: origin,
              travelMode: 'DRIVING',
            }}
            callback={handleDirectionsCallback}
          />
        )}
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>
    </LoadScript>
  );
}
