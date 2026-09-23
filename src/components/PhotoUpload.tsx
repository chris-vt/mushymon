"use client";
import { useState, useRef } from "react";

export default function PhotoUpload({ 
  photoPath, 
  onPhotoUploaded, 
  onPhotoRemoved 
}: { 
  photoPath: string; 
  onPhotoUploaded: (path: string) => void;
  onPhotoRemoved: () => void;
}) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.path) {
        onPhotoUploaded(data.path);
      } else {
        alert("Upload failed.");
      }
    } catch (error) {
      alert("Error uploading photo.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200">
      <h3 className="font-semibold text-gray-800 mb-3">Mushroom Photo</h3>
      
      {photoPath ? (
        <div className="relative rounded-lg overflow-hidden border border-gray-200 group">
          <img src={photoPath} alt="Mushroom Find" className="w-full h-64 object-cover" />
          <button 
            type="button"
            onClick={onPhotoRemoved}
            className="absolute top-2 right-2 bg-red-600/90 text-white p-2 rounded-full shadow-md font-bold text-xs"
          >
            🗑️ Remove
          </button>
        </div>
      ) : (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="h-40 w-full border-2 border-dashed border-emerald-300 rounded-xl bg-emerald-50 flex flex-col items-center justify-center cursor-pointer hover:bg-emerald-100 transition-colors"
        >
          {uploading ? (
            <span className="text-emerald-600 font-bold animate-pulse">Uploading...</span>
          ) : (
            <>
              <span className="text-4xl mb-2">📸</span>
              <span className="text-emerald-700 font-semibold text-sm">Tap to Take Photo</span>
              <span className="text-gray-500 text-xs mt-1">(or choose from library)</span>
            </>
          )}
        </div>
      )}
      
      <input 
        type="file" 
        accept="image/*" 
        capture="environment"
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
      />
    </div>
  );
}
