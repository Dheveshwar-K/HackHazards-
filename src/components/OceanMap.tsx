import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icon issues in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface OceanPoint {
  id: string;
  name: string;
  lat: number;
  lng: number;
  temp: number;
  salinity: number;
  chlorophyll: number;
  species: string;
  threat: "Low" | "Medium" | "High";
  score: number;
}

const OCEAN_POINTS: OceanPoint[] = [
  { id: "p1", name: "North Atlantic Drift Grid B", lat: 42.50, lng: -45.20, temp: 16.8, salinity: 34.2, chlorophyll: 1.82, species: "Bluefin Tuna", threat: "Low", score: 88.5 },
  { id: "p2", name: "Indo-Pacific Trench Sector 4", lat: -12.45, lng: 113.88, temp: 24.2, salinity: 35.1, chlorophyll: 0.94, species: "Great White Shark", threat: "High", score: 62.4 },
  { id: "p3", name: "Coral Triangle Habitat Zone C", lat: -8.32, lng: 142.15, temp: 28.5, salinity: 33.8, chlorophyll: 4.12, species: "Staghorn Coral", threat: "Medium", score: 71.0 },
  { id: "p4", name: "California Current System K", lat: 35.10, lng: -122.40, temp: 14.1, salinity: 34.5, chlorophyll: 5.62, species: "Giant Kelp", threat: "Low", score: 94.2 },
  { id: "p5", name: "Gulf Loop Current Monitoring", lat: 26.50, lng: -85.60, temp: 27.2, salinity: 36.4, chlorophyll: 0.25, species: "Vaquita", threat: "Medium", score: 78.1 },
];

export const OceanMap: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<OceanPoint | null>(null);
  const [currentLayer, setCurrentLayer] = useState<"satellite" | "currents" | "fishing">("satellite");

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize Leaflet Map
    const map = L.map(mapContainerRef.current, {
      center: [15, -10],
      zoom: 3,
      minZoom: 2,
      maxZoom: 10,
      zoomControl: false,
    });
    mapRef.current = map;

    // CartoDB Dark Matter tile layer
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 20,
      }
    ).addTo(map);

    // Fishing Area Polygons overlay
    const fishingZone = L.polygon(
      [
        [32, -125],
        [40, -125],
        [40, -118],
        [32, -118],
      ],
      {
        color: "#00FF9D",
        fillColor: "#00FF9D",
        fillOpacity: 0.08,
        weight: 1.5,
        dashArray: "5, 5",
      }
    );

    const bleachingZone = L.circle([-8.32, 142.15], {
      color: "#FF3B30",
      fillColor: "#FF3B30",
      fillOpacity: 0.1,
      radius: 600000,
      weight: 1.5,
    });

    // Add layers initially
    fishingZone.addTo(map);
    bleachingZone.addTo(map);

    // Add custom pulsing markers for each point
    OCEAN_POINTS.forEach((point) => {
      // Choose CSS class based on threat level
      let pulseClass = "pulse-marker";
      if (point.threat === "Medium") pulseClass = "pulse-marker-warning";
      if (point.threat === "High") pulseClass = "pulse-marker-danger";

      const customIcon = L.divIcon({
        className: "",
        html: `<div class="${pulseClass}"></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      });

      const marker = L.marker([point.lat, point.lng], { icon: customIcon }).addTo(map);

      // Handle marker click
      marker.on("click", () => {
        setSelectedPoint(point);
        map.panTo([point.lat, point.lng]);
      });
    });

    // Cleanup map on unmount
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  const toggleLayer = (layerType: "satellite" | "currents" | "fishing") => {
    setCurrentLayer(layerType);
    if (!mapRef.current) return;
    
    // Simulating layers change
    if (layerType === "fishing") {
      mapRef.current.setZoom(4);
    } else if (layerType === "currents") {
      mapRef.current.setZoom(3);
    } else {
      mapRef.current.setZoom(3);
    }
  };

  return (
    <div className="w-full h-full relative flex">
      {/* Map Container */}
      <div ref={mapContainerRef} className="flex-1 h-full z-0" />

      {/* Futuristic Map Overlay Layer Controls */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        <div className="glass-panel p-2 rounded-lg flex flex-col gap-1 border border-cyan-400/20">
          <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest mb-1 px-1">Layers</span>
          <button
            onClick={() => toggleLayer("satellite")}
            className={`px-3 py-1 text-xs rounded text-left font-sub transition-colors ${
              currentLayer === "satellite"
                ? "bg-cyan-400/20 text-cyan-400 border border-cyan-400/40"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            🛰️ Satellite Base
          </button>
          <button
            onClick={() => toggleLayer("currents")}
            className={`px-3 py-1 text-xs rounded text-left font-sub transition-colors ${
              currentLayer === "currents"
                ? "bg-cyan-400/20 text-cyan-400 border border-cyan-400/40"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            🌊 Ocean Currents
          </button>
          <button
            onClick={() => toggleLayer("fishing")}
            className={`px-3 py-1 text-xs rounded text-left font-sub transition-colors ${
              currentLayer === "fishing"
                ? "bg-cyan-400/20 text-cyan-400 border border-cyan-400/40"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            🐟 Fishing Zones
          </button>
        </div>
      </div>

      {/* Selected Point Detail Cyber Sidebar */}
      {selectedPoint && (
        <div className="absolute right-4 top-4 bottom-4 w-80 z-10 glass-panel border border-cyan-400/30 p-4 rounded-xl flex flex-col gap-4 overflow-y-auto animate-[slideIn_0.3s_ease-out]">
          <div className="flex justify-between items-start border-b border-cyan-400/10 pb-2">
            <div>
              <span className="text-[9px] font-numeric text-cyan-400/60 uppercase tracking-widest">Selected Grid Node</span>
              <h3 className="text-sm font-bold text-slate-100">{selectedPoint.name}</h3>
            </div>
            <button
              onClick={() => setSelectedPoint(null)}
              className="text-slate-400 hover:text-white text-xs font-bold px-1"
            >
              ✕
            </button>
          </div>

          {/* Critical Indicators HUD */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-primary/40 border border-cyan-400/10 p-2 rounded">
              <span className="text-[10px] text-slate-400 block font-sub">Temperature</span>
              <span className="text-sm font-numeric text-cyan-400 font-bold">{selectedPoint.temp}°C</span>
            </div>
            <div className="bg-primary/40 border border-cyan-400/10 p-2 rounded">
              <span className="text-[10px] text-slate-400 block font-sub">Salinity</span>
              <span className="text-sm font-numeric text-cyan-400 font-bold">{selectedPoint.salinity} PSU</span>
            </div>
            <div className="bg-primary/40 border border-cyan-400/10 p-2 rounded">
              <span className="text-[10px] text-slate-400 block font-sub">Chlorophyll</span>
              <span className="text-sm font-numeric text-cyan-400 font-bold">{selectedPoint.chlorophyll} mg/m³</span>
            </div>
            <div className="bg-primary/40 border border-cyan-400/10 p-2 rounded">
              <span className="text-[10px] text-slate-400 block font-sub">Health Index</span>
              <span className="text-sm font-numeric text-accent font-bold">{selectedPoint.score}</span>
            </div>
          </div>

          {/* AI Threat Assessment */}
          <div className="bg-primary/50 border border-cyan-400/10 p-3 rounded-lg flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">AI Threat Status</span>
              <span
                className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
                  selectedPoint.threat === "High"
                    ? "bg-danger/20 text-danger border border-danger/40 text-glow-red"
                    : selectedPoint.threat === "Medium"
                    ? "bg-warning/20 text-warning border border-warning/40 text-glow-orange"
                    : "bg-accent/20 text-accent border border-accent/40 text-glow-green"
                }`}
              >
                {selectedPoint.threat}
              </span>
            </div>
            <div className="text-xs text-slate-300 font-sub leading-relaxed">
              {selectedPoint.threat === "High"
                ? "Immediate biological depletion observed. Automated alerts dispatched due to prolonged local temperature anomaly."
                : selectedPoint.threat === "Medium"
                ? "Moderate anomalies detected. Marine ecosystems experiencing minor thermal pressure. Continue observation."
                : "Optimal conditions. Biodiversity indicators stable, no anomalies detected."}
            </div>
          </div>

          {/* Local eDNA Traces */}
          <div>
            <h4 className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest mb-2">eDNA DNA Sample Traces</h4>
            <div className="bg-black/40 border border-cyan-400/20 p-2.5 rounded text-[10px] font-numeric flex flex-col gap-1.5">
              <div className="flex justify-between text-slate-400 border-b border-cyan-400/10 pb-1">
                <span>Detected Species</span>
                <span>Match</span>
              </div>
              <div className="flex justify-between text-accent">
                <span>{selectedPoint.species}</span>
                <span>99.1%</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Acanthocybium solandri</span>
                <span>86.5%</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Coryphaena hippurus</span>
                <span>72.4%</span>
              </div>
            </div>
          </div>

          {/* Latitude Longitude Telemetry */}
          <div className="mt-auto border-t border-cyan-400/10 pt-2 flex justify-between font-numeric text-[9px] text-slate-500">
            <span>LAT: {selectedPoint.lat}°N</span>
            <span>LNG: {selectedPoint.lng}°E</span>
          </div>
        </div>
      )}

      {/* Crosshair target overlay */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10 flex items-center justify-center">
        <div className="w-16 h-16 border border-cyan-400/15 rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-cyan-400/30 rounded-full" />
        </div>
      </div>
    </div>
  );
};
