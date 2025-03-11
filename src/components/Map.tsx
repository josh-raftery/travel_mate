"use client"

import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MyMap: React.FC = () => {
    
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mapContainerRef.current) {
      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY || "";
  
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        center: [-74.5, 40],
        zoom: 3,
      });
  
      map.on('click', async (event) => {
        const { lng, lat } = event.lngLat;
  
        const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxgl.accessToken}`
          );
  
          if (!response.ok) {
            console.error("Failed to fetch geocoding data");
            return;
          }
  
          const data = await response.json();
          const place = data.features[0]?.place_name || "Unknown location";
  
          console.log(`Clicked location: ${place}`);
          alert(`You clicked on: ${place}`);
      });
  
      return () => map.remove();
    }
  }, []);
  

  return (
    <div
      style={{ position: "absolute", top: 10, bottom: 0, width: "100%" }}
      ref={mapContainerRef}
      className="map-container"
    />
  );
};

export default MyMap;
