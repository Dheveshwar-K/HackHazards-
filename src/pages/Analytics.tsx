import React, { useState } from "react";

interface TelemetryRow {
  id: string;
  timestamp: string;
  gridNode: string;
  species: string;
  temp: number;
  salinity: number;
  ph: number;
  chlorophyll: number;
}

const INITIAL_ROWS: TelemetryRow[] = [
  { id: "R-01", timestamp: "2026-07-09T22:30:00Z", gridNode: "North Atlantic B", species: "Bluefin Tuna", temp: 16.8, salinity: 34.2, ph: 8.05, chlorophyll: 1.82 },
  { id: "R-02", timestamp: "2026-07-09T21:45:00Z", gridNode: "Indo-Pacific 4", species: "Great White Shark", temp: 24.2, salinity: 35.1, ph: 8.12, chlorophyll: 0.94 },
  { id: "R-03", timestamp: "2026-07-09T21:10:00Z", gridNode: "Coral Triangle C", species: "Staghorn Coral", temp: 28.5, salinity: 33.8, ph: 7.82, chlorophyll: 4.12 },
  { id: "R-04", timestamp: "2026-07-09T20:30:00Z", gridNode: "California K", species: "Giant Kelp", temp: 14.1, salinity: 34.5, ph: 8.15, chlorophyll: 5.62 },
  { id: "R-05", timestamp: "2026-07-09T19:15:00Z", gridNode: "Gulf Loop Current", species: "Vaquita", temp: 27.2, salinity: 36.4, ph: 7.98, chlorophyll: 0.25 },
];

export const Analytics: React.FC = () => {
  const [filterSpecies, setFilterSpecies] = useState("all");
  const [filterRegion, setFilterRegion] = useState("all");
  const [toastMessage, setToastMessage] = useState("");

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 2500);
  };

  const handleExport = (format: "CSV" | "PDF" | "PNG") => {
    triggerToast(`Exporting filtered data to ${format} format. Packaging metadata...`);
  };

  const filteredRows = INITIAL_ROWS.filter((row) => {
    const matchSpecies = filterSpecies === "all" || row.species === filterSpecies;
    const matchRegion = filterRegion === "all" || row.gridNode.toLowerCase().includes(filterRegion);
    return matchSpecies && matchRegion;
  });

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto px-4 py-6">
      {/* Toast Alert overlay */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 glass-panel border border-accent/40 bg-primary/90 px-4 py-3 rounded-lg text-xs font-sub text-accent shadow-[0_0_20px_rgba(0,255,157,0.15)] animate-[slideIn_0.25s_ease-out]">
          🚀 {toastMessage}
        </div>
      )}

      {/* Header */}
      <div className="border-b border-cyan-400/20 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-[10px] text-cyan-400 font-numeric font-bold tracking-widest block uppercase">
            Data Query Console
          </span>
          <h2 className="text-xl font-bold font-orbitron tracking-wider text-slate-100 uppercase">
            Advanced Analytics
          </h2>
        </div>

        {/* Export Toolbar */}
        <div className="flex gap-2">
          <button
            onClick={() => handleExport("CSV")}
            className="bg-primary/40 border border-cyan-400/20 hover:border-cyan-400/40 text-[10px] font-orbitron font-bold text-slate-300 px-3 py-1.5 rounded transition-all uppercase cursor-pointer"
          >
            Export CSV
          </button>
          <button
            onClick={() => handleExport("PDF")}
            className="bg-primary/40 border border-cyan-400/20 hover:border-cyan-400/40 text-[10px] font-orbitron font-bold text-slate-300 px-3 py-1.5 rounded transition-all uppercase cursor-pointer"
          >
            Export PDF
          </button>
          <button
            onClick={() => handleExport("PNG")}
            className="bg-primary/40 border border-cyan-400/20 hover:border-cyan-400/40 text-[10px] font-orbitron font-bold text-slate-300 px-3 py-1.5 rounded transition-all uppercase cursor-pointer"
          >
            Export PNG
          </button>
        </div>
      </div>

      {/* Filter panel */}
      <div className="glass-panel border border-cyan-400/20 p-4 rounded-xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-sub">
        <div>
          <label className="text-[10px] text-slate-400 block mb-1 uppercase font-numeric">Species Filter</label>
          <select
            value={filterSpecies}
            onChange={(e) => setFilterSpecies(e.target.value)}
            className="w-full bg-black/60 border border-cyan-400/25 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-400"
          >
            <option value="all">All Species</option>
            <option value="Bluefin Tuna">Bluefin Tuna</option>
            <option value="Great White Shark">Great White Shark</option>
            <option value="Staghorn Coral">Staghorn Coral</option>
            <option value="Giant Kelp">Giant Kelp</option>
            <option value="Vaquita">Vaquita</option>
          </select>
        </div>

        <div>
          <label className="text-[10px] text-slate-400 block mb-1 uppercase font-numeric">Region Filter</label>
          <select
            value={filterRegion}
            onChange={(e) => setFilterRegion(e.target.value)}
            className="w-full bg-black/60 border border-cyan-400/25 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-400"
          >
            <option value="all">All Regions</option>
            <option value="atlantic">Atlantic</option>
            <option value="pacific">Pacific</option>
            <option value="coral">Coral Triangle</option>
            <option value="gulf">Gulf Current</option>
          </select>
        </div>

        <div>
          <label className="text-[10px] text-slate-400 block mb-1 uppercase font-numeric">Range Start Date</label>
          <input
            type="date"
            defaultValue="2026-07-01"
            className="w-full bg-black/60 border border-cyan-400/25 rounded px-2.5 py-1 text-slate-200 focus:outline-none focus:border-cyan-400 font-numeric"
          />
        </div>

        <div className="flex items-end">
          <button
            onClick={() => triggerToast("Filters updated. Querying database cores...")}
            className="w-full bg-cyan-400/15 hover:bg-cyan-400/25 border border-cyan-400/40 text-cyan-400 py-1.5 rounded font-orbitron font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            Refresh Query
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="glass-panel border border-cyan-400/20 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-primary/80 border-b border-cyan-400/25 text-[10px] font-orbitron text-cyan-400 uppercase tracking-wider">
                <th className="p-4">Record ID</th>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Grid Node</th>
                <th className="p-4">Primary Species</th>
                <th className="p-4">Temp (°C)</th>
                <th className="p-4">Salinity (PSU)</th>
                <th className="p-4">pH Level</th>
                <th className="p-4">Chl (mg/m³)</th>
              </tr>
            </thead>
            <tbody className="font-numeric text-xs text-slate-300 divide-y divide-cyan-400/10">
              {filteredRows.length > 0 ? (
                filteredRows.map((row) => (
                  <tr key={row.id} className="hover:bg-primary/20 transition-colors">
                    <td className="p-4 font-bold text-cyan-400">{row.id}</td>
                    <td className="p-4 text-slate-400">{row.timestamp}</td>
                    <td className="p-4 font-sub text-slate-200">{row.gridNode}</td>
                    <td className="p-4 font-sub font-bold text-slate-200">{row.species}</td>
                    <td className="p-4 text-cyan-400 font-bold">{row.temp}</td>
                    <td className="p-4">{row.salinity}</td>
                    <td className="p-4">{row.ph}</td>
                    <td className="p-4 text-accent">{row.chlorophyll}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500 font-sub">
                    No active records match the selected grid criteria filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
