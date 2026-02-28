import { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import { AlertCircle } from "lucide-react";
import "mapbox-gl/dist/mapbox-gl.css";
import axios from "axios";

function MapComponent() {
  const mapRef = useRef();
  const mapContainerRef = useRef();
  const userMarkerRef = useRef(); // Marker for user location

  useEffect(() => {
    mapboxgl.accessToken =import.meta.env.VITE_MAPBOX_TOKEN;

    // Initialize map
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [85.324, 27.7172], // Kathmandu default
      zoom: 11,
    });

    // Watch user location
    const watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        // Move or create user marker
        if (!userMarkerRef.current) {
          userMarkerRef.current = new mapboxgl.Marker({ color: "red" })
            .setLngLat([longitude, latitude])
            .addTo(mapRef.current);
        } else {
          userMarkerRef.current.setLngLat([longitude, latitude]);
        }

        // Center map on user location
        mapRef.current.setCenter([longitude, latitude]);

        // Send live location to backend
        try {
          await axios.get(
            "http://localhost:8000/location",
            { latitude, longitude },
            { withCredentials: true }
          );
        } catch (err) {
          console.error("Error sending location:", err);
        }
      },
      (err) => console.error(err),
      { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
    );

    // Cleanup
    return () => {
      navigator.geolocation.clearWatch(watchId);
      mapRef.current.remove();
    };
  }, []);

  return (
    <div className="ubuntu-regular">
      {/* Title */}
      <div className="font-bold gap-2 text-xl text-center text-red-950 flex items-center justify-center mb-4">
        <AlertCircle />
        <h1 className="font-bold text-2xl text-red-950">
          Emergency Blood Requests
        </h1>
      </div>

      {/* Map */}
      <div className="flex justify-center items-center">
        <div
          ref={mapContainerRef}
          className="h-120 w-full rounded-xl md:w-1/2"
        />
      </div>
    </div>
  );
}

export default MapComponent;
