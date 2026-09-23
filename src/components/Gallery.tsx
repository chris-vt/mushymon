"use client";
import { useState, useRef } from "react";

export default function Gallery({ 
  isOpen, 
  onClose, 
  photos, 
  previewPhoto, 
  onAddPhoto, 
  onRemovePhoto, 
  onSetPreview 
}: { 
  isOpen: boolean; 
  onClose: () => void;
  photos: string[];
  previewPhoto: string | null;
  onAddPhoto: (path: string) => void;
  onRemovePhoto: (path: string) => void;
  onSetPreview: (path: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Swipe handling
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.path) {
        onAddPhoto(data.path);
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

  const handleNext = () => {
    if (expandedIndex !== null && photos.length > 0) {
      setExpandedIndex((expandedIndex + 1) % photos.length);
    }
  };

  const handlePrev = () => {
    if (expandedIndex !== null && photos.length > 0) {
      setExpandedIndex((expandedIndex - 1 + photos.length) % photos.length);
    }
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEndEvent = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;
    
    if (distance > minSwipeDistance) handleNext();
    if (distance < -minSwipeDistance) handlePrev();
  };

  if (!isOpen) return null;

  // Fullscreen single photo view
  if (expandedIndex !== null) {
    const currentPhoto = photos[expandedIndex];
    return (
      <div className="fixed inset-0 z-[200] bg-black text-white flex flex-col">
        {/* Header */}
        <div className="p-4 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent pt-safe absolute top-0 w-full z-10">
          <button onClick={() => setExpandedIndex(null)} className="font-bold text-lg p-2 drop-shadow-md">✕ Close</button>
          <div className="flex gap-4">
            <button 
              onClick={() => {
                if (window.confirm("Delete this photo?")) {
                  onRemovePhoto(currentPhoto);
                  setExpandedIndex(null);
                }
              }} 
              className="text-red-400 font-bold p-2 drop-shadow-md"
            >
              🗑️ Delete
            </button>
          </div>
        </div>
        
        {/* Swiper Area */}
        <div 
          className="flex-1 flex items-center justify-center overflow-hidden relative"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEndEvent}
        >
          {photos.length > 1 && (
            <button onClick={handlePrev} className="absolute left-2 text-4xl p-4 z-10 text-white/50 hover:text-white drop-shadow-lg transition-colors">
              ‹
            </button>
          )}
          
          <img 
            key={currentPhoto} // forces re-render/animation if we wanted
            src={currentPhoto} 
            alt="Expanded" 
            className="max-w-full max-h-full object-contain" 
          />
          
          {photos.length > 1 && (
            <button onClick={handleNext} className="absolute right-2 text-4xl p-4 z-10 text-white/50 hover:text-white drop-shadow-lg transition-colors">
              ›
            </button>
          )}

          <div className="absolute top-20 text-center w-full text-white/70 text-sm font-semibold pointer-events-none drop-shadow-md">
            {expandedIndex + 1} of {photos.length}
          </div>
        </div>
        
        {/* Footer */}
        <div className="p-6 bg-gradient-to-t from-black/80 to-transparent pb-safe flex justify-center absolute bottom-0 w-full z-10">
          <button 
            onClick={() => {
              onSetPreview(currentPhoto);
              setExpandedIndex(null);
            }}
            className={`w-full max-w-sm py-3 rounded-xl font-bold shadow-lg ${
              previewPhoto === currentPhoto 
                ? "bg-emerald-800 text-white opacity-50 cursor-not-allowed" 
                : "bg-emerald-600 text-white hover:bg-emerald-500"
            }`}
            disabled={previewPhoto === currentPhoto}
          >
            {previewPhoto === currentPhoto ? "✓ Current Preview" : "⭐ Set as Logbook Preview"}
          </button>
        </div>
      </div>
    );
  }

  // Main Gallery Grid
  return (
    <div className="fixed inset-0 z-[100] bg-gray-50 flex flex-col">
      <div className="p-4 bg-emerald-700 text-white flex justify-between items-center shadow-md pt-safe shrink-0">
        <h2 className="font-bold text-lg">🖼️ Mushroom Gallery</h2>
        <button onClick={onClose} className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-lg font-bold text-sm">
          Done
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          
          {/* Add Photo Button Tile */}
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="aspect-square border-2 border-dashed border-emerald-300 rounded-xl bg-emerald-50 flex flex-col items-center justify-center cursor-pointer hover:bg-emerald-100 transition-colors"
          >
            {uploading ? (
              <span className="text-emerald-600 font-bold animate-pulse text-sm">Uploading...</span>
            ) : (
              <>
                <span className="text-4xl mb-2">📸</span>
                <span className="text-emerald-700 font-semibold text-xs text-center px-2">Take Photo / Library</span>
              </>
            )}
          </div>
          
          {/* Photo Tiles */}
          {photos.map((photo, i) => (
            <div 
              key={i} 
              onClick={() => setExpandedIndex(i)}
              className="aspect-square rounded-xl overflow-hidden relative cursor-pointer group shadow-sm border border-gray-200"
            >
              <img src={photo} alt="Mushroom" className="w-full h-full object-cover" />
              {previewPhoto === photo && (
                <div className="absolute top-2 left-2 bg-emerald-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md border border-white">
                  ⭐ Preview
                </div>
              )}
            </div>
          ))}

        </div>
      </div>
      
      {/* Notice we removed capture="environment" so iOS correctly prompts for Camera vs Library */}
      <input 
        type="file" 
        accept="image/*" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
      />
    </div>
  );
}
