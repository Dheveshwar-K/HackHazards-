import React from "react";
import { ThreeGlobe } from "../components/ThreeGlobe";

interface LandingPageProps {
  onEnterApp: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp }) => {
  return (
    <div className="min-h-screen w-full relative bg-almost-black overflow-hidden flex flex-col">
      {/* Sticky futuristic navbar */}
      <header className="sticky top-0 z-40 w-full bg-primary/20 backdrop-blur-md border-b border-cyan-400/10 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="text-xl">🌊</span>
          <div>
            <h1 className="text-sm font-bold text-slate-100 font-orbitron tracking-wider">OCEANMIND AI</h1>
            <span className="text-[8px] font-numeric text-cyan-400 uppercase tracking-widest">Global Security Hub</span>
          </div>
        </div>

        <nav className="hidden md:flex gap-6">
          <a href="#features" className="text-xs font-sub text-slate-400 hover:text-cyan-400 transition-colors uppercase tracking-wider">Features</a>
          <a href="#telemetry" className="text-xs font-sub text-slate-400 hover:text-cyan-400 transition-colors uppercase tracking-wider">Global Telemetry</a>
          <a href="#models" className="text-xs font-sub text-slate-400 hover:text-cyan-400 transition-colors uppercase tracking-wider">AI Models</a>
        </nav>

        <button
          onClick={onEnterApp}
          className="bg-cyan-400/15 hover:bg-cyan-400/25 border border-cyan-400/40 text-cyan-400 px-4 py-1.5 rounded text-xs font-orbitron font-bold uppercase tracking-wider transition-colors cursor-pointer"
        >
          Launch Core HUD
        </button>
      </header>

      {/* Cyber Grid Background */}
      <div className="absolute inset-0 cyber-grid opacity-50 pointer-events-none z-0" />
      <div className="absolute inset-0 ocean-wave-bg z-0 pointer-events-none opacity-40 bottom-0 top-auto h-32" />

      {/* Hero Body */}
      <main className="flex-1 flex flex-col lg:flex-row items-center justify-between px-6 max-w-7xl mx-auto w-full z-10 gap-10 py-12">
        {/* Left copy column */}
        <div className="flex-1 flex flex-col gap-6 max-w-xl">
          <div>
            <span className="text-glow-cyan text-[10px] font-numeric text-cyan-400 font-bold uppercase tracking-widest block mb-2">
              Next-Gen Autonomous Telemetry
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-orbitron text-slate-100 leading-tight uppercase tracking-wide">
              AI-Powered Ocean <span className="text-cyan-400 text-glow-cyan">Intelligence</span> Platform
            </h2>
          </div>

          <p className="text-sm font-sub text-slate-400 leading-relaxed">
            Predict Fisheries • Monitor Ocean Health • Decode Marine Biodiversity. Leveraging globally scaled satellites, eDNA sequencing markers, and Random Forest regressors to manage maritime security.
          </p>

          <div className="flex flex-wrap gap-4 mt-2">
            <button
              onClick={onEnterApp}
              className="bg-accent/15 hover:bg-accent/25 border border-accent/40 text-accent px-6 py-3 rounded-lg text-xs font-orbitron font-bold uppercase tracking-wider transition-all hover:-translate-y-0.5 cursor-pointer"
              style={{ boxShadow: "0 0 15px rgba(0, 255, 157, 0.15)" }}
            >
              Launch Command Platform
            </button>
            <button
              onClick={onEnterApp}
              className="bg-cyan-400/10 hover:bg-cyan-400/20 border border-cyan-400/35 text-cyan-400 px-6 py-3 rounded-lg text-xs font-orbitron font-bold uppercase tracking-wider transition-all hover:-translate-y-0.5 cursor-pointer"
            >
              Explore AI Models
            </button>
          </div>

          {/* Quick HUD Metrics */}
          <div className="grid grid-cols-3 gap-4 border-t border-cyan-400/10 pt-6 mt-4">
            <div>
              <span className="text-[9px] font-numeric text-slate-500 uppercase">SAT_NODES_ONLINE</span>
              <div className="text-sm font-numeric text-cyan-400 font-bold text-glow-cyan">09 / 09</div>
            </div>
            <div>
              <span className="text-[9px] font-numeric text-slate-500 uppercase">SPECIES_MAPPED</span>
              <div className="text-sm font-numeric text-accent font-bold text-glow-green">14,242</div>
            </div>
            <div>
              <span className="text-[9px] font-numeric text-slate-500 uppercase">SECURE_INDEX</span>
              <div className="text-sm font-numeric text-warning font-bold text-glow-orange">96.8%</div>
            </div>
          </div>
        </div>

        {/* Right Globe Column */}
        <div className="flex-1 w-full h-[350px] sm:h-[450px] lg:h-[550px] min-h-[300px] flex items-center justify-center relative">
          {/* Animated 3D Globe Canvas */}
          <ThreeGlobe />
        </div>
      </main>

      {/* Landing footer */}
      <footer className="w-full bg-black/60 border-t border-cyan-400/10 py-4 px-6 text-center text-[10px] font-numeric text-slate-500 z-10 flex flex-col sm:flex-row justify-between items-center gap-2">
        <span>© 2026 OCEANMIND AI CORE SYSTEMS. CODENAME: POSEIDON.</span>
        <span>GLOBAL DEPLOYMENT PORT: D:\OCEANMINDAI // LAT: 0.00N LNG: 0.00E</span>
      </footer>
    </div>
  );
};
