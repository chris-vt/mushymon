"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

export default function Home() {
  const router = useRouter();
  const [finds, setFinds] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"list" | "map">("list");

  useEffect(() => {
    fetch("/api/mushrooms")
      .then((res) => res.json())
      .then((data) => setFinds(data));
  }, []);

  return (
    <div className="flex flex-col h-[100dvh] bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="p-4 bg-emerald-700 text-white flex justify-between items-center shrink-0 shadow-md z-10 pt-safe">
        <h1 className="text-2xl font-bold">🍄 Mushymon!</h1>
      </header>

      {/* Main Content (Fills remaining space) */}
      <main className="flex-1 overflow-hidden relative">
        {activeTab === "list" ? (
          <div className="h-full overflow-y-auto p-4 space-y-4 pb-24">
            {finds.length === 0 && (
              <p className="text-gray-500 text-center mt-10">No mushroom finds yet. Go explore!</p>
            )}
            {finds.map((find) => (
              <Link 
                href={`/edit/${find.id}`} 
                key={find.id} 
                className="block p-4 pr-10 bg-white rounded-xl shadow-sm border border-gray-100 relative cursor-pointer active:bg-gray-50 hover:border-emerald-300 transition-colors"
              >
                {/* Chevron centered vertically on the far right */}
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-600 opacity-40 text-3xl leading-none">
                  ›
                </span>

                {/* Top Block: Preview & Core Info */}
                <div className="flex gap-4">
                  {/* Left: Preview Image or Default Icon */}
                  <div className="shrink-0 w-24 h-24 bg-gray-50 rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center">
                    {find.photoPath ? (
                      <img src={find.photoPath} alt={find.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-4xl opacity-40 grayscale">🍄</span>
                    )}
                  </div>
                  
                  {/* Right: Info Stack */}
                  <div className="flex-1 flex flex-col justify-center min-w-0 py-1">
                    <span className="text-xs text-gray-400 mb-1">{new Date(find.date).toLocaleDateString()}</span>
                    <h3 className="font-bold text-lg text-emerald-900 line-clamp-2 leading-tight mb-1">{find.name || "Unknown"}</h3>
                    <p className="text-sm text-gray-600 flex items-center gap-1 truncate">
                      📍 {find.area || "Unknown Area"}
                    </p>
                  </div>
                </div>
                
                {/* Bottom Block: Notes */}
                {find.notes && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 italic line-clamp-3 leading-relaxed">
                      "{find.notes}"
                    </p>
                  </div>
                )}
              </Link>
            ))}
          </div>
        ) : (
          <div className="h-full w-full">
            <Map finds={finds} />
          </div>
        )}
      </main>

      {/* Bottom Navigation Menu */}
      <nav className="shrink-0 bg-white border-t border-gray-200 flex justify-around items-center p-3 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10">
        <button 
          onClick={() => setActiveTab("list")}
          className={`flex flex-col items-center p-2 ${activeTab === "list" ? "text-emerald-600" : "text-gray-400"}`}
        >
          <span className="text-2xl mb-1">📝</span>
          <span className="text-xs font-bold">Logbook</span>
        </button>
        
        <Link href="/add" className="transform -translate-y-4">
          <div className="bg-emerald-600 h-16 w-16 rounded-full flex items-center justify-center shadow-lg border-4 border-white text-white text-3xl hover:bg-emerald-500 transition-colors">
            +
          </div>
        </Link>

        <button 
          onClick={() => setActiveTab("map")}
          className={`flex flex-col items-center p-2 ${activeTab === "map" ? "text-emerald-600" : "text-gray-400"}`}
        >
          <span className="text-2xl mb-1">🗺️</span>
          <span className="text-xs font-bold">Map</span>
        </button>
      </nav>
    </div>
  );
}
