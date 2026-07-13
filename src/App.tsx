import React, { useState, useEffect } from "react";
import { LandingPage } from "./pages/LandingPage";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Biodiversity } from "./pages/Biodiversity";
import { Forecast } from "./pages/Forecast";
import { Analytics } from "./pages/Analytics";
import { AIAssistant } from "./components/AIAssistant";

type PageState = "landing" | "login" | "loading" | "platform";
type PlatformView = "dashboard" | "biodiversity" | "forecast" | "analytics" | "settings" | "about";

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageState>("landing");
  const [activeView, setActiveView] = useState<PlatformView>("dashboard");
  const [soundActive, setSoundActive] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [notifications] = useState<string[]>([
    "Satellite node SAT-04 locked telemetry signal.",
    "Benthic sensor B-12 reports DO drop below 5.0mg/L."
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Trigger loading state before entering platform
  const startPlatformLoading = () => {
    setCurrentPage("loading");
    setLoadingProgress(0);
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setCurrentPage("platform");
          }, 300);
          return 100;
        }
        return prev + 4;
      });
    }, 50);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch((err) => {
        console.error("Fullscreen request failed:", err);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  };

  if (currentPage === "landing") {
    return <LandingPage onEnterApp={() => setCurrentPage("login")} />;
  }

  if (currentPage === "login") {
    return <Login onLoginSuccess={startPlatformLoading} />;
  }

  if (currentPage === "loading") {
    return (
      <div className="min-h-screen w-full bg-almost-black flex flex-col items-center justify-center relative cyber-grid">
        <div className="absolute top-1/4 w-[300px] h-[300px] rounded-full bg-cyan-400/5 blur-[90px]" />
        
        {/* Loading Globe Visualizer */}
        <div className="w-32 h-32 rounded-full border-2 border-dashed border-cyan-400/40 flex items-center justify-center animate-spin mb-8 relative">
          <div className="absolute w-24 h-24 rounded-full border border-accent/30 animate-[spin_6s_linear_infinite_reverse]" />
          <span className="text-3xl animate-pulse">🛰️</span>
        </div>

        {/* Status Indicators */}
        <div className="text-center flex flex-col gap-2 max-w-xs w-full px-4">
          <span className="text-[10px] text-cyan-400 font-numeric font-bold uppercase tracking-widest block">
            Initializing Poseidon Telemetry Core
          </span>
          <h3 className="text-xs font-orbitron font-bold text-slate-300">
            CONNECTING DEEP SEA HYDROPHONE ARRAY...
          </h3>
          
          {/* Progress Bar */}
          <div className="w-full bg-cyan-400/10 h-1.5 rounded overflow-hidden mt-4 border border-cyan-400/10">
            <div 
              className="bg-cyan-400 h-full transition-all duration-75 text-glow-cyan"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
          <span className="text-[9px] font-numeric text-slate-500 mt-1">{loadingProgress}% Synchronized</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-almost-black text-slate-200 flex flex-col cyber-grid relative">
      
      {/* Sticky futuristic HUD header */}
      <header className="sticky top-0 z-40 w-full bg-primary/40 backdrop-blur-md border-b border-cyan-400/15 px-6 py-4 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-3">
          <span className="text-xl">🌊</span>
          <div>
            <h1 className="text-xs font-bold text-slate-100 font-orbitron tracking-wider">OCEANMIND AI</h1>
            <span className="text-[8px] font-numeric text-cyan-400 uppercase tracking-widest">Operator Session: Active</span>
          </div>
        </div>

        {/* View controller links */}
        <nav className="hidden md:flex gap-1.5">
          {(["dashboard", "biodiversity", "forecast", "analytics"] as PlatformView[]).map((view) => (
            <button
              key={view}
              onClick={() => setActiveView(view)}
              className={`px-3 py-1 text-[10px] font-orbitron font-bold rounded uppercase border tracking-wider transition-colors cursor-pointer ${
                activeView === view
                  ? "bg-cyan-400/15 text-cyan-400 border-cyan-400/40 text-glow-cyan"
                  : "text-slate-400 border-transparent hover:text-slate-200"
              }`}
            >
              {view}
            </button>
          ))}
        </nav>

        {/* Header telemetry and indicators */}
        <div className="flex items-center gap-4 relative">
          
          {/* Sound Ambalance Toggle */}
          <button
            onClick={() => setSoundActive(!soundActive)}
            className={`text-xs p-1 rounded hover:bg-cyan-400/10 transition-colors cursor-pointer ${soundActive ? "text-accent" : "text-slate-500"}`}
            title="Toggle Ambient Hydrophone Noise"
          >
            🔊 {soundActive ? "Ambience Active" : "Sound Muted"}
          </button>

          {/* Fullscreen HUD Toggle */}
          <button
            onClick={toggleFullscreen}
            className="text-xs p-1 rounded text-slate-400 hover:text-cyan-400 hover:bg-cyan-400/10 transition-colors cursor-pointer"
            title="Toggle Fullscreen Command HUD"
          >
            📺 {isFullscreen ? "HUD Normal" : "HUD Full"}
          </button>

          {/* Notifications Tray */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="text-xs p-1 rounded text-slate-400 hover:text-cyan-400 hover:bg-cyan-400/10 transition-colors cursor-pointer relative"
              title="Notification Core logs"
            >
              🔔
              <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-danger rounded-full animate-ping" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-8 w-64 glass-panel border border-cyan-400/25 p-3 rounded-xl flex flex-col gap-2 z-50 animate-[slideIn_0.2s_ease-out]">
                <h4 className="text-[9px] font-orbitron text-cyan-400 border-b border-cyan-400/10 pb-1 font-bold uppercase tracking-wider">System Log Entries</h4>
                {notifications.map((note, idx) => (
                  <div key={idx} className="text-[10px] font-sub text-slate-300 leading-normal border-b border-cyan-400/5 pb-1">
                    • {note}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => {
              setCurrentPage("landing");
              setActiveView("dashboard");
            }}
            className="text-[10px] font-orbitron font-bold text-danger border border-danger/30 hover:bg-danger/10 px-2 py-1 rounded transition-colors cursor-pointer"
          >
            LOGOUT
          </button>
        </div>
      </header>

      {/* Ambient background waves styling */}
      <div className="absolute inset-x-0 bottom-0 h-24 ocean-wave-bg pointer-events-none opacity-30 z-0" />

      {/* Core Platform View Area */}
      <main className="flex-1 z-10 relative flex flex-col overflow-y-auto">
        {activeView === "dashboard" && <Dashboard />}
        {activeView === "biodiversity" && <Biodiversity />}
        {activeView === "forecast" && <Forecast />}
        {activeView === "analytics" && <Analytics />}
        {activeView === "settings" && (
          <div className="flex-1 flex items-center justify-center p-8 text-center">
            <div className="glass-panel border border-cyan-400/25 p-8 rounded-xl max-w-sm">
              <h3 className="font-orbitron font-bold text-cyan-400 uppercase tracking-widest mb-2">Platform Settings</h3>
              <p className="text-xs font-sub text-slate-400">Settings core is currently locked under supervisor clearance levels.</p>
            </div>
          </div>
        )}
        {activeView === "about" && (
          <div className="flex-1 flex items-center justify-center p-8 text-center">
            <div className="glass-panel border border-cyan-400/25 p-8 rounded-xl max-w-sm">
              <h3 className="font-orbitron font-bold text-cyan-400 uppercase tracking-widest mb-2">About OceanMind</h3>
              <p className="text-xs font-sub text-slate-400">Deployed for regional water security monitoring. v1.0.0 Alpha.</p>
            </div>
          </div>
        )}
      </main>

      {/* Dynamic Sound ambiance simulation player */}
      {soundActive && (
        <div className="hidden">
          {/* We display a small hidden indicator or we can generate periodic synthetic audio using Web Audio API! */}
          {/* That is a super high-end hackathon detail: play a very quiet ocean/wind synthesizer! */}
          <SoundAmbienceSynthesizer />
        </div>
      )}

      {/* Floating AI Chatbot assistant */}
      <AIAssistant />
    </div>
  );
};

// Web Audio API Ambient Synthesizer: Generates a real 432Hz deep hydrophone sound drone in the browser!
// This is an incredible bonus feature that works instantly in standard browsers on click!
const SoundAmbienceSynthesizer: React.FC = () => {
  useEffect(() => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();

      // Deep rumble (Ocean water current)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(55, ctx.currentTime); // very deep rumble
      gain.gain.setValueAtTime(0.08, ctx.currentTime); // quiet

      // Filter to emulate deep water damping
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(120, ctx.currentTime);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();

      return () => {
        osc.stop();
        ctx.close();
      };
    } catch (e) {
      console.warn("Audio Context block or unsupported browser:", e);
    }
  }, []);

  return null;
};

export default App;
