"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { OpenLocationCode } from "open-location-code";
import dynamic from "next/dynamic";
import Gallery from "@/components/Gallery";

const EditableMap = dynamic(() => import("@/components/EditableMap"), { ssr: false });

export default function AddFind() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    area: "",
    notes: "",
    latitude: null as number | null,
    longitude: null as number | null,
    plusCode: "",
    photoPath: "",
    gallery: [] as string[],
  });

  const handleMapChange = (lat: number, lng: number) => {
    const plusCode = new OpenLocationCode().encode(lat, lng);
    setFormData({ ...formData, latitude: lat, longitude: lng, plusCode });
  };

  const handleClearLocation = () => {
    setFormData({ ...formData, latitude: null, longitude: null, plusCode: "" });
  };

  const handleAddPhoto = (path: string) => {
    const newGallery = [...formData.gallery, path];
    const newPreview = formData.photoPath === "" ? path : formData.photoPath;
    setFormData({ ...formData, gallery: newGallery, photoPath: newPreview });
  };

  const handleRemovePhoto = (path: string) => {
    const newGallery = formData.gallery.filter(p => p !== path);
    let newPreview = formData.photoPath;
    if (newPreview === path) {
      newPreview = newGallery.length > 0 ? newGallery[0] : "";
    }
    setFormData({ ...formData, gallery: newGallery, photoPath: newPreview });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch("/api/mushrooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, gallery: JSON.stringify(formData.gallery) }),
      });
      router.push("/");
    } catch (error) {
      alert("Error saving find!");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 text-gray-900 pb-24">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
        <h1 className="text-3xl font-bold text-emerald-800 mb-6">🍄 New Find</h1>

        <Gallery 
          isOpen={isGalleryOpen} 
          onClose={() => setIsGalleryOpen(false)}
          photos={formData.gallery}
          previewPhoto={formData.photoPath}
          onAddPhoto={handleAddPhoto}
          onRemovePhoto={handleRemovePhoto}
          onSetPreview={(path) => setFormData({ ...formData, photoPath: path })}
        />

        <form suppressHydrationWarning onSubmit={handleSubmit} className="space-y-6">
          
          {/* Main Form Photo Preview matching Map style */}
          <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
            <h3 className="font-semibold text-emerald-900 mb-3">Gallery</h3>
            
            {formData.gallery.length === 0 || !formData.photoPath ? (
              <button 
                type="button"
                onClick={() => setIsGalleryOpen(true)}
                className="w-full h-48 md:h-64 border-2 border-dashed border-emerald-300 rounded-lg bg-emerald-50 flex flex-col items-center justify-center cursor-pointer hover:bg-emerald-100 transition-colors"
              >
                <span className="text-4xl mb-2">📸</span>
                <span className="text-emerald-700 font-semibold text-sm">Add Photo / Open Gallery</span>
              </button>
            ) : (
              <div 
                onClick={() => setIsGalleryOpen(true)}
                className="h-48 md:h-64 w-full rounded-lg overflow-hidden border border-gray-300 relative cursor-pointer group"
              >
                <img src={formData.photoPath} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <span className="bg-white/80 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-gray-700 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    Tap to open Gallery
                  </span>
                </div>
                {/* Photo count indicator */}
                {formData.gallery.length > 1 && (
                  <div className="absolute top-2 right-2 bg-black/50 backdrop-blur text-white px-2 py-1 rounded-full text-xs font-bold border border-white/20 shadow-md">
                    {formData.gallery.length} Photos
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
            <h3 className="font-semibold text-emerald-900 mb-1">Location</h3>
            
            {formData.latitude ? (
              <p className="text-sm text-emerald-700 mb-3 font-mono">
                GPS: {formData.latitude.toFixed(5)}, {formData.longitude?.toFixed(5)}
              </p>
            ) : (
              <p className="text-sm text-gray-500 mb-3 italic">No location set</p>
            )}
            
            <EditableMap 
              latitude={formData.latitude} 
              longitude={formData.longitude} 
              onChange={handleMapChange} 
              onClear={handleClearLocation}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Mushroom Name *</label>
            <input type="text" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">General Area</label>
            <input type="text" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg" value={formData.area} onChange={(e) => setFormData({ ...formData, area: e.target.value })} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Notes</label>
            <textarea className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg h-24" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} />
          </div>

          <div className="flex gap-4 pt-4">
            <button type="button" onClick={() => router.push("/")} className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-lg transition-colors">Go Back</button>
            <button type="submit" disabled={submitting} className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-colors">{submitting ? "Saving..." : "Save Find"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
