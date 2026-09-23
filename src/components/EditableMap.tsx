"use client";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";

const customIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function MapClickHandler({ 
  isActive, 
  setPosition 
}: { 
  isActive: boolean; 
  setPosition: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      if (isActive) {
        setPosition(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
}

export default function EditableMap({ 
  latitude, 
  longitude, 
  onChange,
  onClear
}: { 
  latitude: number | null; 
  longitude: number | null; 
  onChange: (lat: number, lng: number) => void;
  onClear: () => void;
}) {
  const [mode, setMode] = useState<"mini" | "view" | "edit">("mini");
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    });
  }, []);

  const center = latitude && longitude ? [latitude, longitude] : [50.85, -0.1];
  const zoom = latitude && longitude ? 15 : 10;
  const mapKey = mode; // forces remount when mode changes

  const enterEditMode = () => {
    if (window.confirm("Are you sure you want to edit the location?")) {
      setMode("edit");
    }
  };

  const removeLocation = () => {
    if (window.confirm("Are you sure you want to completely remove this location?")) {
      onClear();
      setMode("mini");
    }
  };

  const resetToCurrentPosition = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          onChange(position.coords.latitude, position.coords.longitude);
          setIsLocating(false);
        },
        (error) => {
          alert("Error getting location: " + error.message);
          setIsLocating(false);
        },
        { enableHighAccuracy: true }
      );
    }
  };

  if (mode === "view" || mode === "edit") {
    return (
      <div className="fixed inset-0 z-[100] bg-gray-100 flex flex-col">
        {/* Header */}
        <div className="p-4 bg-emerald-700 text-white flex justify-between items-center shadow-md shrink-0 pt-safe">
          <h2 className="font-bold text-lg">
            {mode === "edit" ? "✏️ Editing Location" : "🗺️ Location Preview"}
          </h2>
          <button 
            type="button"
            onClick={() => setMode("mini")}
            className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-lg font-bold text-sm shadow-sm"
          >
            {mode === "edit" ? "Save & Close" : "Close"}
          </button>
        </div>

        {/* Map Area */}
        <div className="flex-1 relative">
          <MapContainer maxZoom={19} key={mapKey} center={center as [number, number]} zoom={zoom} className="h-full w-full">
            <TileLayer maxZoom={19} maxNativeZoom={17}
              url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
              attribution='Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            <MapClickHandler isActive={mode === "edit"} setPosition={onChange} />
            {latitude && longitude && (
              <Marker position={[latitude, longitude]} icon={customIcon} />
            )}
          </MapContainer>
          
          {/* Overlays depending on mode */}
          {mode === "edit" ? (
            <>
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-yellow-100 border border-yellow-300 px-4 py-2 rounded-full shadow-lg z-[1000] text-sm font-semibold text-yellow-800 pointer-events-none text-center whitespace-nowrap">
                Tap anywhere to drop pin
              </div>
              <button 
                type="button"
                onClick={resetToCurrentPosition}
                disabled={isLocating}
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-full font-bold shadow-xl z-[1000] flex items-center gap-2 whitespace-nowrap"
              >
                {isLocating ? "Locating..." : "📍 Reset to current GPS"}
              </button>
            </>
          ) : (
            <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-4 px-4 z-[1000]">
              <button 
                type="button"
                onClick={enterEditMode}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-full font-bold shadow-xl flex items-center gap-2 whitespace-nowrap"
              >
                ✏️ Edit Location
              </button>
              {latitude && (
                <button 
                  type="button"
                  onClick={removeLocation}
                  className="bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-full font-bold shadow-xl flex items-center gap-2 whitespace-nowrap"
                >
                  🗑️ Remove
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // MINI MODE
  return (
    <div className="relative z-0">
      <div 
        className="h-48 md:h-64 w-full rounded-lg overflow-hidden border border-gray-300 relative cursor-pointer"
        onClick={() => setMode("view")}
      >
        <MapContainer maxZoom={19} 
          key={mapKey} 
          center={center as [number, number]} 
          zoom={zoom} 
          className="h-full w-full pointer-events-none" 
          dragging={false} 
          zoomControl={false} 
          scrollWheelZoom={false}
          doubleClickZoom={false}
        >
          <TileLayer maxZoom={19} maxNativeZoom={17}
            url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
            attribution='Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          {latitude && longitude && (
            <Marker position={[latitude, longitude]} icon={customIcon} />
          )}
        </MapContainer>

        <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors z-[1000] flex items-center justify-center">
           <span className="bg-white/80 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-gray-700 shadow-sm opacity-0 hover:opacity-100 transition-opacity">
             Tap to expand
           </span>
        </div>
      </div>
    </div>
  );
}
