import React, { useState } from "react";

export const Forecast: React.FC = () => {
  const [timeline, setTimeline] = useState<"7days" | "1month" | "1year">("7days");
  
  // Forecast metrics
  const forecasts = {
    "7days": {
      fishPop: "Slight Increase (+4.2%)",
      tempTrend: "Rising anomaly (+1.8°C)",
      bleachRisk: "Moderate (24%)",
      stormImpact: "Low (no active storms)",
      biodiversity: "Stable Index (88.4)"
    },
    "1month": {
      fishPop: "Spike (+14.5% - Tuna migration peak)",
      tempTrend: "Plateau (+1.5°C anomaly)",
      bleachRisk: "Severe Risk Alert (42%)",
      stormImpact: "Moderate Warning (cyclone tracking)",
      biodiversity: "Marginal Drop (85.2)"
    },
    "1year": {
      fishPop: "Decline (-8.4% due to acidification)",
      tempTrend: "Global anomaly (+2.1°C)",
      bleachRisk: "Critical Event Warning (68%)",
      stormImpact: "High Risk Frequency",
      biodiversity: "Hypoxia Stress Alert (78.1)"
    }
  };

  const currentForecast = forecasts[timeline];

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto px-4 py-6">
      
      {/* Header */}
      <div className="border-b border-cyan-400/20 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-[10px] text-cyan-400 font-numeric font-bold tracking-widest block uppercase">
            Recurrent Neural Network Simulator
          </span>
          <h2 className="text-xl font-bold font-orbitron tracking-wider text-slate-100 uppercase">
            LSTM Forecasting Core
          </h2>
        </div>

        {/* Timeline controller */}
        <div className="flex gap-2 bg-primary/45 border border-cyan-400/25 p-1 rounded-lg">
          <button
            onClick={() => setTimeline("7days")}
            className={`px-3 py-1 text-xs font-orbitron font-bold rounded transition-colors ${
              timeline === "7days"
                ? "bg-cyan-400/20 text-cyan-400 border border-cyan-400/40"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            7 Days
          </button>
          <button
            onClick={() => setTimeline("1month")}
            className={`px-3 py-1 text-xs font-orbitron font-bold rounded transition-colors ${
              timeline === "1month"
                ? "bg-cyan-400/20 text-cyan-400 border border-cyan-400/40"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            1 Month
          </button>
          <button
            onClick={() => setTimeline("1year")}
            className={`px-3 py-1 text-xs font-orbitron font-bold rounded transition-colors ${
              timeline === "1year"
                ? "bg-cyan-400/20 text-cyan-400 border border-cyan-400/40"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            1 Year
          </button>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: LSTM Visualizer Nodes (2 cols) */}
        <div className="lg:col-span-2 glass-panel border border-cyan-400/20 p-5 rounded-2xl flex flex-col gap-4 min-h-[350px] relative overflow-hidden">
          <div>
            <span className="text-[9px] font-numeric text-cyan-400/60 uppercase block">Model Layer Node Activations</span>
            <h3 className="text-sm font-bold font-orbitron text-slate-100 uppercase tracking-wide">
              Neural Network Architecture
            </h3>
          </div>

          {/* Network Visualization Container */}
          <div className="flex-1 flex items-center justify-between px-4 py-8 relative">
            
            {/* SVG connections with dash array flow animation */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
              {/* Lines from Input (x: 15%) to Hidden (x: 50%) */}
              <line x1="15%" y1="20%" x2="50%" y2="35%" stroke="#00E5FF" strokeOpacity="0.3" strokeWidth="1.5" strokeDasharray="5,5" className="animate-[dash_2s_linear_infinite]" />
              <line x1="15%" y1="50%" x2="50%" y2="35%" stroke="#00E5FF" strokeOpacity="0.3" strokeWidth="1.5" strokeDasharray="5,5" className="animate-[dash_2s_linear_infinite]" />
              <line x1="15%" y1="50%" x2="50%" y2="65%" stroke="#00E5FF" strokeOpacity="0.3" strokeWidth="1.5" strokeDasharray="5,5" className="animate-[dash_2s_linear_infinite]" />
              <line x1="15%" y1="80%" x2="50%" y2="65%" stroke="#00E5FF" strokeOpacity="0.3" strokeWidth="1.5" strokeDasharray="5,5" className="animate-[dash_2s_linear_infinite]" />
              
              {/* Lines from Hidden (x: 50%) to Output (x: 85%) */}
              <line x1="50%" y1="35%" x2="85%" y2="20%" stroke="#00FF9D" strokeOpacity="0.3" strokeWidth="1.5" strokeDasharray="5,5" className="animate-[dash_1.5s_linear_infinite]" />
              <line x1="50%" y1="35%" x2="85%" y2="50%" stroke="#00FF9D" strokeOpacity="0.3" strokeWidth="1.5" strokeDasharray="5,5" className="animate-[dash_1.5s_linear_infinite]" />
              <line x1="50%" y1="65%" x2="85%" y2="50%" stroke="#00FF9D" strokeOpacity="0.3" strokeWidth="1.5" strokeDasharray="5,5" className="animate-[dash_1.5s_linear_infinite]" />
              <line x1="50%" y1="65%" x2="85%" y2="80%" stroke="#00FF9D" strokeOpacity="0.3" strokeWidth="1.5" strokeDasharray="5,5" className="animate-[dash_1.5s_linear_infinite]" />
            </svg>

            {/* Column 1: Input Parameter Layer */}
            <div className="flex flex-col justify-around h-full z-10 gap-8">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-primary/80 border border-cyan-400/50 flex items-center justify-center text-xs font-numeric text-cyan-400 shadow-[0_0_12px_rgba(0,229,255,0.15)]">SST</div>
                <span className="text-[9px] text-slate-400 mt-1 uppercase font-sub">Temp</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-primary/80 border border-cyan-400/50 flex items-center justify-center text-xs font-numeric text-cyan-400 shadow-[0_0_12px_rgba(0,229,255,0.15)]">PH</div>
                <span className="text-[9px] text-slate-400 mt-1 uppercase font-sub">pH Level</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-primary/80 border border-cyan-400/50 flex items-center justify-center text-xs font-numeric text-cyan-400 shadow-[0_0_12px_rgba(0,229,255,0.15)]">CHL</div>
                <span className="text-[9px] text-slate-400 mt-1 uppercase font-sub">Chloro</span>
              </div>
            </div>

            {/* Column 2: Hidden LSTM Layer */}
            <div className="flex flex-col justify-around h-full z-10 gap-16">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-xl bg-primary/90 border border-accent/60 flex flex-col items-center justify-center text-[10px] font-numeric text-accent shadow-[0_0_15px_rgba(0,255,157,0.2)] animate-pulse">
                  <span>LSTM_1</span>
                  <span className="text-[7px] text-slate-400">Forget Gate</span>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-xl bg-primary/90 border border-accent/60 flex flex-col items-center justify-center text-[10px] font-numeric text-accent shadow-[0_0_15px_rgba(0,255,157,0.2)] animate-pulse">
                  <span>LSTM_2</span>
                  <span className="text-[7px] text-slate-400">Cell State</span>
                </div>
              </div>
            </div>

            {/* Column 3: Output Projection Layer */}
            <div className="flex flex-col justify-around h-full z-10 gap-8">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-black/80 border border-warning/50 flex items-center justify-center text-xs font-numeric text-warning">DENS</div>
                <span className="text-[9px] text-slate-400 mt-1 uppercase font-sub">Density</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-black/80 border border-warning/50 flex items-center justify-center text-xs font-numeric text-warning">BLEA</div>
                <span className="text-[9px] text-slate-400 mt-1 uppercase font-sub">Bleach</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-black/80 border border-warning/50 flex items-center justify-center text-xs font-numeric text-warning">TEMP</div>
                <span className="text-[9px] text-slate-400 mt-1 uppercase font-sub">SST Out</span>
              </div>
            </div>

          </div>

          {/* Custom style mapping for connections */}
          <style>{`
            @keyframes dash {
              to {
                stroke-dashoffset: -20;
              }
            }
          `}</style>
        </div>

        {/* Right Column: Timed Forecast Data Details */}
        <div className="glass-panel border border-cyan-400/20 p-5 rounded-2xl flex flex-col gap-4">
          <div>
            <span className="text-[9px] font-numeric text-cyan-400/60 uppercase block">Model Inference Outputs</span>
            <h3 className="text-sm font-bold font-orbitron text-slate-100 uppercase tracking-wide">
              Prediction Parameters
            </h3>
          </div>

          <div className="flex flex-col gap-4 font-sub text-xs">
            
            {/* Fish density forecast card */}
            <div className="bg-primary/40 border border-cyan-400/10 p-3 rounded-lg flex flex-col gap-1">
              <span className="text-[9px] font-numeric text-slate-500 uppercase">Fish Population forecast</span>
              <span className="text-slate-200 font-bold">{currentForecast.fishPop}</span>
            </div>

            {/* Sea Surface Temp forecast card */}
            <div className="bg-primary/40 border border-cyan-400/10 p-3 rounded-lg flex flex-col gap-1">
              <span className="text-[9px] font-numeric text-slate-500 uppercase">Sea Temp Anomaly</span>
              <span className="text-slate-200 font-bold">{currentForecast.tempTrend}</span>
            </div>

            {/* Bleaching risk forecast card */}
            <div className="bg-primary/40 border border-cyan-400/10 p-3 rounded-lg flex flex-col gap-1">
              <span className="text-[9px] font-numeric text-slate-500 uppercase">Coral Bleaching Risk</span>
              <span className="text-slate-200 font-bold">{currentForecast.bleachRisk}</span>
            </div>

            {/* Severe weather forecast card */}
            <div className="bg-primary/40 border border-cyan-400/10 p-3 rounded-lg flex flex-col gap-1">
              <span className="text-[9px] font-numeric text-slate-500 uppercase">Storm Impact probability</span>
              <span className="text-slate-200 font-bold">{currentForecast.stormImpact}</span>
            </div>

            {/* Biodiversity index forecast card */}
            <div className="bg-primary/40 border border-cyan-400/10 p-3 rounded-lg flex flex-col gap-1">
              <span className="text-[9px] font-numeric text-slate-500 uppercase">General Biodiversity Index</span>
              <span className="text-slate-200 font-bold">{currentForecast.biodiversity}</span>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
