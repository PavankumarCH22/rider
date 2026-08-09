import React, { useState, useRef } from "react";
import { useLoadScript } from "@react-google-maps/api";
import { StandaloneSearchBox } from "@react-google-maps/api";

export default function LocationSearch({ onLocationSelect, onCurrentLocation }) {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const originRef = useRef(null);
  const destRef = useRef(null);

  const handlePlaceChanged = (type) => {
    const place = type === "origin" ? originRef.current.getPlaces()[0] : destRef.current.getPlaces()[0];
    if (place && place.formatted_address) {
      if (type === "origin") setOrigin(place.formatted_address);
      else setDestination(place.formatted_address);
      if (type === "origin" && destination) {
        onLocationSelect({ origin: place.formatted_address, destination });
      } else if (type === "destination" && origin) {
        onLocationSelect({ origin, destination: place.formatted_address });
      }
    }
  };

  const boxStyle = {
    boxSizing: `border-box`,
    border: `1px solid #ccc`,
    width: `240px`,
    height: `38px`,
    padding: `0 12px`,
    borderRadius: `4px`,
    fontSize: `14px`,
    outline: `none`,
    textOverflow: `ellipses`,
    backgroundColor: "rgba(255,255,255,0.8)"
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation not supported');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latLng = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        // Reverse geocode to address
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: latLng }, (results, status) => {
          if (status === 'OK' && results[0]) {
            const address = results[0].formatted_address;
            if (onCurrentLocation) onCurrentLocation(address, latLng);
            // Also set as origin for map routing
            setOrigin(address);
          } else {
            console.error('Geocode failed:', status);
            alert('Unable to get address from location');
          }
        });
      },
      (error) => {
        console.error(error);
        alert('Failed to retrieve location');
      }
    );
  };

  return (
    <div className="flex gap-4 mb-6">
      <StandaloneSearchBox
        onLoad={(ref) => (originRef.current = ref)}
        onPlacesChanged={() => handlePlaceChanged("origin")}
      >
        <input type="text" placeholder="Pickup location" value={origin} onChange={(e) => setOrigin(e.target.value)} style={boxStyle} />
      </StandaloneSearchBox>
      <StandaloneSearchBox
        onLoad={(ref) => (destRef.current = ref)}
        onPlacesChanged={() => handlePlaceChanged("destination")}
      >
        <input type="text" placeholder="Drop‑off location" value={destination} onChange={(e) => setDestination(e.target.value)} style={boxStyle} />
      </StandaloneSearchBox>
    </div>
        <button
          type="button"
          onClick={handleUseCurrentLocation}
          className="px-4 py-2 bg-accent text-ink rounded-lg hover:brightness-95 transition"
        >
          Use My Location
        </button>
  );
}
