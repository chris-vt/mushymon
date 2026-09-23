"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";

// Fix Leaflet marker icons in Next.js
const customIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function Map({ finds, onMarkerClick }: { finds: any[], onMarkerClick?: (find: any) => void }) {
  useEffect(() => {
    // Leaflet global fix for SSR
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    });
  }, []);

  const center = finds.length > 0 && finds[0].latitude 
    ? [finds[0].latitude, finds[0].longitude] 
    : [50.85, -0.1]; // Default to near Brighton / South Downs if none exists

  return (
    <div className="h-full w-full">
      <MapContainer maxZoom={19} center={center as [number, number]} zoom={12} className="h-full w-full z-0">
        <TileLayer maxZoom={19} maxNativeZoom={17}
          url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
          attribution='Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
        />
        {finds.map((find) => (
          find.latitude && find.longitude ? (
            <Marker 
              key={find.id} 
              position={[find.latitude, find.longitude]} 
              icon={customIcon}
              eventHandlers={{
                click: () => onMarkerClick?.(find)
              }}
            >
              <Popup>
                <strong className="text-lg">{find.name}</strong><br/>
                {find.area}<br/>
                <span className="text-sm text-gray-500">{new Date(find.date).toLocaleDateString()}</span>
              </Popup>
            </Marker>
          ) : null
        ))}
      </MapContainer>
    </div>
  );
}
